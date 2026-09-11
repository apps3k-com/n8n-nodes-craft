import type { INodeProperties } from 'n8n-workflow';
import { taskUpdatePreSend } from './organization';

const show = {
	resource: ['task'],
	connectionScope: ['space'],
	'@version': [2],
	operation: ['update'],
};

export const taskUpdateDescription: INodeProperties[] = [
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
	{
		displayName: 'New Content',
		name: 'markdown',
		type: 'string',
		default: '',
		displayOptions: { show },
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'options',
		noDataExpression: true,
		default: '',
		displayOptions: { show },
		options: [
			{ name: "Don't Change", value: '' },
			{ name: 'To Do', value: 'todo' },
			{ name: 'Done', value: 'done' },
			{ name: 'Canceled', value: 'canceled' },
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
	{
		displayName: 'Change Location',
		name: 'changeLocation',
		type: 'boolean',
		default: false,
		displayOptions: { show },
	},
	{
		displayName: 'Location',
		name: 'locationType',
		type: 'options',
		noDataExpression: true,
		default: 'inbox',
		displayOptions: { show: { ...show, changeLocation: [true] } },
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
		displayOptions: { show: { ...show, changeLocation: [true], locationType: ['dailyNote'] } },
	},
	{
		displayName: 'Document',
		name: 'locationDocumentId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: { show: { ...show, changeLocation: [true], locationType: ['document'] } },
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
];

export const taskUpdateRouting = {
	request: { method: 'PUT' as const, url: '/tasks' },
	send: { preSend: [taskUpdatePreSend] },
};
