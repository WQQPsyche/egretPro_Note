declare type DependencyType = 'Identifier' | 'PropertyAccess' | 'Extend';
declare type DefineType = 'Variable' | 'Enum' | 'Parameter' | 'Function' | 'Interface' | 'Class' | 'Namespace';
export interface Dependencies {
    [name: string]: {
        type: DependencyType;
    };
}
export interface Defines {
    [name: string]: {
        type: DefineType;
    };
}
export interface ParseResult {
    isModule: boolean;
    defines: Defines;
    dependencies: Dependencies;
}
export default function fn(fileName: string, content: string): ParseResult;
export {};
