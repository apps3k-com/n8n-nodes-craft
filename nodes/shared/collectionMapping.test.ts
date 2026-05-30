/* eslint-disable @n8n/community-nodes/no-restricted-imports -- vitest is a dev-only test dependency; test files are excluded from the n8n build (tsconfig) and never ship to n8n Cloud */
import { describe, it, expect } from 'vitest';
import { craftTypeToFieldType, mapSchemaToResourceMapperFields } from './collectionMapping';
import type { CraftCollectionSchema } from './collectionMapping';

describe('craftTypeToFieldType', () => {
	it('maps known Craft types to n8n field types', () => {
		expect(craftTypeToFieldType('text')).toBe('string');
		expect(craftTypeToFieldType('number')).toBe('number');
		expect(craftTypeToFieldType('date')).toBe('dateTime');
		expect(craftTypeToFieldType('singleSelect')).toBe('options');
	});
	it('falls back to string for unknown types', () => {
		expect(craftTypeToFieldType('multiSelect')).toBe('string');
		expect(craftTypeToFieldType('whatever')).toBe('string');
	});
});

const schema: CraftCollectionSchema = {
	name: 'Fixkosten',
	contentPropDetails: { name: 'Was', key: 'was' },
	properties: [
		{ key: 'betrag_chf', name: 'Betrag CHF', type: 'number' },
		{ key: 'datum', name: 'Datum', type: 'date' },
		{
			key: 'prioritt',
			name: 'Priorität',
			type: 'singleSelect',
			options: [{ name: '🔴 MUSS' }, { name: '🟡 SOLL' }],
		},
		{ key: 'briefkasten', name: 'Briefkasten', type: 'relation', targetCollectionId: 'target-1' },
	],
};

describe('mapSchemaToResourceMapperFields', () => {
	it('builds typed columns and skips relations (add mode)', () => {
		const fields = mapSchemaToResourceMapperFields(schema, 'add');
		expect(fields.map((f) => f.id)).toEqual(['was', 'betrag_chf', 'datum', 'prioritt']);
		expect(fields.find((f) => f.id === 'was')).toMatchObject({ type: 'string', required: true });
		expect(fields.find((f) => f.id === 'betrag_chf')!.type).toBe('number');
		expect(fields.find((f) => f.id === 'datum')!.type).toBe('dateTime');
		const sel = fields.find((f) => f.id === 'prioritt')!;
		expect(sel.type).toBe('options');
		expect(sel.options).toEqual([
			{ name: '🔴 MUSS', value: '🔴 MUSS' },
			{ name: '🟡 SOLL', value: '🟡 SOLL' },
		]);
	});
	it('prepends a required Item ID match column (update mode)', () => {
		const fields = mapSchemaToResourceMapperFields(schema, 'update');
		expect(fields[0]).toMatchObject({
			id: 'id',
			required: true,
			defaultMatch: true,
			canBeUsedToMatch: true,
		});
		expect(fields.find((f) => f.id === 'was')!.required).toBe(false);
	});
});
