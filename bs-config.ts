/// <reference path="./typings/globals/node/index.d.ts" />
/// <reference path="./typings/globals/browser-sync/index.d.ts" />
import * as fs from "fs";
import * as http from "http";
import * as vm from "vm";
import * as BrowserSync from "browser-sync";
import {jf} from "jf";

//import * as browserSync from browser_sync

interface IInvoke {
    invoke: BrowserSync.MiddlewareHandler
}

var tsMiddleWare = <BrowserSync.PerRouteMiddleware>
    {
      route: "/api",
      handle: function (req: http.ServerRequest, res: http.ServerResponse, next: Function) {

          var _path = './api' + req.url;

          if (fs.existsSync(_path)) {
              if (fs.statSync(_path).isFile()) {
                  fs.readFile(_path, (err: NodeJS.ErrnoException, data: Buffer) => {
                      try {
                          var context = vm.createContext({
                              console: console,
                              //fs: fs,
                              require: require,
                              http: http,
                              jf: jf
                          });
                          var code = data.toString();
                          code = code.substring(code.indexOf('(function'), code.lastIndexOf(';')) ;
                          var _script = vm.createScript(code);
                          //console.log(code);
                          var fn: BrowserSync.MiddlewareHandler = _script.runInContext(context);
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
    //how to invoke a TypeScriptFile?
}
//var _module: BrowserSync.IBrowserSyncModule = eval("module");

/// Export configuration options

module.exports = <BrowserSync.Options>{
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
