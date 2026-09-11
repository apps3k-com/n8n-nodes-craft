/* eslint-disable n8n-nodes-base/node-param-description-lowercase-first-char -- API fixture values are not editor labels */
/* eslint-disable @n8n/community-nodes/no-restricted-imports -- vitest is test-only */
import { describe, expect, it, vi } from 'vitest';
import type { ILoadOptionsFunctions } from 'n8n-workflow';

import { getTasks, searchTasks } from './getTasks';

function context(
	response: unknown,
	parameters: Record<string, unknown> = {},
): ILoadOptionsFunctions {
	return {
		getNodeParameter: (name: string, fallback?: unknown) => parameters[name] ?? fallback,
		getCredentials: vi.fn().mockResolvedValue({ apiUrl: 'https://example.invalid/api/v1' }),
		helpers: { httpRequestWithAuthentication: vi.fn().mockResolvedValue(response) },
	} as unknown as ILoadOptionsFunctions;
}

describe('Craft Space task locators', () => {
	it('uses documentId for document scope and displays markdown content', async () => {
		const ctx = context(
			{ items: [{ id: 'task-1', markdown: 'Review API', taskInfo: { state: 'todo' } }] },
			{ taskScope: 'document', documentId: { value: 'doc-1' } },
		);
		expect(await getTasks.call(ctx)).toEqual([
			{ name: 'Review API', value: 'task-1', description: 'todo' },
		]);
		expect(vi.mocked(ctx.helpers.httpRequestWithAuthentication)).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ qs: { scope: 'document', documentId: 'doc-1' } }),
		);
	});

	it('returns no options instead of calling Craft without a document target', async () => {
		const ctx = context({ items: [] }, { taskScope: 'document', documentId: { value: '' } });
		expect(await getTasks.call(ctx)).toEqual([]);
		expect(ctx.helpers.httpRequestWithAuthentication).not.toHaveBeenCalled();
	});

	it('filters by task content and pages the returned scope locally', async () => {
		const ctx = context({
			items: Array.from({ length: 101 }, (_, i) => ({ id: `task-${i}`, markdown: `Task ${i}` })),
		});
		const first = await searchTasks.call(ctx, 'task');
		expect(first.results).toHaveLength(100);
		expect(first.paginationToken).toBe('100');
		expect((await searchTasks.call(ctx, 'task', '100')).results).toEqual([
			{ name: 'Task 100', value: 'task-100', description: 'ID: task-100' },
		]);
	});
});
