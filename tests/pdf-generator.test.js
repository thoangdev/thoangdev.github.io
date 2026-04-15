'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const pdfGenerator = require('../js/pdf-generator.js');
const { FakeDocument, FakeElement } = require('./helpers/dom-fakes.js');

test('isIntentionalResumeAccess accepts explicit, referrer, and hash-based access', function () {
    assert.equal(pdfGenerator.isIntentionalResumeAccess({ search: '?access=resume', referrer: '', hash: '' }), true);
    assert.equal(pdfGenerator.isIntentionalResumeAccess({ search: '', referrer: 'https://thoangdev.github.io/', hash: '' }), true);
    assert.equal(pdfGenerator.isIntentionalResumeAccess({ search: '', referrer: '', hash: '#resume-pdf' }), true);
    assert.equal(pdfGenerator.isIntentionalResumeAccess({ search: '', referrer: '', hash: '' }), false);
});

test('buildResumeFilename uses zero-padded ISO date segments', function () {
    const date = new Date(2026, 3, 5, 12, 0, 0);
    assert.equal(pdfGenerator.buildResumeFilename(date), 'Tommy_Hoang_Resume_2026-04-05');
});

test('handlePdfGeneratorLoad redirects accidental visits and titles intentional visits', function () {
    const redirectedWindow = {
        location: {
            search: '',
            hash: '',
            replaceUrl: null,
            replace: function (url) {
                this.replaceUrl = url;
            }
        },
        history: { length: 2 }
    };
    const redirectedDocument = new FakeDocument({ referrer: '' });

    const redirected = pdfGenerator.handlePdfGeneratorLoad(redirectedDocument, redirectedWindow, function () {
        return new Date(2026, 3, 15, 12, 0, 0);
    });

    assert.equal(redirected.redirected, true);
    assert.equal(redirectedWindow.location.replaceUrl, 'https://thoangdev.github.io/');

    const normalWindow = {
        location: {
            search: '?access=resume',
            hash: '',
            replace: function () {
                throw new Error('should not redirect');
            }
        },
        history: { length: 1 }
    };
    const normalDocument = new FakeDocument({ referrer: '' });

    const normal = pdfGenerator.handlePdfGeneratorLoad(normalDocument, normalWindow, function () {
        return new Date(2026, 3, 15, 12, 0, 0);
    });

    assert.equal(normal.redirected, false);
    assert.equal(normalDocument.title, 'Tommy_Hoang_Resume_2026-04-15');
});

test('openAndPrint focuses popup or falls back to same-tab navigation', function () {
    const popup = { wasFocused: false, focus: function () { this.wasFocused = true; } };
    const popupWindow = {
        location: { href: '' },
        open: function () {
            return popup;
        }
    };

    assert.equal(pdfGenerator.openAndPrint(popupWindow), true);
    assert.equal(popup.wasFocused, true);

    const fallbackWindow = {
        location: { href: '' },
        open: function () {
            return null;
        }
    };

    assert.equal(pdfGenerator.openAndPrint(fallbackWindow), false);
    assert.equal(fallbackWindow.location.href, 'resume-pdf.html?print=true');
});

test('initPdfGenerator binds the button click to print flow', function () {
    const button = new FakeElement();
    const doc = new FakeDocument({
        elementsById: { openResumeBtn: button },
        readyState: 'complete'
    });

    let opened = 0;
    const win = {
        location: {
            search: '?access=resume',
            hash: '',
            href: '',
            replace: function () {}
        },
        history: { length: 1 },
        open: function () {
            opened += 1;
            return { focus: function () {} };
        }
    };

    pdfGenerator.initPdfGenerator(doc, win, {
        createDate: function () {
            return new Date(2026, 3, 15, 12, 0, 0);
        }
    });

    button.click();
    assert.equal(opened, 1);
    assert.equal(doc.title, 'Tommy_Hoang_Resume_2026-04-15');
});