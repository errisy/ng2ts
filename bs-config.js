"use strict";
/// <reference path="./typings/globals/node/index.d.ts" />
/// <reference path="./typings/globals/browser-sync/index.d.ts" />
var fs = require("fs");
var http = require("http");
var vm = require("vm");
var jf_1 = require("jf");
var tsMiddleWare = {
    route: "/api",
    handle: function (req, res, next) {
        var _path = './api' + req.url;
        if (fs.existsSync(_path)) {
            if (fs.statSync(_path).isFile()) {
                fs.readFile(_path, function (err, data) {
                    try {
                        var context = vm.createContext({
                            console: console,
                            //fs: fs,
                            require: require,
                            http: http,
                            jf: jf_1.jf
                        });
                        var code = data.toString();
                        code = code.substring(code.indexOf('(function'), code.lastIndexOf(';'));
                        var _script = vm.createScript(code);
                        //console.log(code);
                        var fn = _script.runInContext(context);
                        fn(req, res, next);
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                });
            }
        }
        console.log("route api:", _path);
        //res.end(_path);
        //return req.url;
        //next();
    }
};
//var _module: BrowserSync.IBrowserSyncModule = eval("module");
/// Export configuration options
module.exports = {
    files: ['./**/*.{html,htm,css,js}'],
    server: {
        baseDir: "./"
    },
    middleware: [
        tsMiddleWare
    ],
    watchOptions: { ignored: 'node_modules' },
    port: 3000
};
//# sourceMappingURL=bs-config.js.map