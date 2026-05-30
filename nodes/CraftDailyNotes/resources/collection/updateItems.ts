/**
 * COLLECTION UPDATE ITEMS OPERATION
 * PUT /collections/{collectionId}/items — schema-driven typed mapping.
 */
import type { INodeProperties } from 'n8n-workflow';
import { collectionMapperProperties } from '../../../shared/collectionUi';

const show = { operation: ['updateItems'], resource: ['collection'] };

export const collectionUpdateItemsDescription: INodeProperties[] = [
	{
		displayName: 'Collection Name or ID',
		name: 'collectionId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCollections' },
		default: '',
		required: true,
		description:
			'Select a collection. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: { show },
	},
	...collectionMapperProperties('update'),
];
