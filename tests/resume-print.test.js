'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const resumePrint = require('../js/resume-print.js');

test('shouldAutoPrint only enables print mode for the expected query flag', function () {
    assert.equal(resumePrint.shouldAutoPrint('?print=true'), true);
    assert.equal(resumePrint.shouldAutoPrint('?foo=bar&print=true'), true);
    assert.equal(resumePrint.shouldAutoPrint('?print=false'), false);
    assert.equal(resumePrint.shouldAutoPrint(''), false);
});

test('registerPrintOnLoad defers printing until load when the document is not ready', function () {
    let printCalls = 0;
    let loadHandler = null;
    const win = {
        document: { readyState: 'interactive' },
        addEventListener: function (eventName, handler, options) {
            assert.equal(eventName, 'load');
            assert.deepEqual(options, { once: true });
            loadHandler = handler;
        },
        print: function () {
            printCalls += 1;
        }
    };

    const mode = resumePrint.registerPrintOnLoad(win);

    assert.equal(mode, 'deferred');
    assert.equal(printCalls, 0);
    loadHandler();
    assert.equal(printCalls, 1);
});

test('registerPrintOnLoad prints immediately when the document is already complete', function () {
    let printCalls = 0;
    const win = {
        document: { readyState: 'complete' },
        addEventListener: function () {
            throw new Error('load handler should not be registered');
        },
        print: function () {
            printCalls += 1;
        }
    };

    const mode = resumePrint.registerPrintOnLoad(win);

    assert.equal(mode, 'printed');
    assert.equal(printCalls, 1);
});

test('initResumePrint remains idle unless print mode is requested', function () {
    const idleWindow = {
        location: { search: '?access=resume' },
        document: { readyState: 'interactive' },
        addEventListener: function () {
            throw new Error('should not register load listener');
        },
        print: function () {
            throw new Error('should not print');
        }
    };

    assert.deepEqual(resumePrint.initResumePrint(idleWindow), {
        enabled: false,
        mode: 'idle'
    });
});

test('initResumePrint enables print mode when requested', function () {
    let registered = false;
    const win = {
        location: { search: '?print=true' },
        document: { readyState: 'interactive' },
        addEventListener: function () {
            registered = true;
        },
        print: function () {}
    };

    const result = resumePrint.initResumePrint(win);

    assert.equal(registered, true);
    assert.deepEqual(result, {
        enabled: true,
        mode: 'deferred'
    });
});