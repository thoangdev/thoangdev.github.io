/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    };

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

    // Modern enhancements and resume download functionality
    initializeModernFeatures();

});

// Modern portfolio enhancements
function initializeModernFeatures() {
    // Add download resume button
    addDownloadResumeButton();
    
    // Add smooth scroll behavior
    initializeSmoothScroll();
    
    // Add intersection observer for animations
    initializeScrollAnimations();
    
    // Add typing animation for lead text
    initializeTypingAnimation();
    
    // Add skills progress animation
    initializeSkillsAnimation();
}

// Download Resume Functionality
function addDownloadResumeButton() {
    const aboutSection = document.querySelector('#about .resume-section-content');
    if (aboutSection && !document.querySelector('.download-resume-btn')) {
        const socialIcons = aboutSection.querySelector('.social-icons');
        
        // Create download button
        const downloadButton = document.createElement('a');
        downloadButton.href = '#';
        downloadButton.className = 'btn btn-primary download-resume-btn me-3 mb-3';
        downloadButton.innerHTML = `
            <i class="fas fa-download me-2"></i>
            Download Resume
        `;
        
        // Add click handler
        downloadButton.addEventListener('click', (e) => {
            e.preventDefault();
            downloadResume();
        });
        
        // Insert before social icons
        if (socialIcons) {
            socialIcons.parentNode.insertBefore(downloadButton, socialIcons);
        }
    }
}

// Resume download function
function downloadResume() {
    // Show loading state
    const btn = document.querySelector('.download-resume-btn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Preparing PDF...';
    btn.disabled = true;
    
    // Check if jsPDF is available, if not load it dynamically
    if (typeof window.jsPDF === 'undefined') {
        loadJsPDF().then(() => {
            generateAndDownloadPDF(btn, originalHTML);
        }).catch(() => {
            // Fallback to text version
            generateTextResume(btn, originalHTML);
        });
    } else {
        generateAndDownloadPDF(btn, originalHTML);
    }
}

// Load jsPDF library dynamically
function loadJsPDF() {
    return new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="jspdf"]')) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
    });
}

// Generate and download PDF
function generateAndDownloadPDF(btn, originalHTML) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set font
        doc.setFont('helvetica');
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(37, 99, 235); // Blue color
        doc.text('TOMMY HOANG', 20, 25);
        
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text('Tech Lead Quality Engineer', 20, 35);
        
        // Contact Info with clickable links
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('New Orleans, LA (Remote) | (504) 453-8178', 20, 45);
        
        // Email link
        doc.setTextColor(37, 99, 235);
        doc.textWithLink('hoangtommyquoc@gmail.com', 20, 52, { url: 'mailto:hoangtommyquoc@gmail.com' });
        
        // LinkedIn and GitHub links
        doc.setTextColor(0, 0, 0);
        doc.text('LinkedIn: ', 20, 59);
        doc.setTextColor(37, 99, 235);
        doc.textWithLink('linkedin.com/in/tommyqhoang', 40, 59, { url: 'https://linkedin.com/in/tommyqhoang' });
        
        doc.setTextColor(0, 0, 0);
        doc.text(' | GitHub: ', 95, 59);
        doc.setTextColor(37, 99, 235);
        doc.textWithLink('github.com/thoangdev', 120, 59, { url: 'https://github.com/thoangdev' });
        
        // Line separator
        doc.setDrawColor(37, 99, 235);
        doc.line(20, 65, 190, 65);
        
        // Professional Summary
        doc.setFontSize(14);
        doc.setTextColor(37, 99, 235);
        doc.text('PROFESSIONAL SUMMARY', 20, 77);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const summaryText = 'Innovative and results-oriented QA leader with 7+ years of experience in test automation, DevSecOps, API validation, and performance/security testing. Proven success driving automation frameworks, CI/CD pipelines, fraud detection systems, and quality-focused release processes. Passionate about scaling test strategies, integrating AI tools, and delivering secure, seamless user experiences.';
        const summaryLines = doc.splitTextToSize(summaryText, 170);
        doc.text(summaryLines, 20, 87);
        
        // Experience Section
        let yPos = 110;
        doc.setFontSize(14);
        doc.setTextColor(37, 99, 235);
        doc.text('PROFESSIONAL EXPERIENCE', 20, yPos);
        yPos += 15;
        
        // Job 1 - Dispel
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Senior QA Engineer - Dispel', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('June 2025 - Present', 130, yPos);
        yPos += 8;
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const job1Points = [
            '• Built modular K6-based performance testing framework with Docker, CI/CD, Grafana, and InfluxDB',
            '• Automated smoke and regression testing across products (STIG, ABB, DSMD) using Robot Framework + Playwright with parallel execution via Pabot',
            '• Integrated OWASP ZAP for security testing with robust data seeding/teardown in PostgreSQL',
            '• Enabled end-to-end visibility with Tuskr reporting, Slack alerts, and full-stack test coverage'
        ];
        
        job1Points.forEach(point => {
            const lines = doc.splitTextToSize(point, 170);
            doc.text(lines, 20, yPos);
            yPos += lines.length * 5;
        });
        yPos += 5;
        
        // Job 2 - Cognizant
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Technical Lead (QA) - Cognizant', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Dec 2023 - June 2025', 130, yPos);
        yPos += 8;
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const job2Points = [
            '• Led fraud payment QA efforts for AT&T DirecTV, ensuring PCI and security compliance',
            '• Owned API test coverage, UI validation, and error-code monitoring using Postman and Zephyr',
            '• Oversaw multiple zero-defect launches by optimizing regression pipelines and test case audits',
            '• Integrated AI-based tools (e.g., Copilot, ChatGPT) to streamline test reviews and documentation'
        ];
        
        job2Points.forEach(point => {
            const lines = doc.splitTextToSize(point, 170);
            doc.text(lines, 20, yPos);
            yPos += lines.length * 5;
        });
        yPos += 5;
        
        // Job 3 - DXC Technology
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Test Manager - DXC Technology', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('May 2022 - Oct 2023', 130, yPos);
        yPos += 8;
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const job3Points = [
            '• Delivered scalable test strategies for TVOD and MDU launches, ensuring streaming reliability',
            '• Automated UI and API test cases to reduce manual test hours by 70%',
            '• Leveraged Docker and CI pipelines for parallel execution and faster feedback loops'
        ];
        
        job3Points.forEach(point => {
            const lines = doc.splitTextToSize(point, 170);
            doc.text(lines, 20, yPos);
            yPos += lines.length * 5;
        });
        yPos += 5;
        
        // Check if we need a new page
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        // Job 4 - insightsoftware
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Automation Engineer - insightsoftware', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Nov 2021 - May 2022', 130, yPos);
        yPos += 8;
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const job4Points = [
            '• Built automated test suites for financial Excel plugins using Ranorex with C#',
            '• Deployed Dockerized environments for scalable cross-platform test scenarios',
            '• Enhanced test coverage for data validation and financial formula accuracy'
        ];
        
        job4Points.forEach(point => {
            const lines = doc.splitTextToSize(point, 170);
            doc.text(lines, 20, yPos);
            yPos += lines.length * 5;
        });
        yPos += 5;
        
        // Job 5 - Dialexa (IBM)
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Quality Engineer - Dialexa (IBM)', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Feb 2021 - Oct 2021', 130, yPos);
        yPos += 8;
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const job5Points = [
            '• Led iOS and Apple Watch QA for glucose monitoring app, validating compliance and reliability',
            '• Conducted data sync testing across mobile/health platforms and built performance benchmarks'
        ];
        
        job5Points.forEach(point => {
            const lines = doc.splitTextToSize(point, 170);
            doc.text(lines, 20, yPos);
            yPos += lines.length * 5;
        });
        yPos += 5;
        
        // Job 6 - Accruent
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Software Engineer in Test - Accruent', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Nov 2018 - Feb 2021', 130, yPos);
        yPos += 8;
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const job6Points = [
            '• Architected CI/CD-ready security and performance test suites',
            '• Built onboarding automation tools to streamline setup and reduce errors',
            '• Conducted continuous regression testing to support fast, stable deployments'
        ];
        
        job6Points.forEach(point => {
            const lines = doc.splitTextToSize(point, 170);
            doc.text(lines, 20, yPos);
            yPos += lines.length * 5;
        });
        yPos += 10;
        
        // Technical Skills
        doc.setFontSize(14);
        doc.setTextColor(37, 99, 235);
        doc.text('TECHNICAL SKILLS', 20, yPos);
        yPos += 15;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const skills = [
            'Automation & Quality: Robot Framework, Playwright, Selenium, Cypress, Appium, Postman, Zephyr, TestRail, Tuskr, Jira, Pabot, K6, JMeter, NeoLoad',
            'Security & Performance: OWASP ZAP, Snyk, API Security, Encryption, Authentication, Firewall Testing, Load/Stress/Soak/Spike Testing',
            'DevOps & CI/CD: Docker, GitHub Actions, Jenkins, AWS, Sentry, Linux, Bash, DevSecOps, InfluxDB, Grafana',
            'Programming & Scripting: Python, JavaScript (Node.js), Java, YAML, C#',
            'Database & Data: PostgreSQL, MySQL, JSON APIs, Data Seeding, Cleanup Utilities',
            'Productivity Tools: Copilot, ChatGPT, AI-assisted Test Planning, Automated Docs'
        ];
        
        skills.forEach(skill => {
            const lines = doc.splitTextToSize(`• ${skill}`, 170);
            doc.text(lines, 20, yPos);
            yPos += lines.length * 6;
        });
        yPos += 5;
        
        // Check if we need a new page for remaining sections
        if (yPos > 220) {
            doc.addPage();
            yPos = 20;
        }
        
        // Certifications
        doc.setFontSize(14);
        doc.setTextColor(37, 99, 235);
        doc.text('CERTIFICATIONS', 20, yPos);
        yPos += 15;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const certs = [
            '• CompTIA Security+',
            '• AWS Certified Cloud Practitioner',
            '• Google Cybersecurity Certificate',
            '• Google Project Management',
            '• Professional Scrum Master (Scrum.org)'
        ];
        
        certs.forEach(cert => {
            doc.text(cert, 20, yPos);
            yPos += 6;
        });
        yPos += 5;
        
        // Education
        doc.setFontSize(14);
        doc.setTextColor(37, 99, 235);
        doc.text('EDUCATION', 20, yPos);
        yPos += 15;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Southern University at New Orleans', 20, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += 6;
        doc.text('Bachelor of Science - Computer Information Systems (Jan 2015 - Dec 2017)', 20, yPos);
        yPos += 10;
        
        // Highlights & Impact
        doc.setFontSize(14);
        doc.setTextColor(37, 99, 235);
        doc.text('HIGHLIGHTS & IMPACT', 20, yPos);
        yPos += 15;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const highlights = [
            '• Launched 5+ major features with near-zero production bugs and full regression coverage',
            '• Reduced manual test time by 70% via cross-product automation and AI-driven test audits',
            '• Prevented payment fraud at scale through proactive security testing for telecom clients',
            '• Built performance testing pipelines from scratch using K6, Docker, and cloud monitoring tools'
        ];
        
        highlights.forEach(highlight => {
            const lines = doc.splitTextToSize(highlight, 170);
            doc.text(lines, 20, yPos);
            yPos += lines.length * 6;
        });
        yPos += 5;
        
        // Leadership & Collaboration
        doc.setFontSize(14);
        doc.setTextColor(37, 99, 235);
        doc.text('LEADERSHIP & COLLABORATION', 20, yPos);
        yPos += 15;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const leadership = [
            '• Mentored junior QA engineers on automation, API, and security testing',
            '• Collaborated with dev/ops/product teams across Agile/Scrum environments',
            '• Led quality-focused strategies that reduced release blockers and improved team velocity'
        ];
        
        leadership.forEach(item => {
            const lines = doc.splitTextToSize(item, 170);
            doc.text(lines, 20, yPos);
            yPos += lines.length * 6;
        });
        yPos += 5;
        
        // GitHub Activity & Projects
        doc.setFontSize(14);
        doc.setTextColor(37, 99, 235);
        doc.text('GITHUB ACTIVITY & PROJECTS', 20, yPos);
        yPos += 15;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Active Developer Profile:', 20, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += 8;
        
        const githubActivity = [
            '• 199+ contributions in the last year, demonstrating consistent coding practice',
            '• Active repositories: Robot Framework automation, Playwright testing, portfolio development',
            '• Primary languages: Python (Robot Framework, test automation), JavaScript (Node.js, web dev)',
            '• Recent projects: dispel_robot_framework, playwright_sample, thoangdev.github.io',
            '• Contributions include: test automation frameworks, security testing, CI/CD pipelines'
        ];
        
        githubActivity.forEach(activity => {
            const lines = doc.splitTextToSize(activity, 170);
            doc.text(lines, 20, yPos);
            yPos += lines.length * 6;
        });
        yPos += 5;
        
        // Add GitHub link
        doc.setTextColor(0, 0, 0);
        doc.text('View live activity: ', 20, yPos);
        doc.setTextColor(37, 99, 235);
        doc.textWithLink('github.com/thoangdev', 60, yPos, { url: 'https://github.com/thoangdev' });
        
        // Download the PDF
        doc.save('Tommy_Hoang_Resume.pdf');
        
        // Reset button and show success
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        showNotification('Complete PDF resume downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('PDF generation failed:', error);
        // Fallback to text version
        generateTextResume(btn, originalHTML);
    }
}

// Fallback text resume generation
function generateTextResume(btn, originalHTML) {
    setTimeout(() => {
        const resumeData = generateResumeData();
        downloadFile(resumeData, 'Tommy_Hoang_Resume.txt');
        
        // Reset button
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        
        // Show success message
        showNotification('Text resume downloaded successfully!', 'success');
    }, 500);
}

// Generate resume data for fallback text version
function generateResumeData() {
    const resumeText = `TOMMY HOANG
Tech Lead Quality Engineer
New Orleans, LA (Remote) | hoangtommyquoc@gmail.com | (504) 453-8178
LinkedIn: linkedin.com/in/tommyqhoang | GitHub: github.com/thoangdev

PROFESSIONAL SUMMARY
Innovative and results-oriented QA leader with 7+ years of experience in test automation, DevSecOps, API validation, and performance/security testing. Proven success driving automation frameworks, CI/CD pipelines, fraud detection systems, and quality-focused release processes. Passionate about scaling test strategies, integrating AI tools, and delivering secure, seamless user experiences.

PROFESSIONAL EXPERIENCE

Senior QA Engineer - Dispel (June 2025 - Present)
• Built modular K6-based performance testing framework with Docker, CI/CD, Grafana, and InfluxDB
• Automated smoke and regression testing across products (STIG, ABB, DSMD) using Robot Framework + Playwright with parallel execution via Pabot
• Integrated OWASP ZAP for security testing with robust data seeding/teardown in PostgreSQL
• Enabled end-to-end visibility with Tuskr reporting, Slack alerts, and full-stack test coverage

Technical Lead (QA) - Cognizant (Dec 2023 - June 2025)
• Led fraud payment QA efforts for AT&T DirecTV, ensuring PCI and security compliance
• Owned API test coverage, UI validation, and error-code monitoring using Postman and Zephyr
• Oversaw multiple zero-defect launches by optimizing regression pipelines and test case audits
• Integrated AI-based tools (e.g., Copilot, ChatGPT) to streamline test reviews and documentation

Test Manager - DXC Technology (May 2022 - Oct 2023)
• Delivered scalable test strategies for TVOD and MDU launches, ensuring streaming reliability
• Automated UI and API test cases to reduce manual test hours by 70%
• Leveraged Docker and CI pipelines for parallel execution and faster feedback loops

Automation Engineer - insightsoftware (Nov 2021 - May 2022)
• Built automated test suites for financial Excel plugins using Ranorex with C#
• Deployed Dockerized environments for scalable cross-platform test scenarios
• Enhanced test coverage for data validation and financial formula accuracy

Quality Engineer - Dialexa (IBM) (Feb 2021 - Oct 2021)
• Led iOS and Apple Watch QA for glucose monitoring app, validating compliance and reliability
• Conducted data sync testing across mobile/health platforms and built performance benchmarks

Software Engineer in Test - Accruent (Nov 2018 - Feb 2021)
• Architected CI/CD-ready security and performance test suites
• Built onboarding automation tools to streamline setup and reduce errors
• Conducted continuous regression testing to support fast, stable deployments

TECHNICAL SKILLS
Automation & Quality: Robot Framework, Playwright, Selenium, Cypress, Appium, Postman, Zephyr, TestRail, Tuskr, Jira, Pabot, K6, JMeter, NeoLoad
Security & Performance: OWASP ZAP, Snyk, API Security, Encryption, Authentication, Firewall Testing, Load/Stress/Soak/Spike Testing
DevOps & CI/CD: Docker, GitHub Actions, Jenkins, AWS, Sentry, Linux, Bash, DevSecOps, InfluxDB, Grafana
Programming & Scripting: Python, JavaScript (Node.js), Java, YAML, C#
Database & Data: PostgreSQL, MySQL, JSON APIs, Data Seeding, Cleanup Utilities
Productivity Tools: Copilot, ChatGPT, AI-assisted Test Planning, Automated Docs

CERTIFICATIONS
• CompTIA Security+
• AWS Certified Cloud Practitioner
• Google Cybersecurity Certificate
• Google Project Management
• Professional Scrum Master (Scrum.org)

EDUCATION
Southern University at New Orleans
Bachelor of Science - Computer Information Systems (Jan 2015 - Dec 2017)

HIGHLIGHTS & IMPACT
• Launched 5+ major features with near-zero production bugs and full regression coverage
• Reduced manual test time by 70% via cross-product automation and AI-driven test audits
• Prevented payment fraud at scale through proactive security testing for telecom clients
• Built performance testing pipelines from scratch using K6, Docker, and cloud monitoring tools

LEADERSHIP & COLLABORATION
• Mentored junior QA engineers on automation, API, and security testing
• Collaborated with dev/ops/product teams across Agile/Scrum environments
• Led quality-focused strategies that reduced release blockers and improved team velocity

GITHUB ACTIVITY & PROJECTS
Active Developer Profile:
• 199+ contributions in the last year, demonstrating consistent coding practice
• Active repositories: Robot Framework automation, Playwright testing, portfolio development
• Primary languages: Python (Robot Framework, test automation), JavaScript (Node.js, web dev)
• Recent projects: dispel_robot_framework, playwright_sample, thoangdev.github.io
• Contributions include: test automation frameworks, security testing, CI/CD pipelines
• View live activity: github.com/thoangdev`;
    
    return new Blob([resumeText], { type: 'text/plain' });
}

// Generic download function
function downloadFile(data, filename) {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Smooth scroll for navigation links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll animations with Intersection Observer
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate skill bars if they exist
                const skillBars = entry.target.querySelectorAll('.skill-bar');
                skillBars.forEach(bar => animateSkillBar(bar));
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section.resume-section').forEach(section => {
        observer.observe(section);
    });
}

// Typing animation for lead text (disabled for better UX)
function initializeTypingAnimation() {
    // Typing animation disabled - text appears immediately for better user experience
    // const leadText = document.querySelector('.lead');
    // if (leadText && !leadText.dataset.typed) {
    //     leadText.dataset.typed = 'true';
    //     const originalText = leadText.textContent;
    //     leadText.textContent = '';
    //     
    //     let i = 0;
    //     const typeWriter = () => {
    //         if (i < originalText.length) {
    //             leadText.textContent += originalText.charAt(i);
    //             i++;
    //             setTimeout(typeWriter, 30);
    //         }
    //     };
    //     
    //     // Start typing animation after a short delay
    //     setTimeout(typeWriter, 500);
    // }
}

// Skills animation
function initializeSkillsAnimation() {
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        // Add progress bars to skill items
        const skillItems = skillsSection.querySelectorAll('.fa-ul li');
        skillItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('skill-item-animate');
        });
    }
}

// Animate skill bar (if you add progress bars later)
function animateSkillBar(skillBar) {
    const progress = skillBar.dataset.progress || 85;
    const progressFill = skillBar.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = '0%';
        setTimeout(() => {
            progressFill.style.width = progress + '%';
        }, 100);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.toast-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `toast-notification toast-${type}`;
    notification.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;
    
    // Mobile-responsive positioning
    const isMobile = window.innerWidth <= 768;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: isMobile ? '10px' : '20px',
        right: isMobile ? '10px' : '20px',
        left: isMobile ? '10px' : 'auto',
        background: type === 'success' ? '#10b981' : '#3b82f6',
        color: 'white',
        padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        zIndex: '9999',
        transform: isMobile ? 'translateY(-100%)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        fontWeight: '500',
        fontSize: isMobile ? '0.9rem' : '1rem',
        textAlign: 'center',
        maxWidth: isMobile ? 'none' : '300px'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = isMobile ? 'translateY(-100%)' : 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals or notifications
        const notifications = document.querySelectorAll('.toast-notification');
        notifications.forEach(notification => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
    }
});

// Add loading animation for page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Initialize scroll progress indicator
    initializeScrollProgress();
    
    // Mobile-specific enhancements
    initializeMobileEnhancements();
});

// Mobile-specific enhancements
function initializeMobileEnhancements() {
    // Improve mobile navigation
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#navbarResponsive');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                const isClickInsideNav = navbarCollapse.contains(e.target) || navbarToggler.contains(e.target);
                if (!isClickInsideNav && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
        
        // Close mobile menu on swipe up
        let startY = 0;
        navbarCollapse.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        
        navbarCollapse.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            const diff = startY - endY;
            
            // If swipe up more than 50px, close menu
            if (diff > 50 && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    }
    
    // Optimize touch scrolling
    if (window.innerWidth <= 991) {
        document.body.style.WebkitOverflowScrolling = 'touch';
    }
    
    // Add mobile viewport height fix for iOS
    const setVhProperty = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVhProperty();
    window.addEventListener('resize', setVhProperty);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVhProperty, 100);
    });
}

// Scroll progress indicator
function initializeScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    Object.assign(progressBar.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '0%',
        height: '3px',
        background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
        zIndex: '10000',
        transition: 'width 0.1s ease'
    });
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}
