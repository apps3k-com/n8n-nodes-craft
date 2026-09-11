/** Craft Space folder resource. */
import type { INodeProperties } from 'n8n-workflow';

import { folderListDescription } from './list';

const show = { resource: ['folder'], connectionScope: ['space'], '@version': [2] };

/** Folder List only; it is intentionally read-only. */
export const folderDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		default: 'list',
		options: [
			{
				name: 'List',
				value: 'list',
				action: 'List folders',
				description: 'Retrieve the folder hierarchy and built-in locations',
				routing: { request: { method: 'GET', url: '/folders' } },
			},
		],
	},
	...folderListDescription,
];
