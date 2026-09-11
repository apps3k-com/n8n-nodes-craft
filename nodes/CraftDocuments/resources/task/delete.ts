import type { INodeProperties } from 'n8n-workflow';
import { taskDeletePreSend } from './organization';

const show = {
	resource: ['task'],
	connectionScope: ['space'],
	'@version': [2],
	operation: ['delete'],
};

export const taskDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Task Scope',
		name: 'taskScope',
		type: 'options',
		noDataExpression: true,
		default: 'active',
		displayOptions: { show },
		options: [
			{ name: 'Active', value: 'active' },
			{ name: 'Document', value: 'document' },
			{ name: 'Inbox', value: 'inbox' },
			{ name: 'Logbook', value: 'logbook' },
			{ name: 'Upcoming', value: 'upcoming' },
		],
	},
	{
		displayName: 'Task Document',
		name: 'documentId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: { show: { ...show, taskScope: ['document'] } },
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
		displayName: 'Task',
		name: 'taskId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: { show },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: { searchListMethod: 'searchTasks', searchable: true },
			},
			{ displayName: 'By ID', name: 'id', type: 'string' },
		],
	},
];

export const taskDeleteRouting = {
	request: { method: 'DELETE' as const, url: '/tasks' },
	send: { preSend: [taskDeletePreSend] },
};
