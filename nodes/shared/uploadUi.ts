import type {
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

// Shown for BOTH entry points: the File resource and the Block "Upload File" op.
const show = { resource: ['file', 'block'], operation: ['upload'] };

/**
 * Shared field set for the file-upload operation.
 * @param target 'page' (Documents → pageId) or 'date' (Daily Notes → date)
 */
export function uploadFileProperties(target: 'page' | 'date'): INodeProperties[] {
	const startEndTarget: INodeProperties =
		target === 'page'
			? {
					displayName: 'Page Name or ID',
					name: 'pageId',
					type: 'options',
					typeOptions: { loadOptionsMethod: 'getDocuments' },
					default: '',
					required: true,
					description:
						'Page (document) to upload into. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					displayOptions: { show: { ...show, position: ['start', 'end'] } },
					routing: { send: { type: 'query', property: 'pageId' } },
				}
			: {
					displayName: 'Date',
					name: 'date',
					type: 'string',
					default: 'today',
					required: true,
					placeholder: 'today, tomorrow, yesterday, or YYYY-MM-DD',
					description: 'Daily note date to upload into',
					displayOptions: { show: { ...show, position: ['start', 'end'] } },
					routing: { send: { type: 'query', property: 'date' } },
				};

	return [
		{
			displayName: 'Input Binary Field',
			name: 'binaryPropertyName',
			type: 'string',
			default: 'data',
			required: true,
			hint: 'The name of the input binary field containing the file to upload',
			displayOptions: { show },
		},
		{
			displayName: 'Position',
			name: 'position',
			type: 'options',
			default: 'end',
			description: 'Where to insert the uploaded file',
			options: [
				{ name: 'End', value: 'end', description: 'At the end of the page or daily note' },
				{ name: 'Start', value: 'start', description: 'At the start of the page or daily note' },
				{ name: 'After', value: 'after', description: 'After a sibling block' },
				{ name: 'Before', value: 'before', description: 'Before a sibling block' },
			],
			displayOptions: { show },
			routing: { send: { type: 'query', property: 'position' } },
		},
		startEndTarget,
		{
			displayName: 'Sibling Block ID',
			name: 'siblingId',
			type: 'string',
			default: '',
			required: true,
			description: 'The block to insert relative to (used with Before/After)',
			displayOptions: { show: { ...show, position: ['before', 'after'] } },
			routing: { send: { type: 'query', property: 'siblingId' } },
		},
		{
			displayName: 'File Name',
			name: 'fileName',
			type: 'string',
			default: '',
			placeholder: "Defaults to the uploaded file's original name",
			description:
				"Optional file name returned in this node's output. Leave empty to use the uploaded file's original name. Craft's API does not show file names on uploaded blocks, so this only affects the node output.",
			displayOptions: { show },
		},
	];
}

/**
 * preSend that turns the node's binary input into the raw octet-stream body.
 * Auth + URL come from the declarative request, so this needs no credentials.
 */
export async function uploadPreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 'data') as string;
	// In a per-item preSend (IExecuteSingleFunctions) the binary helpers are already
	// item-scoped: they take (propertyName), not (itemIndex, propertyName).
	const binary = this.helpers.assertBinaryData(binaryPropertyName);
	const buffer = await this.helpers.getBinaryDataBuffer(binaryPropertyName);

	requestOptions.body = buffer;
	requestOptions.headers = {
		...requestOptions.headers,
		'Content-Type': binary.mimeType || 'application/octet-stream',
	};
	requestOptions.json = false;
	return requestOptions;
}

/**
 * Resolve the file name to surface in the node output: the custom name if provided,
 * otherwise the input file's original name, otherwise an empty string.
 */
export function resolveUploadFileName(customName: string, originalName?: string): string {
	const custom = (customName ?? '').trim();
	if (custom !== '') return custom;
	return originalName ?? '';
}

/**
 * postReceive that adds the resolved file name to the upload response. Craft does not store
 * file names on uploaded blocks, so the name is surfaced in this node's output only.
 */
export async function uploadPostReceive(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const custom = this.getNodeParameter('fileName', '') as string;
	let originalName: string | undefined;
	try {
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 'data') as string;
		originalName = this.helpers.assertBinaryData(binaryPropertyName).fileName;
	} catch {
		originalName = undefined;
	}
	const fileName = resolveUploadFileName(custom, originalName);
	for (const item of items) {
		item.json = { ...item.json, fileName };
	}
	return items;
}
