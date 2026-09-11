/* eslint-disable @n8n/community-nodes/no-restricted-imports -- vitest is test-only */
import { describe, expect, it } from 'vitest';
import type { IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

import {
	taskAddPreSend,
	taskDeletePreSend,
	taskGetPreSend,
	taskUpdatePreSend,
} from './organization';

function context(parameters: Record<string, unknown>): IExecuteSingleFunctions {
	return {
		getNodeParameter: (name: string, fallback?: unknown) => parameters[name] ?? fallback,
	} as unknown as IExecuteSingleFunctions;
}

describe('Craft Space task request builders', () => {
	it('builds an inbox task with schedule and deadline', async () => {
		const result = await taskAddPreSend.call(
			context({
				markdown: 'Review API',
				locationType: 'inbox',
				scheduleDate: 'today',
				deadlineDate: '2026-09-12',
			}),
			{} as IHttpRequestOptions,
		);
		expect(result.body).toEqual({
			tasks: [
				{
					markdown: 'Review API',
					location: { type: 'inbox' },
					taskInfo: { scheduleDate: 'today', deadlineDate: '2026-09-12' },
				},
			],
		});
	});

	it('builds a document task location from a resource locator', async () => {
		const result = await taskAddPreSend.call(
			context({
				markdown: 'Write docs',
				locationType: 'document',
				locationDocumentId: { mode: 'list', value: 'doc-1' },
			}),
			{} as IHttpRequestOptions,
		);
		expect(result.body).toEqual({
			tasks: [{ markdown: 'Write docs', location: { type: 'document', documentId: 'doc-1' } }],
		});
	});

	it('updates state and optionally moves a task', async () => {
		const result = await taskUpdatePreSend.call(
			context({
				taskId: { value: 'task-1' },
				state: 'done',
				changeLocation: true,
				locationType: 'dailyNote',
				locationDate: 'tomorrow',
			}),
			{} as IHttpRequestOptions,
		);
		expect(result.body).toEqual({
			tasksToUpdate: [
				{
					id: 'task-1',
					taskInfo: { state: 'done' },
					location: { type: 'dailyNote', date: 'tomorrow' },
				},
			],
		});
	});

	it('deletes by task ID and rejects missing IDs', async () => {
		const result = await taskDeletePreSend.call(
			context({ taskId: 'task-1' }),
			{} as IHttpRequestOptions,
		);
		expect(result.body).toEqual({ idsToDelete: ['task-1'] });
		await expect(
			taskDeletePreSend.call(context({ taskId: { value: '' } }), {} as IHttpRequestOptions),
		).rejects.toThrow('Task is required.');
	});

	it('requires a document for document scope and accepts the documented canceled state', async () => {
		await expect(
			taskGetPreSend.call(context({ taskScope: 'document', documentId: { value: '' } }), {
				qs: {},
			} as IHttpRequestOptions),
		).rejects.toThrow('Document is required');
		const result = await taskUpdatePreSend.call(
			context({ taskId: 'task-1', state: 'canceled' }),
			{} as IHttpRequestOptions,
		);
		expect(result.body).toEqual({
			tasksToUpdate: [{ id: 'task-1', taskInfo: { state: 'canceled' } }],
		});
		await expect(
			taskUpdatePreSend.call(
				context({ taskId: 'task-1', state: 'cancelled' }),
				{} as IHttpRequestOptions,
			),
		).rejects.toThrow('Task state');
	});
});
