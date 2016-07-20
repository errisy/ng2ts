"use strict";
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
var rpc_1 = require('./rpc');
var Demo = (function () {
    function Demo($_Angular2HttpClient) {
        this.$_Angular2HttpClient = $_Angular2HttpClient;
    }
    Demo.prototype.Dogs = function () {
        return this.$_Angular2HttpClient.post('/rpc/demo.cgi.js?Demo-Dogs', []).map(rpc_1.Converter.convertJsonResponse);
    };
    Demo.prototype.test = function (jack, sam, jason) {
        return this.$_Angular2HttpClient.post('/rpc/demo.cgi.js?Demo-test', [jack, sam, jason]).map(rpc_1.Converter.convertStringResponse);
    };
    Demo.prototype.tom = function () {
        return this.$_Angular2HttpClient.post('/rpc/demo.cgi.js?Demo-tom', []).map(rpc_1.Converter.convertJsonResponse);
    };
    Demo.prototype.jerry = function () {
        return this.$_Angular2HttpClient.post('/rpc/demo.cgi.js?Demo-jerry', []).map(rpc_1.Converter.convertBooleanResponse);
    };
    return Demo;
}());
exports.Demo = Demo;
//# sourceMappingURL=demo.client.js.map