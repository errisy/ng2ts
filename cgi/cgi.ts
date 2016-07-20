import * as fs from 'fs';
import * as http from 'http';
import * as vm from 'vm';
import * as url from 'url';
import * as path from 'path';
import * as pathreducer from 'pathreducer';
/**
 * This path is determined by path.dirname(require.main.filename). If you want to changed the default value, set a new value to it after require/import.
 */
export var __relativeRoot: string = path.dirname(require.main.filename);
/**
 * Dynamically load and run a script in a try-catch block. This is great for debugging.
 * @param fileName The script file name with relative path. e.g. "../app/testModule". '.js' will be added to the end of the file name.
 * @param directoryName The directory where the script file is located. By default it is the root directory.
 */
export function DynamicRequire(fileName: string, directoryName?: string) {
    try {
        if (!directoryName) directoryName = __relativeRoot;
        console.log('DynamicRequire: ', fileName, ' Base Path: ' + directoryName);
        let required: { [id: number]: any } = {};
        let requiredIndex: number = 0;
        let fullFilename: string = pathreducer.reduce(directoryName + '//' + fileName);
        if (fs.existsSync(fullFilename)) {
            if (fs.statSync(fullFilename).isFile()) {
                let code = '(function (){\ntry{\n\texports = {};\n' +
                    fs.readFileSync(fullFilename).toString()
                        .replace(/require\s*\(\s*[\'"](\.+[\/a-z_\-\s0-9\.]+)[\'"]\s*\)/ig, (capture: string, ...args: any[]) => {
                            let $file = pathreducer.reduce(directoryName + '//' + args[0] + '.js');
                            required[requiredIndex] = DynamicRequire(pathreducer.filename($file), pathreducer.pathname($file));
                            let replacement = '$__required[' + requiredIndex + ']';
                            requiredIndex += 1;
                            return replacement;
                        }) +
                    '\n\treturn exports;\n}\ncatch(ex){\n\tconsole.log("Error:", ex);\n}\n})';
                let context = vm.createContext({
                    console: console,
                    require: require,
                    __dirname: directoryName,
                    __filename: __filename,
                    process: process,
                    $__required: required
                });
                let _script = vm.createScript(code);
                let fn: Function = _script.runInContext(context);
                let exported: any = fn();
                if (exported['__relativeRoot']) exported['__relativeRoot'] = __relativeRoot;
                return exported;
            }
            else {
                console.log('dynamicRequire Error: File not found - ' + fullFilename);
            }
        }
        else {
            console.log('dynamicRequire Error: File not found - ' + fullFilename);
        }
    }
    catch (ex) {
        console.log('dynamicRequire Error: ', ex);
    }
}
interface MiddlewareHandler {
    (req: http.ServerRequest, res: http.ServerResponse, next: Function): any;
}
export function Middleware (req: http.ServerRequest, res: http.ServerResponse, next: Function) {
    let _url: url.Url = url.parse(req.url);
    //console.log(_url);
    
    if (req.url.indexOf('.cgi.js') > -1) {
        let scriptFile = pathreducer.reduce(__relativeRoot + '\/' + _url.pathname);
        console.log('CGI Script:', scriptFile);
        let $directory = pathreducer.pathname(scriptFile);
        if (fs.existsSync(scriptFile)) {
            if (fs.statSync(scriptFile).isFile()) {
                fs.readFile(scriptFile, (err: NodeJS.ErrnoException, data: Buffer) => {
                    let required: { [id: number]: any } = {};
                    let requiredIndex: number = 0;
                    try {

                        let code = '(function (request, response, next){\ntry{\n'
                            + data.toString().replace(/require\s*\(\s*[\'"]\s*\[\s*(\w+)\s*\]\s*[\'"]\s*\)/ig, (capture: string, ...args: any[]) => {
                                return args[0];
                            }).replace(/require\s*\(\s*[\'"](\.+[\/a-z_\-\s0-9\.]+)[\'"]\s*\)/ig, (capture: string, ...args: any[]) => {
                                //console.log('Replacing: ', capture);
                                let $file = pathreducer.reduce($directory + '//' + args[0] + '.js');
                                required[requiredIndex] = DynamicRequire(pathreducer.filename($file), pathreducer.pathname($file));
                                let replacement = '$__required[' + requiredIndex + ']';
                                requiredIndex += 1;
                                return replacement;
                            }) +
                            '\n}\ncatch(ex){\n\tconsole.log("Error:", ex);\n\tresponse.statusCode = 500;\n\tresponse.end(ex.toString()); \n}\n})';
                        //console.log(code);
                        let context = vm.createContext({
                            console: console,
                            require: require,
                            __dirname: $directory,
                            __filename: scriptFile,
                            process: process,
                            $__required: required
                        });
                        let _script = vm.createScript(code);
                        let fn: MiddlewareHandler = _script.runInContext(context);
                        fn(req, res, next);
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                });
            }
            else {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                res.end('Error: The file does not exist in the server.');
            }
        }
        else {
            res.writeHead(500, {
                "Content-Type": "text/plain"
            });
            res.end('Error: The file does not exist in the server.');
        }
        //console.log("route api:", $file);
    }
    else {
        next();
    }
};

//if (module!==undefined) module.exports = exports;