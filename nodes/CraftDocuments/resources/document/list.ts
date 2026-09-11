/**
 * DOCUMENT LIST OPERATION
 * GET /documents - List all accessible documents
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocumentList = { operation: ['list'], resource: ['document'] };
const showOnlyForSpaceDocumentList = {
	...showOnlyForDocumentList,
	connectionScope: ['space'],
	'@version': [2],
};

export const documentListDescription: INodeProperties[] = [
	// Options collection for document list parameters
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForDocumentList },
		options: [
			{
				displayName: 'Fetch Metadata',
				name: 'fetchMetadata',
				type: 'boolean',
				default: false,
				description:
					'Whether to include metadata (lastModifiedAt, createdAt, clickableLink) in the response',
				routing: {
					send: {
						type: 'query',
						property: 'fetchMetadata',
					},
				},
			},
		],
	},
	{
		displayName: 'Location',
		name: 'location',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'All Locations', value: '' },
			{ name: 'Daily Notes', value: 'daily_notes' },
			{ name: 'Templates', value: 'templates' },
			{ name: 'Trash', value: 'trash' },
			{ name: 'Unsorted', value: 'unsorted' },
		],
		default: '',
		description: 'Filter by a built-in location. Use All Locations to optionally choose a folder.',
		displayOptions: { show: showOnlyForSpaceDocumentList },
		routing: { send: { type: 'query', property: 'location', value: '={{ $value || undefined }}' } },
	},
	{
		displayName: 'Folder',
		name: 'folderId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Optionally filter by a folder. Folders include their subfolders.',
		displayOptions: { show: { ...showOnlyForSpaceDocumentList, location: [''] } },
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
		routing: {
			send: {
				type: 'query',
				property: 'folderId',
				value: '={{ typeof $value === "object" ? $value.value : $value || undefined }}',
			},
		},
	},
];
