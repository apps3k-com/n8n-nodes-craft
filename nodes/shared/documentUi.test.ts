/* eslint-disable @n8n/community-nodes/no-restricted-imports -- vitest is a dev-only test dependency */
import { describe, expect, it, vi } from 'vitest';
import type { IExecuteSingleFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import { withDocumentLocators } from './documentUi';
import { getDocuments, searchDocuments } from '../CraftDocuments/loadOptions/getDocuments';
import { blockGetDescription } from '../CraftDocuments/resources/block/get';
import { blockInsertPreSend } from '../CraftDocuments/resources/block/insert';

function context(items: unknown) {
	return {
		getCredentials: vi.fn().mockResolvedValue({ apiUrl: 'https://example.invalid/api/' }),
		helpers: { httpRequestWithAuthentication: vi.fn().mockResolvedValue(items) },
	} as unknown as ILoadOptionsFunctions;
}

describe('document selection', () => {
	it('preserves v1 fields and offers v2 list and direct ID while retaining query routing', () => {
		const fields = withDocumentLocators(blockGetDescription).filter((p) => p.name === 'blockId');
		expect(fields).toHaveLength(2);
		expect(fields[0].type).toBe('options');
		expect(fields[0].displayOptions?.show?.['@version']).toEqual([1]);
		expect(fields[1].displayOptions?.show?.['@version']).toEqual([2]);
		expect(fields[1].modes?.map((mode) => mode.name)).toEqual(['list', 'id']);
		expect(fields[1].routing).toEqual(fields[0].routing);
	});
	it('filters deleted documents, searches titles/IDs and pages the complete returned list', async () => {
		const ctx = context({
			items: [
				...Array.from({ length: 101 }, (_, i) => ({ id: `doc-${i}`, title: `Project ${i}` })),
				{ id: 'deleted', isDeleted: true },
			],
		});
		const first = await searchDocuments.call(ctx, 'project');
		expect(first.results).toHaveLength(100);
		expect(first.paginationToken).toBe('100');
		expect((await searchDocuments.call(ctx, 'project', '100')).results).toHaveLength(1);
		expect((await searchDocuments.call(ctx, 'doc-100')).results[0].name).toBe('Project 100');
		await expect(searchDocuments.call(ctx, '', '-1')).rejects.toThrow('Invalid');
	});
	it('distinguishes empty successful responses from server/schema errors', async () => {
		expect(await getDocuments.call(context({ items: [] }))).toEqual([]);
		await expect(getDocuments.call(context({}))).rejects.toThrow('invalid document list');
		const ctx = context({});
		vi.mocked(ctx.helpers.httpRequestWithAuthentication).mockRejectedValue(
			new Error('Unauthorized'),
		);
		await expect(getDocuments.call(ctx)).rejects.toThrow('Unauthorized');
	});
});

describe('versioned block insert', () => {
	function execution(params: Record<string, unknown>, version = 2) {
		return {
			getNodeParameter: (name: string, fallback: unknown) => params[name] ?? fallback,
			getNode: () => ({ typeVersion: version }),
		} as unknown as IExecuteSingleFunctions;
	}
	it('accepts legacy string and locator target IDs', async () => {
		for (const targetPageId of ['doc', { mode: 'list', value: 'doc' }]) {
			const result = await blockInsertPreSend.call(
				execution({ targetPageId, markdownContent: 'Hello' }),
				{ method: 'POST', url: '/blocks' },
			);
			expect(result.body).toEqual({
				blocks: [{ type: 'text', markdown: 'Hello' }],
				position: { position: 'end', pageId: 'doc' },
			});
		}
	});
	it('sends only the sibling position for v2 and rejects missing targets', async () => {
		const result = await blockInsertPreSend.call(
			execution({ targetPageId: 'doc', positionType: 'after', referenceBlockId: 'block' }),
			{ method: 'POST', url: '/blocks' },
		);
		expect(result.body).toMatchObject({ position: { position: 'after', siblingId: 'block' } });
		expect((result.body as { position: object }).position).not.toHaveProperty('pageId');
		await expect(
			blockInsertPreSend.call(execution({ positionType: 'after' }), { url: '/blocks' }),
		).rejects.toThrow('reference block');
	});
});
