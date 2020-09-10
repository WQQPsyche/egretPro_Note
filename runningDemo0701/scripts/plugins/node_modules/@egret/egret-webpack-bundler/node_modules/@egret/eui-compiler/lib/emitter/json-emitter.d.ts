import { BaseEmitter } from ".";
import { AST_Node, AST_NodeBase, AST_Skin } from "../exml-ast";
declare type OutputDataFormat_State = {
    $ssP?: {
        target: string;
        name: string;
        value: any;
    }[];
    $saI?: {
        target: string;
        property: string;
        position: number;
        relativeTo: string;
    }[];
};
declare type OutputDataFormat = {
    $path: string;
    $sP?: string[];
    $sC: "$eSk";
    $s?: {
        [stateName: string]: OutputDataFormat_State;
    };
};
export declare class JSONEmitter extends BaseEmitter {
    private jsonContent;
    private addBingdingJson;
    private euiNormalizeNames;
    private elementContents;
    private elementIds;
    private skinParts;
    private nodeMap;
    private otherNodeMap;
    getResult(): string;
    emitHeader(themeData: any): void;
    emitSkinNode(filename: string, skinNode: AST_Skin): void;
    setBaseState(node: AST_NodeBase, json: any, key: string | undefined, skinNode: AST_NodeBase): void;
    setStates(skinNode: AST_Skin, json: OutputDataFormat): void;
    getStatesAttribute(node: AST_NodeBase, json: NonNullable<OutputDataFormat['$s']>): void;
    hasAddType(node: AST_NodeBase): boolean;
    getNodeId(node: AST_NodeBase): string | null;
    parseNode(node: AST_Node): string;
    parseValue(value: string | number | boolean | AST_Node | AST_Skin, skinNode: AST_NodeBase): string | number | boolean | AST_Node | AST_Skin;
    convertType(type: string): string;
    catchClass(nodeMap: any): void;
    createSkinName(child: any): any;
}
export {};
