/**
 * Mac OS Boot-up Video Preloader with First Visit Detection
 * Only shows boot-up video on first visit to avoid annoyance
 */

document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('mainContent');
    const bootVideo = document.getElementById('bootVideo');
    const skipButton = document.getElementById('skipButton');

    // Check if user has visited before
    const hasVisitedBefore = localStorage.getItem('hasSeenBootVideo');

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
            cleanupPreloader();
        }, 800);
    }

    /**
     * Skip directly to main content without video
     */
    function skipToMainContent() {
        preloader.style.display = 'none';
        mainContent.classList.add('show');
        mainContent.style.opacity = '1'; // Immediate show, no fade
        console.log('Returning visitor - skipping boot video');
    }

    function cleanupPreloader() {
        // Mark that user has seen the boot video
        localStorage.setItem('hasSeenBootVideo', 'true');
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
                bootVideo.currentTime = bootVideo.duration;
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
            bootVideo.play().catch(function (error) {
                console.log('Video playback failed:', error);
                clearTimeout(fallbackTimer);
                hidePreloader();
            });
        });

        // Clear fallback timer when video starts playing successfully
        bootVideo.addEventListener('playing', function () {
            clearTimeout(fallbackTimer);
            console.log('Boot video playing successfully');
        });
    }

    /**
     * Initialize the preloader system
     */
    function initPreloader() {
        // If user has visited before, skip the boot video entirely
        if (hasVisitedBefore) {
            skipToMainContent();
            return;
        }

        // First-time visitor - show boot video
        console.log('First-time visitor - showing boot video');

        // Set up video controls
        setupVideoControls();

        // Set fallback timer (4 seconds max wait time)
        fallbackTimer = setTimeout(function () {
            console.log('Fallback timer triggered - showing main content');
            hidePreloader();
        }, 4000);

        // Allow clicking anywhere on preloader to skip
        preloader.addEventListener('click', function (event) {
            if (event.target !== skipButton) {
                bootVideo.currentTime = bootVideo.duration;
            }
        });
    }

    // Start the preloader system
    initPreloader();

    // Enhanced debugging functions
    window.preloaderControls = {
        skip: function () {
            if (bootVideo && bootVideo.duration) {
                bootVideo.currentTime = bootVideo.duration;
            }
        },
        forceHide: function () {
            clearTimeout(fallbackTimer);
            hidePreloader();
        },
        resetFirstVisit: function () {
            localStorage.removeItem('hasSeenBootVideo');
            console.log('First visit flag reset - reload page to see boot video again');
        },
        checkVisitStatus: function () {
            return {
                hasVisitedBefore: !!localStorage.getItem('hasSeenBootVideo'),
                canResetWith: 'preloaderControls.resetFirstVisit()'
            };
        },
        getVideoState: function () {
            return bootVideo ? {
                currentTime: bootVideo.currentTime,
                duration: bootVideo.duration,
                paused: bootVideo.paused,
                muted: bootVideo.muted,
                readyState: bootVideo.readyState
            } : 'Video not available (returning visitor)';
        }
    };
});