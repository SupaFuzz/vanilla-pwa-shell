// every 5 minutes for demo purposes (do change this, fo sho)
const app_update_check_interval = (60 * 5 * 1000);

window.onload = () => {
    if ('serviceWorker' in navigator) {
        registerServiceWorker();
    }
};

function registerServiceWorker() {
    navigator.serviceWorker.register('./serviceWorker.js', {scope: './'})
        .then((registration) => {
            console.log('Service Worker registered with scope: ', registration.scope);

            registration.addEventListener('updatefound', () => {
                // An installing service worker is found
                const installingWorker = registration.installing;
                installingWorker.addEventListener('statechange', () => {
                    // New service worker is in the waiting state
                    if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateButton(registration);
                    }
                });
            });
        }).catch((error) => {
            console.error('Service Worker registration failed: ', error);
        });
}

function showUpdateButton(registration) {
    const updateButton = document.getElementById('btnInstallUpdate');
    const statusMessage = document.getElementById('status-message');
    updateButton.disabled = false;

    updateButton.addEventListener('click', () => {
        // Send message to the waiting service worker to skip waiting
        if (registration.waiting){ registration.waiting.postMessage({ type: 'SKIP_WAITING' }); }
        window.location.reload();
    });
}

// Reload the page when the service worker controller changes (i.e., the new one takes over)
navigator.serviceWorker.addEventListener('controllerchange', () => {
    /*
        if you don't want to wait for the user to click the "Install & Restart" button
        and you just wanna brute-force reload on the spot, uncomment this lil guy
    */
    //window.location.reload();
});


// when the document is ready ...
document.addEventListener("DOMContentLoaded", (evt) => {

    // add a hook for the check-button
    const btnCheck = document.getElementById('btnCheckForUpdates');
    btnCheck.addEventListener('click', (evt) => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.update().then((newRegistration) => {
                    console.log("registration update requested (user check)");
                });
            });
        }
    });

    // setup a timer to check for updates every app_update_check_interval miliseconds
    setInterval(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.update().then((newRegistration) => {
                    console.log("registration update requested (automatically)");
                });
            });
        }
    }, app_update_check_interval);

});
