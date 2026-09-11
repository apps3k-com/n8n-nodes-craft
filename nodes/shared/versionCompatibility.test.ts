/* eslint-disable @n8n/community-nodes/no-restricted-imports -- vitest is a dev-only test dependency */
import { describe, expect, it } from 'vitest';
import { NodeHelpers, Workflow } from 'n8n-workflow';
import type { INode } from 'n8n-workflow';
import { CraftDocuments } from '../CraftDocuments/CraftDocuments.node';
import { CraftDailyNotes } from '../CraftDailyNotes/CraftDailyNotes.node';

const documents = new CraftDocuments();
const daily = new CraftDailyNotes();
function visible(
	nodeType: typeof documents | typeof daily,
	version: number,
	parameters: Record<string, unknown>,
) {
	const node = { typeVersion: version, parameters } as INode;
	return nodeType.description.properties.filter((p) =>
		NodeHelpers.displayParameter(parameters, p, node, nodeType.description),
	);
}

describe('n8n actual parameter display engine', () => {
	it.each([1, 2])(
		'has exactly one document operation selector at version %s for each connection scope',
		(version) => {
			for (const connectionScope of ['selected', 'space']) {
				const props = visible(documents, version, {
					resource: 'document',
					operation: 'list',
					connectionScope,
				});
				const ops = props.filter((p) => p.name === 'operation');
				expect(ops).toHaveLength(1);
				expect(ops[0].options?.length).toBe(version === 2 && connectionScope === 'space' ? 4 : 1);
			}
		},
	);
	it.each([documents, daily])(
		'selects exactly one collection field for every operation and version',
		(type) => {
			for (const version of [1, 2])
				for (const operation of [
					'addItems',
					'updateItems',
					'deleteItems',
					'getItems',
					'getSchema',
				]) {
					const props = visible(type, version, { resource: 'collection', operation });
					const selector = props.filter((p) => p.name === 'collectionId');
					expect(selector).toHaveLength(1);
					expect(selector[0].type).toBe(version === 1 ? 'options' : 'resourceLocator');
				}
		},
	);
	it('retains saved string IDs and v1 defaults with n8n parameter normalization', () => {
		const parameters = { resource: 'block', operation: 'get', blockId: 'legacy-id' };
		const node = { typeVersion: 1, parameters } as INode;
		const resolved = NodeHelpers.getNodeParameters(
			documents.description.properties,
			parameters,
			true,
			false,
			node,
			documents.description,
		);
		expect(resolved?.blockId).toBe('legacy-id');
		expect(resolved).not.toHaveProperty('connectionScope');
	});
});

// Exercise n8n's actual expression engine rather than only matching route strings.
describe('collection routing compatibility', () => {
	it.each([1, 2])('encodes legacy and locator IDs at version %s', (version) => {
		const collectionId = version === 1 ? 'a/b?c' : { __rl: true, mode: 'id', value: 'a/b?c' };
		const node = {
			id: 'test',
			name: 'Craft',
			type: 'craftDocuments',
			typeVersion: version,
			position: [0, 0],
			parameters: { resource: 'collection', operation: 'getItems', collectionId },
		} as INode;
		const workflow = new Workflow({
			id: 'test',
			nodes: [node],
			connections: {},
			active: false,
			nodeTypes: { getByNameAndVersion: () => documents, getKnownTypes: () => ({}) },
		});
		const selector = documents.description.properties.find(
			(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('collection'),
		)!;
		const operation = selector.options!.find((o) => 'value' in o && o.value === 'getItems')!;
		const route = 'routing' in operation ? (operation.routing!.request!.url as string) : '';
		expect(workflow.expression.getSimpleParameterValue(node, route, 'manual', {})).toBe(
			'/collections/a%2Fb%3Fc/items',
		);
	});
});
