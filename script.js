document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. SELECTORS & DOM ELEMENTS
    // -------------------------------------------------------------------------
    const btnEnter = document.getElementById('btn-enter');
    const sectionLanding = document.getElementById('section-landing');
    const surpriseWrapper = document.getElementById('surprise-wrapper');
    const sectionReveal = document.getElementById('section-reveal');
    
    const bgAudio = document.getElementById('bg-audio');
    const audioToggle = document.getElementById('audio-toggle');
    const iconPlaying = document.getElementById('sound-icon-playing');
    const iconMuted = document.getElementById('sound-icon-muted');
    
    const envelope = document.getElementById('interactive-envelope');
    const btnResetEnvelope = document.getElementById('btn-reset-envelope');
    const messageControls = document.getElementById('message-controls');
    
    const canvas = document.getElementById('ambient-particles');
    const ctx = canvas.getContext('2d');

    // Create backdrop for letter expansion dynamically
    const letterBackdrop = document.createElement('div');
    letterBackdrop.className = 'letter-backdrop';
    document.body.appendChild(letterBackdrop);

    // -------------------------------------------------------------------------
    // 2. LANDING & TRANSITION HANDLER
    // -------------------------------------------------------------------------
    btnEnter.addEventListener('click', () => {
        // Play audio (browser allows sound now as this is a user click)
        playAudio();

        // Show the surprise contents & floating audio button
        surpriseWrapper.classList.remove('hidden');
        audioToggle.classList.remove('hidden');

        // Transition landing screen upwards
        sectionLanding.classList.add('slide-up');

        // After landing screen slides away, trigger section-reveal animations
        setTimeout(() => {
            sectionReveal.classList.add('revealed');
            sectionLanding.style.display = 'none'; // remove from layout
            
            // Auto open the envelope after a short delay for cinematic pacing
            setTimeout(() => {
                openEnvelope();
            }, 600);
        }, 1200);
    });

    // -------------------------------------------------------------------------
    // 3. AUDIO CONTROLLER
    // -------------------------------------------------------------------------
    let isPlaying = false;

    function playAudio() {
        bgAudio.play()
            .then(() => {
                isPlaying = true;
                iconPlaying.classList.remove('hidden');
                iconMuted.classList.add('hidden');
            })
            .catch(error => {
                console.log("Audio autoplay failed or blocked:", error);
            });
    }

    function pauseAudio() {
        bgAudio.pause();
        isPlaying = false;
        iconPlaying.classList.add('hidden');
        iconMuted.classList.remove('hidden');
    }

    audioToggle.addEventListener('click', () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });

    // -------------------------------------------------------------------------
    // 4. INTERACTIVE ENVELOPE (Message Section)
    // -------------------------------------------------------------------------
    let envelopeState = 'closed'; // closed, open, expanded

    function openEnvelope() {
        if (envelopeState !== 'closed') return;
        envelopeState = 'open';
        envelope.classList.add('open');
        envelope.setAttribute('aria-expanded', 'true');

        // Wait for flap/slide animation, then expand letter and show controls
        setTimeout(() => {
            if (envelopeState === 'open') {
                expandLetter();
            }
        }, 1100);
    }

    function expandLetter() {
        envelopeState = 'expanded';
        envelope.classList.add('expanded');
        letterBackdrop.classList.add('active');
        messageControls.classList.add('visible');
        messageControls.classList.remove('hidden');
    }

    function resetEnvelope() {
        envelopeState = 'closed';
        envelope.classList.remove('expanded', 'open');
        envelope.setAttribute('aria-expanded', 'false');
        letterBackdrop.classList.remove('active');
        messageControls.classList.remove('visible');
        
        // Show scroll prompt pointing to memories
        const scrollPrompt = document.getElementById('scroll-prompt');
        if (scrollPrompt) {
            scrollPrompt.classList.remove('hidden');
        }
        
        // Hide controls after fade transition
        setTimeout(() => {
            if (envelopeState === 'closed') {
                messageControls.classList.add('hidden');
            }
        }, 600);
    }

    // Toggle opening
    envelope.addEventListener('click', (e) => {
        // Prevent click events inside the letter content from closing it if expanded
        if (envelopeState === 'expanded' && e.target.closest('.envelope-letter')) {
            return;
        }
        
        if (envelopeState === 'closed') {
            openEnvelope();
        } else if (envelopeState === 'expanded') {
            resetEnvelope();
        }
    });

    // Close when clicking the backdrop
    letterBackdrop.addEventListener('click', resetEnvelope);

    // Reset envelope button
    btnResetEnvelope.addEventListener('click', (e) => {
        e.stopPropagation();
        resetEnvelope();
    });

    // -------------------------------------------------------------------------
    // 5. AMBIENT PARTICLE ENGINE (Canvas)
    // -------------------------------------------------------------------------
    let particles = [];
    let animationId = null;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Resize canvas to fill window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle class
    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? (Math.random() * canvas.height) : (canvas.height + 20);
            this.size = Math.random() * 4 + 2; // size between 2px and 6px
            this.speedY = -(Math.random() * 0.4 + 0.1); // float upwards
            this.speedX = (Math.random() * 0.3 - 0.15); // gentle wobble
            this.alpha = Math.random() * 0.3 + 0.1; // soft opacity
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.type = Math.random() > 0.85 ? 'heart' : 'circle'; // 15% hearts
            this.rotation = Math.random() * Math.PI;
            this.rotationSpeed = (Math.random() * 0.02 - 0.01);
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            
            // Wobble
            this.speedX += (Math.random() * 0.04 - 0.02);
            // Cap horizontal speed
            if (this.speedX > 0.4) this.speedX = 0.4;
            if (this.speedX < -0.4) this.speedX = -0.4;

            this.rotation += this.rotationSpeed;

            // Reset if out of bounds
            if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = '#E8C5C8'; // Soft blush
            ctx.strokeStyle = '#E8C5C8';

            if (this.type === 'heart') {
                // Draw a small heart shape
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.beginPath();
                // Heart path
                const sizeFactor = this.size * 1.5;
                ctx.moveTo(0, -sizeFactor / 4);
                ctx.bezierCurveTo(sizeFactor / 2, -sizeFactor, sizeFactor, -sizeFactor / 2, 0, sizeFactor);
                ctx.bezierCurveTo(-sizeFactor, -sizeFactor / 2, -sizeFactor / 2, -sizeFactor, 0, -sizeFactor / 4);
                ctx.closePath();
                ctx.fill();
            } else {
                // Draw a standard soft glow circle
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Initialize particles
    const maxParticles = isReducedMotion ? 15 : 60; // scale down if user prefers reduced motion
    function initParticles() {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // Start particles
    initParticles();
    animate();

    // -------------------------------------------------------------------------
    // 6. SCROLL ANIMATIONS (Intersection Observer)
    // -------------------------------------------------------------------------
    const scrollRevealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Mute and pause gallery video if it goes out of view
                const video = entry.target.querySelector('video');
                if (video) {
                    // Video is inside view, do nothing. But we handle out-of-view elsewhere
                }
            } else {
                // If gallery is out of view, pause the video
                const video = entry.target.querySelector('video');
                if (video) {
                    video.pause();
                }
            }
        });
    }, scrollRevealOptions);

    // Apply scroll observer to key containers
    const cards = document.querySelectorAll('.gallery-card');
    cards.forEach(card => {
        // Add scroll animation styles dynamically if not in css
        card.style.opacity = '0';
        card.style.transform = card.classList.contains('rot-left') 
            ? 'rotate(-5deg) translateY(30px)' 
            : 'rotate(5deg) translateY(30px)';
        card.style.transition = 'opacity 1s ease, transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
        scrollObserver.observe(card);
    });

    // Observer action logic for cards
    document.addEventListener('scroll', () => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            if (rect.top <= viewHeight * 0.85) {
                card.style.opacity = '1';
                // Restore their original tilt rotations
                const rotation = card.classList.contains('rot-left') ? '-2deg' : '2deg';
                // But respect reduced motion
                if (isReducedMotion) {
                    card.style.transform = 'none';
                } else {
                    card.style.transform = `rotate(${rotation}) translateY(0)`;
                }
            }
        });
    });

});
