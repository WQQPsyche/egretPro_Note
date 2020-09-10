"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApi = void 0;
var installer_proxy_1 = require("./installer-proxy");
var launcher_proxy_1 = require("./launcher-proxy");
var api;
function getApi() {
    if (!api) {
        api = createAPI();
    }
    return api;
}
exports.getApi = getApi;
function createAPI() {
    try {
        return launcher_proxy_1.createLauncherLibrary();
    }
    catch (e) {
        return installer_proxy_1.createInstallerLibrary();
    }
}
