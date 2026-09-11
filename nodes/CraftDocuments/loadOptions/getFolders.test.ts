/* eslint-disable @n8n/community-nodes/no-restricted-imports -- vitest is a dev-only test dependency */
import { describe, expect, it } from 'vitest';

import { flattenFolders, folderSearchResults } from './getFolders';

describe('Craft Space folder locator options', () => {
	it('flattens nested user folders and excludes built-in locations', () => {
		const options = flattenFolders([
			{ id: 'unsorted', name: 'Unsorted', folders: [] },
			{ id: 'projects', name: 'Projects', folders: [{ id: 'work', name: 'Work', folders: [] }] },
			{ id: 'trash', name: 'Recently Deleted', folders: [] },
		]);
		expect(options).toEqual([
			{ name: 'Projects', value: 'projects', description: 'ID: projects' },
			{ name: 'Projects / Work', value: 'work', description: 'ID: work' },
		]);
	});

	it('filters and pages locator options locally', () => {
		const options = Array.from({ length: 101 }, (_, index) => ({
			name: `Folder ${index}`,
			value: `folder-${index}`,
		}));
		expect(
			folderSearchResults(options, 'folder-1').results.map((result) => result.value),
		).toContain('folder-1');
		expect(folderSearchResults(options).paginationToken).toBe('100');
		expect(folderSearchResults(options, '', '100').results).toEqual([
			{ name: 'Folder 100', value: 'folder-100', description: undefined },
		]);
	});
});
