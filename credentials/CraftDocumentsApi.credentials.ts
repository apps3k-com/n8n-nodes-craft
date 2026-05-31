import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CraftDocumentsApi implements ICredentialType {
	name = 'craftDocumentsApi';

	displayName = 'Craft Documents API';

	icon: Icon = { light: 'file:../icons/craft.svg', dark: 'file:../icons/craft.dark.svg' };

	documentationUrl = 'https://craft-n8n.apps3k.com/';

	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://connect.craft.do/links/YOUR_ID/api/v1',
			description:
				'Your Connect API URL from Craft. Go to Settings → Connect → Collections & Docs to get this URL.',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your Craft Connect API key. Sent as a Bearer token in the Authorization header. In Craft: Settings → Connect → your connection → API Key.',
		},
	];

	// Authentication is a separate Bearer token (the API URL no longer carries it).
	// n8n applies this block to every declarative request AND to the credential test below.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	// Credential test: GET /connection is a lightweight validity check that returns
	// space metadata. Uniform across both connection types and cheaper than listing.
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}',
			url: '/connection',
			method: 'GET',
		},
	};
}
