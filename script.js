// =================================
// Background Music System
// =================================

let musicStarted = false;
const backgroundMusic = document.getElementById('backgroundMusic');
const musicControl = document.getElementById('musicControl');

// Set volume to a comfortable level
if (backgroundMusic) {
    backgroundMusic.volume = 0.4; // 40% volume - adjust as needed
}

// Attempt to autoplay music when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (backgroundMusic) {
        backgroundMusic.play().then(() => {
            musicStarted = true;
            musicControl.classList.add('playing');
            console.log('Music started automatically!');
        }).catch(err => {
            console.log('Autoplay blocked by browser. User can click the music button to start.');
            // Music button is available as fallback
        });
    }
});

// Function to start music (called on first user interaction as backup)
function startMusic() {
    if (!musicStarted && backgroundMusic) {
        backgroundMusic.play().then(() => {
            musicStarted = true;
            musicControl.classList.add('playing');
        }).catch(err => {
            console.log('Music play blocked:', err);
        });
    }
}

// Toggle music play/pause
function toggleMusic() {
    if (!backgroundMusic) return;
    
    if (backgroundMusic.paused) {
        backgroundMusic.play().then(() => {
            musicControl.classList.add('playing');
            musicStarted = true;
        }).catch(err => {
            console.log('Music play failed:', err);
        });
    } else {
        backgroundMusic.pause();
        musicControl.classList.remove('playing');
    }
}

// =================================
// Screen Navigation System
// =================================

let currentScreen = 0;
const totalScreens = 6;

function nextScreen() {
    if (currentScreen < totalScreens - 1) {
        startMusic(); // Start music on first interaction
        goToScreen(currentScreen + 1);
    }
}

function previousScreen() {
    if (currentScreen > 0) {
        goToScreen(currentScreen - 1);
    }
}

function goToScreen(screenIndex) {
    if (screenIndex < 0 || screenIndex >= totalScreens) return;
    
    // Get all screens
    const allScreens = document.querySelectorAll('.screen');
    const current = document.getElementById(`screen-${currentScreen}`);
    const next = document.getElementById(`screen-${screenIndex}`);   
    // Hide all screens except the next one
    allScreens.forEach((screen, index) => {
        if (index === screenIndex) {
            // Show and activate the next screen
            screen.style.display = 'flex';
            setTimeout(() => {
                screen.classList.add('active');
            }, 10);
        } else {
            // Remove active class and hide screen
            screen.classList.remove('active', 'exiting');
            // Delay hiding to allow transition
            setTimeout(() => {
                if (!screen.classList.contains('active')) {
                    screen.style.display = 'none';
                }
            }, 600); // Match transition duration
        }
    });
    
    // Add exiting class to current screen
    if (current && current !== next) {
        current.classList.add('exiting');
    }
    
    // Update progress indicator and current screen
    setTimeout(() => {
        updateProgressIndicator(screenIndex);
        currentScreen = screenIndex;
        
        // Reset letter if moving away from screen 2
        if (currentScreen !== 2) {
            resetLetter();
        }
    }, 100);
}

function updateProgressIndicator(activeIndex) {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index === activeIndex) {
            dot.classList.add('active');
        } else if (index < activeIndex) {
            dot.classList.add('completed');
        }
    });
}

function restartJourney() {
    goToScreen(0);
}

// =================================
// Swipe Gesture Detection
// =================================

let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

function handleSwipeGesture() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistanceX = touchEndX - touchStartX;
    const swipeDistanceY = touchEndY - touchStartY;
    
    // Only trigger if horizontal swipe is more dominant than vertical
    if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
        if (Math.abs(swipeDistanceX) > swipeThreshold) {
            if (swipeDistanceX > 0) {
                // Swiped right - go to previous screen
                previousScreen();
            } else {
                // Swiped left - go to next screen
                nextScreen();
            }
        }
    }
}

// Add touch event listeners to the screens container
document.addEventListener('DOMContentLoaded', () => {
    const screensContainer = document.querySelector('.screens-container');
    
    if (screensContainer) {
        screensContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        screensContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipeGesture();
        }, { passive: true });
    }
});

// Allow clicking on progress dots to navigate
document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Only allow going to completed or current screen
            if (index <= currentScreen) {
                goToScreen(index);
            }
        });
    });
});

// =================================
// Countdown Timer
// =================================

function updateCountdown() {
    // Birthday: February 17, 2026 at midnight
    const birthday = new Date('2026-02-17T00:00:00+07:00').getTime();
    const now = new Date().getTime();
    const distance = birthday - now;

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    // Check if birthday has arrived
    if (distance < 0) {
        document.getElementById('countdownTimer').innerHTML = `
            <div style="grid-column: 1/-1; font-size: 2rem; text-align: center; padding: 2rem;">
                🎉 It's Your Birthday! 🎉
            </div>
        `;
    }
}

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

// =================================
// Floating Hearts Animation
// =================================

function createFloatingHeart() {
    const heartsContainer = document.getElementById('heartsContainer');
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '💗';
    
    // Random position
    heart.style.left = Math.random() * 100 + '%';
    
    // Random animation delay and duration
    const duration = 6 + Math.random() * 4; // 6-10 seconds
    const delay = Math.random() * 5; // 0-5 seconds delay
    
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = delay + 's';
    
    heartsContainer.appendChild(heart);
    
    // Remove heart after animation completes
    setTimeout(() => {
        heart.remove();
    }, (duration + delay) * 1000);
}

// Create hearts periodically
setInterval(createFloatingHeart, 800);

// Create initial batch of hearts
for (let i = 0; i < 8; i++) {
    setTimeout(createFloatingHeart, i * 200);
}

// =================================
// Reveal Love Letter
// =================================

function revealLetter() {
    const letterContent = document.getElementById('letterContent');
    const revealBtn = document.getElementById('revealLetterBtn');
    
    // Hide button
    revealBtn.style.opacity = '0';
    revealBtn.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        revealBtn.classList.add('hidden');
        
        // Show letter content
        letterContent.style.display = 'block';
        letterContent.style.opacity = '0';
        letterContent.style.transform = 'translateY(20px)';
        
        // Animate letter content appearance
        setTimeout(() => {
            letterContent.style.transition = 'all 0.8s ease-out';
            letterContent.style.opacity = '1';
            letterContent.style.transform = 'translateY(0)';
        }, 50);
        
        // Create heart burst effect
        const colors = ['💗', '💕', '💖', '💝'];
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = colors[Math.floor(Math.random() * colors.length)];
                heart.style.cssText = `
                    position: fixed;
                    font-size: 2rem;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    z-index: 9999;
                    animation: burstHeart 1.2s ease-out forwards;
                `;
                
                const angle = (i / 15) * Math.PI * 2;
                const distance = 150;
                heart.style.setProperty('--burst-x', Math.cos(angle) * distance + 'px');
                heart.style.setProperty('--burst-y', Math.sin(angle) * distance + 'px');
                
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 1200);
            }, i * 40);
        }
        
        // Add burst animation if not exists
        if (!document.getElementById('burst-styles')) {
            const style = document.createElement('style');
            style.id = 'burst-styles';
            style.textContent = `
                @keyframes burstHeart {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(
                            calc(-50% + var(--burst-x)),
                            calc(-50% + var(--burst-y))
                        ) scale(1);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }, 300);
}

function resetLetter() {
    const letterContent = document.getElementById('letterContent');
    const revealBtn = document.getElementById('revealLetterBtn');
    
    if (letterContent && revealBtn) {
        letterContent.style.display = 'none';
        revealBtn.classList.remove('hidden');
        revealBtn.style.opacity = '1';
        revealBtn.style.transform = 'scale(1)';
    }
}

// =================================
// Celebration Effect
// =================================

function triggerCelebration() {
    const colors = ['#ff6b9d', '#c44569', '#ffd700', '#ff8fab', '#ffc9da'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfetti(colors);
    }
    
    // Play celebration animation on button
    const button = event.target;
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    // Show birthday message
    showBirthdayMessage();
}

function createConfetti(colors) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    
    document.body.appendChild(confetti);
    
    confetti.style.animation = 'confettiFall linear forwards';
    
    setTimeout(() => {
        confetti.remove();
    }, 5000);
}

function showBirthdayMessage() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Create message box
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        background: linear-gradient(135deg, #2d1b4e 0%, #1a0e2e 100%);
        border: 2px solid #ff6b9d;
        border-radius: 30px;
        padding: 3rem;
        text-align: center;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(255, 107, 157, 0.4);
        animation: scaleIn 0.5s ease-out;
    `;
    
    messageBox.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1rem;">🎂🎉🎁</div>
        <h2 style="font-size: 2rem; color: #ff6b9d; margin-bottom: 1rem;">Happy Birthday Thida!</h2>
        <p style="font-size: 1.2rem; color: #f0e6ff; line-height: 1.6; margin-bottom: 2rem;">
            Wishing you a day filled with love, laughter, and unforgettable moments! 
            You deserve all the happiness in the world! 💕
        </p>
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
            border: none;
            padding: 1rem 2.5rem;
            font-size: 1.1rem;
            font-weight: 600;
            color: white;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(255, 107, 157, 0.4);
            font-family: 'Poppins', sans-serif;
        ">Thank You! 💕</button>
    `;
    
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
    
    // Add animations in style tag
    if (!document.getElementById('celebration-styles')) {
        const style = document.createElement('style');
        style.id = 'celebration-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// =================================
// Easter Egg - Click on Name
// =================================

let clickCount = 0;
const nameElement = document.querySelector('.name');

if (nameElement) {
    nameElement.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 3) {
            // Secret message after 3 clicks on name
            const secretHearts = ['💖', '💕', '💗', '💓', '💝'];
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const heart = document.createElement('div');
                    heart.textContent = secretHearts[Math.floor(Math.random() * secretHearts.length)];
                    heart.style.cssText = `
                        position: fixed;
                        font-size: 3rem;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        animation: explodeHeart 1.5s ease-out forwards;
                        pointer-events: none;
                        z-index: 9999;
                    `;
                    document.body.appendChild(heart);
                    
                    setTimeout(() => heart.remove(), 1500);
                }, i * 50);
            }
            
            if (!document.getElementById('explode-styles')) {
                const style = document.createElement('style');
                style.id = 'explode-styles';
                style.textContent = `
                    @keyframes explodeHeart {
                        0% {
                            transform: translate(-50%, -50%) scale(0);
                            opacity: 1;
                        }
                        100% {
                            transform: translate(
                                calc(-50% + ${Math.random() * 400 - 200}px),
                                calc(-50% + ${Math.random() * 400 - 200}px)
                            ) scale(1);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            clickCount = 0;
        }
    });
}

// =================================
// Initialize Screens on Page Load
// =================================
// Hide all screens except the first one to prevent excessive scroll
document.addEventListener('DOMContentLoaded', () => {
    const allScreens = document.querySelectorAll('.screen');
    allScreens.forEach((screen, index) => {
        if (index !== 0) {
            screen.style.display = 'none';
        }
    });
});
