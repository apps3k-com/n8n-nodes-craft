/**
 * FILE RESOURCE INDEX (Documents)
 * Operations: Upload
 */
import type { INodeProperties } from 'n8n-workflow';
import { fileUploadDescription } from './upload';

const showOnlyForFile = { resource: ['file'] };

export const fileDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForFile },
		options: [
			{
				name: 'Upload',
				value: 'upload',
				action: 'Upload a file',
				description: 'Upload a file and insert it at a position',
			},
		],
		default: 'upload',
	},
	...fileUploadDescription,
];
