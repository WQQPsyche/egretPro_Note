export * from 'fs-extra';
import { Options } from 'fast-glob';
/**
 * Simplified and sorted glob function (using fast-glob) for one or more pattern from current directory or a optional cwd one.
 *
 * Note 1: The result will be sorted by natural directory/subdir/filename order (as a would a recursive walk)
 * Note 2: When `cwd` in options, it is added to the file path i.e. `pathJoin(cwd, path)`
 *
 * @returns always sorted result return Promise<string[]>
*/
export declare function glob(pattern: string | string[], cwdOrFastGlobOptions?: string | Options): Promise<string[]>;
/** Remove one or more files. Resolved the number of names removed */
export declare function saferRemove(names: string | string[], cwd?: string): Promise<string[]>;
