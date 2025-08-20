//***************************Sticky Header and Scroll to Top Button Start***************************
const header = document.querySelector(".main-header");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const sticky = header.offsetTop;

// Handle scroll events
window.onscroll = function () {
    // Sticky Header Logic
    if (window.scrollY > sticky) {
        header.style.position = "fixed";
        header.style.top = "0";
        header.style.width = "100%";
        header.style.zIndex = "1000";
        document.body.style.paddingTop = header.offsetHeight + 'px';
    } else {
        header.style.position = "static";
        document.body.style.paddingTop = '0';
    }

    // Show or hide the scroll to top button
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

// Scroll to top function
scrollToTopBtn.onclick = function (event) {
    event.preventDefault(); // Prevent the default anchor behavior
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll smoothly to the top
};
//***************************Sticky Header and Scroll to Top Button End***************************


//***************************Footer Year Start***************************
const currentYear = new Date().getFullYear(); // Get the current year
document.getElementById('year').textContent = currentYear; // Insert the year into the span with id="year"
//***************************Footer Year End***************************


