function setOffcanvasClass() {
    const offcanvas = document.getElementById('offcanvasNavbar');
    if (window.innerWidth < 992) {
        offcanvas.classList.remove('offcanvas-start');
        offcanvas.classList.add('offcanvas-top');
    } else {
        offcanvas.classList.remove('offcanvas-top');
        offcanvas.classList.add('offcanvas-start');
    }
}

window.addEventListener('resize', setOffcanvasClass);
window.addEventListener('DOMContentLoaded', setOffcanvasClass);