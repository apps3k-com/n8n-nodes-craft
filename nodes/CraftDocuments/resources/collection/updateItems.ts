/**
 * COLLECTION UPDATE ITEMS OPERATION
 * PUT /collections/{collectionId}/items — schema-driven typed mapping.
 */
import type { INodeProperties } from 'n8n-workflow';
import { collectionMapperProperties } from '../../../shared/collectionUi';
import { collectionLocatorProperties } from '../../../shared/resourceLocator';

const show = { operation: ['updateItems'], resource: ['collection'] };

export const collectionUpdateItemsDescription: INodeProperties[] = [
	...collectionLocatorProperties({ show }),
	...collectionMapperProperties('update'),
];
