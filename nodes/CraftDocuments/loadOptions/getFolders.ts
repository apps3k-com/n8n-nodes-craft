/** Load options for Craft Space folders. */
import type {
	ILoadOptionsFunctions,
	INodeListSearchResult,
	INodePropertyOptions,
} from 'n8n-workflow';

import { craftApiRequest } from '../shared/transport';

interface FolderItem {
	id: string;
	name: string;
	folders: FolderItem[];
}

interface FoldersResponse {
	items: FolderItem[];
}

const BUILT_IN_LOCATION_IDS = new Set(['unsorted', 'trash', 'templates']);
const PAGE_SIZE = 100;

/** Flattens user-created folders while excluding built-in locations handled by destination fields. */
export function flattenFolders(folders: FolderItem[], prefix = ''): INodePropertyOptions[] {
	const options: INodePropertyOptions[] = [];
	for (const folder of folders) {
		const name = folder.name || `Unnamed folder (${folder.id})`;
		if (!BUILT_IN_LOCATION_IDS.has(folder.id)) {
			options.push({ name: `${prefix}${name}`, value: folder.id, description: `ID: ${folder.id}` });
		}
		if (Array.isArray(folder.folders))
			options.push(...flattenFolders(folder.folders, `${prefix}${name} / `));
	}
	return options;
}

/** Builds a bounded client-side resource locator result because Craft documents no folder cursor. */
export function folderSearchResults(
	options: INodePropertyOptions[],
	filter = '',
	paginationToken?: string,
): INodeListSearchResult {
	const offset = paginationToken === undefined ? 0 : Number(paginationToken);
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error('Invalid folder selection page. Search again.');
	const query = filter.toLocaleLowerCase();
	const filtered = options.filter((option) =>
		`${option.name} ${option.value}`.toLocaleLowerCase().includes(query),
	);
	return {
		results: filtered
			.slice(offset, offset + PAGE_SIZE)
			.map((option) => ({
				name: option.name,
				value: String(option.value),
				description: option.description,
			})),
		...(offset + PAGE_SIZE < filtered.length
			? { paginationToken: String(offset + PAGE_SIZE) }
			: {}),
	};
}

/**
 * Fetches the Space folder tree and flattens it into resource-locator options.
 */
export async function getFolders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = (await craftApiRequest.call(
		this,
		'GET',
		'/folders',
	)) as unknown as FoldersResponse;
	if (!Array.isArray(response?.items))
		throw new Error(
			'Craft returned an invalid folder list. Check the connection type and API URL.',
		);
	return flattenFolders(response.items);
}

/** Searches a bounded page of flattened folders for n8n's resource locator. */
export async function searchFolders(
	this: ILoadOptionsFunctions,
	filter = '',
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return folderSearchResults(await getFolders.call(this), filter, paginationToken);
}
