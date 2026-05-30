/**
 * COLLECTION ADD ITEMS OPERATION
 * POST /collections/{collectionId}/items — schema-driven typed mapping.
 */
import type { INodeProperties } from 'n8n-workflow';
import { collectionMapperProperties } from '../../../shared/collectionUi';

const show = { operation: ['addItems'], resource: ['collection'] };

export const collectionAddItemsDescription: INodeProperties[] = [
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
	...collectionMapperProperties('add'),
];
