/**
 * DOCUMENT RESOURCE INDEX
 * Operations: List
 */
import type { INodeProperties } from 'n8n-workflow';

import { documentCreateDescription } from './create';
import { documentDeleteDescription } from './delete';
import { documentListDescription } from './list';
import { documentMoveDescription } from './move';
import { documentCreatePreSend, documentDeletePreSend, documentMovePreSend } from './organization';

const showOnlyForDocument = { resource: ['document'] };

export const documentDescription: INodeProperties[] = [
	// Version 1 selector is retained so saved selected-document workflows remain unchanged.
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { ...showOnlyForDocument, '@version': [1] } },
		options: [
			{
				name: 'List',
				value: 'list',
				action: 'List all documents',
				description: 'Retrieve all documents accessible through this connection',
				routing: {
					request: {
						method: 'GET',
						url: '/documents',
					},
				},
			},
		],
		default: 'list',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { ...showOnlyForDocument, connectionScope: ['selected'], '@version': [2] },
		},
		options: [
			{
				name: 'List',
				value: 'list',
				action: 'List all documents',
				description: 'Retrieve documents accessible through this connection',
				routing: { request: { method: 'GET', url: '/documents' } },
			},
		],
		default: 'list',
	},
	// Space connections expose the documented organization operations in version 2.
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { ...showOnlyForDocument, connectionScope: ['space'], '@version': [2] },
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a document',
				description: 'Create a document in Unsorted, Templates, or a folder',
				routing: {
					request: { method: 'POST', url: '/documents' },
					send: { preSend: [documentCreatePreSend] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Move a document to trash',
				description: 'Soft-delete a document by moving it to Trash',
				routing: {
					request: { method: 'DELETE', url: '/documents' },
					send: { preSend: [documentDeletePreSend] },
				},
			},
			{
				name: 'List',
				value: 'list',
				action: 'List documents',
				description: 'List documents in the connected Space',
				routing: { request: { method: 'GET', url: '/documents' } },
			},
			{
				name: 'Move',
				value: 'move',
				action: 'Move a document',
				description: 'Move a document to Unsorted, Templates, or a folder',
				routing: {
					request: { method: 'PUT', url: '/documents/move' },
					send: { preSend: [documentMovePreSend] },
				},
			},
		],
		default: 'list',
	},

	// Spread operation-specific fields
	...documentListDescription,
	...documentCreateDescription,
	...documentMoveDescription,
	...documentDeleteDescription,
];
