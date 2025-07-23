/**
 * Mac OS Boot-up Video Preloader
 * Handles the boot-up video that plays before the main website loads
 */

document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('mainContent');
    const bootVideo = document.getElementById('bootVideo');
    const skipButton = document.getElementById('skipButton');

    // Fallback timer reference
    let fallbackTimer;

    /**
     * Hide preloader and show main content with smooth transition
     */
    function hidePreloader() {
        preloader.classList.add('fade-out');

        setTimeout(() => {
            preloader.style.display = 'none';
            mainContent.classList.add('show');
            // Cleanup preloader resources
            cleanupPreloader();
        }, 800); // Match the CSS transition duration
    }

    function cleanupPreloader() {
        // Just clean up any preloader-specific resources if needed
        console.log('Boot-up complete - main website loaded');
    }

    /**
     * Set up video event listeners and controls
     */
    function setupVideoControls() {
        // Hide preloader when video ends naturally
        bootVideo.addEventListener('ended', function () {
            clearTimeout(fallbackTimer);
            hidePreloader();
        });

        // Skip button functionality
        if (skipButton) {
            skipButton.addEventListener('click', function () {
                bootVideo.currentTime = bootVideo.duration; // Jump to end
            });
        }

        // Handle video loading errors
        bootVideo.addEventListener('error', function () {
            console.log('Boot video failed to load, showing main content');
            clearTimeout(fallbackTimer);
            hidePreloader();
        });

        // Handle successful video load and attempt autoplay
        bootVideo.addEventListener('canplay', function () {
            // Try to play with sound first (modern browsers may block this)
            bootVideo.muted = false;

            bootVideo.play().catch(function (error) {
                console.log('Autoplay with sound failed, trying muted:', error);
                // Fallback to muted autoplay
                bootVideo.muted = true;

                bootVideo.play().catch(function (mutedError) {
                    console.log('Video playback failed entirely:', mutedError);
                    clearTimeout(fallbackTimer);
                    hidePreloader();
                });
            });
        });

        // Clear fallback timer when video starts playing successfully
        bootVideo.addEventListener('playing', function () {
            clearTimeout(fallbackTimer);
            console.log('Boot video playing successfully');
        });

        // Handle when video is paused (shouldn't happen with autoplay)
        bootVideo.addEventListener('pause', function () {
            console.log('Boot video paused unexpectedly');
        });
    }

    /**
     * Initialize the preloader system
     */
    function initPreloader() {
        // Set up video controls
        setupVideoControls();

        // Set fallback timer (4 seconds max wait time)
        fallbackTimer = setTimeout(function () {
            console.log('Fallback timer triggered - showing main content');
            hidePreloader();
        }, 4000);

        // Optional: Allow clicking anywhere on preloader to skip (except skip button)
        preloader.addEventListener('click', function (event) {
            // Don't skip if clicking the skip button (it has its own handler)
            if (event.target !== skipButton) {
                bootVideo.currentTime = bootVideo.duration;
            }
        });
    }

    // Start the preloader system
    initPreloader();

    // Optional: Expose functions globally for debugging
    window.preloaderControls = {
        skip: function () {
            bootVideo.currentTime = bootVideo.duration;
        },
        forceHide: function () {
            clearTimeout(fallbackTimer);
            hidePreloader();
        },
        getVideoState: function () {
            return {
                currentTime: bootVideo.currentTime,
                duration: bootVideo.duration,
                paused: bootVideo.paused,
                muted: bootVideo.muted,
                readyState: bootVideo.readyState
            };
        }
    };
});