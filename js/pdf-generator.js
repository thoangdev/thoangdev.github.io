(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
        return;
    }

    root.TommyPortfolioPdfGenerator = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var globalRoot = typeof globalThis !== 'undefined' ? globalThis : this;

    function isIntentionalResumeAccess(context) {
        var params = new URLSearchParams(context.search || '');
        var referrer = context.referrer || '';

        return params.get('access') === 'resume'
            || referrer.indexOf('thoangdev.github.io') !== -1
            || context.hash === '#resume-pdf';
    }

    function shouldRedirectPdfGenerator(context) {
        return !isIntentionalResumeAccess(context) && context.historyLength > 1;
    }

    function buildResumeFilename(date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        return 'Tommy_Hoang_Resume_' + year + '-' + month + '-' + day;
    }

    function openAndPrint(win) {
        var printWindow = win.open('resume-pdf.html?print=true', '_blank');
        if (printWindow) {
            printWindow.focus();
            return true;
        }

        win.location.href = 'resume-pdf.html?print=true';
        return false;
    }

    function handlePdfGeneratorLoad(doc, win, createDate) {
        var context = {
            search: win.location.search,
            referrer: doc.referrer,
            hash: win.location.hash,
            historyLength: win.history.length
        };

        if (shouldRedirectPdfGenerator(context)) {
            win.location.replace('https://thoangdev.github.io/');
            return { redirected: true };
        }

        doc.title = buildResumeFilename(createDate());
        return { redirected: false };
    }

    function initPdfGenerator(doc, win, options) {
        options = options || {};
        var createDate = options.createDate || function () { return new Date(); };
        var button = doc.getElementById('openResumeBtn');

        if (button) {
            button.addEventListener('click', function () {
                openAndPrint(win);
            });
        }

        if (doc.readyState === 'loading') {
            doc.addEventListener('DOMContentLoaded', function () {
                handlePdfGeneratorLoad(doc, win, createDate);
            });
            return;
        }

        handlePdfGeneratorLoad(doc, win, createDate);
    }

    function autoInit() {
        if (!globalRoot.document || !globalRoot.window) return;
        initPdfGenerator(globalRoot.document, globalRoot.window);
    }

    autoInit();

    return {
        buildResumeFilename: buildResumeFilename,
        handlePdfGeneratorLoad: handlePdfGeneratorLoad,
        initPdfGenerator: initPdfGenerator,
        isIntentionalResumeAccess: isIntentionalResumeAccess,
        openAndPrint: openAndPrint,
        shouldRedirectPdfGenerator: shouldRedirectPdfGenerator
    };
});