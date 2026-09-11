/**
 * Load options method for fetching collections
 * Used by collection selector dropdowns
 */
import type {
	ILoadOptionsFunctions,
	INodeListSearchResult,
	INodePropertyOptions,
} from 'n8n-workflow';

import { craftApiRequest } from '../shared/transport';

interface CollectionItem {
	id: string;
	name: string;
	itemCount?: number;
	dailyNoteDate?: string;
}

interface CollectionsResponse {
	items: CollectionItem[];
}

const MAX_COLLECTION_SEARCH_RESULTS = 250;
interface CollectionSearchPageToken {
	offset: number;
	query: string;
}

/** Parses and validates the opaque local pagination token returned to n8n. */
function parsePageToken(paginationToken: unknown, query: string): CollectionSearchPageToken {
	if (paginationToken === undefined || paginationToken === null) return { offset: 0, query };
	if (typeof paginationToken !== 'string') throw new Error('Invalid collection search page token');
	try {
		const token = JSON.parse(decodeURIComponent(paginationToken)) as CollectionSearchPageToken;
		if (
			!Number.isSafeInteger(token.offset) ||
			token.offset < 0 ||
			typeof token.query !== 'string'
		) {
			throw new Error('Invalid collection search page token');
		}
		if (query && token.query !== query)
			throw new Error('Collection search query changed while paging');
		return token;
	} catch {
		throw new Error('Invalid collection search page token');
	}
}

/** Maps Craft's unpaginated collection response into a bounded n8n locator list. */
export function collectionSearchResults(
	collections: CollectionItem[],
	query = '',
	paginationToken?: unknown,
): INodeListSearchResult {
	const normalizedQuery = query.trim().toLowerCase();
	const page = parsePageToken(paginationToken, normalizedQuery);
	const queryToUse = page.query;
	const filtered = collections.filter((collection) => {
		if (!queryToUse) return true;
		return (
			collection.id.toLowerCase().includes(queryToUse) ||
			collection.name.toLowerCase().includes(queryToUse)
		);
	});
	if (page.offset > filtered.length) throw new Error('Invalid collection search page token');
	const nextOffset = page.offset + MAX_COLLECTION_SEARCH_RESULTS;
	return {
		results: filtered.slice(page.offset, nextOffset).map((collection) => ({
			name: collection.name || `Collection ${collection.id}`,
			value: collection.id,
		})),
		...(nextOffset < filtered.length
			? {
					paginationToken: encodeURIComponent(
						JSON.stringify({ offset: nextOffset, query: queryToUse }),
					),
				}
			: {}),
	};
}

/**
 * Fetch all collections from the Craft Daily Notes API
 * Returns options for collection selector dropdowns
 *
 * @returns Array of collection options
 */
export async function getCollections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = (await craftApiRequest.call(
		this,
		'GET',
		'/collections',
	)) as unknown as CollectionsResponse;
	if (!Array.isArray(response?.items)) return [];
	return response.items.map((collection) => ({
		name: collection.name || `Collection ${collection.id}`,
		value: collection.id,
		description: collection.dailyNoteDate
			? `Date: ${collection.dailyNoteDate}`
			: `ID: ${collection.id}`,
	}));
}

/** Provides n8n's searchable collection locator list without undocumented API parameters. */
export async function searchCollections(
	this: ILoadOptionsFunctions,
	query?: string,
	paginationToken?: unknown,
): Promise<INodeListSearchResult> {
	const response = (await craftApiRequest.call(
		this,
		'GET',
		'/collections',
	)) as unknown as CollectionsResponse;
	return collectionSearchResults(
		Array.isArray(response?.items) ? response.items : [],
		query,
		paginationToken,
	);
}
