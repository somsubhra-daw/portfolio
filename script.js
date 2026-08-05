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

    // 6. Automatic Photo Gallery Engine (Direct Folder Auto-Reflection)
    const galleryGrid = document.getElementById('photo-gallery-grid');
    if (galleryGrid) {
        function formatTitleFromFilename(filename) {
            const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
            const cleanName = nameWithoutExt.replace(/[_-]/g, ' ');
            return cleanName.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        }

        // Lightbox Modal Element References
        const photoModal = document.getElementById('photo-modal');
        const photoModalImg = document.getElementById('photo-modal-img');
        const photoModalTitle = document.getElementById('photo-modal-title');
        const photoModalClose = document.getElementById('photo-modal-close');
        const photoModalOverlay = document.getElementById('photo-modal-overlay');

        function openPhotoModal(src, title) {
            if (!photoModal || !photoModalImg || !photoModalTitle) return;
            photoModalImg.src = src;
            photoModalTitle.textContent = title;
            photoModal.classList.add('active');
            photoModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        function closePhotoModal() {
            if (!photoModal) return;
            photoModal.classList.remove('active');
            photoModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        if (photoModalClose) photoModalClose.addEventListener('click', closePhotoModal);
        if (photoModalOverlay) photoModalOverlay.addEventListener('click', closePhotoModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && photoModal && photoModal.classList.contains('active')) {
                closePhotoModal();
            }
        });

        function createPhotoCard(src, filename) {
            const title = formatTitleFromFilename(filename);
            const card = document.createElement('div');
            card.className = 'glass-card photo-card';
            card.style.overflow = 'hidden';
            card.style.borderRadius = 'var(--radius-md)';
            card.style.transition = 'transform 0.3s ease, border-color 0.3s ease';
            card.style.border = '1px solid var(--border-glow)';

            card.innerHTML = `
                <div class="photo-card-img-wrapper" title="Click to view larger version">
                    <div class="security-shield-overlay" oncontextmenu="return false;"></div>
                    <img src="${src}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" class="photo-card-img protected-media" draggable="false" oncontextmenu="return false;">
                </div>
                <div style="padding: 20px; cursor: pointer;" class="photo-card-caption">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fa-solid fa-camera text-cyan" style="font-size: 1.1rem;"></i>
                        <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0; color: var(--text-main); line-height: 1.4;">${title}</h3>
                    </div>
                </div>
            `;

            // Open Lightbox Modal on click
            card.addEventListener('click', () => {
                openPhotoModal(src, title);
            });

            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-6px)';
                card.style.borderColor = 'var(--primary-cyan)';
                const img = card.querySelector('.photo-card-img');
                if (img) img.style.transform = 'scale(1.06)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.borderColor = 'var(--border-glow)';
                const img = card.querySelector('.photo-card-img');
                if (img) img.style.transform = 'scale(1)';
            });

            return card;
        }

        const loadedImages = new Set();

        function addImageToGallery(src, filename) {
            if (loadedImages.has(src)) return;
            loadedImages.add(src);
            const card = createPhotoCard(src, filename);
            galleryGrid.appendChild(card);
        }

        // Photo Gallery Loaders: Direct Array + JSON Manifest + Directory Auto Scanner
        const defaultGalleryFiles = [
            'gallery/Sunset_at_Berhampore_Campus.jpg',
            'gallery/Coding_and_Software_Development.jpg',
            'gallery/Artistic_Workspace_and_Creative_Tools.jpg'
        ];

        // 1. Proactive load default photos
        defaultGalleryFiles.forEach(src => {
            const filename = src.split('/').pop();
            const img = new Image();
            img.onload = () => {
                addImageToGallery(src, filename);
            };
            img.src = src;
        });

        // 2. Fetch gallery/images.json if deployed on server
        fetch('gallery/images.json')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        const src = typeof item === 'string' ? item : item.src;
                        const filename = typeof item === 'string' ? item.split('/').pop() : (item.filename || item.src.split('/').pop());
                        addImageToGallery(src, filename);
                    });
                }
            })
            .catch(() => {});

        // 3. Auto-parse directory HTML (when local dev server supports it)
        fetch('gallery/')
            .then(res => res.text())
            .then(html => {
                const regex = /href=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["']/gi;
                let match;
                while ((match = regex.exec(html)) !== null) {
                    const fileUrl = match[1];
                    const filename = fileUrl.split('/').pop();
                    const fullSrc = fileUrl.startsWith('gallery/') ? fileUrl : `gallery/${filename}`;
                    addImageToGallery(fullSrc, filename);
                }
            })
            .catch(() => {});
    }

    // 7. Global Media Privacy & Anti-Download Protection System
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
