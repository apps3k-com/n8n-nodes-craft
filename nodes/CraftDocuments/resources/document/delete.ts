/** Craft Space soft-delete properties. */
import type { INodeProperties } from 'n8n-workflow';

const show = {
	resource: ['document'],
	operation: ['delete'],
	connectionScope: ['space'],
	'@version': [2],
};

/** Properties for DELETE /documents, which moves a document to Trash. */
export const documentDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Document',
		name: 'documentId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description:
			'The document to move to Trash. This is a soft delete and can be restored by moving it.',
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
];
