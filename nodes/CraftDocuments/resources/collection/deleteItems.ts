/**
 * COLLECTION DELETE ITEMS OPERATION
 * DELETE /collections/{collectionId}/items - Delete items from a collection
 *
 * Same as Daily Notes API - no differences
 */
import type { INodeProperties } from 'n8n-workflow';
import { collectionLocatorProperties } from '../../../shared/resourceLocator';

const showOnlyForCollectionDeleteItems = { operation: ['deleteItems'], resource: ['collection'] };

export const collectionDeleteItemsDescription: INodeProperties[] = [
	...collectionLocatorProperties({ show: showOnlyForCollectionDeleteItems }),
	// Item IDs to delete
	{
		displayName: 'Item IDs',
		name: 'idsToDelete',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'ID1, ID2, ID3 or ["ID1", "ID2"]',
		description: 'Item IDs to delete. Provide as comma-separated values or JSON array.',
		displayOptions: { show: showOnlyForCollectionDeleteItems },
		routing: {
			send: {
				type: 'body',
				property: 'idsToDelete',
				// Safely parse as JSON array or split by comma
				value:
					'={{ $value && $value.trim().startsWith("[") ? (() => { try { return JSON.parse($value); } catch { return $value.split(",").map(id => id.trim()).filter(id => id); } })() : ($value ? $value.split(",").map(id => id.trim()).filter(id => id) : []) }}',
			},
		},
	},
];
