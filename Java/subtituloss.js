// Select the subtitle element
const subtitle = document.getElementById("subtitle");

// Use GSAP to animate the subtitle when the page loads
window.onload = function() {
    // Animate the opacity and position with easing
    gsap.to(subtitle, {
        duration: 3,
        ease: "circ.out", 
        opacity: 1, 
        y: 0, 
    });
};