import type { INodeProperties } from 'n8n-workflow';
import { taskGetDescription, taskGetRouting } from './get';
import { taskAddDescription, taskAddRouting } from './add';
import { taskUpdateDescription, taskUpdateRouting } from './update';
import { taskDeleteDescription, taskDeleteRouting } from './delete';

const show = { resource: ['task'], connectionScope: ['space'], '@version': [2] };

/** Space task resource; intentionally gated to CraftDocuments v2 Space connections. */
export const taskDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'get',
		displayOptions: { show },
		options: [
			{ name: 'Get', value: 'get', action: 'Get tasks by scope', routing: taskGetRouting },
			{ name: 'Add', value: 'add', action: 'Add a task', routing: taskAddRouting },
			{ name: 'Update', value: 'update', action: 'Update a task', routing: taskUpdateRouting },
			{ name: 'Delete', value: 'delete', action: 'Delete a task', routing: taskDeleteRouting },
		],
	},
	...taskGetDescription,
	...taskAddDescription,
	...taskUpdateDescription,
	...taskDeleteDescription,
];
