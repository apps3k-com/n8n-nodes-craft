import type { INodeProperties } from 'n8n-workflow';
import { taskAddPreSend } from './organization';

const show = {
	resource: ['task'],
	connectionScope: ['space'],
	'@version': [2],
	operation: ['add'],
};

export const taskAddDescription: INodeProperties[] = [
	{
		displayName: 'Task Content',
		name: 'markdown',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show },
	},
	{
		displayName: 'Location',
		name: 'locationType',
		type: 'options',
		noDataExpression: true,
		default: 'inbox',
		displayOptions: { show },
		options: [
			{ name: 'Inbox', value: 'inbox' },
			{ name: 'Daily Note', value: 'dailyNote' },
			{ name: 'Document', value: 'document' },
		],
	},
	{
		displayName: 'Date',
		name: 'locationDate',
		type: 'string',
		default: 'today',
		displayOptions: { show: { ...show, locationType: ['dailyNote'] } },
	},
	{
		displayName: 'Document',
		name: 'locationDocumentId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: { show: { ...show, locationType: ['document'] } },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: { searchListMethod: 'searchDocuments', searchable: true },
			},
			{ displayName: 'By ID', name: 'id', type: 'string' },
		],
	},
	{
		displayName: 'Schedule Date',
		name: 'scheduleDate',
		type: 'string',
		default: '',
		displayOptions: { show },
	},
	{
		displayName: 'Deadline Date',
		name: 'deadlineDate',
		type: 'string',
		default: '',
		displayOptions: { show },
	},
];

export const taskAddRouting = {
	request: { method: 'POST' as const, url: '/tasks' },
	send: { preSend: [taskAddPreSend] },
};
