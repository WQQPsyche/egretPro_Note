"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeFile = void 0;
var fs = require("fs");
var path = require("path");
var parser_1 = require("../util/parser");
var ThemeFile = /** @class */ (function () {
    function ThemeFile(projectRoot, filePath) {
        this.projectRoot = projectRoot;
        this.filePath = filePath;
        this._dependenceMap = {};
        this._preloads = [];
        var jsonContent = fs.readFileSync(path.join(projectRoot, filePath), 'utf-8');
        var json = JSON.parse(jsonContent);
        this.data = json;
        var duplicate = json.exmls.filter(function (item, index, array) {
            return array.lastIndexOf(item) !== array.indexOf(item);
        });
        if (duplicate.length > 0) {
            console.log("\u5B58\u5728\u76F8\u540C\u7684\u76AE\u80A4\u6587\u4EF6", duplicate);
            process.exit(1);
        }
    }
    ThemeFile.prototype.sort = function (exmls, clear) {
        if (clear === void 0) { clear = false; }
        var theme = this.data;
        if (!theme.exmls || !theme.skins) {
            return;
        }
        if (clear) {
            this._dependenceMap = {};
        }
        this._preloads = exmls.filter(function (value) { return value.preload; }).map(function (value) { return value.filename; });
        this.getDependence(exmls);
        theme.exmls.sort(function (a, b) { return a.localeCompare(b); });
        theme.exmls = this.sortExmls(theme.exmls);
    };
    ThemeFile.prototype.getDependence = function (exmls) {
        var dependenceMap = this._dependenceMap;
        for (var _i = 0, exmls_1 = exmls; _i < exmls_1.length; _i++) {
            var exml = exmls_1[_i];
            if (exml.filename in dependenceMap)
                continue;
            var skinNode = parser_1.generateAST(exml.contents);
            var classes = ['eui:Skin'];
            for (var _a = 0, _b = skinNode.children; _a < _b.length; _a++) {
                var child = _b[_a];
                classes.push.apply(classes, this.getDependenceClasses(child));
            }
            dependenceMap[exml.filename] = classes.filter(function (value, index, arr) { return arr.indexOf(value) === index; });
        }
    };
    ThemeFile.prototype.getDependenceClasses = function (node) {
        var result = [node.type];
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            result.push.apply(result, this.getDependenceClasses(child));
        }
        return result;
    };
    ThemeFile.prototype.sortExmls = function (exmls) {
        var result = [];
        var preloads = this._preloads;
        for (var _i = 0, _a = exmls; _i < _a.length; _i++) {
            var filename = _a[_i];
            if (preloads.indexOf(filename) > -1) {
                this.sortFileName(filename, result);
            }
        }
        for (var _b = 0, _c = exmls; _b < _c.length; _b++) {
            var filename = _c[_b];
            this.sortFileName(filename, result);
        }
        return result;
    };
    ThemeFile.prototype.sortFileName = function (filename, output) {
        if (output.indexOf(filename) > -1)
            return;
        var dependencies = this._dependenceMap[filename];
        if (!dependencies)
            return;
        var skins = this.data.skins;
        for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
            var dependence = dependencies_1[_i];
            if (!skins[dependence])
                continue;
            this.sortFileName(skins[dependence], output);
        }
        output.push(filename);
    };
    return ThemeFile;
}());
exports.ThemeFile = ThemeFile;
