/**
 * FILE UPLOAD OPERATION (Documents) — POST /upload
 */
import type { INodeProperties } from 'n8n-workflow';
import { uploadFileProperties } from '../../../shared/uploadUi';

export const fileUploadDescription: INodeProperties[] = uploadFileProperties('page');
