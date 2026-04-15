(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
        return;
    }

    root.TommyPortfolioResumePrint = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var globalRoot = typeof globalThis !== 'undefined' ? globalThis : this;

    function shouldAutoPrint(search) {
        return typeof search === 'string' && search.indexOf('print=true') !== -1;
    }

    function registerPrintOnLoad(win) {
        if (win.document && win.document.readyState === 'complete') {
            win.print();
            return 'printed';
        }

        win.addEventListener('load', function () {
            win.print();
        }, { once: true });
        return 'deferred';
    }

    function initResumePrint(win) {
        if (!shouldAutoPrint(win.location.search)) {
            return { enabled: false, mode: 'idle' };
        }

        return {
            enabled: true,
            mode: registerPrintOnLoad(win)
        };
    }

    function autoInit() {
        if (!globalRoot.window && !globalRoot.location) return;

        var win = globalRoot.window || globalRoot;
        initResumePrint(win);
    }

    autoInit();

    return {
        initResumePrint: initResumePrint,
        registerPrintOnLoad: registerPrintOnLoad,
        shouldAutoPrint: shouldAutoPrint
    };
});