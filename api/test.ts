/// <reference path="../typings/globals/node/index.d.ts" />
import * as http from "http";
import * as fsRef from "fs";
import * as vm from "vm";
import * as jfRef from "jf";

(function invoke(req: http.ServerRequest, res: http.ServerResponse, next: Function) {
    var _path = './api' + req.url;
    var jf: (typeof jfRef.jf) = require("jf");
    console.log('nodeJS', jf.nodeJS);
    console.log('test value: ', jf.testValue);
    var fs = jf.nodeJS.fs;
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    console.log('api invoked', _path, fs.existsSync(_path));
    res.end(req.method + 'there is another file let me know we can test this one.');
})