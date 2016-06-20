"use strict";
(function invoke(req, res, next) {
    var _path = './api' + req.url;
    var jf = require("jf");
    console.log('nodeJS', jf.nodeJS);
    console.log('test value: ', jf.testValue);
    var fs = jf.nodeJS.fs;
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    console.log('api invoked', _path, fs.existsSync(_path));
    res.end(req.method + 'there is another file let me know we can test this one.');
});
//# sourceMappingURL=test.js.map