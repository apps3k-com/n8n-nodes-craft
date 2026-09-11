import type { IDisplayOptions, INodeProperties } from 'n8n-workflow';

/** The persisted representation used by n8n's resource locator component. */
export interface ResourceLocatorValue {
	value?: unknown;
}

/**
 * Resolves either a legacy string parameter or a resource locator parameter.
 *
 * Version 1 workflows persist collection IDs as strings. Version 2 uses a
 * locator object. Keeping this conversion at the API boundary makes existing
 * workflows execute unchanged while new workflows gain the locator UI.
 */
export function resolveResourceId(value: unknown): string {
	if (typeof value === 'string') return value;
	if (value && typeof value === 'object' && 'value' in value) {
		const locatorValue = (value as ResourceLocatorValue).value;
		return typeof locatorValue === 'string' ? locatorValue : '';
	}
	return '';
}

/**
 * Defines the collection selector for both supported node versions.
 *
 * Version 1 deliberately retains its `options` parameter to preserve saved
 * workflow semantics. Version 2 adds n8n's searchable resource locator and a
 * direct ID mode; callers register `searchCollections` in `methods.listSearch`.
 */
export function collectionLocatorProperties(displayOptions: IDisplayOptions): INodeProperties[] {
	/** Applies the n8n node version gate without discarding the caller's visibility rules. */
	const forVersion = (version: number): IDisplayOptions => ({
		...displayOptions,
		show: { ...displayOptions.show, '@version': [version] },
	});
	return [
		{
			displayName: 'Collection Name or ID',
			name: 'collectionId',
			type: 'options',
			typeOptions: { loadOptionsMethod: 'getCollections' },
			default: '',
			required: true,
			description:
				'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			displayOptions: forVersion(1),
		},
		{
			displayName: 'Collection',
			name: 'collectionId',
			type: 'resourceLocator',
			default: { mode: 'list', value: '' },
			required: true,
			description: 'Choose a collection from the list or enter its ID',
			displayOptions: forVersion(2),
			modes: [
				{
					displayName: 'From List',
					name: 'list',
					type: 'list',
					placeholder: 'Select a collection...',
					typeOptions: {
						searchListMethod: 'searchCollections',
						searchFilterRequired: false,
						searchable: true,
					},
				},
				{
					displayName: 'ID',
					name: 'id',
					type: 'string',
					placeholder: 'Enter collection ID',
				},
			],
		},
	];
}
