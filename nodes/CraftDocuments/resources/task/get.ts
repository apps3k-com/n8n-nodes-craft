import type { INodeProperties } from 'n8n-workflow';
import { taskGetPreSend } from './organization';

const show = {
	resource: ['task'],
	connectionScope: ['space'],
	'@version': [2],
	operation: ['get'],
};

export const taskGetDescription: INodeProperties[] = [
	{
		displayName: 'Scope',
		name: 'taskScope',
		type: 'options',
		noDataExpression: true,
		required: true,
		default: 'active',
		displayOptions: { show },
		options: [
			{ name: 'Active', value: 'active' },
			{ name: 'Document', value: 'document' },
			{ name: 'Inbox', value: 'inbox' },
			{ name: 'Logbook', value: 'logbook' },
			{ name: 'Upcoming', value: 'upcoming' },
		],
		routing: { send: { type: 'query', property: 'scope' } },
	},
	{
		displayName: 'Document',
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
		routing: {
			send: { type: 'query', property: 'documentId', value: '={{ $value.value || $value }}' },
		},
	},
];

export const taskGetRouting = {
	request: { method: 'GET' as const, url: '/tasks' },
	send: { preSend: [taskGetPreSend] },
};
