document.addEventListener('DOMContentLoaded', () => {
    // --- Inisialisasi Awal ---
    feather.replace();
    gsap.registerPlugin(ScrollTrigger);

    // --- Fungsionalitas Hamburger Menu (Baru) ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinksMobile = document.querySelectorAll('.nav-menu .nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Fungsi untuk menutup menu saat link di-klik
    const closeMenu = () => {
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    };

    navLinksMobile.forEach(link => link.addEventListener('click', closeMenu));


    // --- Animasi Teks Profesional ---
    const splitText = (selector) => {
        const elem = document.querySelector(selector);
        if (!elem) return;
        const text = elem.innerText;
        const words = text.split(' ');
        elem.innerHTML = '';
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
    splitText('[data-text-split]');

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
    const heroTl = gsap.timeline({ delay: 0.5 });
    heroTl.to('.hero-title .char', { opacity: 1, y: 0, scale: 1, rotateZ: 0, stagger: 0.04, ease: 'back.out(1.7)', duration: 0.8 })
    .from('.hero-subtitle', { opacity: 0, y: 20, ease: 'power3.out' }, '-=0.6')
    .to('.image-reveal-box', { scaleX: 0, transformOrigin: 'right', duration: 1.2, ease: 'power4.inOut' }, '-=1');

    // --- Animasi Header saat scroll ---
    const header = document.querySelector('.main-header');
    if (header) {
        ScrollTrigger.create({
            start: 'top -80', end: 99999, toggleClass: { className: 'scrolled', target: header }
        });
    }
    
    // --- Navbar Aktif Saat Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    function updateActiveNav() {
        let currentSection = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - (header.clientHeight + 50)) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
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

    // --- Animasi Scroll ---
    const animateOnScroll = (selector, y = 50, stagger = 0.1) => {
        const elem = document.querySelectorAll(selector);
        if (!elem || elem.length === 0) return;
        
        gsap.from(elem, {
            scrollTrigger: { trigger: elem[0].closest('section'), start: 'top 85%', toggleActions: 'play none none none' },
            opacity: 0, y: y, duration: 1, ease: 'power3.out', stagger: stagger
        });
    };
    
    // Animasi untuk semua elemen umum
    animateOnScroll('.section-title, .section-intro, .education-card, .work-card, .org-card, .project-card, .skills-category, .cert-link-container, .achievement-item', 50, 0.1);
});