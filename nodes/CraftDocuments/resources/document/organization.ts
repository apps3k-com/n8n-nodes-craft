/**
 * Request builders for Craft Space document organization endpoints.
 */
import type { IDataObject, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

/** A persisted n8n resource locator value. */
interface LocatorValue {
	value?: unknown;
}

/**
 * Resolves an ID persisted either by a legacy string field or a resource locator.
 */
export function resolveLocatorId(value: unknown): string {
	if (typeof value === 'string') return value.trim();
	if (value && typeof value === 'object' && 'value' in value) {
		const locatorValue = (value as LocatorValue).value;
		return typeof locatorValue === 'string' ? locatorValue.trim() : '';
	}
	return '';
}

/**
 * Reads a required locator parameter and returns a clear execution error when it is absent.
 */
function requireLocatorId(context: IExecuteSingleFunctions, name: string, label: string): string {
	const id = resolveLocatorId(context.getNodeParameter(name, ''));
	if (!id) throw new Error(`${label} is required.`);
	return id;
}

/**
 * Converts the selected document destination into Craft's documented destination object.
 */
function getDestination(context: IExecuteSingleFunctions): IDataObject {
	const destinationType = context.getNodeParameter('destinationType', 'unsorted') as string;
	if (destinationType === 'folder') {
		return { folderId: requireLocatorId(context, 'folderId', 'Destination folder') };
	}
	if (destinationType === 'templates' || destinationType === 'unsorted') {
		return { destination: destinationType };
	}
	throw new Error('Destination must be Unsorted, Templates, or a folder.');
}

/** Builds the POST /documents body for one new document. */
export async function documentCreatePreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const title = String(this.getNodeParameter('title', '')).trim();
	if (!title) throw new Error('Document title is required.');
	requestOptions.body = { documents: [{ title }], destination: getDestination(this) };
	return requestOptions;
}

/** Builds the PUT /documents/move body for one selected document. */
export async function documentMovePreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	requestOptions.body = {
		documentIds: [requireLocatorId(this, 'documentId', 'Document')],
		destination: getDestination(this),
	};
	return requestOptions;
}

/** Builds the soft-delete DELETE /documents body for one selected document. */
export async function documentDeletePreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	requestOptions.body = { documentIds: [requireLocatorId(this, 'documentId', 'Document')] };
	return requestOptions;
}
