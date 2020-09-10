"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLibsFileList = void 0;
var data_1 = require("./data");
function getLibsFileList(target, projectRoot, mode) {
    data_1.projectData.init(projectRoot);
    var result = [];
    data_1.projectData.getModulesConfig(target).forEach(function (m) {
        m.target.forEach(function (m) {
            var filename = mode == 'debug' ? m.debug : m.release;
            result.push(filename);
        });
    });
    return result;
}
exports.getLibsFileList = getLibsFileList;
