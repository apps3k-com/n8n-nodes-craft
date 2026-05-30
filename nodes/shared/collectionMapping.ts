import type { ResourceMapperField } from 'n8n-workflow';

export type ResourceMapperMode = 'add' | 'update';

export interface CraftSchemaProperty {
	key: string;
	name: string;
	type: string;
	options?: Array<{ name: string }>;
	targetCollectionId?: string;
	config?: Record<string, unknown>;
}

export interface CraftCollectionSchema {
	name: string;
	contentPropDetails?: { key: string; name: string };
	properties: CraftSchemaProperty[];
}

export type N8nFieldType = 'string' | 'number' | 'dateTime' | 'options';

export function craftTypeToFieldType(craftType: string): N8nFieldType {
	switch (craftType) {
		case 'number':
			return 'number';
		case 'date':
			return 'dateTime';
		case 'singleSelect':
			return 'options';
		case 'text':
			return 'string';
		default:
			return 'string';
	}
}

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
			field.options = prop.options.map((o) => ({ name: o.name, value: o.name }));
		}
		fields.push(field);
	}

	return fields;
}
