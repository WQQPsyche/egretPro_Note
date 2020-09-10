"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTypings = exports.getTypings = void 0;
var fs = require("fs");
var path = require("path");
var property;
function getTypings(className, propertyKey) {
    if (propertyKey === 'id') {
        return "id";
    }
    var typings = property[className];
    var type;
    var isCustomComponent = false;
    if (!typings) {
        typings = property['eui.Component'];
        isCustomComponent = true;
        // console.error('missing classname on typings:', className)
        // process.exit(1);
    }
    type = typings[propertyKey];
    while (!type && typings.super) {
        typings = property[typings.super];
        type = typings[propertyKey];
    }
    if (!type) {
        if (isCustomComponent) {
            type = 'any';
        }
        else {
            console.error(className + "\u4E2D\u4E0D\u5305\u542B" + propertyKey + "\u5C5E\u6027");
            return null;
        }
    }
    return type;
}
exports.getTypings = getTypings;
function initTypings() {
    var filename = path.resolve(__dirname, "../../", "property.json");
    var content = fs.readFileSync(filename, 'utf-8');
    property = JSON.parse(content);
    for (var className in property) {
        var typings = property[className];
        if (typings.super) {
        }
    }
}
exports.initTypings = initTypings;
