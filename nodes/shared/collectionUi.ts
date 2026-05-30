import type { INodeProperties } from 'n8n-workflow';
import type { ResourceMapperMode } from './collectionMapping';

/**
 * Shared n8n property definitions for Collection Add/Update Items:
 * a Resource Mapper (typed scalar fields) + a Relations multi-picker section.
 * Identical for both Craft Documents and Craft Daily Notes nodes.
 */
export function collectionMapperProperties(mode: ResourceMapperMode): INodeProperties[] {
	const operation = mode === 'add' ? 'addItems' : 'updateItems';
	const show = { resource: ['collection'], operation: [operation] };

	return [
		{
			displayName: 'Fields',
			name: 'columns',
			type: 'resourceMapper',
			noDataExpression: true,
			default: { mappingMode: 'defineBelow', value: null },
			required: true,
			typeOptions: {
				loadOptionsDependsOn: ['collectionId'],
				resourceMapper: {
					resourceMapperMethod: 'getCollectionFields',
					mode,
					fieldWords: { singular: 'field', plural: 'fields' },
					addAllFields: true,
					supportAutoMap: true,
				},
			},
			displayOptions: { show },
		},
		{
			displayName: 'Relations',
			name: 'relations',
			type: 'fixedCollection',
			typeOptions: { multipleValues: true },
			default: {},
			placeholder: 'Add Relation',
			description: 'Link this item to items in related collections',
			displayOptions: { show },
			options: [
				{
					name: 'relation',
					displayName: 'Relation',
					values: [
						{
							displayName: 'Relation Field Name or ID',
							name: 'relationField',
							type: 'options',
							default: '',
							description:
								'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
							typeOptions: {
								loadOptionsDependsOn: ['collectionId'],
								loadOptionsMethod: 'getRelationFields',
							},
						},
						{
							displayName: 'Related Items Names or IDs',
							name: 'relatedItems',
							type: 'multiOptions',
							default: [],
							description:
								'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
							typeOptions: {
								loadOptionsDependsOn: ['collectionId', '&relationField'],
								loadOptionsMethod: 'getRelationTargetItems',
							},
						},
					],
				},
			],
		},
		{
			displayName: 'Allow New Select Options',
			name: 'allowNewSelectOptions',
			type: 'boolean',
			default: false,
			description:
				"Whether to allow creating new options for select properties if the value doesn't exist in the schema",
			displayOptions: { show },
		},
	];
}
