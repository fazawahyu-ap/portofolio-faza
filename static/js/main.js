// =============================
// PRELOADER
// =============================
document.body.classList.add('preloading');
const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
    if (preloader) preloader.classList.add('preloader-hidden');
    document.body.classList.remove('preloading');
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});

// =============================
// DOM READY
// =============================
document.addEventListener('DOMContentLoaded', () => {
    // Init GSAP
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // =============================
    // UTILITY FUNCTIONS
    // =============================

    // Fungsi untuk memecah teks menjadi karakter untuk animasi
    function splitText(target) {
        const elem = document.querySelector(target);
        if (!elem) return;
        // Simpan teks asli jika belum ada, untuk mencegah pemecahan berulang
        if (!elem.dataset.originalText) {
            elem.dataset.originalText = elem.textContent;
        }
        const text = elem.dataset.originalText;
        elem.innerHTML = ''; // Kosongkan elemen sebelum diisi lagi
        const words = text.split(' ');
        words.forEach((word, wordIndex) => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'word';
            for (let char of word) {
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.innerText = char;
                wordDiv.appendChild(charSpan);
            }
            elem.appendChild(wordDiv);
            if (wordIndex < words.length - 1) elem.insertAdjacentHTML('beforeend', ' ');
        });
    }

    // =============================
    // LANGUAGE SWITCHER & CORE INITIALIZATION
    // =============================
    const langSwitcher = document.querySelector('.lang-switcher');

    function switchLanguage(lang) {
        if (!lang || !translations[lang]) return;

        // 1. Ganti semua teks berdasarkan atribut data-translate-key
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            if (translations[lang][key] !== undefined) {
                el.innerHTML = translations[lang][key];
            }
        });

        // 2. Update indicator bahasa
        const currentLangSpan = document.getElementById('current-lang');
        if (currentLangSpan) currentLangSpan.textContent = lang.toUpperCase();

        // 3. Simpan pilihan bahasa
        localStorage.setItem('selectedLanguage', lang);

        // 💡 BAGIAN PENTING: Jalankan fungsi yang butuh konten setelah penerjemahan selesai
        
        // 4. Inisialisasi ulang Feather Icons agar ikon baru muncul
        if (typeof feather !== 'undefined') {
            feather.replace();
            
        }

        // 5. Jalankan animasi Hero
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && typeof gsap !== 'undefined') {
            // Hapus animasi sebelumnya & atur ulang properti untuk menghindari bug
            gsap.killTweensOf('.hero-title .char, .hero-subtitle, .hero-main-buttons');
            gsap.set('.hero-title .char, .hero-subtitle, .hero-main-buttons', { clearProps: "all" });

            // Simpan teks asli ke data-attribute sebelum dipecah
            heroTitle.dataset.originalText = heroTitle.textContent;
            splitText('.hero-title');
            
            gsap.timeline()
                .fromTo('.hero-title .char', { opacity: 0, y: 20 }, {
                    opacity: 1, y: 0, stagger: 0.04, ease: 'back.out(1.7)', duration: 0.8
                })
                .from('.hero-subtitle', { opacity: 0, y: 20, ease: 'power3.out' }, '-=0.6')
                .from('.hero-main-buttons', { opacity: 0, y: 20, ease: 'power3.out' }, '-=0.8');
        }
    }

    if (langSwitcher) {
        const langButton = langSwitcher.querySelector('.lang-button');
        const langDropdown = langSwitcher.querySelector('.lang-dropdown');

        langButton.addEventListener('click', (e) => {
            e.stopPropagation();
            langSwitcher.classList.toggle('active');
        });

        langDropdown.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('a');
            if (link) {
                const lang = link.dataset.lang;
                switchLanguage(lang);
                langSwitcher.classList.remove('active');
            }
        });
    }

    document.addEventListener('click', () => {
        if (langSwitcher && langSwitcher.classList.contains('active')) {
            langSwitcher.classList.remove('active');
        }
    });

    // Panggil switchLanguage saat pertama kali halaman dimuat
    const savedLang = localStorage.getItem('selectedLanguage') || 'id';
    switchLanguage(savedLang);

    // =============================
    // GRID REVEAL EFFECT (ANIMASI AWAL)
    // =============================
    function createRevealGrid() {
        const container = document.querySelector('.reveal-overlay');
        if (!container) return;
        for (let i = 0; i < 100; i++) {
            const div = document.createElement('div');
            div.classList.add('reveal-grid-block');
            container.appendChild(div);
        }
    }
    createRevealGrid();
    gsap.to('.reveal-grid-block', {
        scale: 0,
        ease: 'power3.inOut',
        stagger: { amount: 1, from: 'center' },
        delay: 0.2, // Sedikit delay agar tidak terlalu buru-buru
        duration: 1.5
    });

    // =============================
    // HAMBURGER NAV
    // =============================
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // =============================
    // HERO MOUSE MOVE EFFECT
    // =============================
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 2;
            const y = (clientY / window.innerHeight - 0.5) * 2;
            gsap.to('.hero-image-container', {
                x: -x * 25, y: -y * 25,
                rotationY: x * 15, rotationX: -y * 15,
                duration: 1, ease: 'power3.out'
            });
        });
    }

    // =============================
    // HEADER SCROLL BEHAVIOR
    // =============================
    const header = document.querySelector('.main-header');
    if (header) {
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            toggleClass: { className: 'scrolled', target: header }
        });
    }

    function updateActiveNav() {
        let currentSection = 'home';
        const currentPath = window.location.pathname;
        if (currentPath.includes('organization')) return;

        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - (header.clientHeight + 50)) {
                currentSection = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes('#') && href.split('#')[1] === currentSection) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // =============================
    // GALLERY & PROJECT MODALS
    // =============================
    function initGalleryModal(modalOverlay) {
        if (!modalOverlay) return { open: () => {} };
        const modalCloseBtn = modalOverlay.querySelector('.modal-close');
        const sliderImage = modalOverlay.querySelector('.slider-image');
        const prevBtn = modalOverlay.querySelector('.slider-btn.prev');
        const nextBtn = modalOverlay.querySelector('.slider-btn.next');
        let currentImages = [];
        let currentIndex = 0;

        const updateImage = () => {
            if (sliderImage && currentImages.length > 0)
                sliderImage.src = `/static/img/${currentImages[currentIndex]}`;
        };
        const closeModal = () => modalOverlay.classList.remove('active');

        prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateImage();
        });
        nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateImage();
        });
        modalCloseBtn?.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        return {
            open: (imagesData) => {
                try {
                    currentImages = JSON.parse(imagesData);
                    if (currentImages?.length > 0) {
                        currentIndex = 0;
                        updateImage();
                        modalOverlay.classList.add('active');
                    }
                } catch (e) {
                    console.error("Error parsing images data:", e);
                }
            }
        };
    }

    function initProjectModal(modalOverlay) {
        if (!modalOverlay) return { openImage: () => {}, openVideo: () => {} };
        const imageSlider = modalOverlay.querySelector('.project-image-slider');
        const videoPlayer = modalOverlay.querySelector('.modal-video-player');
        const videoElement = videoPlayer?.querySelector('video');
        const galleryModal = initGalleryModal(modalOverlay);

        const openImage = (imagesData) => {
            if (imageSlider) imageSlider.style.display = 'block';
            if (videoPlayer) videoPlayer.style.display = 'none';
            if (videoElement) videoElement.pause();
            galleryModal.open(imagesData);
        };

        const openVideo = (videoFile) => {
            if (imageSlider) imageSlider.style.display = 'none';
            if (videoPlayer) videoPlayer.style.display = 'block';
            if (videoElement) {
                videoElement.src = `/static/video/${videoFile}`;
                videoElement.play();
            }
            modalOverlay.classList.add('active');
        };

        const closeModalAndResetVideo = () => {
            if (videoElement && !videoElement.paused) {
                videoElement.pause();
                videoElement.currentTime = 0;
                videoElement.src = "";
            }
        };

        modalOverlay.querySelector('.modal-close')?.addEventListener('click', closeModalAndResetVideo);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModalAndResetVideo();
        });

        return { openImage, openVideo };
    }

    const workModal = initGalleryModal(document.querySelector('#work-modal-overlay'));
    const projectModal = initProjectModal(document.querySelector('#project-modal-overlay'));
    const achievementModal = initGalleryModal(document.querySelector('#achievement-modal-overlay'));

    document.addEventListener('click', (e) => {
        const workGalleryBtn = e.target.closest('.btn-gallery');
        const projectGalleryBtn = e.target.closest('.btn-project-gallery');
        const projectVideoBtn = e.target.closest('.btn-project-video');
        const achievementItem = e.target.closest('.achievement-item, .achievement-image-wrapper');

        if (workGalleryBtn) workModal.open(workGalleryBtn.dataset.images);
        else if (projectGalleryBtn) projectModal.openImage(projectGalleryBtn.dataset.images);
        else if (projectVideoBtn) projectModal.openVideo(projectVideoBtn.dataset.video);
        else if (achievementItem) {
            const imgWrap = achievementItem.closest('.achievement-item').querySelector('.achievement-image-wrapper');
            if (imgWrap && imgWrap.dataset.images) {
                achievementModal.open(imgWrap.dataset.images);
            }
        }
    });

    // =============================
    // CONTACT FORM
    // =============================
    const contactForm = document.getElementById('contact-form');
    const popupBubble = document.getElementById('form-popup-bubble');
    let popupTimer;

    function showPopup(message, isSuccess) {
        if (!popupBubble) return;
        clearTimeout(popupTimer);
        popupBubble.textContent = message;
        popupBubble.className = 'popup-bubble';
        popupBubble.classList.add(isSuccess ? 'success' : 'error', 'active');
        popupTimer = setTimeout(() => popupBubble.classList.remove('active'), 4000);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        showPopup("Mengirim pesan...", true);
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                showPopup("Pesan berhasil terkirim. Terima kasih!", true);
                form.reset();
            } else showPopup("Oops! Terjadi kesalahan.", false);
        } catch (error) {
            showPopup("Oops! Terjadi kesalahan jaringan.", false);
        }
    }

    if (contactForm) contactForm.addEventListener("submit", handleSubmit);

    // =============================
    // SCROLL ANIMATIONS (AOS atau GSAP)
    // =============================
    // Menggunakan AOS dari file organization.html sebagai referensi
// main.js

// ... (kode lain di atasnya) ...

// =============================
// SCROLL ANIMATIONS
// =============================
// Cek jika library AOS (Animate on Scroll) ada, jika tidak, gunakan GSAP
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 600,
        once: true,
        offset: 50,
    });
} else { 
    // PENDEKATAN BARU: Animasikan setiap elemen secara individual
    const elementsToAnimate = document.querySelectorAll(
        '.section-title, .about-content-wrapper, .about-extra-content, .work-card, .project-card, .skills-category, .edu-timeline'
    );

    elementsToAnimate.forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element, // Pemicunya adalah elemen itu sendiri
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true // Animasi hanya berjalan sekali
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
}

    // =============================
    // ORGANIZATION PAGE SPECIFIC LOGIC
    // =============================
    // Cek jika kita berada di halaman organisasi
    if (document.querySelector('.org-hero-compact')) {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetEl = document.querySelector(anchor.getAttribute('href'));
                if (targetEl) {
                    const headerOffset = document.querySelector('.main-header')?.offsetHeight || 80;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        });
    }
});

// Simple Navbar Scroll Behavior
function initNavbar() {
    const header = document.querySelector('.main-header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
            
            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll);
    
    // Reset navbar when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            header.style.transform = 'translateY(0)';
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initNavbar);