/* eslint-disable @n8n/community-nodes/no-restricted-imports -- vitest is a dev-only test dependency; test files are excluded from the n8n build (tsconfig) and never ship */
import { describe, it, expect } from 'vitest';
import { resolveUploadFileName } from './uploadUi';

describe('resolveUploadFileName', () => {
	it('uses the custom name when provided', () => {
		expect(resolveUploadFileName('Custom.pdf', 'Original.pdf')).toBe('Custom.pdf');
	});

	it('falls back to the original binary name when custom is empty or blank', () => {
		expect(resolveUploadFileName('', 'Original.pdf')).toBe('Original.pdf');
		expect(resolveUploadFileName('   ', 'Original.pdf')).toBe('Original.pdf');
	});

	it('returns an empty string when neither is available', () => {
		expect(resolveUploadFileName('', undefined)).toBe('');
	});

	it('trims the custom name', () => {
		expect(resolveUploadFileName('  My File.pdf  ', undefined)).toBe('My File.pdf');
	});
});
