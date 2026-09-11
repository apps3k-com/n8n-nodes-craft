import type {
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeListSearchResult,
} from 'n8n-workflow';
import { craftApiRequest } from '../shared/transport';

interface DocumentItem {
	id: string;
	title: string;
	isDeleted?: boolean;
	dailyNoteDate?: string;
}

/** Fetch readable documents; keep credential/server errors visible in the editor. */
export async function getDocuments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = (await craftApiRequest.call(this, 'GET', '/documents')) as {
		items?: DocumentItem[];
	};
	if (!Array.isArray(response.items))
		throw new Error(
			'Craft returned an invalid document list. Check the connection type and API URL.',
		);
	return response.items
		.filter((doc) => !doc.isDeleted)
		.map((doc) => ({
			name: doc.title || `Untitled (${doc.id})`,
			value: doc.id,
			description: doc.dailyNoteDate || `ID: ${doc.id}`,
		}));
}

/** Search titles/IDs and page the editor list locally; Craft has no documented list cursor. */
export async function searchDocuments(
	this: ILoadOptionsFunctions,
	filter = '',
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const offset = paginationToken === undefined ? 0 : Number(paginationToken);
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error('Invalid document selection page. Search again.');
	const query = filter.toLocaleLowerCase();
	const options = (await getDocuments.call(this)).filter((item) =>
		`${item.name} ${item.value}`.toLocaleLowerCase().includes(query),
	);
	return {
		results: options
			.slice(offset, offset + 100)
			.map((item) => ({
				name: item.name,
				value: String(item.value),
				description: item.description,
			})),
		...(offset + 100 < options.length ? { paginationToken: String(offset + 100) } : {}),
	};
}
