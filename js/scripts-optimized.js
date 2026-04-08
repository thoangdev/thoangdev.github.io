/*!
 * Tommy Hoang Portfolio — Theme Scripts
 * Mobile-first: bottom tab bar + More drawer + section spy
 */

(function () {
    'use strict';

    /* -------------------------------------------------------
       NAV: scroll class + active section spy
       (Drives both top nav links AND bottom tab items)
    ------------------------------------------------------- */
    function initNav() {
        const nav      = document.getElementById('topNav');
        const links    = document.querySelectorAll('.nav-menu .nav-link');
        const tabItems = document.querySelectorAll('.bottom-tab-bar .tab-item[data-section]');
        const moreBtn  = document.querySelector('.tab-more-btn');

        // Scroll: add .scrolled class for glass elevation
        if (nav) {
            const onScroll = () => {
                nav.classList.toggle('scrolled', window.scrollY > 20);
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }

        // Section spy — highlight nav links and bottom tab items
        const sections = Array.from(document.querySelectorAll('section[id], footer[id]'));
        if (!sections.length) return;

        // Use the actual rendered nav height (accounts for safe-area-inset-top on iOS notch)
        const navHeight = nav ? nav.getBoundingClientRect().height : 64;

        // Sections that map to the "More" tab
        const moreSectionIds = new Set(['books', 'testimonials', 'interests', 'awards', 'contact']);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const id = entry.target.id;

                    // Update top nav links
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        link.classList.toggle('active', href === `#${id}`);
                    });

                    // Update bottom tab items (direct section match)
                    tabItems.forEach(tab => {
                        tab.classList.toggle('active', tab.dataset.section === id);
                    });

                    // Update "More" button for overflow sections
                    if (moreBtn) {
                        moreBtn.classList.toggle('active', moreSectionIds.has(id));
                    }
                });
            },
            {
                rootMargin: `-${navHeight}px 0px -60% 0px`,
                threshold: 0,
            }
        );

        sections.forEach(s => observer.observe(s));
    }

    /* -------------------------------------------------------
       BOTTOM TAB BAR: More drawer open / close
    ------------------------------------------------------- */
    function initBottomTabs() {
        const moreBtn   = document.querySelector('.tab-more-btn');
        const drawer    = document.getElementById('moreDrawer');
        const backdrop  = document.getElementById('moreDrawerBackdrop');

        if (!moreBtn || !drawer || !backdrop) return;

        let isOpen = false;

        function openDrawer() {
            isOpen = true;
            drawer.classList.add('open');
            backdrop.classList.add('open');
            moreBtn.setAttribute('aria-expanded', 'true');
            drawer.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeDrawer() {
            isOpen = false;
            drawer.classList.remove('open');
            backdrop.classList.remove('open');
            moreBtn.setAttribute('aria-expanded', 'false');
            drawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        moreBtn.addEventListener('click', () => {
            isOpen ? closeDrawer() : openDrawer();
        });

        // Tap backdrop to close
        backdrop.addEventListener('click', closeDrawer);

        // Close on any link/CTA click inside drawer
        drawer.querySelectorAll('.drawer-link, .drawer-resume-btn, .drawer-contact-link').forEach(el => {
            el.addEventListener('click', closeDrawer);
        });

        // Swipe down to close (touch)
        let touchStartY = 0;
        drawer.addEventListener('touchstart', e => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        drawer.addEventListener('touchend', e => {
            const delta = e.changedTouches[0].clientY - touchStartY;
            if (delta > 60) closeDrawer();
        }, { passive: true });

        // Escape key to close
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && isOpen) closeDrawer();
        });
    }

    /* -------------------------------------------------------
       SMOOTH SCROLL (offset-aware anchor links)
       Reads the actual rendered nav height (includes safe-area-inset-top
       on notched iOS devices) instead of a fixed CSS variable.
    ------------------------------------------------------- */
    function initSmoothScroll() {
        const topNav = document.getElementById('topNav');
        const NAV_H  = () => topNav ? topNav.getBoundingClientRect().height : 64;

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && href.length > 1 && href !== '#') {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const top = target.getBoundingClientRect().top + window.scrollY - NAV_H() - 8;
                        window.scrollTo({ top, behavior: 'smooth' });
                    }
                }
            });
        });
    }

    /* -------------------------------------------------------
       SCROLL REVEAL (.reveal elements)
    ------------------------------------------------------- */
    function initReveal() {
        const elements = document.querySelectorAll('.reveal');
        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08 }
        );

        elements.forEach(el => observer.observe(el));
    }

    /* -------------------------------------------------------
       BOOT
    ------------------------------------------------------- */
    function boot() {
        initNav();
        initBottomTabs();
        initSmoothScroll();
        initReveal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();
