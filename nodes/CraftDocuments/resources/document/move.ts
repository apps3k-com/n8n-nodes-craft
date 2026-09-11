/** Craft Space document move properties. */
import type { INodeProperties } from 'n8n-workflow';

const show = {
	resource: ['document'],
	operation: ['move'],
	connectionScope: ['space'],
	'@version': [2],
};

/** Properties for PUT /documents/move. */
export const documentMoveDescription: INodeProperties[] = [
	{
		displayName: 'Document',
		name: 'documentId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Choose the document to move or enter its ID',
		displayOptions: { show },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a document...',
				typeOptions: { searchListMethod: 'searchDocuments', searchable: true },
			},
			{ displayName: 'ID', name: 'id', type: 'string', placeholder: 'Enter document ID' },
		],
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
		description: 'Choose the destination folder or enter its ID',
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
