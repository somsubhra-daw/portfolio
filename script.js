function id(name) { return document.getElementById(name); }

document.addEventListener('DOMContentLoaded', () => {

    // 1. Subtle Architectural Grid Overlay Canvas (Reflow-Free ResizeObserver)
    const canvas = id('hero-grid-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: true });
        let width = 0;
        let height = 0;

        function drawGrid() {
            if (!width || !height) return;
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;

            const gridSize = 40;
            for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y <= height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        }

        if ('ResizeObserver' in window && canvas.parentElement) {
            const ro = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const rect = entry.contentRect;
                    width = canvas.width = Math.floor(rect.width);
                    height = canvas.height = Math.floor(rect.height);
                    requestAnimationFrame(drawGrid);
                }
            });
            ro.observe(canvas.parentElement);
        } else {
            width = canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
            height = canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
            drawGrid();
        }
    }

    // 2. Typing Subtitle Rotation Effect
    const typingElement = id('typing-text');
    if (typingElement) {
        const roles = [
            ' | Software Engineering',
            ' | Java & Python Developer',
            ' | Systems Automation'
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = isDeleting ? 30 : 70;

            if (!isDeleting && charIndex === currentRole.length) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                speed = 300;
            }

            setTimeout(typeEffect, speed);
        }

        typeEffect();
    }

    // 3. Web Audio Synthesizer (UI Audio Click Feedback)
    let audioCtx = null;
    let soundEnabled = true;
    const soundToggleBtn = id('sound-toggle');

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high text-accent"></i>';
                showToast('Audio feedback enabled');
                playClickSound(800, 0.04);
            } else {
                soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                showToast('Audio feedback muted');
            }
        });
    }

    function playClickSound(freq = 600, duration = 0.03) {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio context fallback
        }
    }

    // Delegated click listener for click feedback
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('button, .btn, .nav-link')) {
            playClickSound(750, 0.03);
        }
    }, { passive: true });

    // 4. IntersectionObserver Nav Link Tracker
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // 5. Mobile Navigation Drawer Toggle Handler
    const mobileToggleBtn = id('mobile-toggle');
    const navMenu = id('nav-menu');

    if (mobileToggleBtn && navMenu) {
        mobileToggleBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isActive = navMenu.classList.contains('active');
            mobileToggleBtn.innerHTML = isActive 
                ? '<i class="fa-solid fa-xmark"></i>' 
                : '<i class="fa-solid fa-bars"></i>';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (mobileToggleBtn) mobileToggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    // 6. Command Palette Modal (Ctrl + K)
    const cmdPalette = id('cmd-palette');
    const cmdTrigger = id('cmd-k-trigger');
    const cmdInput = id('cmd-input');
    const cmdItems = document.querySelectorAll('.cmd-item');

    function openCmdPalette() {
        if (cmdPalette) {
            cmdPalette.classList.add('active');
            if (cmdInput) {
                cmdInput.value = '';
                cmdInput.focus();
            }
        }
    }

    function closeCmdPalette() {
        if (cmdPalette) cmdPalette.classList.remove('active');
    }

    if (cmdTrigger) cmdTrigger.addEventListener('click', openCmdPalette);

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            if (cmdPalette && cmdPalette.classList.contains('active')) closeCmdPalette();
            else openCmdPalette();
        } else if (e.key === 'Escape' && cmdPalette && cmdPalette.classList.contains('active')) {
            closeCmdPalette();
        }
    });

    if (cmdPalette) {
        cmdPalette.addEventListener('click', (e) => {
            if (e.target === cmdPalette) closeCmdPalette();
        });
    }

    if (cmdInput) {
        cmdInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            cmdItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? 'flex' : 'none';
            });
        });
    }

    cmdItems.forEach(item => item.addEventListener('click', closeCmdPalette));

    // 7. Project Drawer Modal
    const projectDrawer = id('project-drawer');
    const openDrawerBtn = id('open-project-drawer-1');

    if (openDrawerBtn && projectDrawer) {
        openDrawerBtn.addEventListener('click', () => {
            projectDrawer.classList.add('active');
        });
    }

    window.closeProjectDrawer = function() {
        if (projectDrawer) projectDrawer.classList.remove('active');
    };

    if (projectDrawer) {
        projectDrawer.addEventListener('click', (e) => {
            if (e.target === projectDrawer) closeProjectDrawer();
        });
    }

    // 7.5. Legal Modals (Privacy Policy & TOS)
    const privacyModal = id('privacy-modal');
    const openPrivacyBtn = id('open-privacy-btn');
    const closePrivacyBtn = id('close-privacy-btn');
    const closePrivacyBtn2 = id('close-privacy-btn-2');

    const tosModal = id('tos-modal');
    const openTosBtn = id('open-tos-btn');
    const closeTosBtn = id('close-tos-btn');
    const closeTosBtn2 = id('close-tos-btn-2');

    if (openPrivacyBtn && privacyModal) {
        openPrivacyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.classList.add('active');
        });
    }

    function closePrivacy() {
        if (privacyModal) privacyModal.classList.remove('active');
    }
    if (closePrivacyBtn) closePrivacyBtn.addEventListener('click', closePrivacy);
    if (closePrivacyBtn2) closePrivacyBtn2.addEventListener('click', closePrivacy);
    if (privacyModal) {
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) closePrivacy();
        });
    }

    if (openTosBtn && tosModal) {
        openTosBtn.addEventListener('click', (e) => {
            e.preventDefault();
            tosModal.classList.add('active');
        });
    }

    function closeTos() {
        if (tosModal) tosModal.classList.remove('active');
    }
    if (closeTosBtn) closeTosBtn.addEventListener('click', closeTos);
    if (closeTosBtn2) closeTosBtn2.addEventListener('click', closeTos);
    if (tosModal) {
        tosModal.addEventListener('click', (e) => {
            if (e.target === tosModal) closeTos();
        });
    }

    // 8. Email Copy & Toast System
    const copyEmailBtn = id('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('somsubhradaw@gmail.com').then(() => {
                showToast('Copied somsubhradaw@gmail.com to clipboard');
            });
        });
    }

    function showToast(message) {
        const container = id('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // 9. Contact Form Dispatcher
    const contactForm = id('contact-form');
    const formStatus = id('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = id('name').value.trim();
            const email = id('email').value.trim();
            const message = id('message').value.trim();

            const mailtoUrl = `mailto:somsubhradaw@gmail.com?subject=${encodeURIComponent('Portfolio Contact from ' + name)}&body=${encodeURIComponent('Hi Somsubhra,\n\nName: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`;

            if (formStatus) {
                formStatus.style.color = '#d97706';
                formStatus.innerHTML = 'Opening default email application...';
            }

            showToast('Dispatching email client');

            setTimeout(() => {
                window.location.href = mailtoUrl;
                contactForm.reset();
            }, 500);
        });
    }

    // 10. Media Protection System
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG' || e.target.classList.contains('protected-media')) {
            e.preventDefault();
            return false;
        }
    }, { passive: false });

    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG' || e.target.classList.contains('protected-media')) {
            e.preventDefault();
            return false;
        }
    }, { passive: false });
});
