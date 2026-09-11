#!/usr/bin/env node
/** Run the built nodes in an isolated n8n CLI against a loopback contract fixture, never live Craft. */
const { createServer } = require('node:http');
const { mkdtemp, writeFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');

(async () => {
	const binary = process.env.N8N_BINARY;
	if (!binary)
		throw new Error(
			'Set N8N_BINARY to the installed n8n/bin/n8n entrypoint and run with its supported Node.js version.',
		);
	const directory = await mkdtemp(path.join(tmpdir(), 'craft-runtime-smoke-'));
	const requests = [];
	const server = createServer(async (req, res) => {
		let raw = '';
		for await (const chunk of req) raw += chunk;
		const url = new URL(req.url, 'http://localhost');
		const body = raw ? JSON.parse(raw) : undefined;
		requests.push({
			method: req.method,
			path: url.pathname,
			query: Object.fromEntries(url.searchParams),
			body,
		});
		res.setHeader('Content-Type', 'application/json');
		if (req.headers.authorization !== 'Bearer fixture-only') {
			res.statusCode = 401;
			res.end('{}');
			return;
		}
		if (url.pathname.endsWith('/schema'))
			res.end(
				JSON.stringify({
					name: 'Fixture',
					contentPropDetails: { key: 'title', name: 'Title' },
					properties: [],
				}),
			);
		else if (url.pathname === '/connection') res.end(JSON.stringify({ space: { id: 'fixture' } }));
		else
			res.end(
				JSON.stringify({
					items: [{ id: 'fixture-id', title: 'Fixture', markdown: 'Fixture task' }],
				}),
			);
	});
	await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
	const env = {
		...process.env,
		N8N_USER_FOLDER: directory,
		N8N_CUSTOM_EXTENSIONS: path.resolve('dist'),
		N8N_DIAGNOSTICS_ENABLED: 'false',
		N8N_VERSION_NOTIFICATIONS_ENABLED: 'false',
		N8N_RUNNERS_ENABLED: 'false',
		N8N_RUNNERS_BROKER_PORT: '5691',
	};
	/** Keep subprocess failures inspectable without printing credential material. */
	async function run(args) {
		const result = await new Promise((resolve, reject) => {
			const child = spawn(process.execPath, [binary, ...args], { env });
			let output = '';
			child.stdout.on('data', (data) => (output += data));
			child.stderr.on('data', (data) => (output += data));
			child.on('error', reject);
			child.on('close', (code) => resolve({ code, output }));
		});
		await writeFile(path.join(directory, args[0].replace(':', '-') + '.log'), result.output);
		if (result.code) throw new Error(`${args[0]} failed (${result.code}); see ${directory}`);
		return result.output;
	}
	const locator = (value) => ({ __rl: true, mode: 'id', value });
	const scenarios = [
		['Folder default', 2, { connectionScope: 'space', resource: 'folder' }],
		[
			'Create document',
			2,
			{
				connectionScope: 'space',
				resource: 'document',
				operation: 'create',
				title: 'Fixture title',
				destinationType: 'folder',
				folderId: locator('folder'),
			},
		],
		[
			'Add task',
			2,
			{
				connectionScope: 'space',
				resource: 'task',
				operation: 'add',
				markdown: 'Fixture task',
				locationType: 'document',
				locationDocumentId: locator('doc'),
			},
		],
		[
			'Get document tasks',
			2,
			{
				connectionScope: 'space',
				resource: 'task',
				operation: 'get',
				taskScope: 'document',
				documentId: locator('doc'),
			},
		],
		[
			'Update task',
			2,
			{
				connectionScope: 'space',
				resource: 'task',
				operation: 'update',
				taskId: locator('task'),
				state: 'done',
			},
		],
		[
			'Update selected item',
			2,
			{
				resource: 'collection',
				operation: 'updateItems',
				collectionId: locator('collection'),
				itemSelectionMode: 'selectItem',
				itemId: locator('item'),
				columns: { mappingMode: 'defineBelow', value: { title: 'Updated' } },
			},
		],
		[
			'Legacy collection',
			1,
			{ resource: 'collection', operation: 'getItems', collectionId: 'collection' },
		],
		[
			'Move document',
			2,
			{
				connectionScope: 'space',
				resource: 'document',
				operation: 'move',
				documentId: locator('doc'),
				destinationType: 'templates',
			},
		],
		[
			'Trash document',
			2,
			{
				connectionScope: 'space',
				resource: 'document',
				operation: 'delete',
				documentId: locator('doc'),
			},
		],
		[
			'Delete task',
			2,
			{ connectionScope: 'space', resource: 'task', operation: 'delete', taskId: locator('task') },
		],
	];
	const nodes = [
		{
			id: 'start',
			name: 'Start',
			type: 'n8n-nodes-base.manualTrigger',
			typeVersion: 1,
			position: [0, 0],
			parameters: {},
		},
		...scenarios.map(([name, version, parameters], index) => ({
			id: `node-${index}`,
			name,
			type: 'CUSTOM.craftDocuments',
			typeVersion: version,
			position: [index * 200 + 200, 0],
			parameters,
			credentials: { craftDocumentsApi: { id: 'fixture-credential', name: 'Fixture only' } },
		})),
	];
	const connections = {};
	for (let i = 0; i < nodes.length - 1; i++)
		connections[nodes[i].name] = { main: [[{ node: nodes[i + 1].name, type: 'main', index: 0 }]] };
	const credentials = path.join(directory, 'credentials.json');
	await writeFile(
		credentials,
		JSON.stringify([
			{
				id: 'fixture-credential',
				name: 'Fixture only',
				type: 'craftDocumentsApi',
				data: { apiUrl: `http://127.0.0.1:${server.address().port}`, apiKey: 'fixture-only' },
			},
		]),
	);
	const workflowFile = path.join(directory, 'workflow.json');
	await writeFile(
		workflowFile,
		JSON.stringify([
			{
				id: 'craft-runtime-fixture',
				name: 'Craft runtime fixture',
				nodes,
				connections,
				settings: { executionOrder: 'v1' },
				active: false,
			},
		]),
	);
	try {
		await run(['import:credentials', `--input=${credentials}`]);
		await run(['import:workflow', `--input=${workflowFile}`]);
		const output = await run(['execute', '--id=craft-runtime-fixture']);
		if (output.includes('Workflow execution failed'))
			throw new Error(`Execution failed; see ${directory}`);
		const find = (method, endpoint) =>
			requests.find((r) => r.method === method && r.path === endpoint);
		assert.ok(find('GET', '/folders'), 'Folder default route');
		assert.deepEqual(find('POST', '/documents').body, {
			documents: [{ title: 'Fixture title' }],
			destination: { folderId: 'folder' },
		});
		assert.deepEqual(find('POST', '/tasks').body, {
			tasks: [{ markdown: 'Fixture task', location: { type: 'document', documentId: 'doc' } }],
		});
		assert.deepEqual(find('GET', '/tasks').query, { scope: 'document', documentId: 'doc' });
		assert.deepEqual(find('PUT', '/tasks').body, {
			tasksToUpdate: [{ id: 'task', taskInfo: { state: 'done' } }],
		});
		assert.equal(find('PUT', '/collections/collection/items').body.itemsToUpdate[0].id, 'item');
		assert.ok(find('GET', '/collections/collection/items'), 'Legacy collection read');
		assert.deepEqual(find('PUT', '/documents/move').body, {
			documentIds: ['doc'],
			destination: { destination: 'templates' },
		});
		assert.deepEqual(find('DELETE', '/documents').body, { documentIds: ['doc'] });
		assert.deepEqual(find('DELETE', '/tasks').body, { idsToDelete: ['task'] });
		await writeFile(path.join(directory, 'requests.json'), JSON.stringify(requests, null, 2));
		console.log(`PASS: ${scenarios.length} n8n runtime scenarios; fixture evidence: ${directory}`);
	} finally {
		await new Promise((resolve) => server.close(resolve));
	}
})().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
