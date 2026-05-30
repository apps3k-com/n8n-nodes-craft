/* eslint-disable @n8n/community-nodes/no-restricted-imports -- vitest is a dev-only test dependency; test files are excluded from the n8n build (tsconfig) and never ship to n8n Cloud */
import { describe, it, expect } from 'vitest';
import { craftTypeToFieldType } from './collectionMapping';

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
