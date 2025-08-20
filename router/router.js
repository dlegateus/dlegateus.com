const contentDiv = document.getElementById('content');
const mainNavLinks = document.querySelectorAll('.main-header .nav-link');

async function loadPage(path) {
    // Normalize path
    path = path.replace('.html', '');
    if (!path || path === 'index') path = 'home';

    try {
        // Fetch and load the requested page
        const response = await fetch(`pages/${path}.html`);
        if (!response.ok) throw new Error('Page not found');

        contentDiv.innerHTML = await response.text();
        history.pushState({}, '', `#${path}`);
        updateDocumentTitle();
        window.scrollTo(0, 0);
        updateActiveNavLink(path);

        // Wait until all images are fully loaded before applying effects
        await waitForImages(contentDiv);
        // initializePageEffects();
    } catch (error) {
        console.error('Error loading page:', error);
        // Load 404 page if requested page not found
        const notFoundResponse = await fetch('pages/404.html');
        contentDiv.innerHTML = await notFoundResponse.text();
        document.title = 'Page Not Found | Dlegateus';

        await waitForImages(contentDiv);
        // initializePageEffects();
    }
}

// Wait for all images inside container to load
function waitForImages(container) {
    const images = container.querySelectorAll('img');
    const promises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.onload = img.onerror = resolve;
        });
    });
    return Promise.all(promises);
}

// Reinitialize animations, reveal classes, and scroll effects
function initializePageEffects() {
    // Restart reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        el.classList.remove('reveal');
        void el.offsetWidth; // Trigger reflow
        el.classList.add('reveal');
    });

    // Force visibility if some images were hidden due to animations
    document.querySelectorAll('img').forEach(img => {
        img.style.visibility = 'visible';
        img.style.opacity = '1';
    });

    // Reinit plugins
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }
    
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }

    if (typeof initializeRangeCalculator === 'function') {
    initializeRangeCalculator();
}

}

// Dynamically update <title> based on page heading or title element
function updateDocumentTitle() {
    const titleElement =
        contentDiv.querySelector('h1') ||
        contentDiv.querySelector('title') ||
        contentDiv.querySelector('[data-page-title]');

    if (titleElement) {
        document.title = `${titleElement.textContent.trim()} | Dlegateus`;
    }
}

// Highlight the currently active nav link
function updateActiveNavLink(activePath) {
    mainNavLinks.forEach(link => {
        const linkPath = link.getAttribute('href')
            .replace('.html', '')
            .replace('#', '');
        link.classList.toggle('active', linkPath === activePath);
    });
}

// Load initial route or hash
function handleNavigation() {
    const hash = window.location.hash.substring(1);
    loadPage(hash || 'home');
}

// Intercept click events and route them
function handleLinkClick(e) {
    const navLink = e.target.closest('[data-router-link], .nav-link, .navbar-brand');
    if (navLink && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const href = navLink.getAttribute('href');
        const path = href.startsWith('#') ? href.substring(1) : href;
        loadPage(path);
    }
}

// Event listeners for routing
window.addEventListener('DOMContentLoaded', handleNavigation);
window.addEventListener('hashchange', handleNavigation);
document.addEventListener('click', handleLinkClick);

// Expose navigation globally
window.navigateTo = (path) => loadPage(path);
