/* eslint-disable @n8n/community-nodes/no-restricted-imports -- vitest is a dev-only test dependency */
import { describe, expect, it } from 'vitest';
import { collectionSearchResults as documentSearchResults } from '../CraftDocuments/loadOptions/getCollections';
import { collectionSearchResults as dailyNoteSearchResults } from '../CraftDailyNotes/loadOptions/getCollections';

const collections = Array.from({ length: 260 }, (_, index) => ({
	id: `collection-${index}`,
	name: index === 12 ? 'Launch Plans' : `Collection ${index}`,
}));

describe.each([
	['documents', documentSearchResults],
	['daily notes', dailyNoteSearchResults],
])('%s collection search', (_name, search) => {
	it('filters by name or ID and pages an unpaginated response', () => {
		expect(search(collections, 'launch').results).toEqual([
			{ name: 'Launch Plans', value: 'collection-12' },
		]);
		expect(search(collections, 'collection-259').results).toEqual([
			{ name: 'Collection 259', value: 'collection-259' },
		]);
		const firstPage = search(collections);
		expect(firstPage.results).toHaveLength(250);
		expect(firstPage.paginationToken).toEqual(expect.any(String));
		const secondPage = search(collections, '', firstPage.paginationToken);
		expect(secondPage.results).toHaveLength(10);
		expect(secondPage.results[0]).toEqual({ name: 'Collection 250', value: 'collection-250' });
		expect(secondPage.paginationToken).toBeUndefined();
		const filteredFirstPage = search(collections, 'collection');
		const filteredSecondPage = search(collections, undefined, filteredFirstPage.paginationToken);
		expect(filteredSecondPage.results[0]).toEqual({
			name: 'Collection 250',
			value: 'collection-250',
		});
	});

	it('rejects malformed and query-mismatched page tokens', () => {
		expect(() => search(collections, '', 'not-a-token')).toThrow(
			/Invalid collection search page token/,
		);
		const firstPage = search(collections, 'collection');
		expect(() => search(collections, 'launch', firstPage.paginationToken)).toThrow(
			/Invalid collection search page token/,
		);
	});
});
