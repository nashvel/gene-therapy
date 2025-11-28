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
        section.style.overflowX = 'hidden';
        section.style.margin = '0';
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
