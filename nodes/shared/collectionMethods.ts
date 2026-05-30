import type {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
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

async function fetchSchema(
	ctx: ILoadOptionsFunctions | IExecuteSingleFunctions,
	credentialName: string,
	collectionId: string,
): Promise<CraftCollectionSchema> {
	return (await apiGet(ctx, credentialName, `/collections/${collectionId}/schema`, {
		format: 'schema',
	})) as unknown as CraftCollectionSchema;
}

export function createCollectionFieldMethods(credentialName: string) {
	return {
		async getCollectionFields(this: ILoadOptionsFunctions): Promise<ResourceMapperFields> {
			const collectionId = this.getNodeParameter('collectionId', '') as string;
			if (!collectionId) return { fields: [] };
			const operation = this.getNodeParameter('operation', '') as string;
			const mode: ResourceMapperMode = operation === 'updateItems' ? 'update' : 'add';
			try {
				const schema = await fetchSchema(this, credentialName, collectionId);
				return { fields: mapSchemaToResourceMapperFields(schema, mode) };
			} catch {
				return { fields: [] };
			}
		},

		async getRelationFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
			const collectionId = this.getNodeParameter('collectionId', '') as string;
			if (!collectionId) return [];
			try {
				const schema = await fetchSchema(this, credentialName, collectionId);
				return (schema.properties ?? [])
					.filter((p) => p.type === 'relation')
					.map((p) => ({ name: p.name, value: p.key }));
			} catch {
				return [];
			}
		},

		async getRelationTargetItems(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
			const collectionId = this.getNodeParameter('collectionId', '') as string;
			const relationField = this.getCurrentNodeParameter('&relationField') as string;
			if (!collectionId || !relationField) return [];
			try {
				const schema = await fetchSchema(this, credentialName, collectionId);
				const rel = (schema.properties ?? []).find(
					(p) => p.key === relationField && p.type === 'relation',
				);
				if (!rel?.targetCollectionId) return [];
				const res = await apiGet(
					this,
					credentialName,
					`/collections/${rel.targetCollectionId}/items`,
					{ maxDepth: 0 },
				);
				const items = (res.items as IDataObject[]) ?? [];
				return items.map((item) => {
					// Collection items expose their title under the collection's content key
					// (e.g. `was`, `betreff`) — the only top-level key that isn't id/properties.
					const labelKey = Object.keys(item).find((k) => k !== 'id' && k !== 'properties');
					const label = labelKey ? item[labelKey] : undefined;
					const id = String(item.id);
					return {
						name: label !== undefined && label !== null && label !== '' ? String(label) : id,
						value: id,
					};
				});
			} catch {
				return [];
			}
		},
	};
}

export function createCollectionPreSend(credentialName: string, mode: ResourceMapperMode) {
	return async function (
		this: IExecuteSingleFunctions,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		const collectionId = this.getNodeParameter('collectionId', '') as string;
		if (!collectionId) {
			throw new NodeOperationError(this.getNode(), 'Select a collection before mapping fields.');
		}
		const columns = this.getNodeParameter('columns', {}) as { value?: IDataObject };
		const relationsParam = this.getNodeParameter('relations', {}) as {
			relation?: RelationEntry[];
		};
		const allowNewSelectOptions = this.getNodeParameter(
			'allowNewSelectOptions',
			false,
		) as boolean;

		const schema = await fetchSchema(this, credentialName, collectionId);
		try {
			requestOptions.body = buildCollectionItemBody({
				schema,
				mode,
				mapperValue: columns.value ?? {},
				relations: relationsParam.relation ?? [],
				allowNewSelectOptions,
			});
		} catch (error) {
			throw new NodeOperationError(this.getNode(), (error as Error).message);
		}
		return requestOptions;
	};
}
