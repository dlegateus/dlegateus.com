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
// Track user interactions
document.addEventListener('DOMContentLoaded', function () {
    // Track CTA button clicks
    document.addEventListener('click', function (e) {
        // Track navigation clicks
        if (e.target.matches('.nav-link, [data-router-link]')) {
            const linkText = e.target.textContent.trim();
            const linkHref = e.target.getAttribute('href');

            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'navClick',
                    'linkText': linkText,
                    'linkHref': linkHref
                });
            }
        }

        // Track CTA button clicks
        if (e.target.matches('.cta-button, .custom-btn')) {
            const buttonText = e.target.textContent.trim();

            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'ctaClick',
                    'buttonText': buttonText,
                    'buttonLocation': e.target.closest('section') ? e.target.closest('section').id || 'unknown' : 'unknown'
                });
            }
        }

        // Track social media clicks
        if (e.target.closest('a[href*="facebook"], a[href*="linkedin"], a[href*="instagram"], a[href*="youtube"]')) {
            const socialLink = e.target.closest('a').href;

            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'socialClick',
                    'socialPlatform': getSocialPlatform(socialLink)
                });
            }
        }
    });

    // Track form submissions
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

    // Track scroll depth
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
    });
});

// Helper function to extract social platform from URL
function getSocialPlatform(url) {
    if (url.includes('facebook')) return 'Facebook';
    if (url.includes('linkedin')) return 'LinkedIn';
    if (url.includes('instagram')) return 'Instagram';
    if (url.includes('youtube')) return 'YouTube';
    return 'Other';
}
//***************************Google Tag Manager Tracking End***************************