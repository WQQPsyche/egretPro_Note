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
exports.JSONEmitter = void 0;
var _1 = require(".");
var JSONEmitter = /** @class */ (function (_super) {
    __extends(JSONEmitter, _super);
    function JSONEmitter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.jsonContent = '';
        _this.addBingdingJson = { $b: [] };
        _this.euiNormalizeNames = {
            "$eBL": "eui.BitmapLabel",
            "$eB": "eui.Button",
            "$eCB": "eui.CheckBox",
            "$eC": "eui.Component",
            "$eDG": "eui.DataGroup",
            "$eET": "eui.EditableText",
            "$eG": "eui.Group",
            "$eHL": "eui.HorizontalLayout",
            "$eHSB": "eui.HScrollBar",
            "$eHS": "eui.HSlider",
            "$eI": "eui.Image",
            "$eL": "eui.Label",
            "$eLs": "eui.List",
            "$eP": "eui.Panel",
            "$ePB": "eui.ProgressBar",
            "$eRB": "eui.RadioButton",
            "$eRBG": "eui.RadioButtonGroup",
            "$eRa": "eui.Range",
            "$eR": "eui.Rect",
            "$eRAl": "eui.RowAlign",
            "$eS": "eui.Scroller",
            "$eT": "eui.TabBar",
            "$eTI": "eui.TextInput",
            "$eTL": "eui.TileLayout",
            "$eTB": "eui.ToggleButton",
            "$eTS": "eui.ToggleSwitch",
            "$eVL": "eui.VerticalLayout",
            "$eV": "eui.ViewStack",
            "$eVSB": "eui.VScrollBar",
            "$eVS": "eui.VSlider",
            "$eSk": "eui.Skin"
        };
        _this.elementContents = {};
        _this.elementIds = [];
        _this.skinParts = [];
        _this.nodeMap = {};
        _this.otherNodeMap = [];
        return _this;
    }
    JSONEmitter.prototype.getResult = function () {
        return this.jsonContent;
    };
    JSONEmitter.prototype.emitHeader = function (themeData) {
    };
    JSONEmitter.prototype.emitSkinNode = function (filename, skinNode) {
        var json = {};
        this.elementContents = {};
        this.elementIds = [];
        this.skinParts = [];
        this.nodeMap = {};
        var key = skinNode.fullname;
        var item = {
            $sC: "$eSk",
            $path: filename
        };
        json[key] = item;
        this.nodeMap[key] = skinNode;
        if (this.otherNodeMap.length == 0) {
            for (var _i = 0, _a = Object.keys(this.nodeMap); _i < _a.length; _i++) {
                var key_1 = _a[_i];
                this.catchClass(this.nodeMap[key_1]);
            }
        }
        this.setBaseState(skinNode, item, undefined, skinNode);
        Object.assign(item, this.elementContents);
        if (this.skinParts.length > 0) {
            item.$sP = this.skinParts;
        }
        this.setStates(skinNode, item);
        if (this.otherNodeMap.length > 0) {
            for (var _b = 0, _c = this.otherNodeMap; _b < _c.length; _b++) {
                var child = _c[_b];
                var result = this.createSkinName(child);
                var key_2 = Object.keys(result)[0];
                delete result[key_2].$path;
                delete result[key_2].$s;
                Object.assign(json, result);
            }
        }
        if (this.addBingdingJson.$b.length > 0) {
            json[skinNode.fullname] = Object.assign(json[skinNode.fullname], this.addBingdingJson);
        }
        this.jsonContent = JSON.stringify(json, null, 4);
    };
    JSONEmitter.prototype.setBaseState = function (node, json, key, skinNode) {
        if (key === void 0) { key = '$bs'; }
        var base = {};
        if (key.indexOf('w.') < 0) {
            json[key] = base;
            for (var _i = 0, _a = node.attributes; _i < _a.length; _i++) {
                var attr = _a[_i];
                base[attr.key] = this.parseValue(attr.value, skinNode);
            }
            if (node["type"]) {
                base['$t'] = this.convertType(node["type"]);
            }
            for (var _b = 0, _c = skinNode.bindings; _b < _c.length; _b++) {
                var binding = _c[_b];
                if (node['type']) {
                    // const type = node['type'].replace("eui.", "_");
                    // const keyWord = key.replace(type, "a");
                    //if (keyWord === binding.target) {
                    if (node.varIndex == binding.target.replace('a', '')) {
                        var array = binding.templates.map(function (item) {
                            var result = Number(item);
                            if (isNaN(result)) {
                                return item;
                            }
                            else {
                                return result;
                            }
                        });
                        if (binding.templates.length == 1 && binding.chainIndex.length == 1) {
                            this.addBingdingJson.$b.push({
                                "$bd": array,
                                "$bt": key,
                                "$bp": binding.property
                            });
                        }
                        else {
                            this.addBingdingJson.$b.push({
                                "$bd": array,
                                "$bt": key,
                                "$bp": binding.property,
                                "$bc": binding.chainIndex
                            });
                        }
                        json[key][binding.property] = "";
                    }
                }
            }
        }
        var elementContents = [];
        var sIds = [];
        for (var _d = 0, _e = node.children; _d < _e.length; _d++) {
            var child = _e[_d];
            var id = this.parseNode(child);
            if (id.indexOf('w.') < 0) {
                this.hasAddType(child) ? sIds.push(id) : elementContents.push(id);
            }
            this.setBaseState(child, this.elementContents, id, skinNode);
        }
        var type = node.type;
        var prop = '$eleC';
        if (type) {
            if (type.indexOf('TweenGroup') > -1) {
                prop = 'items';
            }
            else if (type.indexOf('TweenItem') > -1) {
                prop = 'paths';
            }
        }
        elementContents.length > 0 && (base[prop] = elementContents);
        sIds.length > 0 && (base['$sId'] = sIds);
    };
    JSONEmitter.prototype.setStates = function (skinNode, json) {
        if (skinNode.states.length === 0) {
            return;
        }
        json.$s = {};
        for (var _i = 0, _a = skinNode.states; _i < _a.length; _i++) {
            var state = _a[_i];
            json.$s[state] = {};
        }
        this.getStatesAttribute(skinNode, json.$s);
    };
    JSONEmitter.prototype.getStatesAttribute = function (node, json) {
        var target = this.getNodeId(node);
        for (var _i = 0, _a = node.stateAttributes; _i < _a.length; _i++) {
            var attr = _a[_i];
            switch (attr.type) {
                case 'set':
                    {
                        if (attr.name in json) {
                            if (!json[attr.name].$ssP) {
                                json[attr.name].$ssP = [];
                            }
                            json[attr.name].$ssP.push({
                                target: target,
                                name: attr.attribute.key,
                                value: attr.attribute.value
                            });
                        }
                    }
                    break;
                case 'add':
                    {
                        if (attr.name in json) {
                            if (!json[attr.name].$saI) {
                                json[attr.name].$saI = [];
                            }
                            json[attr.name].$saI.push({
                                target: target,
                                property: "",
                                position: 1,
                                relativeTo: ""
                            });
                        }
                    }
                    break;
            }
        }
        for (var _b = 0, _c = node.children; _b < _c.length; _b++) {
            var child = _c[_b];
            this.getStatesAttribute(child, json);
        }
    };
    JSONEmitter.prototype.hasAddType = function (node) {
        for (var _i = 0, _a = node.stateAttributes; _i < _a.length; _i++) {
            var attr = _a[_i];
            if (attr.type === 'add') {
                return true;
            }
        }
        return false;
    };
    JSONEmitter.prototype.getNodeId = function (node) {
        var nodeMap = this.nodeMap;
        for (var id in nodeMap) {
            if (nodeMap[id] === node) {
                return id;
            }
        }
        return null;
    };
    JSONEmitter.prototype.parseNode = function (node) {
        var id = node.id;
        if (id) {
            this.skinParts.push(id);
        }
        else {
            var i = 1;
            var type = node.type;
            if (node.type.indexOf('w.') < 0) {
                type = node.type.split('.').pop();
            }
            do {
                id = "_" + type + i++;
            } while (this.elementIds.indexOf(id) !== -1);
        }
        this.elementIds.push(id);
        this.nodeMap[id] = node;
        return id;
    };
    JSONEmitter.prototype.parseValue = function (value, skinNode) {
        if (!value["attributes"] && !value["children"]) {
            return value;
        }
        if (value["type"]) {
            var id = this.parseNode(value);
            this.setBaseState(value, this.elementContents, id, skinNode);
            return id;
        }
        return value;
    };
    JSONEmitter.prototype.convertType = function (type) {
        for (var key in this.euiNormalizeNames) {
            if (this.euiNormalizeNames[key] === type) {
                return key;
            }
        }
        if (type.indexOf("Object") >= 0) {
            return "Object";
        }
        else if (type.indexOf("tween") >= 0) {
            return "egret." + type.replace(":", ".");
        }
        else {
            return "$eSk";
        }
    };
    JSONEmitter.prototype.catchClass = function (nodeMap) {
        if (nodeMap.attributes) {
            for (var _i = 0, _a = nodeMap.attributes; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child.type == 'skinName') {
                    this.otherNodeMap.push(child);
                    var value = child.value.fullname;
                    nodeMap.attributes = [
                        {
                            'type': 'skinName',
                            'key': 'skinName',
                            'value': value,
                            'attributes': []
                        }
                    ];
                    break;
                }
            }
        }
        if (nodeMap.children) {
            for (var _b = 0, _c = nodeMap.children; _b < _c.length; _b++) {
                var child = _c[_b];
                this.catchClass(child);
            }
        }
    };
    JSONEmitter.prototype.createSkinName = function (child) {
        var emitter = new JSONEmitter();
        emitter.emitSkinNode('', child.value);
        var result = emitter.getResult();
        return JSON.parse(result);
    };
    return JSONEmitter;
}(_1.BaseEmitter));
exports.JSONEmitter = JSONEmitter;
