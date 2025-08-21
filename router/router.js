const contentDiv = document.getElementById('content');
const mainNavLinks = document.querySelectorAll('.main-header .nav-link');

// Load and inject the requested page content
async function loadPage(path) {
    path = path.replace('.html', '').trim();
    if (!path || path === 'index') path = 'home';

    // Skip fetching if home is already preloaded
    const isFirstLoad = contentDiv.getAttribute('data-loaded') !== 'true';
    if (path === 'home' && isFirstLoad) {
        contentDiv.setAttribute('data-loaded', 'true');
        updateDocumentTitle();
        updateActiveNavLink(path);
        history.replaceState({}, '', `#home`);
        return;
    }

    // Update the hash in the address bar
    history.replaceState({}, '', `#${path}`);

    // Optional: Show a loader for non-home pages
    contentDiv.innerHTML = '<div class="loader">Loading...</div>';

    try {
        const response = await fetch(`pages/${path}.html`);
        if (!response.ok) throw new Error('Page not found');

        contentDiv.innerHTML = await response.text();
        contentDiv.setAttribute('data-loaded', 'true');

        window.scrollTo(0, 0);
        updateDocumentTitle();
        updateActiveNavLink(path);

        await waitForImages(contentDiv);

    } catch (error) {
        console.error(`Error loading page "${path}":`, error);

        const notFoundResponse = await fetch('pages/404.html');
        contentDiv.innerHTML = await notFoundResponse.text();
        document.title = 'Page Not Found | Dlegateus';

        await waitForImages(contentDiv);
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

// Handle navigation on page load or hash change
function handleNavigation() {
    let hash = window.location.hash.substring(1).trim();

    // Default to #home if no hash
    if (!hash) {
        hash = 'home';
        history.replaceState({}, '', `#${hash}`);
    }

    loadPage(hash);
}

// Intercept navigation link clicks
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

// Global navigation function
window.navigateTo = (path) => loadPage(path);
