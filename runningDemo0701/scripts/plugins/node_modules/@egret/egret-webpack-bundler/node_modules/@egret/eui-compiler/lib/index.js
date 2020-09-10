"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EuiCompiler = exports.emitter = exports.parser = void 0;
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var emitter_1 = require("./emitter");
var eui_config_1 = require("./eui-config");
var parser_1 = require("./util/parser");
var typings_1 = require("./util/typings");
exports.parser = require('./util/parser');
exports.emitter = {
    JavaScriptEmitter: emitter_1.JavaScriptEmitter,
    JSONEmitter: emitter_1.JSONEmitter,
    DeclarationEmitter: emitter_1.DeclarationEmitter
};
var javascriptEmitSolution = function (theme, transformers) {
    var themeData = theme.data;
    var exmlFiles = themeData.exmls;
    var emitter = new emitter_1.JavaScriptEmitter();
    emitter.emitHeader(themeData);
    for (var _i = 0, exmlFiles_1 = exmlFiles; _i < exmlFiles_1.length; _i++) {
        var filename_1 = exmlFiles_1[_i];
        var fullpath = eui_config_1.getFilePathRelativeProjectRoot(filename_1);
        var content_1 = fs.readFileSync(fullpath, 'utf-8');
        var skinNode = parser_1.generateAST(content_1);
        for (var _a = 0, transformers_1 = transformers; _a < transformers_1.length; _a++) {
            var transformer = transformers_1[_a];
            skinNode = transformer(skinNode);
        }
        emitter.emitSkinNode(filename_1, skinNode);
    }
    var filename = theme.filePath.replace("thm.json", 'thm.js');
    var content = emitter.getResult();
    return { filename: filename, content: content };
};
var jsonEmitSolution = function (theme, transformers) {
    var themeData = theme.data;
    var exmlFiles = themeData.exmls;
    var emitter = new emitter_1.JSONEmitter();
    for (var _i = 0, exmlFiles_2 = exmlFiles; _i < exmlFiles_2.length; _i++) {
        var filename_2 = exmlFiles_2[_i];
        var fullpath = eui_config_1.getFilePathRelativeProjectRoot(filename_2);
        var content_2 = fs.readFileSync(fullpath, 'utf-8');
        var skinNode = parser_1.generateAST(content_2);
        for (var _a = 0, transformers_2 = transformers; _a < transformers_2.length; _a++) {
            var transformer = transformers_2[_a];
            skinNode = transformer(skinNode);
        }
        emitter.emitSkinNode(filename_2, skinNode);
    }
    var filename = theme.filePath.replace("thm.json", 'thm.js');
    var content = emitter.getResult();
    return { filename: filename, content: content };
};
var debugEmitSolution = function (theme, transformers) {
    if (theme.data.autoGenerateExmlsList) {
        var dirname_1 = path.dirname(theme.filePath);
        // const 
        var exmlFiles_4 = glob.sync('**/*.exml', { cwd: dirname_1 }).map(function (item) { return path.join(dirname_1, item).split("\\").join("/"); });
        var exmlContents = exmlFiles_4.map(function (filename) {
            var contents = fs.readFileSync(filename, 'utf-8');
            return { filename: filename, contents: contents };
        });
        theme.sort(exmlContents);
        var content_3 = JSON.stringify(theme.data, null, '\t');
        fs.writeFileSync(theme.filePath, content_3);
    }
    var themeData = theme.data;
    var exmlFiles = themeData.exmls;
    var emitter = new emitter_1.DeclarationEmitter();
    for (var _i = 0, exmlFiles_3 = exmlFiles; _i < exmlFiles_3.length; _i++) {
        var filename_3 = exmlFiles_3[_i];
        var fullpath = eui_config_1.getFilePathRelativeProjectRoot(filename_3);
        var content_4 = fs.readFileSync(fullpath, 'utf-8');
        var skinNode = parser_1.generateAST(content_4);
        for (var _a = 0, transformers_3 = transformers; _a < transformers_3.length; _a++) {
            var transformer = transformers_3[_a];
            skinNode = transformer(skinNode);
        }
        emitter.emitSkinNode(filename_3, skinNode);
    }
    var filename = 'libs/exml.e.d.ts';
    var content = emitter.getResult();
    return { filename: filename, content: content };
};
var modes = {
    'commonjs': javascriptEmitSolution,
    'commonjs2': jsonEmitSolution,
    'debug': debugEmitSolution
};
var EuiCompiler = /** @class */ (function () {
    function EuiCompiler(root, mode) {
        if (mode === void 0) { mode = 'commonjs2'; }
        this.mode = mode;
        this._transformers = [];
        eui_config_1.initilize(root);
        typings_1.initTypings();
    }
    EuiCompiler.prototype.setCustomTransformers = function (transformers) {
        this._transformers = transformers;
    };
    EuiCompiler.prototype.emit = function () {
        var _this = this;
        var themes = eui_config_1.getThemes();
        var solution = modes[this.mode];
        return themes.map(function (theme) { return solution(theme, _this._transformers); });
    };
    EuiCompiler.prototype.getThemes = function () {
        return eui_config_1.getThemes();
    };
    return EuiCompiler;
}());
exports.EuiCompiler = EuiCompiler;
