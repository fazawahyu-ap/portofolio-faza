// Skrip untuk mengontrol preloader
document.body.classList.add('preloading'); // Mencegah scroll saat memuat

const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
    if (preloader) {
        preloader.classList.add('preloader-hidden');
    }
    document.body.classList.remove('preloading');
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Inisialisasi Awal ---
    feather.replace();
    gsap.registerPlugin(ScrollTrigger);

    // --- Animasi Grid Foto Profil ---
    function createRevealGrid() {
        const container = document.querySelector('.reveal-overlay');
        if (!container) return;
        const gridSize = 10; 
        for (let i = 0; i < gridSize * gridSize; i++) {
            const div = document.createElement('div');
            div.classList.add('reveal-grid-block');
            container.appendChild(div);
        }
    }
    createRevealGrid();

    // --- FUNGSI TERJEMAHAN BAHASA (DIPERBARUI) ---
    const langSwitcher = document.querySelector('.lang-switcher');
    
    function switchLanguage(lang) {
        if (!lang || !translations[lang]) return;

        // Template HTML untuk logo Python
        const pythonLogoHTML = `<img src="static/img/python-logo.png" alt="Python Logo" class="skill-logo">`;

        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            if (translations[lang][key] !== undefined) {
                // Ambil teks terjemahan asli
                let translatedText = translations[lang][key];

                // Periksa dan ganti placeholder dengan HTML gambar
                if (translatedText.includes('#PYTHON_LOGO#')) {
                    translatedText = translatedText.replace('#PYTHON_LOGO#', pythonLogoHTML);
                }

                // Set konten elemen dengan teks yang sudah diproses
                el.innerHTML = translatedText;
            }
        });
        
        document.getElementById('current-lang').textContent = lang.toUpperCase();
        localStorage.setItem('selectedLanguage', lang);
        
        feather.replace();

        const heroTitle = document.querySelector('[data-text-split]');
        if(heroTitle) {
            splitText('[data-text-split]');
            gsap.fromTo('.hero-title .char', 
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, scale: 1, rotateZ: 0,
                    stagger: 0.04, ease: 'back.out(1.7)', duration: 0.8
                }
            );
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

    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    setTimeout(() => switchLanguage(savedLang), 100);

    // --- PENGHITUNG PENGUNJUNG REAL-TIME (POLLING) ---
    const visitorCountElement = document.getElementById('visitor-count-number');
    if (visitorCountElement) {
        // Buat ID unik untuk pengunjung ini
        const visitorId = 'user_' + Date.now() + Math.random().toString(36).substring(2);
        const API_BASE_URL = window.location.origin;

        const sendPing = () => {
            // Ping ke server untuk memberitahu kita masih online
            // Menggunakan navigator.sendBeacon jika tersedia karena lebih andal saat halaman ditutup
            if (navigator.sendBeacon) {
                navigator.sendBeacon(`${API_BASE_URL}/api/ping`, JSON.stringify({ userId: visitorId }));
            } else {
                 fetch(`${API_BASE_URL}/api/ping`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: visitorId }),
                    keepalive: true
                });
            }
        };

        const getCount = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/count`);
                if (!response.ok) return;
                const data = await response.json();
                visitorCountElement.textContent = data.active_users || 1;
            } catch (error) {
                console.error('Gagal mengambil data pengunjung:', error);
                visitorCountElement.textContent = '1';
            }
        };

        // Jalankan pertama kali saat halaman dimuat
        sendPing();
        getCount();

        // Atur interval untuk ping dan update
        setInterval(sendPing, 15000); // Kirim ping setiap 15 detik
        setInterval(getCount, 10000); // Perbarui jumlah setiap 10 detik

        // Menambahkan event listener untuk saat pengguna akan meninggalkan halaman
        window.addEventListener('unload', sendPing);
    }


    // --- Fungsionalitas UI/UX ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

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

    function splitText(selector) {
        const elem = document.querySelector(selector);
        if (!elem) return;
        const text = elem.textContent;
        elem.innerHTML = '';
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
            if (wordIndex < words.length - 1) {
                elem.insertAdjacentHTML('beforeend', ' ');
            }
        });
    };

    // --- Animasi Mouse Parallax ---
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 2;
            const y = (clientY / window.innerHeight - 0.5) * 2;
            gsap.to('.hero-image-container', {
                x: -x * 25, y: -y * 25, rotationY: x * 15, rotationX: -y * 15, duration: 1, ease: 'power3.out'
            });
        });
    }

    // --- Animasi Entrance Utama ---
    const entranceTl = gsap.timeline({ delay: 0.5 });
    entranceTl.to('.hero-title .char', {
        opacity: 1, y: 0, scale: 1, rotateZ: 0,
        stagger: 0.04, ease: 'back.out(1.7)', duration: 0.8
    })
    .from('.hero-subtitle', { opacity: 0, y: 20, ease: 'power3.out' }, '-=0.6')
    .from('.hero-buttons', { opacity: 0, y: 20, ease: 'power3.out' }, '-=1')
    .to('.reveal-grid-block', { 
        scale: 0,
        ease: 'power3.inOut',
        stagger: { amount: 1, from: 'center' }
    }, '-=1.2');

    // --- Animasi & Kontrol Scroll ---
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
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - (header.clientHeight + 50)) {
                currentSection = section.getAttribute('id');
            }
        });
        document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
    
    // --- Fungsionalitas Modal ---
    const workModal = initGalleryModal(document.querySelector('#work-modal-overlay'));
    const projectModal = initProjectModal(document.querySelector('#project-modal-overlay'));
    const achievementModal = initGalleryModal(document.querySelector('#achievement-modal-overlay'));
    
    document.addEventListener('click', (e) => {
        const workGalleryBtn = e.target.closest('.btn-gallery');
        const projectGalleryBtn = e.target.closest('.btn-project-gallery');
        const projectVideoBtn = e.target.closest('.btn-project-video');
        const achievementItem = e.target.closest('.achievement-item');

        if (workGalleryBtn) workModal.open(workGalleryBtn.dataset.images);
        else if (projectGalleryBtn) projectModal.openImage(projectGalleryBtn.dataset.images);
        else if (projectVideoBtn) projectModal.openVideo(projectVideoBtn.dataset.video);
        else if (achievementItem) {
            const imageWrapper = achievementItem.querySelector('.achievement-image-wrapper');
            if(imageWrapper) achievementModal.open(imageWrapper.dataset.images);
        }
    });

    function initGalleryModal(modalOverlay) {
        if (!modalOverlay) return { open: () => {} };
        const modalCloseBtn = modalOverlay.querySelector('.modal-close');
        const sliderImage = modalOverlay.querySelector('.slider-image');
        const prevBtn = modalOverlay.querySelector('.slider-btn.prev');
        const nextBtn = modalOverlay.querySelector('.slider-btn.next');
        let currentImages = [];
        let currentIndex = 0;

        const updateImage = () => { if (currentImages.length > 0) sliderImage.src = `static/img/${currentImages[currentIndex]}`; };
        const closeModal = () => modalOverlay.classList.remove('active');

        prevBtn?.addEventListener('click', () => { currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; updateImage(); });
        nextBtn?.addEventListener('click', () => { currentIndex = (currentIndex + 1) % currentImages.length; updateImage(); });
        modalCloseBtn?.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

        return {
            open: (imagesData) => {
                try {
                    currentImages = JSON.parse(imagesData);
                    if (currentImages && currentImages.length > 0) { currentIndex = 0; updateImage(); modalOverlay.classList.add('active'); }
                } catch (e) { console.error("Error parsing images data:", e); }
            }
        };
    }

    function initProjectModal(modalOverlay) {
        if (!modalOverlay) return { openImage: () => {}, openVideo: () => {} };
        const imageSlider = modalOverlay.querySelector('.project-image-slider');
        const videoPlayer = modalOverlay.querySelector('.modal-video-player');
        const videoElement = videoPlayer.querySelector('video');
        const galleryModal = initGalleryModal(modalOverlay);

        const openImage = (imagesData) => { imageSlider.style.display = 'block'; videoPlayer.style.display = 'none'; galleryModal.open(imagesData); };
        const openVideo = (videoFile) => { imageSlider.style.display = 'none'; videoPlayer.style.display = 'block'; videoElement.src = `static/video/${videoFile}`; videoElement.controls = true; modalOverlay.classList.add('active'); };
        const closeModalAndResetVideo = () => { if (!videoElement.paused) videoElement.pause(); videoElement.currentTime = 0; videoElement.src = ""; };

        modalOverlay.querySelector('.modal-close').addEventListener('click', closeModalAndResetVideo);
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModalAndResetVideo(); });

        return { openImage, openVideo };
    }

    // --- ANIMASI SCROLL (Swipe In & Stay) - VERSI FINAL STABIL ---
    document.querySelectorAll('section:not(.hero)').forEach(section => {
        const elementsToAnimate = section.querySelectorAll(
            '.section-title, .about-content-wrapper, .education-card, .work-card, .org-card, .project-card, .achievement-item, .skills-container, .cert-link-container'
        );

        if (elementsToAnimate.length > 0) {
             gsap.from(elementsToAnimate, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }
    });
});