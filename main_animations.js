// Configuration
const ANIMATION_DELAY = 390; // Delay between animations (in milliseconds)
const ANIMATION_FILES = {
    loved: 'assets/loved.json', // Path to love animation
    hated: 'assets/hated.json', // Path to hate animation
    like: 'assets/like.json', // Path to like animation
};

// Nav bar height (adjust this value based on your nav bar's height)
const NAV_BAR_HEIGHT = 80; // Height of the navigation bar in pixels

// Function to create a Lottie animation
function createAnimation(type) {
    const animation = document.createElement('dotlottie-player');
    animation.setAttribute('src', ANIMATION_FILES[type]);
    animation.setAttribute('background', 'transparent');
    animation.setAttribute('speed', '0.8');
    animation.setAttribute('loop', 'false');
    animation.setAttribute('autoplay', 'true');
    animation.style.position = 'absolute';
    animation.style.width = '100px'; // Adjust size as needed
    animation.style.height = '100px'; // Adjust size as needed
    animation.style.zIndex = '-2'; // Behind the background image (z-index: -1)
    animation.style.opacity = '0.3'; // 30% opacity

    // Randomly position the animation
    const x = Math.random() * (window.innerWidth - 100); // Adjust for animation width
    const y = NAV_BAR_HEIGHT + Math.random() * (window.innerHeight - NAV_BAR_HEIGHT - 100); // Adjust for animation height
    animation.style.left = `${x}px`;
    animation.style.top = `${y}px`;

    // Add the animation to the container
    document.getElementById('lottie-container').appendChild(animation);

    // Debugging: Log animation creation
    console.log(`Created ${type} animation at (${x}, ${y})`);

    // Remove the animation after it finishes playing
    animation.addEventListener('complete', () => {
        document.getElementById('lottie-container').removeChild(animation);

        // Debugging: Log animation removal
        console.log(`Removed ${type} animation`);
    });
}

// Function to start the animation sequence
function startAnimationSequence() {
    const types = ['loved', 'hated', 'like']; // Animation types

    // Create a new animation every ANIMATION_DELAY milliseconds
    setInterval(() => {
        const randomType = types[Math.floor(Math.random() * types.length)]; // Randomly choose love, like, or hate
        createAnimation(randomType);
    }, ANIMATION_DELAY);
}

// Start the animation sequence when the page loads
window.addEventListener('load', startAnimationSequence);