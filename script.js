// Function to load HTML includes
async function loadIncludes() {
    const includes = document.querySelectorAll('[data-include]');
    for (const include of includes) {
        const file = include.getAttribute('data-include');
        try {
            const response = await fetch(file);
            if (response.ok) {
                const html = await response.text();
                include.outerHTML = html;
            } else {
                console.error(`Failed to load ${file}`);
            }
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }

    // Re-initialize AOS after content loads
    setTimeout(() => {
        // Initialize AOS here to ensure elements exist
        AOS.init({
            duration: 600,
            once: false,
            offset: 100,
            easing: 'ease-in-out'
        });
        AOS.refresh();
        initializeNavigation(); // Re-bind navigation events
        
        // Enforce viewport constraints after content loads
        enforceViewportConstraints();
    }, 100);
}

// Function to enforce viewport constraints
function enforceViewportConstraints() {
    // Ensure no horizontal overflow
    document.documentElement.style.width = '100%';
    document.documentElement.style.maxWidth = '100%';
    document.documentElement.style.overflowX = 'hidden';
    
    document.body.style.width = '100%';
    document.body.style.maxWidth = '100%';
    document.body.style.overflowX = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // Fix all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.width = '100%';
        section.style.maxWidth = '100%';
        section.style.margin = '0';
        
        // Keep intro section overflow visible for decorations
        if (section.id !== 'intro') {
            section.style.overflow = 'hidden';
        } else {
            section.style.overflow = 'visible';
        }
    });
    
    // Fix all containers
    document.querySelectorAll('.container').forEach(container => {
        container.style.width = '100%';
        container.style.maxWidth = '100%';
        container.style.margin = '0';
    });
}

// Wrap existing navigation logic in a function
function initializeNavigation() {
    const sections = document.querySelectorAll('section');
    const navDots = document.querySelectorAll('.nav-dots a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href').slice(1) === current) {
                dot.classList.add('active');
            }
        });
    });

    // Smooth scroll for navigation dots
    navDots.forEach(dot => {
        // Remove old listeners to avoid duplicates if re-initialized
        const newDot = dot.cloneNode(true);
        dot.parentNode.replaceChild(newDot, dot);

        newDot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = newDot.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Hide preloader when page loads
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1000);
    }
});

// Start loading
document.addEventListener('DOMContentLoaded', loadIncludes);

// Hide scroll indicator on scroll
window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '0.7';
        }
    }
});

// Horizontal scroll navigation for desktop
function initializeHorizontalNav() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sections = document.querySelectorAll('section');
    let currentIndex = 0;

    if (!prevBtn || !nextBtn) return;

    function scrollToSection(index) {
        if (index >= 0 && index < sections.length) {
            currentIndex = index;
            sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            scrollToSection(currentIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < sections.length - 1) {
            scrollToSection(currentIndex + 1);
        }
    });

    // Update current index on scroll
    window.addEventListener('scroll', () => {
        if (window.innerWidth >= 1024) {
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                if (rect.left >= 0 && rect.left < window.innerWidth / 2) {
                    currentIndex = index;
                }
            });
        }
    });
}

// Initialize horizontal nav after content loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeHorizontalNav();
        initializeGeneModal();
    }, 500);
});

// Gene Modal functionality
function initializeGeneModal() {
    const geneText = document.getElementById('geneText');
    const geneModal = document.getElementById('geneModal');
    const closeBtn = document.querySelector('.gene-modal-close');

    if (!geneText || !geneModal) return;

    // Open modal when clicking on GENE text
    geneText.addEventListener('click', (e) => {
        e.stopPropagation();
        geneModal.classList.add('show');
    });

    // Close modal when clicking the X button
    closeBtn.addEventListener('click', () => {
        geneModal.classList.remove('show');
    });

    // Close modal when clicking outside the modal content
    geneModal.addEventListener('click', (e) => {
        if (e.target === geneModal) {
            geneModal.classList.remove('show');
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && geneModal.classList.contains('show')) {
            geneModal.classList.remove('show');
        }
    });
}
