'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const themeScripts = require('../js/scripts-optimized.js');
const { FakeDocument, FakeElement, createEvent } = require('./helpers/dom-fakes.js');

test('applyActiveSectionState keeps more button active only for overflow sections', function () {
    const aboutLink = new FakeElement({ attributes: { href: '#about' }, classes: ['active'] });
    const booksLink = new FakeElement({ attributes: { href: '#books' } });
    const aboutTab = new FakeElement({ dataset: { section: 'about' }, classes: ['active'] });
    const booksTab = new FakeElement({ dataset: { section: 'books' } });
    const moreButton = new FakeElement();
    const moreIds = new Set(themeScripts.MORE_SECTION_IDS);

    themeScripts.applyActiveSectionState('books', [aboutLink, booksLink], [aboutTab, booksTab], moreButton, moreIds);

    assert.equal(aboutLink.classList.contains('active'), false);
    assert.equal(booksLink.classList.contains('active'), true);
    assert.equal(aboutTab.classList.contains('active'), false);
    assert.equal(booksTab.classList.contains('active'), true);
    assert.equal(moreButton.classList.contains('active'), true);
});

test('initBottomTabs opens and closes the drawer with click, backdrop, swipe, and escape', function () {
    const moreButton = new FakeElement({ attributes: { 'aria-expanded': 'false' } });
    const drawerLink = new FakeElement();
    const drawer = new FakeElement({
        attributes: { 'aria-hidden': 'true' },
        querySelectorAllMap: {
            '.drawer-link, .drawer-resume-btn, .drawer-contact-link': [drawerLink]
        }
    });
    const backdrop = new FakeElement();
    const doc = new FakeDocument({
        body: { style: {} },
        elementsById: {
            moreDrawer: drawer,
            moreDrawerBackdrop: backdrop
        },
        querySelectorMap: {
            '.tab-more-btn': moreButton
        }
    });

    const controls = themeScripts.initBottomTabs(doc);

    moreButton.click();
    assert.equal(controls.isOpen(), true);
    assert.equal(drawer.classList.contains('open'), true);
    assert.equal(backdrop.classList.contains('open'), true);
    assert.equal(moreButton.getAttribute('aria-expanded'), 'true');
    assert.equal(drawer.getAttribute('aria-hidden'), 'false');
    assert.equal(doc.body.style.overflow, 'hidden');

    drawer.dispatchEvent('touchstart', { touches: [{ clientY: 10 }] });
    drawer.dispatchEvent('touchend', { changedTouches: [{ clientY: 90 }] });
    assert.equal(controls.isOpen(), false);

    moreButton.click();
    doc.dispatchEvent('keydown', { key: 'Escape' });
    assert.equal(controls.isOpen(), false);

    moreButton.click();
    backdrop.click();
    assert.equal(controls.isOpen(), false);

    moreButton.click();
    drawerLink.click();
    assert.equal(controls.isOpen(), false);
    assert.equal(doc.body.style.overflow, '');
});

test('computeScrollTarget includes nav offset and smooth scroll handles missing targets safely', function () {
    const target = new FakeElement({ rect: { top: 120, height: 0 } });
    assert.equal(themeScripts.computeScrollTarget(target, 300, 72), 340);

    const nav = new FakeElement({ rect: { top: 0, height: 72 } });
    const anchor = new FakeElement({ attributes: { href: '#projects' } });
    const missingAnchor = new FakeElement({ attributes: { href: '#missing' } });
    const emptyAnchor = new FakeElement({ attributes: { href: '#' } });
    const doc = new FakeDocument({
        elementsById: { topNav: nav },
        querySelectorMap: { '#projects': target },
        querySelectorAllMap: { 'a[href^="#"]': [anchor, missingAnchor, emptyAnchor] }
    });
    const scrollCalls = [];
    const win = {
        scrollY: 300,
        scrollTo: function (options) {
            scrollCalls.push(options);
        }
    };

    themeScripts.initSmoothScroll(doc, win);

    const clickEvent = createEvent();
    anchor.click(clickEvent);
    assert.equal(clickEvent.defaultPrevented, true);
    assert.deepEqual(scrollCalls[0], { top: 340, behavior: 'smooth' });

    missingAnchor.click(createEvent());
    emptyAnchor.click(createEvent());
    assert.equal(scrollCalls.length, 1);
});

test('initReveal marks visible entries and unobserves them', function () {
    const revealOne = new FakeElement();
    const revealTwo = new FakeElement();
    const observed = [];
    const unobserved = [];
    let callback;

    function FakeObserver(observerCallback) {
        callback = observerCallback;
        this.observe = function (element) {
            observed.push(element);
        };
        this.unobserve = function (element) {
            unobserved.push(element);
        };
    }

    const doc = new FakeDocument({
        querySelectorAllMap: { '.reveal': [revealOne, revealTwo] }
    });

    themeScripts.initReveal(doc, FakeObserver);
    callback([
        { isIntersecting: true, target: revealOne },
        { isIntersecting: false, target: revealTwo }
    ]);

    assert.deepEqual(observed, [revealOne, revealTwo]);
    assert.equal(revealOne.classList.contains('visible'), true);
    assert.equal(revealTwo.classList.contains('visible'), false);
    assert.deepEqual(unobserved, [revealOne]);
});