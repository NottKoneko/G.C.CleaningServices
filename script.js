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

    // Availability Checkbox Group Validation and AJAX Submit with Fallback
    const form = document.getElementById('job-application-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Validate availability checkboxes
            const checkboxes = form.querySelectorAll('input[name="availability[]"]');
            let checked = false;
            let availabilityDays = [];
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    checked = true;
                    availabilityDays.push(cb.value);
                }
            });
            
            if (!checked) {
                alert('Please select at least one day of the week you are available to work.');
                const availGrid = form.querySelector('.checkbox-grid');
                if (availGrid) {
                    availGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // 2. Validate hCaptcha
            const captchaResponse = form.querySelector('[name="h-captcha-response"]');
            if (!captchaResponse || !captchaResponse.value) {
                alert('Please complete the hCaptcha validation before submitting.');
                return;
            }

            // 3. Serialize form data for copy-paste fallback
            const formData = new FormData(form);
            const formattedData = `
G.C CLEANING SERVICES - JOB APPLICATION DETAILS
==================================================
First Name: ${formData.get('first_name')}
Last Name: ${formData.get('last_name')}
Phone: ${formData.get('phone')}
Email: ${formData.get('email') || 'N/A'}
Date of Birth: ${formData.get('date_of_birth')}
Location/ZIP: ${formData.get('location')}

Availability: ${availabilityDays.join(', ')}
Availability Notes: ${formData.get('availability_notes') || 'None'}

Reliable Vehicle & License: ${formData.get('has_transportation')}
Professional Cleaning Experience: ${formData.get('has_experience')}
Experience Details: ${formData.get('experience_details') || 'N/A'}

Additional Details: ${formData.get('additional_information') || 'N/A'}
==================================================
            `.trim();

            // 4. Show Loading State
            const formCard = document.querySelector('.form-card');
            if (formCard) {
                formCard.innerHTML = `
                    <div class="text-center py-12">
                        <div class="loading-spinner mb-4"></div>
                        <h3>Submitting Application...</h3>
                        <p class="section-desc">Please wait while we secure your connection and deliver your details.</p>
                    </div>
                `;
            }

            // 5. Submit Form via Fetch API (JSON Format)
            const object = {};
            formData.forEach((value, key) => {
                if (object[key]) {
                    if (!Array.isArray(object[key])) {
                        object[key] = [object[key]];
                    }
                    object[key].push(value);
                } else {
                    object[key] = value;
                }
            });
            // Join array values for checkboxes
            if (Array.isArray(object['availability[]'])) {
                object['availability'] = object['availability[]'].join(', ');
                delete object['availability[]'];
            } else if (object['availability[]']) {
                object['availability'] = object['availability[]'];
                delete object['availability[]'];
            }

            // hCaptcha natively injects g-recaptcha-response for compatibility. 
            // We must remove it so Web3Forms doesn't throw a Pro feature error.
            if (object['g-recaptcha-response']) {
                delete object['g-recaptcha-response'];
            }

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(object)
            })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok && data.success) {
                    // Render Success UI
                    formCard.innerHTML = `
                        <div class="text-center py-12">
                            <div class="success-icon mb-4">✅</div>
                            <h2 class="section-title">Application Sent!</h2>
                            <p class="section-desc">Thank you for your interest in joining G.C Cleaning Services. We have received your application and will review it shortly.</p>
                            <a href="index.html" class="btn btn-primary mt-6">Return Home</a>
                        </div>
                    `;
                } else {
                    throw new Error(data.message || "Quota exceeded or API error");
                }
            })
            .catch((error) => {
                console.error("Submission Error:", error);
                // Render Fallback Copy-Paste UI with explicit error message
                formCard.innerHTML = `
                    <div class="fallback-container">
                        <div class="text-center mb-6">
                            <div class="error-icon mb-4" style="font-size: 3rem;">⚠️</div>
                            <h2 class="section-title" style="font-size: 1.75rem;">Unable to Send Automatically</h2>
                            <p class="section-desc" style="font-size: 0.95rem;">Our automated form system encountered an issue: <strong>${error.message}</strong>. Please copy your application details below and email them to us directly.</p>
                        </div>
                        
                        <div class="form-group mb-6">
                            <label class="form-label">Your Application Details:</label>
                            <textarea id="fallback-copy-text" class="form-textarea" rows="12" readonly style="font-family: monospace; font-size: 0.875rem; background-color: var(--clr-light); resize: none;">${formattedData}</textarea>
                        </div>

                        <div class="form-footer" style="flex-direction: row; gap: var(--sp-4); justify-content: center; flex-wrap: wrap; border-top: none; padding-top: 0;">
                            <button id="btn-copy-fallback" class="btn btn-secondary" style="width: auto; min-width: 200px;">Copy to Clipboard</button>
                            <a href="mailto:gccleaningservices26@gmail.com?subject=Job%20Application%20-%20G.C%20Cleaning%20Services&body=Please%20paste%20your%20copied%20application%20details%20here..." class="btn btn-primary" style="width: auto; min-width: 200px;">Email Application</a>
                        </div>
                    </div>
                `;

                // Add clipboard copy functionality
                const copyBtn = document.getElementById('btn-copy-fallback');
                const copyText = document.getElementById('fallback-copy-text');
                if (copyBtn && copyText) {
                    copyBtn.addEventListener('click', () => {
                        copyText.select();
                        copyText.setSelectionRange(0, 99999);
                        navigator.clipboard.writeText(copyText.value)
                            .then(() => {
                                copyBtn.textContent = 'Copied!';
                                copyBtn.style.backgroundColor = 'var(--clr-accent)';
                                copyBtn.style.color = 'var(--clr-white)';
                                copyBtn.style.borderColor = 'var(--clr-accent)';
                                setTimeout(() => {
                                    copyBtn.textContent = 'Copy to Clipboard';
                                    copyBtn.style.backgroundColor = 'var(--clr-white)';
                                    copyBtn.style.color = 'var(--clr-dark)';
                                    copyBtn.style.borderColor = 'var(--clr-dark)';
                                }, 2000);
                            })
                            .catch(() => {
                                alert('Please select all text inside the box and copy manually.');
                            });
                    });
                }
            });
        });
    }
});