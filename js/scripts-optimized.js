/*!
* Optimized Resume Website Scripts
* Simplified for better performance
*/

window.addEventListener('DOMContentLoaded', event => {
    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Initialize performance-optimized features
    initializeOptimizedFeatures();
});

// Optimized portfolio enhancements
function initializeOptimizedFeatures() {
    // Add smooth scroll behavior
    initializeSmoothScroll();
    
    // Add intersection observer for animations (lightweight)
    initializeScrollAnimations();
    
    // Simple download functionality
    setupDownloadButton();
}

// Smooth scrolling for navigation links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Lightweight scroll animations using Intersection Observer
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Observe sections for fade-in animation
    document.querySelectorAll('.resume-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
}

// Simple download button setup
function setupDownloadButton() {
    const downloadBtn = document.querySelector('.download-resume-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Opening PDF Generator...';
            this.disabled = true;
            
            // Open the PDF generator page with access parameter
            const pdfWindow = window.open('assets/pdf-generator.html?access=resume', '_blank');
            pdfWindow.focus();
            
            // Reset button after a short delay
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check me-2"></i>PDF Generator Opened!';
                this.style.backgroundColor = '#28a745';
                this.disabled = false;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.backgroundColor = '';
                }, 3000);
            }, 500);
        });
    }
}
