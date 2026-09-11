import type { IDataObject, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

interface Locator {
	value?: unknown;
}

/** Normalize a task/document locator or legacy string ID. */
function resolve(value: unknown): string {
	if (typeof value === 'string') return value.trim();
	if (value && typeof value === 'object' && 'value' in value)
		return typeof (value as Locator).value === 'string'
			? String((value as Locator).value).trim()
			: '';
	return '';
}

/** Reject a missing task target before constructing a request. */
function required(context: IExecuteSingleFunctions, name: string, label: string): string {
	const id = resolve(context.getNodeParameter(name, ''));
	if (!id) throw new Error(`${label} is required.`);
	return id;
}

/** Rejects a document task query that would omit Craft's required documentId. */
export async function taskGetPreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const scope = String(this.getNodeParameter('taskScope', 'active'));
	if (scope === 'document') {
		const id = resolve(this.getNodeParameter('documentId', ''));
		if (!id) throw new Error('Document is required for document task scope.');
		requestOptions.qs = { ...(requestOptions.qs || {}), scope, documentId: id };
	}
	return requestOptions;
}

/** Build the documented inbox, daily note, or document task location. */
function location(context: IExecuteSingleFunctions): IDataObject {
	const type = context.getNodeParameter('locationType', 'inbox') as string;
	if (type === 'inbox') return { type: 'inbox' };
	if (type === 'dailyNote') {
		const date = String(context.getNodeParameter('locationDate', 'today')).trim();
		if (!date) throw new Error('Daily note date is required.');
		return { type: 'dailyNote', date };
	}
	if (type === 'document')
		return {
			type: 'document',
			documentId: required(context, 'locationDocumentId', 'Target document'),
		};
	throw new Error('Task location must be Inbox, Daily Note, or Document.');
}

/** Include only explicitly supplied task state and date updates. */
function taskInfo(context: IExecuteSingleFunctions): IDataObject {
	const info: IDataObject = {};
	const scheduleDate = String(context.getNodeParameter('scheduleDate', '')).trim();
	const deadlineDate = String(context.getNodeParameter('deadlineDate', '')).trim();
	const state = String(context.getNodeParameter('state', '')).trim();
	if (state && !['todo', 'done', 'canceled'].includes(state))
		throw new Error('Task state must be To Do, Done, or Canceled.');
	if (scheduleDate) info.scheduleDate = scheduleDate;
	if (deadlineDate) info.deadlineDate = deadlineDate;
	if (state) info.state = state;
	return info;
}

/** Builds POST /tasks for one or more user-entered task rows. */
export async function taskAddPreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const markdown = String(this.getNodeParameter('markdown', '')).trim();
	if (!markdown) throw new Error('Task content is required.');
	const task: IDataObject = { markdown, location: location(this) };
	const info = taskInfo(this);
	if (Object.keys(info).length) task.taskInfo = info;
	requestOptions.body = { tasks: [task] };
	return requestOptions;
}

/** Builds PUT /tasks for one task. */
export async function taskUpdatePreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const task: IDataObject = { id: required(this, 'taskId', 'Task') };
	const markdown = String(this.getNodeParameter('markdown', '')).trim();
	if (markdown) task.markdown = markdown;
	const info = taskInfo(this);
	if (Object.keys(info).length) task.taskInfo = info;
	if (this.getNodeParameter('changeLocation', false)) task.location = location(this);
	requestOptions.body = { tasksToUpdate: [task] };
	return requestOptions;
}

/** Builds DELETE /tasks for one task. */
export async function taskDeletePreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	requestOptions.body = { idsToDelete: [required(this, 'taskId', 'Task')] };
	return requestOptions;
}
