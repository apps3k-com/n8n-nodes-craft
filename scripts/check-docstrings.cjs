#!/usr/bin/env node
/** Measure JSDoc on named production TypeScript functions/methods, excluding tests and inline callbacks. */
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
let total = 0;
let documented = 0;
const missing = [];
/** Walk only source directories, never dependencies or generated output. */
function visitDirectory(directory) {
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		const file = path.join(directory, entry.name);
		if (entry.isDirectory()) visitDirectory(file);
		else if (file.endsWith('.ts') && !file.endsWith('.test.ts') && !file.endsWith('.d.ts')) {
			const source = ts.createSourceFile(
				file,
				fs.readFileSync(file, 'utf8'),
				ts.ScriptTarget.Latest,
				true,
			);
			/** Count callable declarations and named function-valued properties/variables. */
			function visit(node) {
				const named =
					ts.isFunctionDeclaration(node) ||
					ts.isMethodDeclaration(node) ||
					((ts.isVariableDeclaration(node) || ts.isPropertyAssignment(node)) &&
						node.initializer &&
						(ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer)));
				if (named && (node.body || node.initializer)) {
					total++;
					const docs = ts.getJSDocCommentsAndTags(node);
					if (docs.length) documented++;
					else
						missing.push(
							`${file}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1} ${node.name?.getText(source) || '(anonymous)'}`,
						);
				}
				ts.forEachChild(node, visit);
			}
			visit(source);
		}
	}
}
for (const directory of ['nodes', 'credentials']) visitDirectory(directory);
const percent = total ? (documented / total) * 100 : 100;
console.log(`JSDoc coverage: ${documented}/${total} (${percent.toFixed(1)}%), minimum 80%`);
if (missing.length) console.log(`Undocumented callables:\n${missing.join('\n')}`);
if (percent < 80) process.exitCode = 1;
