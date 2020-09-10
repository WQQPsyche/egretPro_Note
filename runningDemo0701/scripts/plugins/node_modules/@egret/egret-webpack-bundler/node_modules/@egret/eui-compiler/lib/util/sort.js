"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort = void 0;
var parser_1 = require("./parser");
var dependenceMap = {};
var skins = {};
var preloads = [];
// 根据 exml 间的依赖关系进行排序
function sort(theme, exmls, clear) {
    if (clear === void 0) { clear = false; }
    if (clear) {
        dependenceMap = {};
    }
    if (!theme.exmls || !theme.skins) {
        return;
    }
    preloads = exmls.filter(function (value) { return value.preload; }).map(function (value) { return value.filename; });
    skins = theme.skins;
    getDependence(exmls);
    theme.exmls.sort(function (a, b) { return a.localeCompare(b); });
    theme.exmls = sortExmls(theme.exmls);
}
exports.sort = sort;
function sortExmls(exmls) {
    var result = [];
    for (var _i = 0, _a = exmls; _i < _a.length; _i++) {
        var filename = _a[_i];
        if (preloads.indexOf(filename) > -1) {
            sortFileName(filename, result);
        }
    }
    for (var _b = 0, _c = exmls; _b < _c.length; _b++) {
        var filename = _c[_b];
        sortFileName(filename, result);
    }
    return result;
}
function sortFileName(filename, output) {
    if (output.indexOf(filename) > -1) {
        return;
    }
    var dependencies = dependenceMap[filename];
    if (!dependencies) {
        return;
    }
    for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
        var dependence = dependencies_1[_i];
        if (!skins[dependence]) {
            continue;
        }
        sortFileName(skins[dependence], output);
    }
    output.push(filename);
}
function getDependence(exmls) {
    for (var _i = 0, exmls_1 = exmls; _i < exmls_1.length; _i++) {
        var exml = exmls_1[_i];
        if (exml.filename in dependenceMap) {
            continue;
        }
        var skinNode = parser_1.generateAST(exml.contents);
        var classes = ['eui:Skin'];
        for (var _a = 0, _b = skinNode.children; _a < _b.length; _a++) {
            var child = _b[_a];
            classes.push.apply(classes, getDependenceClasses(child));
        }
        dependenceMap[exml.filename] = classes.filter(function (value, index, arr) { return arr.indexOf(value) === index; });
    }
}
function getDependenceClasses(node) {
    var result = [node.type];
    for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
        var child = _a[_i];
        result.push.apply(result, getDependenceClasses(child));
    }
    return result;
}
