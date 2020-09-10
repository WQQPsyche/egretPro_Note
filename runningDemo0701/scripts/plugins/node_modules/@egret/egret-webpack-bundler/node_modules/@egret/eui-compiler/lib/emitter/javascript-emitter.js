"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptEmitter = void 0;
var codegen = require("escodegen");
var _1 = require(".");
var host_1 = require("./host");
var JavaScriptEmitter = /** @class */ (function (_super) {
    __extends(JavaScriptEmitter, _super);
    function JavaScriptEmitter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mapping = {
            number: createNumberOrBooleanLiteral,
            boolean: createNumberOrBooleanLiteral,
            string: createStringLiteral,
            any: createStringLiteral,
            'egret.Rectangle': createNewRectangle,
            'object': _this.createNewObject.bind(_this),
            skinName: createSkinName,
            itemRendererSkinName: createSkinName
        };
        _this.javascript = '';
        _this.body = [];
        return _this;
    }
    JavaScriptEmitter.prototype.getResult = function () {
        return this.javascript;
    };
    JavaScriptEmitter.prototype.emitHeader = function (themeData) {
        var outputText = '';
        outputText += extendsHelper;
        outputText += euiHelper(themeData.skins);
        this.javascript += outputText;
    };
    JavaScriptEmitter.prototype.emitSkinNode = function (filename, skinNode) {
        var ast = this.generateJavaScriptAST(skinNode);
        var text = codegen.generate(ast);
        this.javascript += text + "\n";
        this.javascript += "\ngenerateEUI.paths['" + filename + "'] = " + skinNode.namespace + "." + skinNode.classname + ";\n        ";
    };
    JavaScriptEmitter.prototype.generateJavaScriptAST = function (skinNode) {
        var code = this.createSkinNodeAst(skinNode);
        return createProgram([code]);
    };
    JavaScriptEmitter.prototype.createSkinNodeAst = function (skinNode) {
        var _this = this;
        var ids = [];
        var host = new host_1.EmitterHost();
        var states = [];
        if (skinNode.states) {
            for (var _i = 0, _a = skinNode.states; _i < _a.length; _i++) {
                var stateName = _a[_i];
                states.push({ name: stateName, items: [] });
            }
        }
        function visitChildren(node) {
            if (node.id) {
                ids.push(node.id);
            }
            var _loop_1 = function (stateAttribute) {
                var arr = states.find(function (s) { return s.name === stateAttribute.name; });
                arr.items.push(Object.assign({}, stateAttribute, { context: node.varIndex }));
            };
            for (var _i = 0, _a = node.stateAttributes; _i < _a.length; _i++) {
                var stateAttribute = _a[_i];
                _loop_1(stateAttribute);
            }
            node.children.forEach(visitChildren);
        }
        visitChildren(skinNode);
        var className = createIdentifier(skinNode.classname);
        var namespace = skinNode.namespace ? createIdentifier(skinNode.namespace) : null;
        this.writeToBody(emitSkinPart(ids));
        var context = createIdentifier('_this');
        this.emitAttributes(context, skinNode, host);
        this.emitChildren(context, skinNode, host);
        for (var _b = 0, _c = skinNode.bindings; _b < _c.length; _b++) {
            var binding = _c[_b];
            var result = this.emitBinding(binding);
            this.writeToBody(result);
        }
        if (skinNode.states.length > 0) {
            this.writeToBody(createExpressionStatment(createAssignmentExpression(createMemberExpression(context, createIdentifier('states')), createArray(states.map(function (s) {
                return createNewExpression(createMemberExpression(createIdentifier('eui'), createIdentifier("State")), [
                    createStringLiteral(s.name),
                    createArray(s.items.map(function (item) {
                        if (item.type === 'set') {
                            return createNewExpression(createMemberExpression(createIdentifier("eui"), createIdentifier("SetProperty")), [
                                createStringLiteral("a" + item.context),
                                createStringLiteral(item.attribute.key),
                                _this.mapping[item.attribute.type](item.attribute.value, host)
                            ]);
                        }
                        else {
                            return createNewExpression(createMemberExpression(createIdentifier("eui"), createIdentifier("AddItems")), [
                                createStringLiteral("a" + item.context),
                                createStringLiteral(""),
                                createNumberOrBooleanLiteral(1),
                                createStringLiteral("")
                                // createStringLiteral(item.attribute.key),
                                // this.mapping[item.attribute.type](item.attribute.value)
                            ]);
                        }
                    }))
                ]);
            })))));
        }
        var body = namespace ?
            createExpressionStatment(createAssignmentExpression(createMemberExpression(namespace, className), createClass(className, this.body, host))) : createVariableDeclaration(className, createClass(className, this.body, host));
        return body;
    };
    JavaScriptEmitter.prototype.emitNode = function (node, host) {
        var context = createVarIndexIdentifier(node);
        // if (node.type.indexOf('w.') > -1) {
        //     this.emitAttributes(context, node, host)
        //     this.emitChildren(context, node, host);
        //     return;
        // }
        this.writeToBody(emitCreateNode(context, emitComponentName(node.type)));
        if (node.id) {
            this.writeToBody(createExpressionStatment(createAssignmentExpression(createMemberExpression(createIdentifier("_this"), createIdentifier(node.id)), context)));
        }
        if (node.stateAttributes.length > 0) {
            this.writeToBody(createExpressionStatment(createAssignmentExpression(createMemberExpression(createIdentifier("_this"), context), context)));
        }
        this.emitAttributes(context, node, host);
        this.emitChildren(context, node, host);
    };
    JavaScriptEmitter.prototype.emitChildren = function (context, node, host) {
        if (node.children.length == 0) {
            return;
        }
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.type.indexOf('w.') == -1) {
                this.emitNode(child, host);
            }
            else {
                for (var _b = 0, _c = child.children; _b < _c.length; _b++) {
                    var _child = _c[_b];
                    var context_1 = createVarIndexIdentifier(_child);
                    //this.emitChildren(context, _child, host)
                    this.emitNode(_child, host);
                }
            }
        }
        var children = node.children.map(function (node) {
            if (node.type.indexOf('w.') == -1) {
                return createVarIndexIdentifier(node);
            }
            else {
                return null;
            }
        });
        children = children.filter(function (s) {
            return s;
        });
        var type = node.type;
        var propertyKey = 'elementsContent';
        if (type) {
            if (type.indexOf('TweenGroup') > -1) {
                propertyKey = 'items';
            }
            else if (type.indexOf('TweenItem') > -1) {
                propertyKey = 'paths';
            }
        }
        this.writeToBody(emitElementsContent(context.name, children, propertyKey));
    };
    JavaScriptEmitter.prototype.emitAttributes = function (context, node, host) {
        if (node.type) {
            if (node.type.indexOf('w.') == -1) {
                for (var _i = 0, _a = node.attributes; _i < _a.length; _i++) {
                    var attribute = _a[_i];
                    this.writeToBody(this.emitAttribute(context, attribute, host));
                }
                ;
            }
        }
        else {
            for (var _b = 0, _c = node.attributes; _b < _c.length; _b++) {
                var attribute = _c[_b];
                this.writeToBody(this.emitAttribute(context, attribute, host));
            }
            ;
        }
    };
    JavaScriptEmitter.prototype.createNewObject = function (value, host) {
        var varIndexIdentifer = createIdentifier("a" + value.varIndex);
        this.emitNode(value, host);
        return varIndexIdentifer;
    };
    JavaScriptEmitter.prototype.writeToBody = function (node) {
        this.body.push(node);
    };
    JavaScriptEmitter.prototype.emitAttribute = function (context, attribute, host) {
        var emitterFunction = this.mapping[attribute.type];
        if (!emitterFunction) {
            console.error("找不到", attribute.key, attribute.type, attribute.value);
            process.exit(1);
            return null;
        }
        else {
            return createExpressionStatment(createAssignmentExpression(createMemberExpression(context, createIdentifier(attribute.key)), emitterFunction(attribute.value, host)));
        }
    };
    JavaScriptEmitter.prototype.emitBinding = function (binding) {
        var words = binding.templates.map(function (item) {
            var result = Number(item);
            if (isNaN(result)) {
                return item;
            }
            else {
                return result;
            }
        });
        var keys = binding.chainIndex;
        var elements = [];
        var index = [];
        for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
            var word = words_1[_i];
            elements.push(createStringLiteral(word));
        }
        for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
            var key = keys_1[_a];
            index.push(createNumberOrBooleanLiteral(key));
        }
        var result = createExpressionStatment(createCallExpression(createMemberExpression({ type: 'Identifier', name: 'eui.Binding' }, { type: 'Identifier', name: '$bindProperties' }), [
            createThis(),
            createArray(elements),
            createArray(index),
            createIdentifier(binding.target),
            createStringLiteral(binding.property)
        ]));
        return result;
    };
    return JavaScriptEmitter;
}(_1.BaseEmitter));
exports.JavaScriptEmitter = JavaScriptEmitter;
function createVarIndexIdentifier(node) {
    return createIdentifier("a" + node.varIndex);
}
function emitComponentName(type) {
    var arr = type.split('.');
    return createMemberExpression(createIdentifier(arr[0]), createIdentifier(arr[1]));
}
function emitElementsContent(context, ids, propertyKey) {
    return createExpressionStatment(createAssignmentExpression(createMemberExpression(createIdentifier(context), createIdentifier(propertyKey)), createArray(ids)));
}
function emitCreateNode(varIndex, componentName) {
    return {
        type: "VariableDeclaration",
        declarations: [
            {
                type: "VariableDeclarator",
                id: varIndex,
                init: createNewExpression(componentName, [])
            }
        ],
        kind: "var"
    };
}
function emitSkinPart(skins) {
    return createExpressionStatment(createAssignmentExpression(createMemberExpression(createIdentifier("_this"), createIdentifier("skinParts")), createArray(skins.map(createStringLiteral))));
}
function createArray(elements) {
    return {
        type: "ArrayExpression",
        elements: elements
    };
}
function createStringLiteral(value) {
    return {
        type: "Literal",
        value: value,
        raw: "\"" + value + "\""
    };
}
function createSkinName(value, host) {
    var emitter = new JavaScriptEmitter();
    host.insertClassDeclaration(emitter.createSkinNodeAst(value));
    return createIdentifier(value.fullname);
}
function createNumberOrBooleanLiteral(value) {
    if (typeof value === 'number') {
        if (value < 0 || (value === 0 && 1 / value < 0)) {
            return {
                "type": "UnaryExpression",
                "operator": "-",
                "argument": {
                    type: "Literal",
                    value: -value,
                    raw: -value.toString()
                },
                "prefix": true
            };
        }
    }
    return {
        type: "Literal",
        value: value,
        raw: value.toString()
    };
}
function createNewRectangle(value) {
    var args = value.split(",").map(function (v) { return parseInt(v); });
    return createNewExpression(createMemberExpression(createIdentifier('egret'), createIdentifier('Rectangle')), [
        createNumberOrBooleanLiteral(args[0]),
        createNumberOrBooleanLiteral(args[1]),
        createNumberOrBooleanLiteral(args[2]),
        createNumberOrBooleanLiteral(args[3])
    ]);
}
function createNewExpression(callee, args) {
    return {
        type: "NewExpression",
        callee: callee,
        arguments: args
    };
}
function createExpressionStatment(expression) {
    return {
        "type": "ExpressionStatement",
        "expression": expression
    };
}
function createAssignmentExpression(left, right) {
    return {
        "type": "AssignmentExpression",
        "operator": "=",
        "left": left,
        "right": right
    };
}
function createMemberExpression(object, property) {
    return {
        "type": "MemberExpression",
        "computed": false,
        "object": object,
        "property": property
    };
}
function createIdentifier(name) {
    return {
        "type": "Identifier",
        name: name
    };
}
function createProgram(body) {
    return {
        "type": "Program",
        body: body,
        "sourceType": "script"
    };
}
function createVariableDeclaration(left, right) {
    return {
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": left,
                "init": right
            }
        ],
        "kind": "var"
    };
}
function createThis() {
    return {
        "type": "ThisExpression"
    };
}
function createClass(className, constractorBody, host) {
    var superCall = createVariableDeclaration(createIdentifier('_this'), {
        "type": "LogicalExpression",
        "operator": "||",
        "left": {
            "type": "CallExpression",
            "callee": createMemberExpression(createIdentifier('_super'), createIdentifier('call')),
            "arguments": [
                createThis()
            ]
        },
        "right": createThis()
    });
    var returnStatement = {
        "type": "ReturnStatement",
        "argument": createIdentifier("_this")
    };
    var fullConstractorBody = [superCall].concat(constractorBody).concat([returnStatement]);
    var functionArguments = [
        createMemberExpression(createIdentifier("eui"), createIdentifier("Skin"))
    ];
    var extendExpression = {
        "type": "ExpressionStatement",
        "expression": {
            "type": "CallExpression",
            "callee": {
                "type": "Identifier",
                "name": "__extends"
            },
            "arguments": [
                className,
                {
                    "type": "Identifier",
                    "name": "_super"
                }
            ]
        }
    };
    var classAsFunction = {
        "type": "FunctionDeclaration",
        "id": className,
        "params": [],
        "body": {
            "type": "BlockStatement",
            "body": fullConstractorBody
        },
        "generator": false,
        "expression": false,
        "async": false
    };
    var returnExpression = {
        "type": "ReturnStatement",
        "argument": className
    };
    var body = [extendExpression].concat(host.list).concat([classAsFunction, returnExpression]);
    return {
        "type": "CallExpression",
        "callee": {
            "type": "FunctionExpression",
            "id": null,
            "params": [
                {
                    "type": "Identifier",
                    "name": "_super"
                }
            ],
            "body": {
                "type": "BlockStatement",
                "body": body
            },
            "generator": false,
            "expression": false,
            "async": false
        },
        "arguments": functionArguments
    };
}
function createCallExpression(callee, args) {
    return {
        type: "CallExpression",
        callee: callee,
        arguments: args
    };
}
var extendsHelper = "\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\n\n";
function euiHelper(skins) {
    return "\n    window.skins=window.skins||{};\n    window.generateEUI = {};\n    generateEUI.paths = {};\n    generateEUI.styles = undefined;\n    generateEUI.skins = " + JSON.stringify(skins) + ";\n    ";
}
