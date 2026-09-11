import type { IDataObject, ResourceMapperField } from 'n8n-workflow';

export type ResourceMapperMode = 'add' | 'update';

export interface CraftSchemaProperty {
	key: string;
	name: string;
	type: string;
	options?: Array<string | { name: string }>;
	targetCollectionId?: string;
	config?: Record<string, unknown>;
}

export interface CraftCollectionSchema {
	name: string;
	contentPropDetails?: { key: string; name: string };
	properties: CraftSchemaProperty[];
}

export type N8nFieldType = 'string' | 'number' | 'dateTime' | 'options';

/** Converts documented Craft collection property types to n8n mapper input types. */
export function craftTypeToFieldType(craftType: string): N8nFieldType {
	switch (craftType) {
		case 'number':
			return 'number';
		case 'date':
			return 'dateTime';
		case 'singleSelect':
		case 'select':
			return 'options';
		case 'text':
			return 'string';
		default:
			return 'string';
	}
}

/** Builds n8n mapper fields from the direct Craft schema response. */
export function mapSchemaToResourceMapperFields(
	schema: CraftCollectionSchema,
	mode: ResourceMapperMode,
): ResourceMapperField[] {
	const fields: ResourceMapperField[] = [];

	if (mode === 'update') {
		fields.push({
			id: 'id',
			displayName: 'Item ID',
			type: 'string',
			required: true,
			display: true,
			defaultMatch: true,
			canBeUsedToMatch: true,
		});
	}

	if (schema.contentPropDetails) {
		fields.push({
			id: schema.contentPropDetails.key,
			displayName: schema.contentPropDetails.name,
			type: 'string',
			required: mode === 'add',
			display: true,
			defaultMatch: false,
		});
	}

	for (const prop of schema.properties ?? []) {
		if (prop.type === 'relation') continue;
		const type = craftTypeToFieldType(prop.type);
		const field: ResourceMapperField = {
			id: prop.key,
			displayName: prop.name,
			type,
			required: false,
			display: true,
			defaultMatch: false,
		};
		if (type === 'options' && Array.isArray(prop.options)) {
			field.options = prop.options.flatMap((option) => {
				const value = typeof option === 'string' ? option : option.name;
				return value ? [{ name: value, value }] : [];
			});
		}
		fields.push(field);
	}

	return fields;
}

export interface RelationEntry {
	relationField: string;
	relatedItems: string[];
}

export interface BuildBodyArgs {
	schema: CraftCollectionSchema;
	mode: ResourceMapperMode;
	mapperValue: IDataObject;
	relations: RelationEntry[];
	allowNewSelectOptions: boolean;
}

/** Identifies values that Craft should omit rather than send as empty properties. */
function isEmpty(value: unknown): boolean {
	return value === undefined || value === null || value === '';
}

/** Serializes one mapped n8n input item into Craft's add or update payload shape. */
export function buildCollectionItemBody(args: BuildBodyArgs): IDataObject {
	const { schema, mode, mapperValue, relations, allowNewSelectOptions } = args;
	const contentKey = schema.contentPropDetails?.key;

	const properties: IDataObject = {};
	let contentValue: unknown;
	let id: IDataObject[string];

	for (const [key, value] of Object.entries(mapperValue ?? {})) {
		if (isEmpty(value)) continue;
		if (mode === 'update' && key === 'id') {
			id = value;
			continue;
		}
		if (contentKey && key === contentKey) {
			contentValue = value;
			continue;
		}
		properties[key] = value as IDataObject[string];
	}

	for (const rel of relations ?? []) {
		if (!rel.relationField || !Array.isArray(rel.relatedItems) || rel.relatedItems.length === 0)
			continue;
		properties[rel.relationField] = {
			relations: rel.relatedItems.map((blockId) => ({ blockId })),
		};
	}

	if (mode === 'update' && (id === undefined || id === null || id === '')) {
		throw new Error('Update Items requires an Item ID for each item. Map the "Item ID" field.');
	}

	const item: IDataObject = mode === 'update' ? { id, properties } : { properties };
	if (contentKey && contentValue !== undefined) {
		item[contentKey] = contentValue as IDataObject[string];
	}

	return mode === 'update'
		? { itemsToUpdate: [item], allowNewSelectOptions }
		: { items: [item], allowNewSelectOptions };
}
