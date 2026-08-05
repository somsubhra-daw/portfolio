// ==========================================================================
// Interactive Portfolio Scripts
// ==========================================================================

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
});
