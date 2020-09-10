export * from 'fs-extra';
import FastGlob, { Options } from 'fast-glob';
import { pathExists, remove } from 'fs-extra';
import { join as pathJoin, resolve as pathResolve } from 'path';
import { globCompare } from './util';



/** 
 * Simplified and sorted glob function (using fast-glob) for one or more pattern from current directory or a optional cwd one. 
 * 
 * Note 1: The result will be sorted by natural directory/subdir/filename order (as a would a recursive walk)
 * Note 2: When `cwd` in options, it is added to the file path i.e. `pathJoin(cwd, path)`
 * 
 * @returns always sorted result return Promise<string[]>
*/
export async function glob(pattern: string | string[], cwdOrFastGlobOptions?: string | Options): Promise<string[]> {
	let opts: Options | undefined = undefined;

	if (cwdOrFastGlobOptions != null) {
		opts = (typeof cwdOrFastGlobOptions === 'string') ? { cwd: cwdOrFastGlobOptions } : cwdOrFastGlobOptions;
	}

	const result = await FastGlob(pattern, opts);
	const cwd = (opts) ? opts.cwd : undefined;
	const list = result.map(path => {
		return (cwd) ? pathJoin(cwd, path) : path;
	});
	return list.sort(globCompare);
}

/** Remove one or more files. Resolved the number of names removed */
export async function saferRemove(names: string | string[], cwd?: string): Promise<string[]> {
	const baseDir = (cwd) ? pathResolve(cwd) : pathResolve('./');
	let removedNames: string[] = [];

	for (const name of asArray(names)) {
		const fullPath = pathJoin(baseDir, name);
		if (!fullPath.startsWith(baseDir)) {
			throw new Error(`Path to be removed does not look safe (nothing done): ${fullPath}\n\tCause: Does not belong to ${baseDir}`);
		}
		const exists = await pathExists(fullPath);
		if (exists) {
			await remove(fullPath);
			removedNames.push(name);
		}
	}
	return removedNames;
}


//#region    ---------- Utils ---------- 
function asArray(names: string | string[]) {
	return (names instanceof Array) ? names : [names];
}
//#endregion ---------- /Utils ----------