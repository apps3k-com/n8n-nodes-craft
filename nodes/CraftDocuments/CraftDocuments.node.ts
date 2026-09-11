/**
 * CRAFT DOCUMENTS NODE
 * Fully declarative node for Craft Multi-Document API
 * Uses preSend hooks for complex operations like markdown block building
 *
 * Key differences from Daily Notes:
 * - Uses document IDs instead of dates
 * - Has GET /documents endpoint
 * - Space connections additionally expose document organization, folders and tasks
 * - Position uses pageId instead of date
 */
import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

// Resource descriptions
import { documentDescription } from './resources/document';
import { taskDescription } from './resources/task';
import { getTasks, searchTasks } from './loadOptions/getTasks';
import { folderDescription } from './resources/folder';
import { getFolders, searchFolders } from './loadOptions/getFolders';
import { blockDescription } from './resources/block';
import { collectionDescription } from './resources/collection';
import { searchDescription } from './resources/search';
import { fileDescription } from './resources/file';
import { uploadPreSend, uploadPostReceive } from '../shared/uploadUi';

// Load options methods
import { getDocuments, searchDocuments } from './loadOptions/getDocuments';
import { getCollections, searchCollections } from './loadOptions/getCollections';
import { withDocumentLocators } from '../shared/documentUi';
import { getBlocks } from './loadOptions/getBlocks';

// Shared collection field-mapping methods (resource mapper + relation pickers)
import { createCollectionFieldMethods } from '../shared/collectionMethods';

const collectionMethods = createCollectionFieldMethods('craftDocumentsApi');

export class CraftDocuments implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Craft Documents',
		name: 'craftDocuments',
		icon: { light: 'file:../../icons/craft.svg', dark: 'file:../../icons/craft.dark.svg' },
		group: ['transform'],
		version: [1, 2],
		defaultVersion: 2,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Interact with Craft Multi-Document API - manage documents, blocks, collections, and search',
		defaults: { name: 'Craft Documents' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],

		credentials: [
			{
				name: 'craftDocumentsApi',
				required: true,
			},
		],

		// Request defaults - baseURL comes from credentials
		requestDefaults: {
			baseURL: '={{$credentials.apiUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},

		properties: [
			{
				displayName: 'Connection Scope',
				name: 'connectionScope',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Selected Documents', value: 'selected' },
					{ name: 'All Documents (Space)', value: 'space' },
				],
				default: 'selected',
				description: 'Match the scope chosen when creating your Craft API connection',
				displayOptions: { show: { '@version': [2] } },
			},
			// Resource selector
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Block',
						value: 'block',
						description: 'Manage content blocks in documents',
					},
					{
						name: 'Collection',
						value: 'collection',
						description: 'Manage collections (database-like structures)',
					},
					{
						name: 'Document',
						value: 'document',
						description: 'List and manage documents',
					},
					{
						name: 'File',
						value: 'file',
						description: 'Upload files into documents',
						routing: {
							request: { method: 'POST', url: '/upload' },
							send: { preSend: [uploadPreSend] },
							output: { postReceive: [uploadPostReceive] },
						},
					},
					{
						name: 'Folder',
						value: 'folder',
						description: 'Discover folders in a Space connection',
						displayOptions: { show: { connectionScope: ['space'], '@version': [2] } },
					},
					{
						name: 'Task',
						value: 'task',
						description: 'Manage tasks across a Space connection',
						displayOptions: { show: { connectionScope: ['space'], '@version': [2] } },
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search across documents',
					},
				],
				default: 'document',
			},

			// Spread all resource descriptions
			...documentDescription,
			...folderDescription,
			...taskDescription,
			...withDocumentLocators(blockDescription),
			...collectionDescription,
			...searchDescription,
			...withDocumentLocators(fileDescription),
		],
	};

	// Methods for dynamic dropdowns
	methods = {
		listSearch: {
			searchCollectionItems: collectionMethods.searchCollectionItems,
			searchCollections,
			searchDocuments,
			searchFolders,
			searchTasks,
		},
		loadOptions: {
			getFolders,
			getTasks,
			getDocuments,
			getCollections,
			getBlocks,
			getRelationFields: collectionMethods.getRelationFields,
			getRelationTargetItems: collectionMethods.getRelationTargetItems,
		},
		resourceMapping: {
			getCollectionFields: collectionMethods.getCollectionFields,
		},
	};
}
