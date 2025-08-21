const contentDiv = document.getElementById('content');
const mainNavLinks = document.querySelectorAll('.main-header .nav-link');

// Load and inject the requested page content
async function loadPage(path) {
    // Normalize path
    path = path.replace('.html', '').trim();
    if (!path || path === 'index') path = 'home';

    // Update the address bar hash BEFORE loading content
    history.replaceState({}, '', `#${path}`);

    // Optional: Show a basic loading state
    contentDiv.innerHTML = '<div class="loader">Loading...</div>';

    try {
        const response = await fetch(`pages/${path}.html`);
        if (!response.ok) throw new Error('Page not found');

        // Inject content
        contentDiv.innerHTML = await response.text();

        // Scroll to top and update title/nav
        window.scrollTo(0, 0);
        updateDocumentTitle();
        updateActiveNavLink(path);

        // Wait for all images to load (optional polish)
        await waitForImages(contentDiv);

    } catch (error) {
        console.error(`Error loading page "${path}":`, error);

        // Load 404 fallback page
        const notFoundResponse = await fetch('pages/404.html');
        contentDiv.innerHTML = await notFoundResponse.text();
        document.title = 'Page Not Found | Dlegateus';

        await waitForImages(contentDiv);
    }
}

// Wait for all images inside a container to load
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

// Update <title> dynamically from heading/title element
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

// Handle navigation on page load or when hash changes
function handleNavigation() {
    let hash = window.location.hash.substring(1).trim();

    // Default to home if no hash
    if (!hash) {
        hash = 'home';
        history.replaceState({}, '', `#${hash}`);  // Don't add a new history entry
    }

    loadPage(hash);
}

// Intercept clicks and route them through the SPA
function handleLinkClick(e) {
    const navLink = e.target.closest('[data-router-link], .nav-link, .navbar-brand');
    if (navLink && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const href = navLink.getAttribute('href');
        const path = href.startsWith('#') ? href.substring(1) : href;
        loadPage(path);
    }
}

// Register event listeners
window.addEventListener('DOMContentLoaded', handleNavigation);
window.addEventListener('hashchange', handleNavigation);
document.addEventListener('click', handleLinkClick);

// Global navigation function for programmatic routing
window.navigateTo = (path) => loadPage(path);
