"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAST = void 0;
var convert = require("xml-js");
var exml_ast_1 = require("../exml-ast");
var typings_1 = require("./typings");
var skinParts = [];
var EuiParser = /** @class */ (function () {
    function EuiParser() {
        this.skinNameIndex = 1;
        this.varIndex = 0;
    }
    EuiParser.prototype.parseText = function (filecontent) {
        var data = convert.xml2js(filecontent);
        var rootExmlElement = data.elements.find(function (e) { return e.name === 'e:Skin'; });
        var skinNode = this.createSkinNode(rootExmlElement);
        return skinNode;
    };
    EuiParser.prototype.createSkinNode = function (rootExmlElement) {
        this.varIndex = 0;
        var childrenExmlElement = getExmlChildren(rootExmlElement);
        var isRootSkin = rootExmlElement
            && rootExmlElement.attributes
            && rootExmlElement.attributes.class;
        var fullname = isRootSkin ? rootExmlElement.attributes.class : "skins.MyComponent1$Skin" + this.skinNameIndex;
        // : `TestSkin${this.skinNameIndex++}`;
        var x = fullname.split(".");
        var namespace = x[1] ? x[0] : "";
        var classname = x[1] ? x[1] : x[0];
        this.currentSkinNode = {
            fullname: fullname,
            namespace: namespace,
            stateAttributes: [],
            classname: classname,
            children: [],
            attributes: [],
            states: [],
            bindings: [] //[{ target: 'a1', templates: ["hostComponent.data.data"], chainIndex: [0], property: 'text' }]
        };
        this.walkAST_Node(rootExmlElement);
        for (var key in rootExmlElement.attributes) {
            if (key === 'class' || key.indexOf("xmlns") >= 0) {
                continue;
            }
            var value = rootExmlElement.attributes[key];
            if (key === 'states') {
                this.currentSkinNode.states = value.split(',');
                continue;
            }
            var type = typings_1.getTypings('eui.Skin', key);
            if (!type) {
                continue;
            }
            var attribute = createAttribute(key, type, value);
            this.currentSkinNode.attributes.push(attribute);
        }
        for (var _i = 0, childrenExmlElement_1 = childrenExmlElement; _i < childrenExmlElement_1.length; _i++) {
            var childElement = childrenExmlElement_1[_i];
            var child = this.createAST_Node(childElement);
            if (child) {
                this.currentSkinNode.children.push(child);
            }
        }
        return this.currentSkinNode;
    };
    EuiParser.prototype.walkAST_Node = function (nodeExmlElement) {
        var type = getClassNameFromEXMLElement(nodeExmlElement);
        if (skinParts.indexOf(type) == -1) {
            skinParts.push(type.toUpperCase());
        }
        var childrenExmlElement = getExmlChildren(nodeExmlElement);
        for (var _i = 0, childrenExmlElement_2 = childrenExmlElement; _i < childrenExmlElement_2.length; _i++) {
            var element = childrenExmlElement_2[_i];
            this.walkAST_Node(element);
        }
    };
    EuiParser.prototype.createAST_Node = function (nodeExmlElement) {
        if (nodeExmlElement.name === 'w:Config') {
            return null;
        }
        var childrenExmlElement = getExmlChildren(nodeExmlElement);
        var type = getClassNameFromEXMLElement(nodeExmlElement);
        this.varIndex++;
        var node = {
            type: type,
            children: [],
            attributes: [],
            stateAttributes: [],
            varIndex: this.varIndex,
            id: null
        };
        createAST_Attributes(node, nodeExmlElement, this.currentSkinNode, this.varIndex);
        for (var _i = 0, childrenExmlElement_3 = childrenExmlElement; _i < childrenExmlElement_3.length; _i++) {
            var element = childrenExmlElement_3[_i];
            var nodeType = void 0;
            if (type === 'eui.Scroller' && element.name === 'e:List') {
                nodeType = {
                    namespace: 'e',
                    name: "viewport",
                    type: exml_ast_1.AST_FullName_Type.ATTRIBUTE
                };
            }
            else {
                nodeType = getNodeType(element.name);
            }
            // NodeElement的children中
            // 不一定全是 node.children
            // 也有可能是 attribute
            if (nodeType.type === exml_ast_1.AST_FullName_Type.ELEMENT) {
                var child = this.createAST_Node(element);
                if (child) {
                    node.children.push(child);
                }
            }
            else {
                var key = nodeType.name;
                if (key === 'skinName' || key === 'itemRendererSkinName') {
                    var parser = new EuiParser();
                    var value = parser.createSkinNode(element.elements[0]);
                    var attribute = {
                        type: key,
                        key: key,
                        value: value
                    };
                    node.attributes.push(attribute);
                }
                else if (key === 'viewport') {
                    var attribute = {
                        type: 'object',
                        key: key,
                        value: this.createAST_Node(element)
                    };
                    node.attributes.push(attribute);
                }
                else if (key === 'layout') {
                    var attribute = {
                        type: 'object',
                        key: key,
                        value: this.createAST_Node(element.elements[0])
                    };
                    node.attributes.push(attribute);
                }
                else if (key === 'props') {
                    for (var _a = 0, _b = element.elements; _a < _b.length; _a++) {
                        var obj = _b[_a];
                        var value = this.createAST_Node(obj);
                        var attribute = {
                            type: 'object',
                            key: key,
                            value: value
                        };
                        node.attributes.push(attribute);
                    }
                }
                else {
                    throw new Error("missing " + key);
                }
            }
        }
        return node;
    };
    return EuiParser;
}());
function formatBinding(value, node) {
    var jsKeyWords = ["null", "NaN", "undefined", "true", "false"];
    var HOST_COMPONENT = "hostComponent";
    value = value.substring(1, value.length - 1).trim();
    var templates = [value];
    var chainIndex = [];
    var length = templates.length;
    for (var i = 0; i < length; i++) {
        var item = templates[i].trim();
        if (!item) {
            templates.splice(i, 1);
            i--;
            length--;
            continue;
        }
        var first = item.charAt(0);
        if (first == "'" || first == "\"" || first >= "0" && first <= "9" || first == "-") {
            continue;
        }
        if (item.indexOf(".") == -1 && jsKeyWords.indexOf(item) != -1) {
            continue;
        }
        if (item.indexOf("this.") == 0) {
            item = item.substring(5);
        }
        var firstKey = item.split(".")[0];
        var flag = true;
        for (var _i = 0, skinParts_1 = skinParts; _i < skinParts_1.length; _i++) {
            var item_1 = skinParts_1[_i];
            if (item_1.indexOf(firstKey.toUpperCase()) > -1) {
                flag = false;
            }
        }
        if (firstKey != HOST_COMPONENT && flag) {
            item = HOST_COMPONENT + "." + item;
        }
        templates[i] = "\"" + item + "\"";
        chainIndex.push(i);
    }
    return {
        templates: templates,
        chainIndex: chainIndex
    };
}
function generateAST(filecontent) {
    return new EuiParser().parseText(filecontent);
}
exports.generateAST = generateAST;
function getClassNameFromEXMLElement(element) {
    var result = element.name.replace(/:/g, '.');
    var firstWord = result.split('.')[0];
    switch (firstWord) {
        case 'e':
            result = result.replace('e', 'eui');
            break;
        case 'ns1':
            result = result.replace('ns1:', '');
            break;
        default:
            break;
    }
    return result;
}
function getExmlChildren(element) {
    var childrenElements = element.elements;
    if (!childrenElements) {
        return [];
    }
    else {
        return childrenElements.filter(function (item) {
            return item.type !== 'comment';
        });
    }
    ;
}
function getNodeType(name1) {
    var tempArr = name1.split(":");
    var namespace = tempArr[0];
    var name = tempArr[1];
    // 根据名称的首字母是否是大小写来判断是属性还是子节点
    var type = name.charAt(0).toLowerCase() === name.charAt(0)
        ? exml_ast_1.AST_FullName_Type.ATTRIBUTE
        : exml_ast_1.AST_FullName_Type.ELEMENT;
    return { namespace: namespace, name: name, type: type };
}
function parseStateAttribute(className, originKey, value) {
    var _a = originKey.split("."), key = _a[0], stateName = _a[1];
    var type = typings_1.getTypings(className, key);
    var attribute = createAttribute(key, type, value);
    return {
        type: "set",
        attribute: attribute,
        name: stateName
    };
}
/**
 * 将NodeElement的 attribute节点转化为Node的Attribute
 * @param nodeElement
 */
function createAST_Attributes(node, nodeElement, skinNode, varIndex) {
    var attributes = [];
    var className = getClassNameFromEXMLElement(nodeElement);
    for (var key in nodeElement.attributes) {
        if (key === 'locked') {
            continue;
        }
        var value = nodeElement.attributes[key];
        if (value.indexOf("%") >= 0) {
            if (key === 'width') {
                key = 'percentWidth';
                value = value.replace("%", '');
            }
            else if (key === 'height') {
                key = 'percentHeight';
                value = value.replace("%", '');
            }
        }
        if (key.indexOf(".") >= 0) {
            var stateAttribute = parseStateAttribute(className, key, value);
            node.stateAttributes.push(stateAttribute);
            continue;
        }
        if (key === 'includeIn') {
            var includeStates = value.split(",").map(function (sName) {
                return {
                    name: sName,
                    type: 'add'
                };
            });
            node.stateAttributes = node.stateAttributes.concat(includeStates);
            continue;
        }
        if (key === 'id') {
            node.id = value;
            continue;
        }
        if (value.search(/{\w*}/) > -1) {
            var result = formatBinding(value, node);
            var array = result.templates.map(function (item) {
                item = item.replace(/\"/g, "");
                return item;
            });
            skinNode.bindings.push({
                target: 'a' + varIndex,
                templates: array,
                chainIndex: result.chainIndex,
                property: key,
            });
            continue;
        }
        var type = typings_1.getTypings(className, key);
        if (!type) {
            continue;
        }
        var attribute = createAttribute(key, type, value);
        attributes.push(attribute);
    }
    node.attributes = attributes;
}
function createAttribute(key, type, attributeValue) {
    var value = attributeValue;
    if (type == 'number') {
        value = Number(attributeValue);
    }
    else if (type === 'boolean') {
        value = attributeValue === 'true';
    }
    else if (type === 'any') {
        var temp = Number(attributeValue);
        if (!isNaN(temp)) {
            value = temp;
        }
    }
    else if (['top', 'bottom', 'left', 'right'].indexOf(key) >= 0) {
        if (!isNaN(parseFloat(attributeValue))) {
            type = 'number';
            value = parseFloat(attributeValue);
        }
    }
    return {
        type: type,
        key: key,
        value: value
    };
}
