document.addEventListener('DOMContentLoaded', () => {
    // Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile Menu Toggle with Accessibility & Scroll Lock
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle visual classes
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle accessibility and body scroll
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Header Scroll Effect (Performance Optimized with requestAnimationFrame)
    const header = document.getElementById('header');
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate header offset
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Conditional display of Experience Details in jobs.html
    const expYes = document.getElementById('experience-yes');
    const expNo = document.getElementById('experience-no');
    const expDetailsGroup = document.getElementById('experience-details-group');

    if (expYes && expNo && expDetailsGroup) {
        const toggleExperienceDetails = () => {
            if (expYes.checked) {
                expDetailsGroup.style.display = 'block';
            } else {
                expDetailsGroup.style.display = 'none';
                const expDetailsText = document.getElementById('experience-details');
                if (expDetailsText) expDetailsText.value = ''; // Reset when hidden
            }
        };

        expYes.addEventListener('change', toggleExperienceDetails);
        expNo.addEventListener('change', toggleExperienceDetails);
    }

    // Availability Checkbox Group Validation
    const form = document.getElementById('job-application-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            const checkboxes = form.querySelectorAll('input[name="availability[]"]');
            let checked = false;
            checkboxes.forEach(cb => {
                if (cb.checked) checked = true;
            });
            
            if (!checked) {
                e.preventDefault();
                alert('Please select at least one day of the week you are available to work.');
                
                const availGrid = form.querySelector('.checkbox-grid');
                if (availGrid) {
                    availGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
});