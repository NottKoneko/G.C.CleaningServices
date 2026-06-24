document.addEventListener('DOMContentLoaded', () => {
    // Set Current Year in Footer (with defensive check)
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

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

    // ==========================================================================
    // Bilingual / Internationalization (i18n) Setup
    // ==========================================================================
    const placeholders = {
        en: {
            'first-name': 'Jane',
            'last-name': 'Doe',
            'phone': '(512) 555-5555',
            'email': 'jane.doe@example.com',
            'zip-code': 'e.g., Downtown Austin, 78704',
            'availability-notes': 'Specify if you prefer mornings, afternoons, part-time, full-time, etc.',
            'experience-details': 'Mention home, condo, commercial cleaning, previous employers, or years active...',
            'additional-info': "Tell us about yourself, why you want to join our team, or any other details you'd like to share..."
        },
        es: {
            'first-name': 'Juana',
            'last-name': 'Pérez',
            'phone': '(512) 555-5555',
            'email': 'juana.perez@ejemplo.com',
            'zip-code': 'ej. Centro de Austin, 78704',
            'availability-notes': 'Especifique si prefiere mañanas, tardes, medio tiempo, tiempo completo, etc.',
            'experience-details': 'Mencione limpieza de casas, condominios, comercial, empleadores anteriores o años activos...',
            'additional-info': 'Cuéntenos sobre usted, por qué quiere unirse a nuestro equipo o cualquier otro detalle que desee compartir...'
        }
    };

    const uiStrings = {
        en: {
            selectAvailability: 'Please select at least one day of the week you are available to work.',
            completeCaptcha: 'Please complete the Turnstile validation before submitting.',
            submitting: 'Submitting Application...',
            submittingDesc: 'Please wait while we secure your connection and deliver your details.',
            successTitle: 'Application Sent!',
            successDesc: 'Thank you for your interest in joining G.C Cleaning Services. We have received your application and will review it shortly.',
            returnHome: 'Return Home',
            unableToSend: 'Unable to Send Automatically',
            fallbackDesc: 'Our automated form system encountered an issue: {error}. Please copy your application details below and email them to us directly.',
            appDetails: 'Your Application Details:',
            copyBtn: 'Copy to Clipboard',
            emailBtn: 'Email Application',
            copied: 'Copied!',
            copyFail: 'Please select all text inside the box and copy manually.'
        },
        es: {
            selectAvailability: 'Por favor, seleccione al menos un día de la semana en el que esté disponible para trabajar.',
            completeCaptcha: 'Por favor, complete la validación de Turnstile antes de enviar.',
            submitting: 'Enviando solicitud...',
            submittingDesc: 'Por favor, espere mientras aseguramos su conexión y entregamos sus datos.',
            successTitle: '¡Solicitud enviada!',
            successDesc: 'Gracias por su interés en unirse a G.C Cleaning Services. Hemos recibido su solicitud y la revisaremos en breve.',
            returnHome: 'Volver al inicio',
            unableToSend: 'No se pudo enviar automáticamente',
            fallbackDesc: 'Nuestro sistema de formulario automático encontró un problema: {error}. Por favor, copie los detalles de su solicitud a continuación y envíenos un correo electrónico directamente.',
            appDetails: 'Detalles de su solicitud:',
            copyBtn: 'Copiar al portapapeles',
            emailBtn: 'Enviar solicitud por correo',
            copied: '¡Copiado!',
            copyFail: 'Por favor, seleccione todo el texto dentro de la caja y copie manualmente.'
        }
    };

    const updatePlaceholders = (lang) => {
        const langPlaceholders = placeholders[lang];
        if (langPlaceholders) {
            for (const [id, text] of Object.entries(langPlaceholders)) {
                const el = document.getElementById(id);
                if (el) el.setAttribute('placeholder', text);
            }
        }
    };

    // Language Toggle Functionality
    const langToggle = document.getElementById('lang-toggle');
    const langToggleText = document.getElementById('lang-toggle-text');
    
    const setLanguage = (lang) => {
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('preferred-lang', lang);
        if (langToggleText) {
            langToggleText.textContent = lang === 'en' ? 'Español' : 'English';
        }
        updatePlaceholders(lang);
    };

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = document.documentElement.getAttribute('lang') || 'en';
            const newLang = currentLang === 'en' ? 'es' : 'en';
            setLanguage(newLang);
        });
    }

    // Load initial language preference
    const savedLang = localStorage.getItem('preferred-lang') || (navigator.language.startsWith('es') ? 'es' : 'en');
    setLanguage(savedLang);

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

            const currentLang = document.documentElement.getAttribute('lang') || 'en';
            const strings = uiStrings[currentLang];

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
                alert(strings.selectAvailability);
                const availGrid = form.querySelector('.checkbox-grid');
                if (availGrid) {
                    availGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // 2. Validate Turnstile
            const turnstileResponse = form.querySelector('[name="cf-turnstile-response"]');
            if (!turnstileResponse || !turnstileResponse.value) {
                alert(strings.completeCaptcha);
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
                        <h3>${strings.submitting}</h3>
                        <p class="section-desc">${strings.submittingDesc}</p>
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

            // Clean up legacy reCaptcha if present (Turnstile injects it sometimes for compatibility)
            if (object['g-recaptcha-response']) {
                delete object['g-recaptcha-response'];
            }

            fetch("/api/submit", {
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
                            <h2 class="section-title">${strings.successTitle}</h2>
                            <p class="section-desc">${strings.successDesc}</p>
                            <a href="index.html" class="btn btn-primary mt-6">${strings.returnHome}</a>
                        </div>
                    `;
                } else {
                    throw new Error(data.message || "Quota exceeded or API error");
                }
            })
            .catch((error) => {
                console.error("Submission Error:", error);
                
                // Formulate error description
                const errorDesc = strings.fallbackDesc.replace('{error}', error.message);

                // Render Fallback Copy-Paste UI with explicit error message
                formCard.innerHTML = `
                    <div class="fallback-container">
                        <div class="text-center mb-6">
                            <div class="error-icon mb-4" style="font-size: 3rem;">⚠️</div>
                            <h2 class="section-title" style="font-size: 1.75rem;">${strings.unableToSend}</h2>
                            <p class="section-desc" style="font-size: 0.95rem;">${errorDesc}</p>
                        </div>
                        
                        <div class="form-group mb-6">
                            <label class="form-label">${strings.appDetails}</label>
                            <textarea id="fallback-copy-text" class="form-textarea" rows="12" readonly style="font-family: monospace; font-size: 0.875rem; background-color: var(--clr-light); resize: none;">${formattedData}</textarea>
                        </div>

                        <div class="form-footer" style="flex-direction: row; gap: var(--sp-4); justify-content: center; flex-wrap: wrap; border-top: none; padding-top: 0;">
                            <button id="btn-copy-fallback" class="btn btn-secondary" style="width: auto; min-width: 200px;">${strings.copyBtn}</button>
                            <a href="mailto:gccleaningservices26@gmail.com?subject=Job%20Application%20-%20G.C%20Cleaning%20Services&body=Please%20paste%20your%20copied%20application%20details%20here..." class="btn btn-primary" style="width: auto; min-width: 200px;">${strings.emailBtn}</a>
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
                                copyBtn.textContent = strings.copied;
                                copyBtn.style.backgroundColor = 'var(--clr-accent)';
                                copyBtn.style.color = 'var(--clr-white)';
                                copyBtn.style.borderColor = 'var(--clr-accent)';
                                setTimeout(() => {
                                    copyBtn.textContent = strings.copyBtn;
                                    copyBtn.style.backgroundColor = 'var(--clr-white)';
                                    copyBtn.style.color = 'var(--clr-dark)';
                                    copyBtn.style.borderColor = 'var(--clr-dark)';
                                }, 2000);
                            })
                            .catch(() => {
                                alert(strings.copyFail);
                            });
                    });
                }
            });
        });
    }
});