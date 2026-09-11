/* eslint-disable @n8n/community-nodes/no-restricted-imports -- vitest is a dev-only test dependency */
import { describe, expect, it } from 'vitest';
import { collectionDescription as documentCollections } from '../CraftDocuments/resources/collection';
import { collectionDescription as dailyNoteCollections } from '../CraftDailyNotes/resources/collection';

describe.each([
	['documents', documentCollections],
	['daily notes', dailyNoteCollections],
])('%s collection routing', (_name, properties) => {
	it('encodes both legacy string and v2 locator collection IDs in every item operation URL', () => {
		const operation = properties.find((property) => property.name === 'operation');
		const urls = operation?.options?.flatMap((option) => {
			const request = option.routing?.request;
			return request?.url?.includes('/collections/') ? [request.url] : [];
		});
		expect(urls).toHaveLength(5);
		for (const url of urls ?? []) {
			expect(url).toContain(
				'encodeURIComponent($parameter.collectionId.value ?? $parameter.collectionId)',
			);
		}
	});
});
