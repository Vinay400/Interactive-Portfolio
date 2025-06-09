// Three.js 3D Background Animation
class ParticleBackground {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('bg-canvas'),
            alpha: true,
            antialias: true
        });
        
        this.init();
        this.createParticles();
        this.animate();
        this.handleResize();
    }
    
    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 5;
        
        // Ensure canvas is behind content
        const canvas = document.getElementById('bg-canvas');
        canvas.style.zIndex = '-1';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
    }
    
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const colorOptions = [
            new THREE.Color(0x8b5cf6), // Purple
            new THREE.Color(0x06b6d4), // Cyan
            new THREE.Color(0xec4899), // Pink
        ];
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.particles.rotation.x += 0.0005;
        this.particles.rotation.y += 0.001;
        
        const positions = this.particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(Date.now() * 0.0005 + i) * 0.0001;
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link[data-section]');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.sections = document.querySelectorAll('.section');
        
        this.init();
    }
    
    init() {
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.setupMobileMenu();
        this.setupScrollEffect();
        this.setupResumeDownload();
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-section');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu if open
                if (this.navMenu.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            });
        });
    }
    
    setupActiveNavigation() {
        window.addEventListener('scroll', () => {
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === current) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    setupMobileMenu() {
        this.hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }
    
    setupScrollEffect() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }
    
    setupResumeDownload() {
        const resumeBtn = document.getElementById('resume-btn');
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Create a link element
            const link = document.createElement('a');
            link.href = 'assets/resume/resume.pdf'; // Path to your PDF file
            link.download = 'Vinay_Guleria_Resume.pdf'; // Name of the downloaded file
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
}

// Contact Form functionality
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        let isValid = true;
        Object.keys(data).forEach(key => {
            const input = this.form.querySelector(`[name="${key}"]`);
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            this.submitForm(data);
        }
    }
    
    validateField(input) {
        const value = input.value.trim();
        const name = input.name;
        const errorElement = document.getElementById(`${name}-error`);
        
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (!value) {
            isValid = false;
            errorMessage = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
        }
        
        // Email validation
        if (name === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        
        // Display error
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
        
        // Add/remove error styling
        if (isValid) {
            input.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        } else {
            input.style.borderColor = '#ef4444';
        }
        
        return isValid;
    }
    
    clearError(input) {
        const errorElement = document.getElementById(`${input.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        input.style.borderColor = 'rgba(139, 92, 246, 0.3)';
    }
    
    submitForm(data) {
        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you soon.');
            this.form.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
}

// Project Modal functionality
class ProjectModal {
    constructor() {
        this.modal = document.getElementById('project-modal');
        this.modalBody = document.getElementById('modal-body');
        this.closeBtn = document.getElementById('close-modal');
        this.projectCards = document.querySelectorAll('.project-card');
        
        this.projectData = {
            1: {
                title: 'E-Mart',
                description: 'E-Mart is a full-stack e-commerce platform built with React, TypeScript, and Firebase. It provides a seamless shopping experience for customers while offering robust management tools for vendors and administrators.',
                technologies: ['React', 'Node.js', 'Firebase', 'TypeScript'],
                features: [
                    'User authentication and authorization',
                    'Product catalog with search and filtering',
                    'Shopping cart and wishlist functionality',
                    'Order management and tracking',
                    'Vendor dashboard for inventory management'
                ],
                github: 'https://github.com/Vinay400/E-Mart',
                demo: 'https://e-mart-kappa.vercel.app/'
            },
            2: {
                title: 'Interactive Resume Website',
                description: 'An interactive resume website built with HTML, CSS, and JavaScript. It provides a seamless and engaging experience for visitors to explore my skills, projects, and experiences.',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Three.js'],
                features: [
                    'Responsive design for all devices',
                    'Smooth scrolling animations',
                    'Interactive 3D background',
                    'Project showcase with detailed descriptions',
                    'Contact form with real-time validation',
                ],
                github: 'https://github.com/Vinay400/interactive-resume',
                demo: 'https://vinay400.github.io/interactive-resume/'
            },
            3: {
                title: 'Organic By Pooja',
                description: 'An e-commerce as well as service provider website.',
                technologies: ['Firebase Authentication', 'Firestore Database', 'API Integration'],
                features: [
                    'Firebase Authentication',
                    'Firestore Database',
                    'API Integration'
                ],
                github: 'https://github.com/vansh-frontend/organic-pooja',
                demo: 'https://www.organicbypooja.in/' 
            },
            4: {
                title: 'Joke App',
                description: 'A joke app demonstrating the use of public API using Axios(Promise based HTTP client between node.js and browser)',
                technologies: ['EJS(Embedded JavaScript)',
                    'Axios',
                    'API Integration',
                    'Node.js',
                    'Express'],
                features: [
                    'API Integration',
                    'Axios'
                ],
                github: 'https://github.com/Vinay400/The-Joke-App',
                demo: 'https://the-joke-app-bmv1-5tkta943m-vinay400s-projects.vercel.app/'
            }
        };
        
        this.init();
    }
    
    init() {
        this.projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project');
                this.showProject(projectId);
            });
        });
        
        this.closeBtn.addEventListener('click', () => {
            this.hideModal();
        });
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.hideModal();
            }
        });
    }
    
    showProject(projectId) {
        const project = this.projectData[projectId];
        if (!project) return;
        
        this.modalBody.innerHTML = `
            <h2 style="color: #8b5cf6; margin-bottom: 1rem; font-size: 1.5rem;">${project.title}</h2>
            <p style="color: #cbd5e1; margin-bottom: 1.5rem; line-height: 1.6;">${project.description}</p>
            
            <h3 style="color: #06b6d4; margin-bottom: 0.5rem;">Technologies Used:</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
                ${project.technologies.map(tech => 
                    `<span style="background: rgba(6, 182, 212, 0.2); color: #06b6d4; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem; border: 1px solid rgba(6, 182, 212, 0.3);">${tech}</span>`
                ).join('')}
            </div>
            
            <h3 style="color: #06b6d4; margin-bottom: 0.5rem;">Key Features:</h3>
            <ul style="color: #94a3b8; margin-bottom: 1.5rem; padding-left: 1.5rem;">
                ${project.features.map(feature => `<li style="margin-bottom: 0.5rem;">${feature}</li>`).join('')}
            </ul>
            
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <a href="${project.github}" style="background: linear-gradient(135deg, #8b5cf6, #06b6d4); color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">View Code</a>
                <a href="${project.demo}" style="background: transparent; color: #8b5cf6; border: 2px solid #8b5cf6; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">Live Demo</a>
            </div>
        `;
        
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    hideModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Scroll Animation Handler
class ScrollAnimationHandler {
    constructor() {
        this.init();
    }

    init() {
        // Add animation classes to elements
        this.addAnimationClasses();
        // Select elements after classes are added
        this.animatedElements = document.querySelectorAll('.scroll-fade, .scroll-fade-left, .scroll-fade-right');
        // Setup intersection observer
        this.setupIntersectionObserver();
        // Initial check for elements in viewport
        this.checkInitialVisibility();
    }

    addAnimationClasses() {
        // Hero section
        const heroText = document.querySelector('.hero-text');
        const heroImage = document.querySelector('.hero-image');
        if (heroText) heroText.classList.add('scroll-fade-left');
        if (heroImage) heroImage.classList.add('scroll-fade-right');

        // About section
        const aboutText = document.querySelector('.about-text');
        const timeline = document.querySelector('.timeline');
        if (aboutText) aboutText.classList.add('scroll-fade-left');
        if (timeline) timeline.classList.add('scroll-fade-right');

        // Skills section
        const skillCategories = document.querySelectorAll('.skill-category');
        skillCategories.forEach((category, index) => {
            category.classList.add('scroll-fade');
            category.classList.add(`delay-${(index % 3) + 1}`);
        });

        // Projects section
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.classList.add('scroll-fade');
            card.classList.add(`delay-${(index % 5) + 1}`);
        });

        // Contact section
        const contactInfo = document.querySelector('.contact-info');
        const contactForm = document.querySelector('.contact-form');
        if (contactInfo) contactInfo.classList.add('scroll-fade-left');
        if (contactForm) contactForm.classList.add('scroll-fade-right');
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Add a small delay before unobserve to ensure animation completes
                    setTimeout(() => {
                        observer.unobserve(entry.target);
                    }, 1000);
                }
            });
        }, options);

        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    checkInitialVisibility() {
        // Check if elements are already in viewport on page load
        this.animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isInViewport = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );

            if (isInViewport) {
                element.classList.add('visible');
            }
        });
    }
}

// Custom Cursor Animation
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.cursorDot = document.querySelector('.cursor-dot');
        this.init();
    }

    init() {
        // Initial cursor position
        this.cursor.style.transform = 'translate(-50%, -50%)';
        this.cursorDot.style.transform = 'translate(-50%, -50%)';

        // Mouse move event
        document.addEventListener('mousemove', (e) => {
            this.moveCursor(e);
        });

        // Mouse enter/leave events for interactive elements
        this.setupInteractiveElements();

        // Mouse down/up events
        document.addEventListener('mousedown', () => this.cursor.classList.add('click'));
        document.addEventListener('mouseup', () => this.cursor.classList.remove('click'));
    }

    moveCursor(e) {
        // Smooth cursor movement with lerp
        const lerp = (start, end, factor) => start + (end - start) * factor;

        // Update cursor positions with smooth animation
        requestAnimationFrame(() => {
            // Main cursor
            const currentX = parseFloat(this.cursor.style.left) || e.clientX;
            const currentY = parseFloat(this.cursor.style.top) || e.clientY;
            
            this.cursor.style.left = `${lerp(currentX, e.clientX, 0.2)}px`;
            this.cursor.style.top = `${lerp(currentY, e.clientY, 0.2)}px`;

            // Cursor dot (faster movement)
            const dotCurrentX = parseFloat(this.cursorDot.style.left) || e.clientX;
            const dotCurrentY = parseFloat(this.cursorDot.style.top) || e.clientY;
            
            this.cursorDot.style.left = `${lerp(dotCurrentX, e.clientX, 0.4)}px`;
            this.cursorDot.style.top = `${lerp(dotCurrentY, e.clientY, 0.4)}px`;
        });
    }

    setupInteractiveElements() {
        // Elements that should trigger hover effect
        const interactiveElements = [
            'a',
            'button',
            '.nav-link',
            '.project-card',
            '.view-btn',
            '.btn',
            'input',
            'textarea'
        ];

        interactiveElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('hover');
                });
                element.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('hover');
                });
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // First, make all content visible
    document.body.style.opacity = '1';
    
    // Initialize custom cursor
    const customCursor = new CustomCursor();
    
    // Initialize background with a slight delay
    setTimeout(() => {
        const background = new ParticleBackground();
    }, 100);
    
    // Initialize navigation
    const navigation = new Navigation();
    
    // Initialize contact form
    const contactForm = new ContactForm();
    
    // Initialize project modal
    const projectModal = new ProjectModal();
    
    // Initialize scroll animations
    const scrollAnimations = new ScrollAnimationHandler();
    
    console.log('🚀 Futuristic Portfolio Website Loaded Successfully!');
});

// Additional utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization for scroll events
const optimizedScrollHandler = debounce(() => {
    // Handle scroll events here if needed
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);