// Portfolio Scripts

document.addEventListener('DOMContentLoaded', () => {

    // 1. Theme Switcher (Dark / Light)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Check saved local theme preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-sun';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
                localStorage.setItem('portfolio-theme', 'light');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
                localStorage.setItem('portfolio-theme', 'dark');
            }
        });
    }

    // 2. Dropdown Menu Trigger Handler
    const dropdownTrigger = document.getElementById('dropdown-trigger');
    const dropdownPopup = document.getElementById('dropdown-popup');

    if (dropdownTrigger && dropdownPopup) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownPopup.classList.toggle('active');
            dropdownTrigger.classList.toggle('active');
        });

        // Close dropdown when clicking any item
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                dropdownPopup.classList.remove('active');
                dropdownTrigger.classList.remove('active');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownPopup.contains(e.target) && !dropdownTrigger.contains(e.target)) {
                dropdownPopup.classList.remove('active');
                dropdownTrigger.classList.remove('active');
            }
        });
    }

    // 3. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 5. Contact Form Handler (Direct Email to somsubhradaw@gmail.com)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            const subjectText = `Portfolio Contact Message from ${name}`;
            const bodyText = `Hi Somsubhra,\n\nYou have received a new message from your portfolio website:\n\nName: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`;

            const subject = encodeURIComponent(subjectText);
            const body = encodeURIComponent(bodyText);

            // Direct mailto URL targeted to somsubhradaw@gmail.com
            const mailtoUrl = `mailto:somsubhradaw@gmail.com?subject=${subject}&body=${body}`;

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane fa-spin"></i> Opening Email App...';

            formStatus.style.color = '#10b981';
            formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Launching your email app to send message to <strong>somsubhradaw@gmail.com</strong>...';

            setTimeout(() => {
                window.location.href = mailtoUrl;
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                contactForm.reset();
            }, 800);
        });
    }

    // 6. Global Media Privacy & Anti-Download Protection System
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG' || e.target.classList.contains('security-shield-overlay') || e.target.classList.contains('protected-media') || e.target.closest('.photo-modal')) {
            e.preventDefault();
            return false;
        }
    });

    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG' || e.target.classList.contains('protected-media')) {
            e.preventDefault();
            return false;
        }
    });

    // Prevent Save & Inspect keyboard shortcuts for media privacy
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'S' || e.key === 'U')) || e.key === 'F12') {
            const photoModal = document.getElementById('photo-modal');
            if (photoModal && photoModal.classList.contains('active')) {
                e.preventDefault();
                return false;
            }
        }
    });

    // 7. Automated Cloud Visitor Counter (GitHub Pages 24-Hour IP Deduplicated)
    const visitorCountEl = document.getElementById('visitor-count');
    if (visitorCountEl) {
        const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
        const now = Date.now();
        const lastVisitLog = JSON.parse(localStorage.getItem('visitor_ip_log') || '{}');

        // Step A: Fetch public IP for 24-hour rate limit check
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(ipData => {
                const userIp = ipData.ip || 'visitor_ip';
                const lastVisitTime = lastVisitLog[userIp] || 0;
                const isNewUniqueVisit = (now - lastVisitTime > TWENTY_FOUR_HOURS_MS);

                // If hosted locally or backend endpoint available
                fetch('/api/visit')
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.count) {
                            visitorCountEl.textContent = Number(data.count).toLocaleString();
                        }
                    })
                    .catch(() => {
                        // GitHub Pages Automated Cloud Counter Persistence
                        const cloudApiUrl = isNewUniqueVisit 
                            ? 'https://api.counterapi.dev/v1/somsubhra-daw-portfolio/unique_views/up'
                            : 'https://api.counterapi.dev/v1/somsubhra-daw-portfolio/unique_views';

                        fetch(cloudApiUrl)
                            .then(res => res.json())
                            .then(cloudData => {
                                if (isNewUniqueVisit) {
                                    lastVisitLog[userIp] = now;
                                    localStorage.setItem('visitor_ip_log', JSON.stringify(lastVisitLog));
                                }
                                const count = (cloudData && cloudData.count) ? cloudData.count : 1;
                                localStorage.setItem('portfolio_unique_views', count.toString());
                                visitorCountEl.textContent = Number(count).toLocaleString();
                            })
                            .catch(() => {
                                // Fallback storage
                                let localCount = parseInt(localStorage.getItem('portfolio_unique_views') || '1', 10);
                                if (isNewUniqueVisit) {
                                    localCount += 1;
                                    lastVisitLog[userIp] = now;
                                    localStorage.setItem('visitor_ip_log', JSON.stringify(lastVisitLog));
                                    localStorage.setItem('portfolio_unique_views', localCount.toString());
                                }
                                visitorCountEl.textContent = localCount.toLocaleString();
                            });
                    });
            })
            .catch(() => {
                let localCount = parseInt(localStorage.getItem('portfolio_unique_views') || '1', 10);
                visitorCountEl.textContent = localCount.toLocaleString();
            });
    }
});
