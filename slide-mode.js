// === MODO SLIDE ===
(function() {
    let currentSlide = 0;
    let slides = [];
    let lessonTitle = '';

    function initSlideMode() {
        // Inject HUD elements
        const hud = document.createElement('div');
        hud.className = 'slide-hud';
        hud.innerHTML = `
            <button class="slide-hud-btn" id="slidePrev" title="Anterior (←)">&#x2B05;</button>
            <span class="slide-counter" id="slideCounter">1 / 1</span>
            <button class="slide-hud-btn" id="slideNext" title="Próximo (→)">&#x27A1;</button>
            <button class="slide-hud-close" id="slideClose" title="Sair (ESC)">&#x2716;</button>
        `;
        document.body.appendChild(hud);

        // Inject title bar
        const titleBar = document.createElement('div');
        titleBar.className = 'slide-title-bar';
        titleBar.id = 'slideTitleBar';
        document.body.appendChild(titleBar);

        // Get lesson title
        const heroTitle = document.querySelector('.lesson-hero h1');
        lessonTitle = heroTitle ? heroTitle.textContent : 'Aula';

        // Get all content cards as slides
        slides = Array.from(document.querySelectorAll('.content-card'));

        // Button events
        document.getElementById('slidePrev').addEventListener('click', prevSlide);
        document.getElementById('slideNext').addEventListener('click', nextSlide);
        document.getElementById('slideClose').addEventListener('click', exitSlideMode);

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
    }

    function handleKeyboard(e) {
        if (!document.body.classList.contains('slide-active')) return;

        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                prevSlide();
                break;
            case 'Escape':
                e.preventDefault();
                exitSlideMode();
                break;
        }
    }

    function enterSlideMode() {
        if (slides.length === 0) return;
        currentSlide = 0;
        document.body.classList.add('slide-active');
        showSlide(0);
    }

    function exitSlideMode() {
        document.body.classList.remove('slide-active');
        slides.forEach(s => s.classList.remove('slide-visible'));
    }

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('slide-visible'));
        slides[index].classList.add('slide-visible');

        // Reset scroll position of the slide
        slides[index].scrollTop = 0;

        // Update counter
        const counter = document.getElementById('slideCounter');
        counter.textContent = (index + 1) + ' / ' + slides.length;

        // Update title bar
        const titleBar = document.getElementById('slideTitleBar');
        titleBar.textContent = lessonTitle;
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initSlideMode();

        // Attach toggle button event
        const toggleBtn = document.getElementById('slideToggleBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', enterSlideMode);
        }
    });

    // Expose for external use
    window.slideMode = {
        enter: enterSlideMode,
        exit: exitSlideMode,
        next: nextSlide,
        prev: prevSlide
    };
})();
