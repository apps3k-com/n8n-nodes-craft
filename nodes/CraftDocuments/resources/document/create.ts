/** Craft Space document creation properties. */
import type { INodeProperties } from 'n8n-workflow';

const show = {
	resource: ['document'],
	operation: ['create'],
	connectionScope: ['space'],
	'@version': [2],
};

/** Properties for POST /documents. */
export const documentCreateDescription: INodeProperties[] = [
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
		description: 'Title of the new document',
		displayOptions: { show },
	},
	{
		displayName: 'Destination',
		name: 'destinationType',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Unsorted', value: 'unsorted' },
			{ name: 'Templates', value: 'templates' },
			{ name: 'Folder', value: 'folder' },
		],
		default: 'unsorted',
		displayOptions: { show },
	},
	{
		displayName: 'Folder',
		name: 'folderId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Choose a folder or enter its ID',
		displayOptions: { show: { ...show, destinationType: ['folder'] } },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a folder...',
				typeOptions: { searchListMethod: 'searchFolders', searchable: true },
			},
			{ displayName: 'ID', name: 'id', type: 'string', placeholder: 'Enter folder ID' },
		],
	},
];
