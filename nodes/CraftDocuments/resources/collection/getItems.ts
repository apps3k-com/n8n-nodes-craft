/**
 * COLLECTION GET ITEMS OPERATION
 * GET /collections/{collectionId}/items - Retrieve items from a collection
 *
 * Same as Daily Notes API - no differences
 */
import type { INodeProperties } from 'n8n-workflow';
import { collectionLocatorProperties } from '../../../shared/resourceLocator';

const showOnlyForCollectionGetItems = { operation: ['getItems'], resource: ['collection'] };

export const collectionGetItemsDescription: INodeProperties[] = [
	...collectionLocatorProperties({ show: showOnlyForCollectionGetItems }),
	// Max Depth
	{
		displayName: 'Max Depth',
		name: 'maxDepth',
		type: 'number',
		typeOptions: {
			minValue: -1,
			maxValue: 10,
		},
		default: -1,
		description:
			'Maximum depth of nested content to fetch. -1 for all descendants, 0 for only item properties.',
		displayOptions: { show: showOnlyForCollectionGetItems },
		routing: {
			send: {
				type: 'query',
				property: 'maxDepth',
			},
		},
	},
];
