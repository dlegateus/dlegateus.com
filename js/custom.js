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
