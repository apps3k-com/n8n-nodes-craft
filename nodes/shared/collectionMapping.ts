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
