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
exports.getEgretProperties = exports.getFilePathRelativeProjectRoot = exports.getThemes = exports.initilize = void 0;
var Ajv = require("ajv");
var fs = require("fs");
var path = require("path");
var theme_1 = require("./theme");
var localize = require('ajv-i18n/localize/zh');
var projectRoot = '';
var egretProperties;
var schema = {
    "type": "object",
    "required": ["eui"],
    "properties": {
        "eui": {
            "required": ["themes"],
            "type": "object",
            "properties": {
                "themes": {
                    "type": "array", items: {
                        "type": "string"
                    }
                },
            }
        }
    }
};
var EgretPropertiesError = /** @class */ (function (_super) {
    __extends(EgretPropertiesError, _super);
    function EgretPropertiesError(filepath, message) {
        return _super.call(this, filepath + " " + message) || this;
    }
    return EgretPropertiesError;
}(Error));
function initilize(root) {
    projectRoot = root;
    parseEgretProperties();
}
exports.initilize = initilize;
function getJson(filepath) {
    if (!fs.existsSync(filepath)) {
        throw new EgretPropertiesError(filepath, '找不到该文件');
    }
    var content = fs.readFileSync(filepath, 'utf-8');
    try {
        return JSON.parse(content);
    }
    catch (e) {
        throw new EgretPropertiesError(filepath, '不是有效的JSON文件');
    }
}
function parseEgretProperties() {
    var ajv = new Ajv();
    var validate = ajv.compile(schema);
    var filePath = path.join(projectRoot, 'egretProperties.json');
    egretProperties = getJson(filePath);
    if (!egretProperties.eui) {
        egretProperties.eui = {
            themes: [
                "resource/default.thm.json"
            ]
        };
    }
    var valid = validate(egretProperties);
    if (!valid) {
        localize(validate.errors);
        var message = ajv.errorsText(validate.errors, { separator: '\n' });
        throw new EgretPropertiesError(filePath, message);
    }
    return;
}
function getThemes() {
    var themes = egretProperties.eui.themes;
    return themes.map(function (t) {
        var themeFile = new theme_1.ThemeFile(projectRoot, t);
        return themeFile;
    });
}
exports.getThemes = getThemes;
function getFilePathRelativeProjectRoot(p) {
    return path.join(projectRoot, p).split("\\").join("/");
}
exports.getFilePathRelativeProjectRoot = getFilePathRelativeProjectRoot;
function getEgretProperties() {
    return egretProperties;
}
exports.getEgretProperties = getEgretProperties;
