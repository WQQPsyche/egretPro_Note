"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitClassName = void 0;
var ts = __importStar(require("typescript"));
function isTypeScriptDeclaration(node) {
    if (node.modifiers) {
        return node.modifiers.some(function (m) { return m.kind === ts.SyntaxKind.DeclareKeyword; });
    }
    else {
        return false;
    }
}
function hasExport(node) {
    if (node.modifiers) {
        return node.modifiers.some(function (m) { return m.kind === ts.SyntaxKind.ExportKeyword; });
    }
    else {
        return false;
    }
}
function getFullName(namedNode) {
    var node = namedNode;
    var moduleNames = [namedNode.name.getText()];
    while (node.parent) {
        node = node.parent;
        if (ts.isModuleDeclaration(node)) {
            moduleNames.unshift(node.name.getText());
        }
    }
    return {
        fullname: moduleNames.join('.'),
        hasNamespace: moduleNames.length > 1
    };
}
function isGlobalVariable(node) {
    var n = node;
    while (n.parent) {
        n = n.parent;
        if (ts.isModuleDeclaration(n)) {
            return false;
        }
    }
    return true;
}
function createGlobalExpression(text) {
    return ts.createIdentifier("window[\"" + text + "\"] = " + text + ";");
}
function getInterfaces(node) {
    var result = [];
    if (node.heritageClauses) {
        for (var _i = 0, _a = node.heritageClauses; _i < _a.length; _i++) {
            var h = _a[_i];
            if (h.token === ts.SyntaxKind.ImplementsKeyword) {
                for (var _b = 0, _c = h.types; _b < _c.length; _b++) {
                    var type = _c[_b];
                    result.push(type.expression.getText());
                }
            }
        }
    }
    return result;
}
function emitClassName() {
    return function (ctx) {
        function visitClassDeclaration(node) {
            if (isTypeScriptDeclaration(node)) {
                return node;
            }
            var nameNode = node.name;
            if (nameNode) {
                var result = getFullName(node);
                var arrays = [
                    node,
                ];
                if (!result.hasNamespace) {
                    var globalExpression = createGlobalExpression(result.fullname);
                    arrays.push(globalExpression);
                }
                var interfaces = getInterfaces(node).map(function (item) { return "\"" + item + "\""; }).join(",");
                var reflectExpression = ts.createIdentifier("__reflect(" + nameNode.getText() + ".prototype,\"" + result.fullname + "\",[" + interfaces + "]); ");
                arrays.push(reflectExpression);
                return ts.createNodeArray(arrays);
            }
            else {
                return node;
            }
        }
        function visitVariableStatement(node) {
            if (isTypeScriptDeclaration(node) || hasExport(node)) {
                return node;
            }
            var globalExpressions = node.declarationList.declarations.map(function (d) {
                var nameNode = d.name;
                var nameText = nameNode.getText();
                var globalExpression = createGlobalExpression(nameText);
                return globalExpression;
            });
            return ts.createNodeArray([node].concat(globalExpressions));
        }
        function visitFunctionOrEnumDeclaration(node) {
            if (isTypeScriptDeclaration(node)) {
                return node;
            }
            var nameNode = node.name;
            if (nameNode) {
                var nameText = nameNode.getText();
                var globalExpression = createGlobalExpression(nameText);
                var arrays = [
                    node,
                    globalExpression,
                ];
                if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
                    arrays.unshift(ts.createIdentifier("var " + nameText + " = window['" + nameText + "']; "));
                }
                return ts.createNodeArray(arrays);
            }
            else {
                return node;
            }
        }
        // 最外层变量需要挂载到全局对象上
        var nestLevel = 0;
        function visitor(node) {
            var result;
            if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                result = visitClassDeclaration(node);
            }
            else if (node.kind === ts.SyntaxKind.EnumDeclaration) {
                result = visitFunctionOrEnumDeclaration(node);
            }
            else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
                result = ts.visitEachChild(node, visitor, ctx);
                result = visitFunctionOrEnumDeclaration(result);
            }
            else if ((node.kind === ts.SyntaxKind.FunctionDeclaration) && isGlobalVariable(node)) {
                result = visitFunctionOrEnumDeclaration(node);
            }
            else if (node.kind === ts.SyntaxKind.VariableStatement && isGlobalVariable(node)) {
                result = visitVariableStatement(node);
            }
            else {
                result = ts.visitEachChild(node, visitor, ctx);
            }
            return result;
        }
        ;
        return function (sf) { return ts.visitNode(sf, visitor); };
    };
}
exports.emitClassName = emitClassName;
function addDependency(moduleName) {
    return function (ctx) {
        function visitClassDeclaration(node) {
            // const isExport = node.modifiers ? node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) : false;
            var binaryExpression = ts.createIdentifier("require(\"" + moduleName + "\")");
            var arrays = [
                binaryExpression,
                node,
            ];
            return ts.createNodeArray(arrays);
        }
        function visitor(node) {
            if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                var clz = node;
                if (clz.name && clz.name.getText() === "Main") {
                    return visitClassDeclaration(node);
                }
                else {
                    return ts.visitEachChild(node, visitor, ctx);
                }
            }
            else {
                return ts.visitEachChild(node, visitor, ctx);
            }
        }
        ;
        function visitor2(node) {
            return ts.visitEachChild(node, visitor, ctx);
        }
        ;
        return function (sf) {
            if (sf.fileName.indexOf("Main.ts") >= 0) {
                return ts.visitNode(sf, visitor);
            }
            else {
                return ts.visitNode(sf, visitor2);
            }
        };
    };
}
