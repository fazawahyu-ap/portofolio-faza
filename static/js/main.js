document.body.classList.add('preloading');

const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
    if (preloader) {
        preloader.classList.add('preloader-hidden');
    }
    document.body.classList.remove('preloading');
});

document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    gsap.registerPlugin(ScrollTrigger);

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

    const langSwitcher = document.querySelector('.lang-switcher');
    
    function switchLanguage(lang) {
        if (!lang || !translations[lang]) return;
        
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            if (translations[lang][key] !== undefined) {
                el.innerHTML = translations[lang][key];
            }
        });
        
        const currentLangSpan = document.getElementById('current-lang');
        if(currentLangSpan) {
            currentLangSpan.textContent = lang.toUpperCase();
        }
        
        localStorage.setItem('selectedLanguage', lang);
        
        const heroTitle = document.querySelector('.hero-title[data-text-split]');
        if(heroTitle) {
            splitText('.hero-title[data-text-split]');
            gsap.fromTo('.hero-title .char', { opacity: 0, y: 20 }, {
                opacity: 1, y: 0, scale: 1, rotateZ: 0,
                stagger: 0.04, ease: 'back.out(1.7)', duration: 0.8
            });
        }
        // Pastikan ikon di-render ulang setelah ganti bahasa
        feather.replace();
    }

    if (langSwitcher) {
        const langButton = langSwitcher.querySelector('.lang-button');
        const langDropdown = langSwitcher.querySelector('.lang-dropdown');
        langButton.addEventListener('click', (e) => { e.stopPropagation(); langSwitcher.classList.toggle('active'); });
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

    const savedLang = localStorage.getItem('selectedLanguage') || 'id';
    setTimeout(() => switchLanguage(savedLang), 100);

    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); navMenu.classList.toggle('active'); });
        navLinks.forEach(link => { link.addEventListener('click', () => { hamburger.classList.remove('active'); navMenu.classList.remove('active'); }); });
    }

    function splitText(target) {
        let elem = document.querySelector(target);
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

    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 2;
            const y = (clientY / window.innerHeight - 0.5) * 2;
            gsap.to('.hero-image-container', { x: -x * 25, y: -y * 25, rotationY: x * 15, rotationX: -y * 15, duration: 1, ease: 'power3.out' });
        });
    }

    splitText('.hero-title');
    const entranceTl = gsap.timeline({ delay: 0.5 });
    entranceTl.to('.hero-title .char', { opacity: 1, y: 0, scale: 1, rotateZ: 0, stagger: 0.04, ease: 'back.out(1.7)', duration: 0.8 })
    .from('.hero-subtitle', { opacity: 0, y: 20, ease: 'power3.out' }, '-=0.6')
    .from('.hero-main-buttons', { opacity: 0, y: 20, ease: 'power3.out' }, '-=1')
    .to('.reveal-grid-block', { scale: 0, ease: 'power3.inOut', stagger: { amount: 1, from: 'center' } }, '-=1.2');

    const header = document.querySelector('.main-header');
    if (header) {
        ScrollTrigger.create({ start: 'top -80', end: 99999, toggleClass: { className: 'scrolled', target: header } });
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
        document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.split('#')[1] === currentSection) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
    
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
            if(imageWrapper && imageWrapper.dataset.images) {
                achievementModal.open(imageWrapper.dataset.images);
            }
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
        const updateImage = () => { if (currentImages.length > 0) sliderImage.src = `/static/img/${currentImages[currentIndex]}`; };
        const closeModal = () => modalOverlay.classList.remove('active');
        prevBtn?.addEventListener('click', () => { currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; updateImage(); });
        nextBtn?.addEventListener('click', () => { currentIndex = (currentIndex + 1) % currentImages.length; updateImage(); });
        modalCloseBtn?.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
        return {
            open: (imagesData) => {
                try {
                    currentImages = JSON.parse(imagesData);
                    if (currentImages && currentImages.length > 0) { 
                        currentIndex = 0; 
                        updateImage(); 
                        modalOverlay.classList.add('active'); 
                    }
                } catch (e) { console.error("Error parsing images data:", e); }
            }
        };
    }

    function initProjectModal(modalOverlay) {
        if (!modalOverlay) return { openImage: () => {}, openVideo: () => {} };
        const imageSlider = modalOverlay.querySelector('.project-image-slider');
        const videoPlayer = modalOverlay.querySelector('.modal-video-player');
        const videoElement = videoPlayer?.querySelector('video');
        const galleryModal = initGalleryModal(modalOverlay);
        const openImage = (imagesData) => { imageSlider.style.display = 'block'; videoPlayer.style.display = 'none'; galleryModal.open(imagesData); };
        const openVideo = (videoFile) => { 
            if (imageSlider) imageSlider.style.display = 'none';
            if (videoPlayer) videoPlayer.style.display = 'block';
            if (videoElement) {
                videoElement.src = `/static/video/${videoFile}`;
                videoElement.controls = true;
            }
            modalOverlay.classList.add('active'); 
        };
        const closeModalAndResetVideo = () => { if (videoElement && !videoElement.paused) { videoElement.pause(); videoElement.currentTime = 0; videoElement.src = ""; } };
        modalOverlay.querySelector('.modal-close').addEventListener('click', closeModalAndResetVideo);
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModalAndResetVideo(); });
        return { openImage, openVideo };
    }

    const contactForm = document.getElementById('contact-form');
    const popupBubble = document.getElementById('form-popup-bubble');
    let popupTimer;

    function showPopup(message, isSuccess) {
        if (!popupBubble) return;
        clearTimeout(popupTimer);
        popupBubble.textContent = message;
        popupBubble.className = 'popup-bubble';
        popupBubble.classList.add(isSuccess ? 'success' : 'error');
        popupBubble.classList.add('active');
        popupTimer = setTimeout(() => {
            popupBubble.classList.remove('active');
        }, 4000);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        showPopup("Sending message...", true);
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showPopup("Message sent successfully. Thank you!", true);
                form.reset();
            } else {
                showPopup("Oops! Something went wrong.", false);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showPopup("Oops! A network error occurred.", false);
        }
    }

    if (contactForm) {
        contactForm.addEventListener("submit", handleSubmit);
    }

    document.querySelectorAll('section:not(.hero)').forEach(section => {
        const elementsToAnimate = section.querySelectorAll(
            '.section-title, .about-content-wrapper, .work-card, .project-card, .skill-grid, .cert-link-container, .education-timeline'
        );

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
    });

    const smoothScrollAnchors = document.querySelectorAll('a.scroll-down-btn');

    smoothScrollAnchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});