// scripts.js
document.addEventListener("DOMContentLoaded", function() {
    hideLoader();

    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            showLoader();
            const url = this.href;

            setTimeout(() => {
                window.location.href = url;
            }, 2000); // Simula un pequeño retraso para mostrar el loader
        });
    });
});

function showLoader() {
    document.getElementById('loader').style.display = 'flex';
    document.getElementById('content').style.display = 'none';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}
