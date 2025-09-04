//***************************Scroll to Top Button Start***************************
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.onscroll = function () {
    // Show or hide the scroll to top button
    if (window.scrollY > 100) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

scrollToTopBtn.onclick = function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
//***************************Scroll to Top Button End***************************


//***************************Footer Year Start***************************
const currentYear = new Date().getFullYear();
document.getElementById('year').textContent = currentYear;
//***************************Footer Year End***************************


//***************************Google Tag Manager Tracking Start***************************
// Enhanced tracking for user interactions
document.addEventListener('DOMContentLoaded', function () {
    // Track pageView on initial load
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': 'pageView',
            'pageName': window.location.hash.replace('#', '') || 'home',
            'pagePath': window.location.hash || '#home',
            'pageTitle': document.title
        });
    }

    // Consolidated click tracking function
    function trackClickEvent(e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.href;
        const linkText = link.textContent.trim();
        const linkClasses = link.className;

        // Track navClick events
        if (link.matches('.nav-link, [data-router-link]')) {
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'navClick',
                    'linkText': linkText,
                    'linkHref': href
                });
            }
            return;
        }

        // Track CTA button clicks
        if (link.matches('.cta-button, .custom-btn')) {
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'ctaClick',
                    'buttonText': linkText,
                    'buttonLocation': link.closest('section') ? link.closest('section').id || 'unknown' : 'unknown'
                });
            }
            return;
        }

        // Track social media clicks (ONLY using data attributes)
        if (link.hasAttribute('data-social-platform')) {
            const platform = link.getAttribute('data-social-platform');
            const action = link.getAttribute('data-social-action') || 'click';
            const network = link.getAttribute('data-social-network') || platform;

            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'socialClick',
                    'socialPlatform': platform,
                    'socialAction': action,
                    'socialNetwork': network,
                    'socialTarget': href
                });
            }

            // For JavaScript void links, prevent default after tracking
            if (href === 'javascript:void(0)') {
                e.preventDefault();
            }
            return;
        }

        // Track all outbound links (outboundLinkClick events)
        if (href && !href.includes(window.location.hostname) && !href.startsWith('javascript:') &&
            !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'outboundLinkClick',
                    'linkText': linkText,
                    'linkHref': href,
                    'linkClasses': linkClasses
                });
            }
            return;
        }

        // Track email links (emailClick events)
        if (href && href.startsWith('mailto:')) {
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'emailClick',
                    'emailAddress': href.replace('mailto:', '')
                });
            }
            return;
        }

        // Track telephone links (phoneClick events)
        if (href && href.startsWith('tel:')) {
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'phoneClick',
                    'phoneNumber': href.replace('tel:', '')
                });
            }
            return;
        }
    }

    // Use a single click event listener
    document.addEventListener('click', trackClickEvent);

    // Track form submissions (formSubmit events)
    document.addEventListener('submit', function (e) {
        if (e.target.matches('form')) {
            const formId = e.target.id || 'unknown-form';

            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'formSubmit',
                    'formId': formId,
                    'formName': formId === 'getInTouch' ? 'Contact Form' :
                        formId === 'freetrialForm' ? 'Free Trial Form' : 'Unknown Form'
                });
            }
        }
    });

    // Track form interactions (focus events)
    document.addEventListener('focus', function (e) {
        if (e.target.matches('input, textarea, select')) {
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'formFieldFocus',
                    'fieldType': e.target.type,
                    'fieldName': e.target.name || 'unnamed',
                    'formId': e.target.form ? e.target.form.id || 'unknown-form' : 'no-form'
                });
            }
        }
    }, true);

    // Track scroll depth (scrollDepth events)
    let scrollDepthTracked = [25, 50, 75, 90];
    window.addEventListener('scroll', function () {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

        if (scrollDepthTracked.includes(scrollPercent)) {
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'scrollDepth',
                    'scrollPercentage': scrollPercent
                });
            }
            // Remove this percentage from tracking array
            scrollDepthTracked = scrollDepthTracked.filter(p => p !== scrollPercent);
        }

        // Enhanced scroll tracking (scrollUpdate events)
        const now = Date.now();
        if (now - lastScrollReport < scrollReportDelay) return;
        lastScrollReport = now;

        const viewportHeight = window.innerHeight;
        const totalHeight = document.documentElement.scrollHeight;

        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                'event': 'scrollUpdate',
                'scrollPercentage': scrollPercent,
                'viewportHeight': viewportHeight,
                'totalHeight': totalHeight,
                'verticalPixels': window.scrollY
            });
        }
    });
});

// Track JavaScript errors
window.addEventListener('error', function (e) {
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': 'javascriptError',
            'errorMessage': e.error ? e.error.message : e.message,
            'errorFile': e.filename,
            'errorLine': e.lineno,
            'errorColumn': e.colno
        });
    }
});

// Track promise rejections
window.addEventListener('unhandledrejection', function (e) {
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': 'promiseRejection',
            'reason': e.reason ? e.reason.message : 'Unknown reason'
        });
    }
});

// Enhanced scroll tracking variables
let lastScrollReport = 0;
const scrollReportDelay = 500; // ms

// Time tracking
let pageStartTime = Date.now();

function trackTimeOnPage() {
    const timeSpent = Date.now() - pageStartTime;
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': 'timeOnPage',
            'timeSpent': Math.round(timeSpent / 1000) + 's',
            'pageName': window.location.hash.replace('#', '') || 'home'
        });
    }
}

// Track every 30 seconds
setInterval(trackTimeOnPage, 30000);

// Track when user leaves the page
window.addEventListener('beforeunload', trackTimeOnPage);

//***************************Google Tag Manager Tracking End***************************


//***************************Mobile Navbar Toggle***************************
document.addEventListener('DOMContentLoaded', function () {
    // Wait for SlickNav to initialize
    setTimeout(function () {
        // Get all navigation links in the mobile menu
        const mobileNavLinks = document.querySelectorAll('.slicknav_nav a');

        // Add click event to each navigation link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function () {
                // Find the SlickNav toggle button
                const toggleButton = document.querySelector('.slicknav_btn');

                if (toggleButton) {
                    // Check if the menu is currently open
                    if (toggleButton.classList.contains('slicknav_open')) {
                        // Trigger a click on the toggle button to close the menu
                        toggleButton.click();
                    }
                }
            });
        });
    }, 500); // Give SlickNav time to initialize
});
//***************************Mobile Navbar Toggle***************************