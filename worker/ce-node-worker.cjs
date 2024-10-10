'use strict';

var worker_threads = require('worker_threads');
var path = require('path');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);

class ProcessingListener {
    constructor(context) {
        this.context = context;
    }
    getContext() {
        return this.context;
    }
    onUpdate(data) {
        worker_threads.parentPort === null || worker_threads.parentPort === void 0 ? void 0 : worker_threads.parentPort.postMessage({
            type: "UPDATE",
            data
        });
    }
    onError(err) {
        worker_threads.parentPort === null || worker_threads.parentPort === void 0 ? void 0 : worker_threads.parentPort.postMessage({
            type: "ERROR",
            data: {
                message: err.message,
                status: "ERROR"
            }
        });
    }
    onDone(data) {
        worker_threads.parentPort === null || worker_threads.parentPort === void 0 ? void 0 : worker_threads.parentPort.postMessage({
            type: "DONE",
            data: Object.assign(Object.assign({}, data), { status: "DONE" })
        });
    }
}

const { task } = require(path__namespace.resolve(__dirname, worker_threads.workerData.path));
task(new ProcessingListener(worker_threads.workerData.context));
