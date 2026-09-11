/* eslint-disable @n8n/community-nodes/no-restricted-imports -- vitest is a dev-only test dependency */
import { describe, expect, it } from 'vitest';
import type { IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

import { documentDescription } from './index';
import {
	documentCreatePreSend,
	documentDeletePreSend,
	documentMovePreSend,
	resolveLocatorId,
} from './organization';

function context(parameters: Record<string, unknown>): IExecuteSingleFunctions {
	return {
		getNodeParameter: (name: string, fallback?: unknown) => parameters[name] ?? fallback,
	} as unknown as IExecuteSingleFunctions;
}

describe('Craft Space document organization', () => {
	it('uses the documented routes for each space operation', () => {
		const v2 = documentDescription.find(
			(property) =>
				property.name === 'operation' &&
				property.displayOptions?.show?.connectionScope?.[0] === 'space',
		);
		const routes = Object.fromEntries(
			(v2?.options ?? []).map((option) => [option.value, option.routing?.request]),
		);
		expect(routes).toEqual({
			create: { method: 'POST', url: '/documents' },
			delete: { method: 'DELETE', url: '/documents' },
			list: { method: 'GET', url: '/documents' },
			move: { method: 'PUT', url: '/documents/move' },
		});
	});

	it('keeps the original v1 document list selector', () => {
		const v1 = documentDescription.find(
			(property) => property.name === 'operation' && property.options?.length === 1,
		);
		expect(v1?.options?.[0].routing?.request).toEqual({ method: 'GET', url: '/documents' });
	});

	it('builds a create body from a title and locator folder ID', async () => {
		const request = await documentCreatePreSend.call(
			context({
				title: 'Project plan',
				destinationType: 'folder',
				folderId: { value: 'folder-1' },
			}),
			{} as IHttpRequestOptions,
		);
		expect(request.body).toEqual({
			documents: [{ title: 'Project plan' }],
			destination: { folderId: 'folder-1' },
		});
	});

	it('builds documented move and soft-delete bodies', async () => {
		const moved = await documentMovePreSend.call(
			context({ documentId: { value: 'doc-1' }, destinationType: 'templates' }),
			{} as IHttpRequestOptions,
		);
		expect(moved.body).toEqual({
			documentIds: ['doc-1'],
			destination: { destination: 'templates' },
		});
		const deleted = await documentDeletePreSend.call(
			context({ documentId: 'doc-1' }),
			{} as IHttpRequestOptions,
		);
		expect(deleted.body).toEqual({ documentIds: ['doc-1'] });
	});

	it('rejects missing required locator values and malformed locator values', async () => {
		expect(resolveLocatorId({ value: 12 })).toBe('');
		await expect(
			documentMovePreSend.call(
				context({ documentId: { value: '' }, destinationType: 'unsorted' }),
				{} as IHttpRequestOptions,
			),
		).rejects.toThrow('Document is required.');
		await expect(
			documentCreatePreSend.call(
				context({ title: 'A', destinationType: 'folder', folderId: {} }),
				{} as IHttpRequestOptions,
			),
		).rejects.toThrow('Destination folder is required.');
	});
});
