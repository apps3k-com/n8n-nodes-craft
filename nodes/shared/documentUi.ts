import type { INodeProperties } from 'n8n-workflow';

/** Keep saved v1 dropdowns while offering searchable/direct-ID document inputs in v2. */
export function withDocumentLocators(properties: INodeProperties[]): INodeProperties[] {
	return properties.flatMap((property) => {
		if (property.type !== 'options' || property.typeOptions?.loadOptionsMethod !== 'getDocuments') {
			return [property];
		}
		return [
			{
				...property,
				displayOptions: {
					...property.displayOptions,
					show: { ...property.displayOptions?.show, '@version': [1] },
				},
			},
			{
				...property,
				required: property.name === 'targetPageId' ? false : property.required,
				displayName: property.name === 'blockId' ? 'Document or Block' : 'Document',
				type: 'resourceLocator' as const,
				typeOptions: undefined,
				default: { mode: 'list', value: '' },
				description: 'Choose a document by title, or enter a document or block ID',
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list' as const,
						typeOptions: { searchListMethod: 'searchDocuments', searchable: true },
					},
					{ displayName: 'By ID', name: 'id', type: 'string' as const },
				],
				displayOptions: {
					...property.displayOptions,
					show: { ...property.displayOptions?.show, '@version': [2] },
				},
			},
		];
	});
}
