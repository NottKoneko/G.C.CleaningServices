document.addEventListener('DOMContentLoaded', () => {
    // Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Header Scroll Effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling for anchor links (if not supported natively by CSS)
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

    // Decode contact info on click to prevent bot scraping
    const decodeElements = document.querySelectorAll('.decode-on-click');
    decodeElements.forEach(el => {
        const handleDecode = (e) => {
            e.preventDefault();
            let decodedHref = '';
            const encodedHref = el.getAttribute('data-encoded-href');
            
            if (encodedHref) {
                decodedHref = atob(encodedHref);
                el.setAttribute('href', decodedHref);
            }
            
            // Check if element itself has the text or a child has it
            const textElement = el.hasAttribute('data-encoded-text') ? el : el.querySelector('[data-encoded-text]');
            if (textElement) {
                const encodedText = textElement.getAttribute('data-encoded-text');
                if (encodedText) {
                    textElement.textContent = atob(encodedText);
                    textElement.removeAttribute('data-encoded-text');
                }
            }
            
            // Show a brief native alert with the info (the popup the user requested)
            const decodedText = textElement ? textElement.textContent : '';
            alert(`Contact Info:\n${decodedText}`);
            
            // Trigger the actual phone dialer / email client
            if (decodedHref) {
                window.location.href = decodedHref;
            }
            
            // Remove the class after decoding so subsequent clicks just work normally
            el.classList.remove('decode-on-click');
            el.removeEventListener('click', handleDecode);
        };

        // Trigger decode on click
        el.addEventListener('click', handleDecode);
    });
});
