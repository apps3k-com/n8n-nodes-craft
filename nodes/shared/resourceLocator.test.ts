/* eslint-disable @n8n/community-nodes/no-restricted-imports -- vitest is a dev-only test dependency */
import { describe, expect, it } from 'vitest';
import { collectionLocatorProperties, resolveResourceId } from './resourceLocator';

describe('resolveResourceId', () => {
	it('accepts both version 1 strings and version 2 locator values', () => {
		expect(resolveResourceId('legacy-id')).toBe('legacy-id');
		expect(resolveResourceId({ mode: 'list', value: 'locator-id' })).toBe('locator-id');
	});

	it('does not coerce malformed locator values into request paths', () => {
		expect(resolveResourceId({ value: 12 })).toBe('');
		expect(resolveResourceId(undefined)).toBe('');
	});
});

describe('collectionLocatorProperties', () => {
	it('keeps the legacy selector and adds a searchable v2 locator', () => {
		const [legacy, locator] = collectionLocatorProperties({ show: { resource: ['collection'] } });
		expect(legacy).toMatchObject({
			type: 'options',
			default: '',
			displayOptions: { show: { '@version': [1] } },
		});
		expect(locator).toMatchObject({
			type: 'resourceLocator',
			displayOptions: { show: { '@version': [2] } },
			default: { mode: 'list', value: '' },
		});
		expect(locator.modes?.[0].typeOptions).toMatchObject({
			searchListMethod: 'searchCollections',
			searchable: true,
		});
	});
});
