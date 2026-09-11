import type {
	ILoadOptionsFunctions,
	INodeListSearchResult,
	INodePropertyOptions,
} from 'n8n-workflow';

import { craftApiRequest } from '../shared/transport';

interface CraftTask {
	id: string;
	markdown?: string;
	title?: string;
	state?: string;
	taskInfo?: { state?: string };
}

interface TasksResponse {
	items?: CraftTask[];
}

/** Returns the most useful human-readable task label available from Craft. */
function taskName(task: CraftTask): string {
	return task.markdown || task.title || `Task ${task.id}`;
}

/** Fetches tasks for the selected Space scope for searchable task locators. */
export async function getTasks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const scope = this.getNodeParameter('taskScope', 'active') as string;
	const query: Record<string, string> = { scope };
	if (scope === 'document') {
		const document = this.getNodeParameter('documentId', '') as unknown;
		const documentId =
			typeof document === 'string'
				? document
				: document && typeof document === 'object' && 'value' in document
					? String((document as { value?: unknown }).value || '')
					: '';
		if (!documentId) return [];
		query.documentId = documentId;
	}
	const response = (await craftApiRequest.call(this, 'GET', '/tasks', query)) as TasksResponse;
	if (!Array.isArray(response.items)) throw new Error('Craft returned an invalid task list.');
	return response.items.map((task) => ({
		name: taskName(task),
		value: task.id,
		description: task.taskInfo?.state || task.state || `ID: ${task.id}`,
	}));
}

/** Search task content and IDs locally; Craft exposes no documented task-search endpoint. */
export async function searchTasks(
	this: ILoadOptionsFunctions,
	filter = '',
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const offset = paginationToken === undefined ? 0 : Number(paginationToken);
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error('Invalid task selection page. Search again.');
	const query = filter.toLocaleLowerCase();
	const options = (await getTasks.call(this)).filter((item) =>
		`${item.name} ${item.value} ${item.description || ''}`.toLocaleLowerCase().includes(query),
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
