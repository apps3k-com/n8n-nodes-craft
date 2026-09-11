/* eslint-disable n8n-nodes-base/node-param-display-name-miscased -- API fixture values are not editor labels */
/* eslint-disable @n8n/community-nodes/no-restricted-imports -- vitest is a dev-only test dependency */
import { describe, expect, it, vi } from 'vitest';
import { createCollectionFieldMethods, createCollectionPreSend } from './collectionMethods';

const schema = {
	name: 'Tasks',
	contentPropDetails: { key: 'title', name: 'Title' },
	properties: [],
};

function preSendContext(collectionId: unknown) {
	const request = vi.fn().mockResolvedValue(schema);
	return {
		getCredentials: vi.fn().mockResolvedValue({ apiUrl: 'https://connect.example/api/v1' }),
		getNodeParameter: vi.fn((name: string) => {
			if (name === 'collectionId') return collectionId;
			if (name === 'columns') return { value: { title: 'A task' } };
			if (name === 'relations') return {};
			return false;
		}),
		getNode: vi.fn().mockReturnValue({}),
		helpers: { httpRequestWithAuthentication: request },
		request,
	};
}

describe('createCollectionPreSend', () => {
	it.each(['legacy-id', { mode: 'list', value: 'locator-id' }])(
		'uses the same schema request and body for %j collection IDs',
		async (collectionId) => {
			const ctx = preSendContext(collectionId);
			const preSend = createCollectionPreSend('craftDocumentsApi', 'add');
			const options = await preSend.call(ctx as never, {} as never);
			expect(ctx.request).toHaveBeenCalledWith(
				'craftDocumentsApi',
				expect.objectContaining({
					url: expect.stringContaining(
						`/collections/${String(typeof collectionId === 'string' ? collectionId : collectionId.value)}/schema`,
					),
				}),
			);
			expect(options.body).toEqual({
				items: [{ title: 'A task', properties: {} }],
				allowNewSelectOptions: false,
			});
		},
	);

	it('encodes a collection ID before fetching its schema', async () => {
		const ctx = preSendContext('team/a?draft=true');
		const preSend = createCollectionPreSend('craftDocumentsApi', 'add');
		await preSend.call(ctx as never, {} as never);
		expect(ctx.request).toHaveBeenCalledWith(
			'craftDocumentsApi',
			expect.objectContaining({
				url: 'https://connect.example/api/v1/collections/team%2Fa%3Fdraft%3Dtrue/schema',
			}),
		);
	});

	it('rejects malformed schema responses instead of silently rendering no fields', async () => {
		const ctx = preSendContext('collection-1');
		ctx.request.mockResolvedValueOnce({ properties: 'invalid' });
		const preSend = createCollectionPreSend('craftDocumentsApi', 'add');
		await expect(preSend.call(ctx as never, {} as never)).rejects.toThrow(
			/invalid collection schema/,
		);
	});

	it('injects a selected v2 item ID and rejects a missing selection', async () => {
		const selected = preSendContext('collection-1');
		selected.getNode.mockReturnValue({ typeVersion: 2 });
		selected.getNodeParameter.mockImplementation((name: string) => {
			if (name === 'itemSelectionMode') return 'selectItem';
			if (name === 'itemId') return { mode: 'list', value: 'item-7' };
			if (name === 'columns') return { value: { title: 'Changed' } };
			if (name === 'collectionId') return 'collection-1';
			if (name === 'relations') return {};
			return false;
		});
		const preSend = createCollectionPreSend('craftDocumentsApi', 'update');
		await expect(preSend.call(selected as never, {} as never)).resolves.toMatchObject({
			body: { itemsToUpdate: [{ id: 'item-7' }] },
		});
		const missing = preSendContext('collection-1');
		missing.getNode.mockReturnValue({ typeVersion: 2 });
		missing.getNodeParameter.mockImplementation((name: string) => name === 'itemSelectionMode' ? 'selectItem' : name === 'collectionId' ? 'collection-1' : name === 'relations' ? {} : name === 'columns' ? { value: {} } : '');
		await expect(preSend.call(missing as never, {} as never)).rejects.toThrow(/Select a collection item/);
	});

	it('encodes relation target IDs and labels items from the target schema content field', async () => {
		const ctx = preSendContext('source');
		ctx.getCurrentNodeParameter = vi.fn().mockReturnValue('related');
		ctx.request
			.mockResolvedValueOnce({
				name: 'Source',
				properties: [
					{ key: 'related', name: 'Related', type: 'relation', targetCollectionId: 'target/a?x=1' },
				],
			})
			.mockResolvedValueOnce({
				name: 'Target',
				contentPropDetails: { key: 'title', name: 'Title' },
				properties: [],
			})
			.mockResolvedValueOnce({ items: [{ id: 'item-1', title: 'A related item' }] });
		const methods = createCollectionFieldMethods('craftDocumentsApi');
		await expect(methods.getRelationTargetItems.call(ctx as never)).resolves.toEqual([
			{ name: 'A related item', value: 'item-1' },
		]);
		expect(ctx.request.mock.calls.map((call) => call[1].url)).toEqual(
			expect.arrayContaining([
				expect.stringContaining('/collections/target%2Fa%3Fx%3D1/schema'),
				expect.stringContaining('/collections/target%2Fa%3Fx%3D1/items'),
			]),
		);
	});
});
