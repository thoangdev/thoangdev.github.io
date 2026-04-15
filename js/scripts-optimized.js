/*!
 * Tommy Hoang Portfolio — Theme Scripts
 * Mobile-first: bottom tab bar + More drawer + section spy
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
        return;
    }

    root.TommyPortfolioThemeScripts = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var globalRoot = typeof globalThis !== 'undefined' ? globalThis : this;

    var MORE_SECTION_IDS = ['books', 'testimonials', 'interests', 'awards', 'contact'];

    function getNavHeight(nav) {
        return nav ? nav.getBoundingClientRect().height : 64;
    }

    function applyActiveSectionState(id, links, tabItems, moreButton, moreSectionIds) {
        links.forEach(function (link) {
            var href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + id);
        });

        tabItems.forEach(function (tab) {
            tab.classList.toggle('active', tab.dataset.section === id);
        });

        if (moreButton) {
            moreButton.classList.toggle('active', moreSectionIds.has(id));
        }
    }

    function shouldCloseDrawerOnSwipe(deltaY) {
        return deltaY > 60;
    }

    function computeScrollTarget(target, scrollY, navHeight) {
        return target.getBoundingClientRect().top + scrollY - navHeight - 8;
    }

    function initNav(doc, win, ObserverCtor) {
        var nav = doc.getElementById('topNav');
        var links = Array.prototype.slice.call(doc.querySelectorAll('.nav-menu .nav-link'));
        var tabItems = Array.prototype.slice.call(doc.querySelectorAll('.bottom-tab-bar .tab-item[data-section]'));
        var moreButton = doc.querySelector('.tab-more-btn');

        if (nav) {
            var onScroll = function () {
                nav.classList.toggle('scrolled', win.scrollY > 20);
            };

            win.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }

        var sections = Array.prototype.slice.call(doc.querySelectorAll('section[id], footer[id]'));
        if (!sections.length) return null;

        var Observer = ObserverCtor || win.IntersectionObserver;
        if (typeof Observer !== 'function') return null;

        var moreSectionIds = new Set(MORE_SECTION_IDS);
        var navHeight = getNavHeight(nav);
        var observer = new Observer(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                applyActiveSectionState(entry.target.id, links, tabItems, moreButton, moreSectionIds);
            });
        }, {
            rootMargin: '-' + navHeight + 'px 0px -60% 0px',
            threshold: 0
        });

        sections.forEach(function (section) {
            observer.observe(section);
        });

        return observer;
    }

    function initBottomTabs(doc) {
        var moreButton = doc.querySelector('.tab-more-btn');
        var drawer = doc.getElementById('moreDrawer');
        var backdrop = doc.getElementById('moreDrawerBackdrop');

        if (!moreButton || !drawer || !backdrop) return null;

        var touchStartY = 0;
        var isOpen = false;

        function openDrawer() {
            isOpen = true;
            drawer.classList.add('open');
            backdrop.classList.add('open');
            moreButton.setAttribute('aria-expanded', 'true');
            drawer.setAttribute('aria-hidden', 'false');
            doc.body.style.overflow = 'hidden';
        }

        function closeDrawer() {
            isOpen = false;
            drawer.classList.remove('open');
            backdrop.classList.remove('open');
            moreButton.setAttribute('aria-expanded', 'false');
            drawer.setAttribute('aria-hidden', 'true');
            doc.body.style.overflow = '';
        }

        moreButton.addEventListener('click', function () {
            if (isOpen) {
                closeDrawer();
                return;
            }

            openDrawer();
        });

        backdrop.addEventListener('click', closeDrawer);
        Array.prototype.slice.call(drawer.querySelectorAll('.drawer-link, .drawer-resume-btn, .drawer-contact-link')).forEach(function (element) {
            element.addEventListener('click', closeDrawer);
        });

        drawer.addEventListener('touchstart', function (event) {
            touchStartY = event.touches[0].clientY;
        }, { passive: true });
        drawer.addEventListener('touchend', function (event) {
            var delta = event.changedTouches[0].clientY - touchStartY;
            if (shouldCloseDrawerOnSwipe(delta)) {
                closeDrawer();
            }
        }, { passive: true });

        doc.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && isOpen) {
                closeDrawer();
            }
        });

        return {
            closeDrawer: closeDrawer,
            isOpen: function () { return isOpen; },
            openDrawer: openDrawer
        };
    }

    function initSmoothScroll(doc, win) {
        var topNav = doc.getElementById('topNav');

        Array.prototype.slice.call(doc.querySelectorAll('a[href^="#"]')).forEach(function (anchor) {
            anchor.addEventListener('click', function (event) {
                var href = this.getAttribute('href');
                if (!href || href.length <= 1 || href === '#') return;

                var target = doc.querySelector(href);
                if (!target) return;

                event.preventDefault();
                win.scrollTo({
                    top: computeScrollTarget(target, win.scrollY, getNavHeight(topNav)),
                    behavior: 'smooth'
                });
            });
        });
    }

    function initReveal(doc, ObserverCtor) {
        var elements = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));
        if (!elements.length) return null;

        var Observer = ObserverCtor || (globalRoot.window && globalRoot.window.IntersectionObserver);
        if (typeof Observer !== 'function') return null;

        var observer = new Observer(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.08 });

        elements.forEach(function (element) {
            observer.observe(element);
        });

        return observer;
    }

    function boot(win, doc) {
        initNav(doc, win);
        initBottomTabs(doc);
        initSmoothScroll(doc, win);
        initReveal(doc);
    }

    function autoBoot() {
        if (!globalRoot.document || !globalRoot.window) return;

        if (globalRoot.document.readyState === 'loading') {
            globalRoot.document.addEventListener('DOMContentLoaded', function () {
                boot(globalRoot.window, globalRoot.document);
            });
            return;
        }

        boot(globalRoot.window, globalRoot.document);
    }

    autoBoot();

    return {
        MORE_SECTION_IDS: MORE_SECTION_IDS,
        applyActiveSectionState: applyActiveSectionState,
        boot: boot,
        computeScrollTarget: computeScrollTarget,
        getNavHeight: getNavHeight,
        initBottomTabs: initBottomTabs,
        initNav: initNav,
        initReveal: initReveal,
        initSmoothScroll: initSmoothScroll,
        shouldCloseDrawerOnSwipe: shouldCloseDrawerOnSwipe
    };
});
