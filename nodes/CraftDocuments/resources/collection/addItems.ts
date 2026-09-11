/**
 * COLLECTION ADD ITEMS OPERATION
 * POST /collections/{collectionId}/items — schema-driven typed mapping.
 */
import type { INodeProperties } from 'n8n-workflow';
import { collectionMapperProperties } from '../../../shared/collectionUi';
import { collectionLocatorProperties } from '../../../shared/resourceLocator';

const show = { operation: ['addItems'], resource: ['collection'] };

export const collectionAddItemsDescription: INodeProperties[] = [
	...collectionLocatorProperties({ show }),
	...collectionMapperProperties('add'),
];
