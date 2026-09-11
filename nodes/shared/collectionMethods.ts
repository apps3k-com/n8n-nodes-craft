import type {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeListSearchResult,
	ResourceMapperFields,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	buildCollectionItemBody,
	mapSchemaToResourceMapperFields,
	type CraftCollectionSchema,
	type RelationEntry,
	type ResourceMapperMode,
} from './collectionMapping';
import { resolveResourceId } from './resourceLocator';

/** Executes an authenticated Craft GET request for shared collection UI methods. */
async function apiGet(
	ctx: ILoadOptionsFunctions | IExecuteSingleFunctions,
	credentialName: string,
	url: string,
	qs: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await ctx.getCredentials(credentialName);
	const baseUrl = (credentials.apiUrl as string).replace(/\/$/, '');
	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${baseUrl}${url}`,
		qs,
		json: true,
		headers: { Accept: 'application/json' },
	};
	return (await ctx.helpers.httpRequestWithAuthentication.call(
		ctx,
		credentialName,
		options,
	)) as IDataObject;
}

/** Fetches Craft's direct collection schema response used by the mapper and relations. */
async function fetchSchema(
	ctx: ILoadOptionsFunctions | IExecuteSingleFunctions,
	credentialName: string,
	collectionId: string,
): Promise<CraftCollectionSchema> {
	const schema = await apiGet(
		ctx,
		credentialName,
		`/collections/${encodeURIComponent(collectionId)}/schema`,
		{
			format: 'schema',
		},
	);
	if (!Array.isArray(schema.properties)) {
		throw new Error('Craft returned an invalid collection schema: properties must be an array');
	}
	if (
		schema.contentPropDetails !== undefined &&
		(typeof schema.contentPropDetails !== 'object' ||
			typeof (schema.contentPropDetails as { key?: unknown }).key !== 'string')
	) {
		throw new Error('Craft returned an invalid collection schema: content property is malformed');
	}
	if (
		schema.properties.some(
			(property) =>
				typeof property !== 'object' ||
				property === null ||
				typeof (property as { key?: unknown }).key !== 'string' ||
				typeof (property as { name?: unknown }).name !== 'string' ||
				typeof (property as { type?: unknown }).type !== 'string',
		)
	) {
		throw new Error('Craft returned an invalid collection schema: a property is malformed');
	}
	return schema as unknown as CraftCollectionSchema;
}

/** Reads a collection parameter from either supported node-version representation. */
function getCollectionId(ctx: ILoadOptionsFunctions | IExecuteSingleFunctions): string {
	return resolveResourceId(ctx.getNodeParameter('collectionId', '') as unknown);
}

/** Creates authenticated schema and relation loaders shared by both Craft nodes. */
export function createCollectionFieldMethods(credentialName: string) {
	return {
		/** Loads mapper fields for the currently selected collection. */
		async getCollectionFields(this: ILoadOptionsFunctions): Promise<ResourceMapperFields> {
			const collectionId = getCollectionId(this);
			if (!collectionId) return { fields: [] };
			const operation = this.getNodeParameter('operation', '') as string;
			const mode: ResourceMapperMode = operation === 'updateItems' ? 'update' : 'add';
			const schema = await fetchSchema(this, credentialName, collectionId);
			const fields = mapSchemaToResourceMapperFields(schema, mode);
			if (
				mode === 'update' &&
				this.getNode().typeVersion >= 2 &&
				this.getNodeParameter('itemSelectionMode', 'mappedId') === 'selectItem'
			) {
				const idField = fields.find((field) => field.id === 'id');
				if (idField) idField.required = false;
			}
			return { fields };
		},

		/** Lists relation properties from the currently selected collection schema. */
		async getRelationFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
			const collectionId = getCollectionId(this);
			if (!collectionId) return [];
			const schema = await fetchSchema(this, credentialName, collectionId);
			return (schema.properties ?? [])
				.filter((p) => p.type === 'relation')
				.map((p) => ({ name: p.name, value: p.key }));
		},

		/** Lists target collection items using that collection's declared content field as label. */
		async getRelationTargetItems(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
			const collectionId = getCollectionId(this);
			const relationField = resolveResourceId(
				this.getCurrentNodeParameter('&relationField') as unknown,
			);
			if (!collectionId || !relationField) return [];
			const schema = await fetchSchema(this, credentialName, collectionId);
			const rel = (schema.properties ?? []).find(
				(p) => p.key === relationField && p.type === 'relation',
			);
			if (!rel?.targetCollectionId) return [];
			const [targetSchema, res] = await Promise.all([
				fetchSchema(this, credentialName, rel.targetCollectionId),
				apiGet(
					this,
					credentialName,
					`/collections/${encodeURIComponent(rel.targetCollectionId)}/items`,
					{ maxDepth: 0 },
				),
			]);
			const items = (res.items as IDataObject[]) ?? [];
			const contentKey = targetSchema.contentPropDetails?.key;
			return items.map((item) => {
				const label = contentKey ? item[contentKey] : undefined;
				const id = String(item.id);
				return {
					name: label !== undefined && label !== null && label !== '' ? String(label) : id,
					value: id,
				};
			});
		},

		/** Searches existing collection items for the version 2 update selector. */
		async searchCollectionItems(
			this: ILoadOptionsFunctions,
			query?: string,
			paginationToken?: unknown,
		): Promise<INodeListSearchResult> {
			const collectionId = getCollectionId(this);
			if (!collectionId) return { results: [] };
			const [schema, response] = await Promise.all([
				fetchSchema(this, credentialName, collectionId),
				apiGet(this, credentialName, `/collections/${encodeURIComponent(collectionId)}/items`, {
					maxDepth: 0,
				}),
			]);
			let filter = query?.trim().toLowerCase() ?? '';
			let offset = 0;
			if (paginationToken !== undefined) {
				if (typeof paginationToken !== 'string')
					throw new Error('Invalid collection item search page token');
				try {
					const token = JSON.parse(decodeURIComponent(paginationToken)) as {
						offset: number;
						query: string;
					};
					if (
						!Number.isSafeInteger(token.offset) ||
						token.offset < 0 ||
						typeof token.query !== 'string' ||
						(filter && filter !== token.query)
					)
						throw new Error();
					offset = token.offset;
					filter = token.query;
				} catch {
					throw new Error('Invalid collection item search page token');
				}
			}
			const contentKey = schema.contentPropDetails?.key;
			const filtered = ((response.items as IDataObject[]) ?? []).filter(
				(item) =>
					!filter ||
					String(item.id).toLowerCase().includes(filter) ||
					String(contentKey ? (item[contentKey] ?? '') : '')
						.toLowerCase()
						.includes(filter),
			);
			if (offset > filtered.length) throw new Error('Invalid collection item search page token');
			const nextOffset = offset + 250;
			return {
				results: filtered
					.slice(offset, nextOffset)
					.map((item) => ({
						name: contentKey && item[contentKey] ? String(item[contentKey]) : String(item.id),
						value: String(item.id),
					})),
				...(nextOffset < filtered.length
					? {
							paginationToken: encodeURIComponent(
								JSON.stringify({ offset: nextOffset, query: filter }),
							),
						}
					: {}),
			};
		},
	};
}

/** Creates the declarative request hook that serializes mapped fields for Craft. */
export function createCollectionPreSend(credentialName: string, mode: ResourceMapperMode) {
	return async function (
		this: IExecuteSingleFunctions,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		const collectionId = getCollectionId(this);
		if (!collectionId) {
			throw new NodeOperationError(this.getNode(), 'Select a collection before mapping fields.');
		}
		const columns = this.getNodeParameter('columns', {}) as { value?: IDataObject };
		const relationsParam = this.getNodeParameter('relations', {}) as {
			relation?: RelationEntry[];
		};
		const allowNewSelectOptions = this.getNodeParameter('allowNewSelectOptions', false) as boolean;
		const itemSelectionMode =
			this.getNode().typeVersion >= 2
				? (this.getNodeParameter('itemSelectionMode', 'mappedId') as string)
				: 'mappedId';
		const selectedItemId = resolveResourceId(this.getNodeParameter('itemId', '') as unknown);
		if (mode === 'update' && itemSelectionMode === 'selectItem' && !selectedItemId) {
			throw new NodeOperationError(this.getNode(), 'Select a collection item before updating it.');
		}

		const schema = await fetchSchema(this, credentialName, collectionId);
		try {
			requestOptions.body = buildCollectionItemBody({
				schema,
				mode,
				mapperValue:
					mode === 'update' && itemSelectionMode === 'selectItem'
						? { ...(columns.value ?? {}), id: selectedItemId }
						: (columns.value ?? {}),
				relations: relationsParam.relation ?? [],
				allowNewSelectOptions,
			});
		} catch (error) {
			throw new NodeOperationError(this.getNode(), (error as Error).message);
		}
		return requestOptions;
	};
}
