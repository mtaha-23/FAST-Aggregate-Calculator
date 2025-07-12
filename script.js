document.addEventListener('DOMContentLoaded', function() {
   
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Set up input event listeners for dynamic calculation
    setupDynamicCalculation();
    
    // Clear button functionality
    setupClearButtons();
    
    // Reset inputs when switching tabs
    setupTabSwitching();
    
    // Option cards in home tab
    setupOptionCards();
    
    // Add input validation
    setupInputValidation();
    
    // Check for mobile devices and adjust UI accordingly
    checkMobileDevice();
    
    // Set up feedback form submission
    setupFeedbackForm();
    
    // Set up rating reminder
    setupRatingReminder();
    
    // Set up hamburger menu
    setupHamburgerMenu();

    // Set up theme toggle
    setupThemeToggle();
    
    // Set up PDF generation
    setupPDFGeneration();
    
    // Set up share buttons
    initCopyPdfClearButtons();

    // Set up program type radio buttons
    setupProgramTypeRadios();

    // Set up tab change listener for FAQs
    const faqsTab = document.getElementById('faqs-tab');
    if (faqsTab) {
        faqsTab.addEventListener('shown.bs.tab', function() {
            // Initialize FAQs when the tab is shown
            setupFAQs();
        });
    }

    //show view count
   // showViewCount();
     
});

function showViewCount() {
    
 fetch("https://script.google.com/macros/s/AKfycbxh2BUlf8HCm8qw4g-VU8MhWQ0pWrrZkPwgzU3fO5F2ZL4Xi6qO8t5X4Ba7JFAt_VxO/exec")
    .then(res => res.json())
    .then(data => {
      document.getElementById("viewNumber").textContent = data.count;
    })
    .catch(err => {
      console.error("Error fetching view count:", err);
      document.getElementById("viewNumber").textContent = "1000+";
    });
}

// Detect device type
function getDeviceType() {
    const ua = navigator.userAgent;
    if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
        return "Mobile";
    } else {
        return "Desktop";
    }
}

// records every view of the page
function recordView() {
    var formData = {
                rating: "",
                email: "view",
                comments: getDeviceType()
            };
            
            fetch("https://script.google.com/macros/s/AKfycbxh2BUlf8HCm8qw4g-VU8MhWQ0pWrrZkPwgzU3fO5F2ZL4Xi6qO8t5X4Ba7JFAt_VxO/exec", {  
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "no-cors",
                body: JSON.stringify(formData)
            })
}

// Set up rating reminder popup
function setupRatingReminder() {
    // Check if the user has already seen the popup in this session
    if (!sessionStorage.getItem('ratingReminderShown')) {

        if (!sessionStorage.getItem('viewRecorded')) {
        //record the user view
        recordView();
        sessionStorage.setItem('viewRecorded', 'true');
    }

        // Set a timer to show the rating reminder after 25 seconds
        const ratingReminderTimer = setTimeout(function() {
            showRatingReminder();
        }, 25000); // 25 seconds
        
        // Track user activity to ensure they're still active
        let userActive = false;
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        activityEvents.forEach(function(eventName) {
            document.addEventListener(eventName, function() {
                userActive = true;
            }, { once: true });
        });
        
        // Check if user was active before showing the popup
        setTimeout(function() {
            if (!userActive) {
                clearTimeout(ratingReminderTimer);
            }
        }, 24000); // Check just before showing the popup
    }
    
    // Set up the quick feedback form in the modal
    const quickFeedbackForm = document.getElementById('quickFeedbackForm');
    if (quickFeedbackForm) {
        quickFeedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const selected = quickFeedbackForm.querySelector('input[name="quickRating"]:checked');
            if (!selected) {
                showAlert('Please select a rating.', 'danger', 'quickFeedbackForm');
                return;
            }
            // Prepare data (email and comments are null)
            const formData = {
                rating: selected.value,
                email: null,
                comments: "quick feedback"
            };
            // Optionally disable the form to prevent resubmission
            quickFeedbackForm.querySelectorAll('input,button').forEach(el => el.disabled = true);

            fetch("https://script.google.com/macros/s/AKfycbxh2BUlf8HCm8qw4g-VU8MhWQ0pWrrZkPwgzU3fO5F2ZL4Xi6qO8t5X4Ba7JFAt_VxO/exec", {  
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "no-cors",
                body: JSON.stringify(formData)
            })
            .then(() => {
                showAlert('Thank you for your feedback!', 'success', 'quickFeedbackForm');
            })
            .catch(() => {
                showAlert('Error submitting feedback.', 'danger', 'quickFeedbackForm');
            });
        });
    }

    // Set up the "Give Feedback" button in the modal
    const goToFeedbackBtn = document.getElementById('goToFeedbackBtn');
    if (goToFeedbackBtn) {
        goToFeedbackBtn.addEventListener('click', function() {
            // Hide the modal
            const ratingModal = bootstrap.Modal.getInstance(document.getElementById('ratingReminderModal'));
            ratingModal.hide();
            
            // Navigate to the feedback tab
            const feedbackTab = document.getElementById('feedback-tab');
            if (feedbackTab) {
                const tab = new bootstrap.Tab(feedbackTab);
                tab.show();
            }
        });
    }
    


}

// Function to show the rating reminder modal
function showRatingReminder() {

    // Mark that we've shown the reminder this session
    sessionStorage.setItem('ratingReminderShown', 'true');
    
        
    // Show the modal
    const ratingModal = new bootstrap.Modal(document.getElementById('ratingReminderModal'));
    ratingModal.show();
}


// Check if device is mobile and adjust UI
function checkMobileDevice() {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        // Simplify UI for mobile devices
        adjustForMobile();
    }
    
    // Listen for window resize events
    window.addEventListener('resize', function() {
        if (window.innerWidth < 768 && !isMobile) {
            adjustForMobile();
        } else if (window.innerWidth >= 768 && isMobile) {
            resetMobileAdjustments();
        }
    });
}

// Adjust UI for mobile devices
function adjustForMobile() {
    // Simplify navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.add('mobile-nav');
    });
}

// Reset mobile adjustments
function resetMobileAdjustments() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('mobile-nav');
    });
}

// Set up input validation
function setupInputValidation() {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        // Add validation on input
        input.addEventListener('input', function() {
            let value = parseFloat(this.value);
            
            if (!isNaN(value)) {
                if (value < 0) {
                    this.value = 0;
                    showAlert('Value cannot be less than 0', 'danger', this.closest('form').id);
                }
                // Remove the 100 limit check here - let calculation functions handle it
                
                // Business-specific max validations
                if (this.id === 'advMathAttempted' || this.id === 'advMathCorrect') {
                    if (value > 50) {
                        this.value = 50;
                        showAlert('Maths questions cannot exceed 50', 'danger', this.closest('form').id);
                    }
                } else if (this.id === 'iqAttempted' || this.id === 'iqCorrect') {
                    if (value > 25) {
                        this.value = 25;
                        showAlert('IQ questions cannot exceed 25', 'danger', this.closest('form').id);
                    }
                } else if (this.id === 'englishAttempted' || this.id === 'englishCorrect') {
                    if (value > 30) {
                        this.value = 30;
                        showAlert('English questions cannot exceed 30', 'danger', this.closest('form').id);
                    }
                } else if (this.id === 'essay') {
                    if (value > 15) {
                        this.value = 15;
                        showAlert('Essay marks cannot exceed 15', 'danger', this.closest('form').id);
                    }
                }
                // Computing/Engineering-specific max validations
                else if (this.id === 'advMathAttemptedComp' || this.id === 'advMathCorrectComp') {
                    if (value > 50) {
                        this.value = 50;
                        showAlert('Advanced Math questions cannot exceed 50', 'danger', this.closest('form').id);
                    }
                } else if (this.id === 'basicMathAttempted' || this.id === 'basicMathCorrect') {
                    if (value > 20) {
                        this.value = 20;
                        showAlert('Basic Math questions cannot exceed 20', 'danger', this.closest('form').id);
                    }
                } else if (this.id === 'iqAttemptedComp' || this.id === 'iqCorrectComp') {
                    if (value > 20) {
                        this.value = 20;
                        showAlert('IQ questions cannot exceed 20', 'danger', this.closest('form').id);
                    }
                } else if (this.id === 'englishAttemptedComp' || this.id === 'englishCorrectComp') {
                    if (value > 30) {
                        this.value = 30;
                        showAlert('English questions cannot exceed 30', 'danger', this.closest('form').id);
                    }
                }
            }
            
            // Check if this is a "correct questions" input and validate against attempted
            if (this.id === 'correctExceptEnglish') {
                const attempted = parseFloat(document.getElementById('totalAttemptedExceptEnglish').value);
                if (!isNaN(attempted) && !isNaN(value) && value > attempted) {
                    this.value = attempted;
                    showAlert('Correct questions cannot exceed attempted questions', 'danger', 'nuForm');
                }
            }
            else if (this.id === 'correctEnglish') {
                const attempted = parseFloat(document.getElementById('totalAttemptedEnglish').value);
                if (!isNaN(attempted) && !isNaN(value) && value > attempted) {
                    this.value = attempted;
                    showAlert('Correct questions cannot exceed attempted questions', 'danger', 'nuForm');
                }
            }
            // Business-specific validations
            else if (this.id === 'advMathCorrect') {
                const attempted = parseFloat(document.getElementById('advMathAttempted').value);
                if (!isNaN(attempted) && !isNaN(value) && value > attempted) {
                    this.value = attempted;
                    showAlert('Correct Maths cannot exceed attempted Maths', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
            }
            else if (this.id === 'iqCorrect') {
                const attempted = parseFloat(document.getElementById('iqAttempted').value);
                if (!isNaN(attempted) && !isNaN(value) && value > attempted) {
                    this.value = attempted;
                    showAlert('Correct IQ cannot exceed attempted IQ', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
            }
            else if (this.id === 'englishCorrect') {
                const attempted = parseFloat(document.getElementById('englishAttempted').value);
                if (!isNaN(attempted) && !isNaN(value) && value > attempted) {
                    this.value = attempted;
                    showAlert('Correct English cannot exceed attempted English', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
            }
            // Computing/Engineering-specific validations
            else if (this.id === 'advMathCorrectComp') {
                const attempted = parseFloat(document.getElementById('advMathAttemptedComp').value);
                if (!isNaN(attempted) && !isNaN(value) && value > attempted) {
                    this.value = attempted;
                    showAlert('Correct Advanced Math cannot exceed attempted Advanced Math', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
            }
            else if (this.id === 'basicMathCorrect') {
                const attempted = parseFloat(document.getElementById('basicMathAttempted').value);
                if (!isNaN(attempted) && !isNaN(value) && value > attempted) {
                    this.value = attempted;
                    showAlert('Correct Basic Math cannot exceed attempted Basic Math', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
            }
            else if (this.id === 'iqCorrectComp') {
                const attempted = parseFloat(document.getElementById('iqAttemptedComp').value);
                if (!isNaN(attempted) && !isNaN(value) && value > attempted) {
                    this.value = attempted;
                    showAlert('Correct IQ cannot exceed attempted IQ', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
            }
            else if (this.id === 'englishCorrectComp') {
                const attempted = parseFloat(document.getElementById('englishAttemptedComp').value);
                if (!isNaN(attempted) && !isNaN(value) && value > attempted) {
                    this.value = attempted;
                    showAlert('Correct English cannot exceed attempted English', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
            }
            // Also check if this is an "attempted questions" input and validate against correct
            else if (this.id === 'totalAttemptedExceptEnglish') {
                const correct = parseFloat(document.getElementById('correctExceptEnglish').value);
                if (!isNaN(correct) && !isNaN(value) && value < correct) {
                    document.getElementById('correctExceptEnglish').value = value;
                    showAlert('Correct questions cannot exceed attempted questions', 'danger', 'nuForm');
                }
            }
            else if (this.id === 'totalAttemptedEnglish') {
                const correct = parseFloat(document.getElementById('correctEnglish').value);
                if (!isNaN(correct) && !isNaN(value) && value < correct) {
                    document.getElementById('correctEnglish').value = value;
                    showAlert('Correct questions cannot exceed attempted questions', 'danger', 'nuForm');
                }
            }
            // Business-specific attempted validations
            else if (this.id === 'advMathAttempted') {
                const correct = parseFloat(document.getElementById('advMathCorrect').value);
                if (!isNaN(correct) && !isNaN(value) && value < correct) {
                    document.getElementById('advMathCorrect').value = value;
                    showAlert('Correct Maths cannot exceed attempted Maths', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
                // Update placeholder for correct Maths input
                updateCorrectPlaceholder('advMathCorrect', value, 50);
            }
            else if (this.id === 'iqAttempted') {
                const correct = parseFloat(document.getElementById('iqCorrect').value);
                if (!isNaN(correct) && !isNaN(value) && value < correct) {
                    document.getElementById('iqCorrect').value = value;
                    showAlert('Correct IQ cannot exceed attempted IQ', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
                // Update placeholder for correct IQ input
                updateCorrectPlaceholder('iqCorrect', value, 25);
            }
            else if (this.id === 'englishAttempted') {
                const correct = parseFloat(document.getElementById('englishCorrect').value);
                if (!isNaN(correct) && !isNaN(value) && value < correct) {
                    document.getElementById('englishCorrect').value = value;
                    showAlert('Correct English cannot exceed attempted English', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
                // Update placeholder for correct English input
                updateCorrectPlaceholder('englishCorrect', value, 30);
            }
            // Computing/Engineering-specific attempted validations
            else if (this.id === 'advMathAttemptedComp') {
                const correct = parseFloat(document.getElementById('advMathCorrectComp').value);
                if (!isNaN(correct) && !isNaN(value) && value < correct) {
                    document.getElementById('advMathCorrectComp').value = value;
                    showAlert('Correct Advanced Math cannot exceed attempted Advanced Math', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
                // Update placeholder for correct Advanced Math input
                updateCorrectPlaceholder('advMathCorrectComp', value, 50);
            }
            else if (this.id === 'basicMathAttempted') {
                const correct = parseFloat(document.getElementById('basicMathCorrect').value);
                if (!isNaN(correct) && !isNaN(value) && value < correct) {
                    document.getElementById('basicMathCorrect').value = value;
                    showAlert('Correct Basic Math cannot exceed attempted Basic Math', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
                // Update placeholder for correct Basic Math input
                updateCorrectPlaceholder('basicMathCorrect', value, 20);
            }
            else if (this.id === 'iqAttemptedComp') {
                const correct = parseFloat(document.getElementById('iqCorrectComp').value);
                if (!isNaN(correct) && !isNaN(value) && value < correct) {
                    document.getElementById('iqCorrectComp').value = value;
                    showAlert('Correct IQ cannot exceed attempted IQ', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
                // Update placeholder for correct IQ input
                updateCorrectPlaceholder('iqCorrectComp', value, 20);
            }
            else if (this.id === 'englishAttemptedComp') {
                const correct = parseFloat(document.getElementById('englishCorrectComp').value);
                if (!isNaN(correct) && !isNaN(value) && value < correct) {
                    document.getElementById('englishCorrectComp').value = value;
                    showAlert('Correct English cannot exceed attempted English', 'danger', 'nuForm');
                    // Trigger recalculation with the adjusted value
                    calculateNUAndAggregate();
                }
                // Update placeholder for correct English input
                updateCorrectPlaceholder('englishCorrectComp', value, 30);
            }
        });
    });
}

// Set up dynamic result calculation as user types
function setupDynamicCalculation() {
    // NAT calculator inputs
    const natInputs = document.querySelectorAll('.calc-input[data-calc="nat"]');
    natInputs.forEach(input => {
        input.addEventListener('input', function() {
            calculateAggregateWithNU();
        });
    });
    
    // Add event listeners for program type radio buttons
    const programTypeRadios = document.querySelectorAll('input[name="natProgramType"]');
    programTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            calculateAggregateWithNU();
            // Show/hide appropriate weights info
            document.getElementById('natComputingWeights').style.display = this.value === 'computing' ? 'block' : 'none';
            document.getElementById('natEngineeringWeights').style.display = this.value === 'engineering' ? 'block' : 'none';
            
            // Show/hide appropriate degree options
            document.getElementById('natComputingBusinessDegree').style.display = this.value === 'computing' ? 'block' : 'none';
            document.getElementById('engineeringDegrees').style.display = this.value === 'engineering' ? 'block' : 'none';
        });
    });
    
    // NU calculator inputs
    const nuInputs = document.querySelectorAll('.calc-input[data-calc="nu"]');
    nuInputs.forEach(input => {
        input.addEventListener('input', function() {
            calculateNUAndAggregate();
        });
    });
    
    // Add event listeners for NU program type radio buttons
    const nuProgramTypeRadios = document.querySelectorAll('input[name="nuProgramType"]');
    console.log('Found NU program type radios:', nuProgramTypeRadios.length);
    nuProgramTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            console.log('NU program type changed to:', this.value);
            calculateNUAndAggregate();
            // Show/hide appropriate weights info
            document.getElementById('nuComputingWeights').style.display = this.value === 'computing' ? 'block' : 'none';
            document.getElementById('nuEngineeringWeights').style.display = this.value === 'engineering' ? 'block' : 'none';
            document.getElementById('nuBusinessWeights').style.display = this.value === 'business' ? 'block' : 'none';
            
            // Show/hide appropriate degree options
            document.getElementById('nuComputingDegrees').style.display = this.value === 'computing' ? 'block' : 'none';
            document.getElementById('nuBusinessDegrees').style.display = this.value === 'business' ? 'block' : 'none';
            document.getElementById('nuEngineeringDegrees').style.display = this.value === 'engineering' ? 'block' : 'none';
            
            // Show/hide appropriate input fields
            const isBusinessProgram = document.getElementById('nuBusiness').checked;
            console.log('Is business:', isBusinessProgram);
            
            const computingEngineeringInputs = document.getElementById('computingEngineeringInputs');
            const businessInputs = document.getElementById('businessInputs');
            
            console.log('Elements found:', {
                computingEngineeringInputs: !!computingEngineeringInputs,
                businessInputs: !!businessInputs
            });
            
            if (computingEngineeringInputs) computingEngineeringInputs.style.display = isBusinessProgram ? 'none' : '';
            if (businessInputs) businessInputs.style.display = isBusinessProgram ? '' : 'none';
        });
    });
}

// Set up clear buttons
function setupClearButtons() {
    const clearButtons = document.querySelectorAll('.clear-btn');
    clearButtons.forEach(button => {
        button.addEventListener('click', function() {
            const formId = this.getAttribute('data-form');
            clearForm(formId);
        });
    });
}

// Clear form inputs and results
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    // Clear inputs
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    });
    
    // Hide results
    if (formId === 'natForm') {
        document.getElementById('natResult').style.display = 'none';
        // Remove buttons container if it exists
        const buttonsContainer = document.querySelector('.nat-buttons-container');
        if (buttonsContainer) {
            buttonsContainer.remove();
        }
    } else if (formId === 'nuForm') {
        document.getElementById('nuResult').style.display = 'none';
        // Remove buttons container if it exists
        const buttonsContainer = document.querySelector('.nu-buttons-container');
        if (buttonsContainer) {
            buttonsContainer.remove();
        }
        // Reset program type to computing
        document.getElementById('nuComputing').checked = true;
        // Show computing/engineering inputs and hide business inputs
        document.getElementById('computingEngineeringInputs').style.display = '';
        document.getElementById('businessInputs').style.display = 'none';
        // Show computing weights
        document.getElementById('nuComputingWeights').style.display = 'block';
        document.getElementById('nuEngineeringWeights').style.display = 'none';
        document.getElementById('nuBusinessWeights').style.display = 'none';
    }
}

// Set up tab switching behavior
function setupTabSwitching() {
    const tabEls = document.querySelectorAll('button[data-bs-toggle="pill"]');
    tabEls.forEach(tabEl => {
        tabEl.addEventListener('shown.bs.tab', function(event) {
            // Clear forms when switching tabs
            clearForm('natForm');
            clearForm('nuForm');
        });
    });
}

// Set up option cards
function setupOptionCards() {
    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target').replace('#', '');
            const tabToShow = document.querySelector(`#${targetId}-tab`);
            if (tabToShow) {
                const tab = new bootstrap.Tab(tabToShow);
                tab.show();
            }
        });
    });
    
    // Set up dynamic placeholder updates for business calculation inputs
    setupBusinessPlaceholderUpdates();
}

// Helper function to update placeholder for correct question inputs
// Parameters: correctInputId - ID of the correct input field
//            attemptedValue - Current attempted value
//            maxValue - Maximum allowed value for that section
function updateCorrectPlaceholder(correctInputId, attemptedValue, maxValue) {
    const correctInput = document.getElementById(correctInputId);
    if (correctInput) {
        if (!isNaN(attemptedValue) && attemptedValue > 0) {
            // Set placeholder to show range from 0 to attempted value
            correctInput.placeholder = `0-${Math.min(attemptedValue, maxValue)}`;
        } else {
            // Reset to default placeholder if no attempted value
            const maxPlaceholder = maxValue === 50 ? '0-50' : maxValue === 25 ? '0-25' : '0-30';
            correctInput.placeholder = maxPlaceholder;
        }
    }
}

// Set up dynamic placeholder updates for business calculation inputs
// This function adds event listeners to update placeholders when attempted values change
function setupBusinessPlaceholderUpdates() {
    // Business inputs
    // Advanced Maths attempted input
    const advMathAttempted = document.getElementById('advMathAttempted');
    if (advMathAttempted) {
        advMathAttempted.addEventListener('input', function() {
            const value = parseFloat(this.value);
            updateCorrectPlaceholder('advMathCorrect', value, 50);
        });
    }
    
    // IQ attempted input
    const iqAttempted = document.getElementById('iqAttempted');
    if (iqAttempted) {
        iqAttempted.addEventListener('input', function() {
            const value = parseFloat(this.value);
            updateCorrectPlaceholder('iqCorrect', value, 25);
        });
    }
    
    // English attempted input
    const englishAttempted = document.getElementById('englishAttempted');
    if (englishAttempted) {
        englishAttempted.addEventListener('input', function() {
            const value = parseFloat(this.value);
            updateCorrectPlaceholder('englishCorrect', value, 30);
        });
    }
    
    // Computing/Engineering inputs
    // Advanced Math attempted input
    const advMathAttemptedComp = document.getElementById('advMathAttemptedComp');
    if (advMathAttemptedComp) {
        advMathAttemptedComp.addEventListener('input', function() {
            const value = parseFloat(this.value);
            updateCorrectPlaceholder('advMathCorrectComp', value, 50);
        });
    }
    
    // Basic Math attempted input
    const basicMathAttempted = document.getElementById('basicMathAttempted');
    if (basicMathAttempted) {
        basicMathAttempted.addEventListener('input', function() {
            const value = parseFloat(this.value);
            updateCorrectPlaceholder('basicMathCorrect', value, 20);
        });
    }
    
    // IQ attempted input
    const iqAttemptedComp = document.getElementById('iqAttemptedComp');
    if (iqAttemptedComp) {
        iqAttemptedComp.addEventListener('input', function() {
            const value = parseFloat(this.value);
            updateCorrectPlaceholder('iqCorrectComp', value, 20);
        });
    }
    
    // English attempted input
    const englishAttemptedComp = document.getElementById('englishAttemptedComp');
    if (englishAttemptedComp) {
        englishAttemptedComp.addEventListener('input', function() {
            const value = parseFloat(this.value);
            updateCorrectPlaceholder('englishCorrectComp', value, 30);
        });
    }
}

// Calculate Aggregate with NU/NAT Marks
function calculateAggregateWithNU() {
    const nuNATMarks = parseFloat(document.getElementById('nuNATMarks').value);
    const fscPercentage = parseFloat(document.getElementById('fscPercentage').value);
    const matricPercentage = parseFloat(document.getElementById('matricPercentage').value);
    const isComputingProgram = document.getElementById('natComputing').checked;

   
    // Calculate with any available values
    let finalAggregate = 0;
    let hasAnyValue = false;
    let componentsUsed = 0;
    
    if (!isNaN(nuNATMarks)) {
        let adjustedNuNATMarks = nuNATMarks;
        if (nuNATMarks > 100) {
            document.getElementById('nuNATMarks').value = 100;
            adjustedNuNATMarks = 100;
            showAlert('NU/NAT Marks have been set to 100.', 'warning', 'natForm');
        }
        if (isComputingProgram) {
            finalAggregate += adjustedNuNATMarks * (1/2);   //50% for computing
        } else {
            finalAggregate += adjustedNuNATMarks * (0.33);  //33% for engineering
        }
        hasAnyValue = true;
        componentsUsed++;
    }
    
    if (!isNaN(fscPercentage)) {
        let adjustedFscPercentage = fscPercentage;
        if (fscPercentage > 100) {
            document.getElementById('fscPercentage').value = 100;
            adjustedFscPercentage = 100;
            showAlert('FSC Percentage has been set to 100.', 'warning', 'natForm');
        }
        if (isComputingProgram) {
            finalAggregate += adjustedFscPercentage * (4/10);  //40% for computing
        } else {
            finalAggregate += adjustedFscPercentage * (0.5); // 50% for engineering
        }
        hasAnyValue = true;
        componentsUsed++;
    }
    
    if (!isNaN(matricPercentage)) {
        let adjustedMatricPercentage = matricPercentage;
        if (matricPercentage > 100) {
            document.getElementById('matricPercentage').value = 100;
            adjustedMatricPercentage = 100;
            showAlert('Matric Percentage has been set to 100.', 'warning', 'natForm');
        }
        if (isComputingProgram) {
            finalAggregate += adjustedMatricPercentage * (1/10);  //10% for computing
        } else {
            finalAggregate += adjustedMatricPercentage * (0.17); // 17% for engineering
        }
        hasAnyValue = true;
        componentsUsed++;
    }

    // Display result if any value is entered
    if (hasAnyValue) {
        let resultText = finalAggregate.toFixed(2);
        
        // Update the title based on whether calculation is partial
        const titleElement = document.querySelector('#natResult .card-title');
        if (componentsUsed < 3) {
            titleElement.textContent = "Your Result (Partial Calculation)";
        } else {
            titleElement.textContent = "Final Result";
        }
        
        document.getElementById('finalAggregateWithNU').textContent = resultText;
        document.getElementById('natResult').style.display = 'block';
    } else {
        document.getElementById('natResult').style.display = 'none';
    }
}

// Calculate NU Marks and Aggregate
function calculateNUAndAggregate() {
    const isComputingProgram = document.getElementById('nuComputing').checked;
    const isEngineeringProgram = document.getElementById('nuEngineering').checked;
    const isBusinessProgram = document.getElementById('nuBusiness').checked;
    
    if (isBusinessProgram) {
        calculateBusinessAggregate();
    } else {
        calculateComputingEngineeringAggregate();
    }
}

// Calculate for Computing and Engineering programs
function calculateComputingEngineeringAggregate() {
    // Get attempted values for each section
    const advancedMathAttempted = parseFloat(document.getElementById('advMathAttemptedComp').value);
    const basicMathAttempted = parseFloat(document.getElementById('basicMathAttempted').value);
    const iqAttempted = parseFloat(document.getElementById('iqAttemptedComp').value);
    const englishAttempted = parseFloat(document.getElementById('englishAttemptedComp').value);
    
    // Get correct values (these may have been automatically adjusted by validation)
    let advancedMathCorrect = parseFloat(document.getElementById('advMathCorrectComp').value);
    let basicMathCorrect = parseFloat(document.getElementById('basicMathCorrect').value);
    let iqCorrect = parseFloat(document.getElementById('iqCorrectComp').value);
    let englishCorrect = parseFloat(document.getElementById('englishCorrectComp').value);
    
    // Get academic percentages
    const matricPercentageNU = parseFloat(document.getElementById('matricPercentageNU').value);
    const fscPercentageNU = parseFloat(document.getElementById('fscPercentageNU').value);
    const isComputingProgram = document.getElementById('nuComputing').checked;
    
    // Check if at least one input has a value
    const hasAnyValue = !isNaN(advancedMathAttempted) || !isNaN(advancedMathCorrect) || 
                        !isNaN(basicMathAttempted) || !isNaN(basicMathCorrect) ||
                        !isNaN(iqAttempted) || !isNaN(iqCorrect) ||
                        !isNaN(englishAttempted) || !isNaN(englishCorrect) ||
                        !isNaN(matricPercentageNU) || !isNaN(fscPercentageNU);
    
    if (!hasAnyValue) {
        document.getElementById('nuResult').style.display = 'none';
        return;
    }

    // Validate percentage values if entered and set to 100 if exceeded
    let adjustedFscPercentageNU = fscPercentageNU;
    let adjustedMatricPercentageNU = matricPercentageNU;
    
    if (!isNaN(fscPercentageNU) && fscPercentageNU > 100) {
        document.getElementById('fscPercentageNU').value = 100;
        adjustedFscPercentageNU = 100;
        showAlert('FSC Percentage has been set to 100.', 'warning', 'nuForm');
    }
    
    if (!isNaN(matricPercentageNU) && matricPercentageNU > 100) {
        document.getElementById('matricPercentageNU').value = 100;
        adjustedMatricPercentageNU = 100;
        showAlert('Matric Percentage has been set to 100.', 'warning', 'nuForm');
    }

    // Calculate with available values
    let totalNegativeMarks = 0;
    let totalRawMarks = 0;
    let finalAggregate = 0;
    let isPartialCalculation = false;
    
    // Calculate marks and negative marking for each section
    // Advanced Math (50 MCQs)
    if (!isNaN(advancedMathAttempted) && !isNaN(advancedMathCorrect)) {
        totalRawMarks += advancedMathCorrect;
        totalNegativeMarks += (advancedMathAttempted - advancedMathCorrect) * (1/4); // 0.25 negative marking
    } else {
        isPartialCalculation = true;
    }
    
    // Basic Math (20 MCQs)
    if (!isNaN(basicMathAttempted) && !isNaN(basicMathCorrect)) {
        totalRawMarks += basicMathCorrect;
        totalNegativeMarks += (basicMathAttempted - basicMathCorrect) * (1/4); // 0.25 negative marking
    } else {
        isPartialCalculation = true;
    }
    
    // IQ (20 MCQs)
    if (!isNaN(iqAttempted) && !isNaN(iqCorrect)) {
        totalRawMarks += iqCorrect;
        totalNegativeMarks += (iqAttempted - iqCorrect) * (1/4); // 0.25 negative marking
    } else {
        isPartialCalculation = true;
    }
    
    // English (30 MCQs, worth 10 marks)
    if (!isNaN(englishAttempted) && !isNaN(englishCorrect)) {
        totalRawMarks += (englishCorrect * (10/30)); // English is worth 10 marks out of 30 questions
        totalNegativeMarks += (englishAttempted - englishCorrect) * ((10/30)/4); // 0.25 negative marking on 10 marks
    } else {
        isPartialCalculation = true;
    }
    
    // Calculate final marks after negative marking
    const finalNUMarks = totalRawMarks - totalNegativeMarks;
    
    // Add matric and FSc components if available
    if (!isNaN(finalNUMarks)) {
        let aggregateComponents = 0;
        let aggregateValue = 0;
        
        if (isComputingProgram) {
            aggregateValue += finalNUMarks * (1/2);    //50% for computing
        } else {
            aggregateValue += finalNUMarks * (0.33); // 33% for engineering
        }
        aggregateComponents++;
        
        if (!isNaN(matricPercentageNU)) {
            if (isComputingProgram) {
                aggregateValue += adjustedMatricPercentageNU * (1/10);  //10% for computing
            } else {
                aggregateValue += adjustedMatricPercentageNU * (0.17); // 17% for engineering
            }
            aggregateComponents++;
        } else {
            isPartialCalculation = true;
        }
        
        if (!isNaN(fscPercentageNU)) {
            if (isComputingProgram) {
                aggregateValue += adjustedFscPercentageNU * (4/10); // 40% for computing
            } else {
                aggregateValue += adjustedFscPercentageNU * (1/2); // 50% for engineering
            }
            aggregateComponents++;
        } else {
            isPartialCalculation = true;
        }
        
        finalAggregate = aggregateValue;
    }

    // Display results
    document.getElementById('nuResult').style.display = 'block';
    
    // Update the title based on whether calculation is partial
    const titleElement = document.querySelector('#nuResult .card-title');
    if (isPartialCalculation) {
        titleElement.textContent = "Your Result (Partial Calculation)";
    } else {
        titleElement.textContent = "Final Result";
    }
    
    // Show final marks
    document.getElementById('finalMarksNU').textContent = !isNaN(finalAggregate) ? finalAggregate.toFixed(2) : "N/A";
    
    // Show test marks after negative marking
    const marksAfterNegative = totalRawMarks - totalNegativeMarks
    document.getElementById('NU_Marks_after_negative_marking').textContent = !isNaN(marksAfterNegative) ? marksAfterNegative.toFixed(2) : "N/A";
    
    // Show test marks
    document.getElementById('nuTestMarksNU').textContent = !isNaN(totalRawMarks) ? totalRawMarks.toFixed(2) : "N/A";
    
    // Show negative marks
    document.getElementById('negativeMarksNU').textContent = !isNaN(totalNegativeMarks) ? totalNegativeMarks.toFixed(2) : "N/A";
}

// Calculate for Business programs
function calculateBusinessAggregate() {
    // Get attempted values
    const mathsAttempted = parseFloat(document.getElementById('advMathAttempted').value);
    const iqAttempted = parseFloat(document.getElementById('iqAttempted').value);
    const englishAttempted = parseFloat(document.getElementById('englishAttempted').value);
    
    // Get correct values (these may have been automatically adjusted by validation)
    let mathsCorrect = parseFloat(document.getElementById('advMathCorrect').value);
    let iqCorrect = parseFloat(document.getElementById('iqCorrect').value);
    let englishCorrect = parseFloat(document.getElementById('englishCorrect').value);
    
    // Get other values
    const essayMarks = parseFloat(document.getElementById('essay').value);
    const sscPercentage = parseFloat(document.getElementById('sscPercentage').value);
    const hsscPercentage = parseFloat(document.getElementById('hsscPercentage').value);
    
    // Check if at least one input has a value
    const hasAnyValue = !isNaN(mathsAttempted) || !isNaN(mathsCorrect) || 
                        !isNaN(iqAttempted) || !isNaN(iqCorrect) || 
                        !isNaN(essayMarks) || !isNaN(englishAttempted) || 
                        !isNaN(englishCorrect) || !isNaN(sscPercentage) || 
                        !isNaN(hsscPercentage);
    
    if (!hasAnyValue) {
        document.getElementById('nuResult').style.display = 'none';
        return;
    }

    // Validate percentage values if entered and set to 100 if exceeded
    let adjustedSscPercentage = sscPercentage;
    let adjustedHsscPercentage = hsscPercentage;
    
    if (!isNaN(sscPercentage) && sscPercentage > 100) {
        document.getElementById('sscPercentage').value = 100;
        adjustedSscPercentage = 100;
        showAlert('SSC Percentage has been set to 100.', 'warning', 'nuForm');
    }
    
    if (!isNaN(hsscPercentage) && hsscPercentage > 100) {
        document.getElementById('hsscPercentage').value = 100;
        adjustedHsscPercentage = 100;
        showAlert('HSSC Percentage has been set to 100.', 'warning', 'nuForm');
    }
    
    // Validate that correct questions don't exceed attempted questions
    if (!isNaN(mathsAttempted) && !isNaN(mathsCorrect) && mathsCorrect > mathsAttempted) {
        showAlert('Correct Maths cannot exceed attempted Maths', 'danger', 'nuForm');
        document.getElementById('advMathCorrect').value = mathsAttempted;
        mathsCorrect = mathsAttempted;
    }
    
    if (!isNaN(iqAttempted) && !isNaN(iqCorrect) && iqCorrect > iqAttempted) {
        showAlert('Correct IQ cannot exceed attempted IQ', 'danger', 'nuForm');
        document.getElementById('iqCorrect').value = iqAttempted;
        iqCorrect = iqAttempted;
    }
    
    if (!isNaN(englishAttempted) && !isNaN(englishCorrect) && englishCorrect > englishAttempted) {
        showAlert('Correct English cannot exceed attempted English', 'danger', 'nuForm');
        document.getElementById('englishCorrect').value = englishAttempted;
        englishCorrect = englishAttempted;
    }

    // Calculate business aggregate
    let totalRawMarks = 0;
    let totalNegativeMarks = 0;
    let isPartialCalculation = false;
    
    // Maths calculation (50 questions, 50 marks)
    if (!isNaN(mathsAttempted) && !isNaN(mathsCorrect)) {
        totalRawMarks += mathsCorrect;
        totalNegativeMarks += (mathsAttempted - mathsCorrect) * (1/4); // 1/4 negative marking
    } else {
        isPartialCalculation = true;
    }
    
    // IQ calculation (25 questions, 25 marks)
    if (!isNaN(iqAttempted) && !isNaN(iqCorrect)) {
        totalRawMarks += iqCorrect;
        totalNegativeMarks += (iqAttempted - iqCorrect) * (1/4); // 1/4 negative marking
    } else {
        isPartialCalculation = true;
    }
    
    // Essay (15 marks)
    if (!isNaN(essayMarks)) {
        totalRawMarks += essayMarks;
    } else {
        isPartialCalculation = true;
    }
    
    // English calculation (30 questions, 10 marks)
    if (!isNaN(englishAttempted) && !isNaN(englishCorrect)) {
        totalRawMarks += (englishCorrect * (10/30)); // English is worth 10 marks out of 30 questions
        totalNegativeMarks += (englishAttempted - englishCorrect) * ((10/30)/4); // 1/4 negative marking on 10 marks
    } else {
        isPartialCalculation = true;
    }
    
    // Calculate final NU test marks after negative marking
    const finalNUMarks = totalRawMarks - totalNegativeMarks;
    
    // Calculate aggregate (NU Test: 50%, HSSC: 40%, SSC: 10%)
    let finalAggregate = 0;
    
    if (!isNaN(finalNUMarks)) {
        finalAggregate += finalNUMarks * 0.5; // 50% for NU test
    }
    
    if (!isNaN(hsscPercentage)) {
        finalAggregate += adjustedHsscPercentage * 0.4; // 40% for HSSC
    } else {
        isPartialCalculation = true;
    }
    
    if (!isNaN(sscPercentage)) {
        finalAggregate += adjustedSscPercentage * 0.1; // 10% for SSC
    } else {
        isPartialCalculation = true;
    }

    // Display results
    document.getElementById('nuResult').style.display = 'block';
    
    // Update the title based on whether calculation is partial
    const titleElement = document.querySelector('#nuResult .card-title');
    if (isPartialCalculation) {
        titleElement.textContent = "Your Result (Partial Calculation)";
    } else {
        titleElement.textContent = "Final Result";
    }
    
    // Show final aggregate
    document.getElementById('finalMarksNU').textContent = !isNaN(finalAggregate) ? finalAggregate.toFixed(2) : "N/A";
    
    // Show final NU marks after negative marking
    document.getElementById('NU_Marks_after_negative_marking').textContent = !isNaN(finalNUMarks) ? finalNUMarks.toFixed(2) : "N/A";
    
    // Show total NU test marks
    document.getElementById('nuTestMarksNU').textContent = !isNaN(totalRawMarks) ? totalRawMarks.toFixed(2) : "N/A";
    
    // Show negative marks
    document.getElementById('negativeMarksNU').textContent = !isNaN(totalNegativeMarks) ? totalNegativeMarks.toFixed(2) : "N/A";
}

// Helper function to show alerts
function showAlert(message, type, formId) {
    // Remove any existing alerts
    const existingAlerts = document.querySelectorAll('.alert-dismissible');
    existingAlerts.forEach(alert => {
        alert.remove();
    });
    
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Find the form
    const form = document.getElementById(formId);
    if (!form) return;
    
    // Insert alert before the form
    form.parentNode.insertBefore(alertDiv, form);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}

// Set up feedback form submission
function setupFeedbackForm() {
    const feedbackForm = document.getElementById("feedbackForm");
    if (feedbackForm) {
        feedbackForm.addEventListener("submit", function(event) {
            event.preventDefault();

            var selectedRating = document.querySelector('input[name="rating"]:checked');
            if (!selectedRating) {
                alert("Please select a rating before submitting.");
                return;
            }

            var formData = {
                rating: selectedRating.value,
                email: document.getElementById("email").value,
                comments: document.getElementById("comments").value
            };
            
            //clear input
            document.getElementById("feedbackForm").reset();
            selectedRating.checked = false;
            showAlert("Thank you for your feedback!", "success", "feedbackForm"); 

            fetch("https://script.google.com/macros/s/AKfycbxh2BUlf8HCm8qw4g-VU8MhWQ0pWrrZkPwgzU3fO5F2ZL4Xi6qO8t5X4Ba7JFAt_VxO/exec", {  
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "no-cors",
                body: JSON.stringify(formData)
            })
            .then(response => {
                showAlert("Thank you for your feedback!", "success", "feedbackForm");
            })
            .catch(error => {
                console.error("Error:", error);
                showAlert("There was an error submitting your feedback.", "danger", "feedbackForm");
            });
        });
    }
}

// Set up hamburger menu
function setupHamburgerMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburgerBtn) {
        // Auto-collapse the menu when a nav item is clicked on mobile
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 768) {
                    const navbarCollapse = document.getElementById('navbarNav');
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            });
        });
    }
}

// Set up theme toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Apply dark theme by default unless user has set light
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        // Save preference to localStorage
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Listen for changes in device theme preference
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        }
    });
}

// Set up PDF generation
function setupPDFGeneration() {
    const pdfButtons = document.querySelectorAll('.generate-pdf-btn');
    
    pdfButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resultType = this.getAttribute('data-result-type');
            generatePDF(resultType);
        });
    });
}

// Generate PDF based on result type
function generatePDF(resultType) {
    // Show loading indicator
    showAlert('Generating PDF, please wait...', 'info', resultType === 'nat' ? 'natForm' : 'nuForm');
    
    // Create a new jsPDF instance
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    // Set document properties
    doc.setProperties({
        title: 'FAST NUCES Aggregate Calculation',
        subject: 'Admission Test Score Calculator Results',
        author: 'FAST NUCES Calculator',
        creator: 'FAST NUCES Calculator'
    });
    
    // Add header
    doc.setFontSize(22);
    doc.setTextColor(13, 71, 161); // Primary dark color
    doc.text('FAST NUCES', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(25, 118, 210); // Primary color
    doc.text('Admission Test Score Calculator', 105, 30, { align: 'center' });
    
    // Add horizontal line
    doc.setDrawColor(25, 118, 210);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Add date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${dateStr}`, 20, 45);
    
    // Add calculation type and program type
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    
    if (resultType === 'nat') {
        const isComputingProgram = document.getElementById('natComputing').checked;
        const programType = isComputingProgram ? 'COMPUTING': 'ENGINEERING';
        
        doc.text('NAT Marks Calculation Results', 105, 55, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Program Type: ${programType}`, 20, 65);
        
        // Add weights information
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        if (isComputingProgram) {
            doc.text('Weights: NU/NAT (50%), FSc (40%), Matric (10%)', 20, 72);
        } else {
            doc.text('Weights: NU/NAT (33%), FSc (50%), Matric (17%)', 20, 72);
        }
        
        // Add input values
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Input Values:', 20, 85);
        
        const nuNATMarks = document.getElementById('nuNATMarks').value || 'Not provided';
        const matricPercentage = document.getElementById('matricPercentage').value || 'Not provided';
        const fscPercentage = document.getElementById('fscPercentage').value || 'Not provided';
        
        doc.text(`NU/NAT Marks: ${nuNATMarks}`, 30, 95);
        doc.text(`Matric Percentage: ${matricPercentage}`, 30, 105);
        doc.text(`FSc Percentage: ${fscPercentage}`, 30, 115);
        
        // Add result
        const finalAggregate = document.getElementById('finalAggregateWithNU').textContent;
        
        doc.setFontSize(14);
        doc.text('Final Result:', 20, 125);
        
        doc.setFontSize(16);
        doc.setTextColor(13, 71, 161);
        doc.text(`Aggregate Score: ${finalAggregate}`, 105, 135, { align: 'center' });
        
    } else if (resultType === 'nu') {
        const isComputingProgram = document.getElementById('nuComputing').checked;
        const isEngineeringProgram = document.getElementById('nuEngineering').checked;
        const isBusinessProgram = document.getElementById('nuBusiness').checked;
        
        let programType = 'COMPUTING';
        if (isEngineeringProgram) programType = 'ENGINEERING';
        else if (isBusinessProgram) programType = 'BUSINESS';

        doc.text('NU Marks Calculation Results', 105, 55, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Program Type: ${programType}`, 20, 65);
        
        // Add weights information
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        if (isComputingProgram) {
            doc.text('Weights: NU Test (50%), FSc (40%), Matric (10%)', 20, 72);
        } else if (isEngineeringProgram) {
            doc.text('Weights: NU Test (33%), FSc (50%), Matric (17%)', 20, 72);
        } else if (isBusinessProgram) {
            doc.text('Weights: NU Test (50%), HSSC (40%), SSC (10%)', 20, 72);
        }
        
        // Add input values
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Input Values:', 20, 85);
        
        if (isBusinessProgram) {
            // Business inputs
            const attemptedMaths = document.getElementById('advMathAttempted').value || 'Not provided';
            const correctMaths = document.getElementById('advMathCorrect').value || 'Not provided';
            const attemptedIQ = document.getElementById('iqAttempted').value || 'Not provided';
            const correctIQ = document.getElementById('iqCorrect').value || 'Not provided';
            const essay = document.getElementById('essay').value || 'Not provided';
            const attemptedEnglish = document.getElementById('englishAttempted').value || 'Not provided';
            const correctEnglish = document.getElementById('englishCorrect').value || 'Not provided';
            const sscPercentage = document.getElementById('sscPercentage').value || 'Not provided';
            const hsscPercentage = document.getElementById('hsscPercentage').value || 'Not provided';
            
            doc.text(`Attempted Maths: ${attemptedMaths}`, 30, 95);
            doc.text(`Correct Maths: ${correctMaths}`, 30, 105);
            doc.text(`Attempted IQ: ${attemptedIQ}`, 30, 115);
            doc.text(`Correct IQ: ${correctIQ}`, 30, 125);
            doc.text(`Essay: ${essay}`, 30, 135);
            doc.text(`Attempted English: ${attemptedEnglish}`, 30, 145);
            doc.text(`Correct English: ${correctEnglish}`, 30, 155);
            doc.text(`SSC Percentage: ${sscPercentage}`, 30, 165);
            doc.text(`HSSC Percentage: ${hsscPercentage}`, 30, 175);
        } else {
            // Computing/Engineering inputs
            const totalAttemptedExceptEnglish = document.getElementById('totalAttemptedExceptEnglish').value || 'Not provided';
            const correctExceptEnglish = document.getElementById('correctExceptEnglish').value || 'Not provided';
            const totalAttemptedEnglish = document.getElementById('totalAttemptedEnglish').value || 'Not provided';
            const correctEnglish = document.getElementById('correctEnglish').value || 'Not provided';
            const matricPercentageNU = document.getElementById('matricPercentageNU').value || 'Not provided';
            const fscPercentageNU = document.getElementById('fscPercentageNU').value || 'Not provided';
            
            doc.text(`Total Attempted Questions (except English): ${totalAttemptedExceptEnglish}`, 30, 95);
            doc.text(`Correct Questions (except English): ${correctExceptEnglish}`, 30, 105);
            doc.text(`Total Attempted Questions (only English): ${totalAttemptedEnglish}`, 30, 115);
            doc.text(`Correct Questions (only English): ${correctEnglish}`, 30, 125);
            doc.text(`Matric Percentage: ${matricPercentageNU}`, 30, 135);
            doc.text(`FSc Percentage: ${fscPercentageNU}`, 30, 145);
        }
        
        // Add results
        const finalMarksNU = document.getElementById('finalMarksNU').textContent;
        const nuTestMarksNU = document.getElementById('nuTestMarksNU').textContent;
        const negativeMarksNU = document.getElementById('negativeMarksNU').textContent;
        
        doc.setFontSize(14);
        doc.text('Final Results:', 20, isBusinessProgram ? 185 : 155);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`NU Test Marks: ${nuTestMarksNU}`, 30, isBusinessProgram ? 195 : 165);
        doc.text(`Negative Marks: ${negativeMarksNU}`, 30, isBusinessProgram ? 205 : 175);
        
        doc.setFontSize(16);
        doc.setTextColor(13, 71, 161);
        doc.text(`Final Aggregate: ${finalMarksNU}`, 105, isBusinessProgram ? 225 : 190, { align: 'center' });
    }
    
    // Add calculator link
    doc.setFontSize(12);
    doc.setTextColor(25, 118, 210); // Primary color
    doc.text('Calculator Link:', 20, 210);
    
    // Add clickable link
    const calculatorLink = 'https://mtaha-23.github.io/FAST-Aggregate-Calculator/';
    doc.setTextColor(0, 102, 204); // Link blue color
    doc.textWithLink(calculatorLink, 50, 210, { url: calculatorLink });
    doc.setLineWidth(0.1);
    doc.line(50, 211, 50 + doc.getTextWidth(calculatorLink), 211);
    
    // Add social media section
    doc.setFontSize(12);
    doc.setTextColor(25, 118, 210); // Primary color
    doc.text('Follow on instagram:', 20, 225);
    
    // Add Instagram link
    doc.setTextColor(0, 102, 204); // Link blue color
    const instagramText = '         Taha (Instagram)';
    const instagramLink = 'https://www.instagram.com/taha.insights';
    doc.textWithLink(instagramText, 50, 225, { url: instagramLink });
    doc.setLineWidth(0.1);
    doc.line(50, 226, 50 + doc.getTextWidth(instagramText), 226);
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('© Taha | FAST NUCES Calculator', 105, 280, { align: 'center' });
    doc.text('This is a calculation result and not an official document from FAST NUCES.', 105, 285, { align: 'center' });
    
    // Save the PDF
    doc.save(`FAST-NUCES-${resultType.toUpperCase()}-Calculation.pdf`);
    
    // Show success message
    showAlert('PDF generated successfully!', 'success', resultType === 'nat' ? 'natForm' : 'nuForm');
}

// Sets up Copy, PDF, and Clear buttons after result calculation
function initCopyPdfClearButtons() {
  // Generate dynamic share text
  function getShareText(resultType) {
    if (resultType === 'nat') {
      const finalAggregate = document.getElementById('finalAggregateWithNU').textContent;
      return `I calculated my FAST NUCES aggregate score: ${finalAggregate}! Calculate yours at https://mtaha-23.github.io/FAST-Aggregate-Calculator/`;
    } else if (resultType === 'nu') {
      const finalMarks = document.getElementById('finalMarksNU').textContent;
      const nuTestMarks = document.getElementById('nuTestMarksNU').textContent;
      const negativeMarks = document.getElementById('negativeMarksNU').textContent;
      const isBusinessProgram = document.getElementById('nuBusiness').checked;
      const programType = isBusinessProgram ? "Business" : "Computing/Engineering";
      return `I calculated my FAST NUCES ${programType} results - Final Aggregate: ${finalMarks}, NU Test Marks: ${nuTestMarks}, Negative Marks: ${negativeMarks}. Calculate yours at https://mtaha-23.github.io/FAST-Aggregate-Calculator/`;
    }
    return '';
  }

  // Copy to clipboard
  function copyResult(resultType) {
    const shareText = getShareText(resultType);
    navigator.clipboard.writeText(shareText)
      .then(() => showAlert('Result copied to clipboard!', 'success', `${resultType}Form`))
      .catch(() => showAlert('Failed to copy to clipboard', 'danger', `${resultType}Form`));
  }

  // Reusable: Add copy, PDF, and clear buttons
  function addButtons(resultType) {
    const resultContainer = document.getElementById(`${resultType}Result`);
    if (!resultContainer) return;

    const existing = document.querySelector(`.${resultType}-buttons-container`);
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.className = `${resultType}-buttons-container text-center mt-3`;

    const row = document.createElement('div');
    row.className = 'row g-2 justify-content-center';

    // // 📋 Copy Button
    // row.appendChild(createButtonColumn({
    //   type: 'button',
    //   className: 'btn btn-outline-primary w-100 px-4',
    //   innerHTML: '<i class="bi bi-clipboard me-2"></i> Copy Result',
    //   onClick: () => copyResult(resultType)
    // }));

     // 📋 Screenshot Button
    row.appendChild(createButtonColumn({
      type: 'button',
      className: 'btn btn-primary w-100 px-4',
      innerHTML: '<i class="bi bi-camera"></i> Screenshot Result',
      onClick: () => downloadResultImage(resultType)
      
    }));
   
    // 📄 PDF Button
    row.appendChild(createButtonColumn({
      type: 'button',
      className: 'btn btn-outline-primary w-100 px-4',
      innerHTML: '<i class="bi bi-file-earmark-pdf me-2"></i> Generate PDF',
      onClick: () => generatePDF(resultType)
    }));

    // 🧹 Clear Button
    row.appendChild(createButtonColumn({
      type: 'button',
      className: 'btn btn-outline-secondary w-100 px-4',
      innerHTML: '<i class="bi bi-eraser me-2"></i> Clear',
      onClick: () => clearForm(`${resultType}Form`)
    }));

    wrapper.appendChild(row);
    resultContainer.after(wrapper);
  }

  // Helper to create a Bootstrap column button
  function createButtonColumn({ type, className, innerHTML, onClick }) {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-auto';
    const btn = document.createElement('button');
    btn.type = type;
    btn.className = className;
    btn.innerHTML = innerHTML;
    btn.addEventListener('click', onClick);
    col.appendChild(btn);
    return col;
  }

  // Hook into original calculation functions
  const originalCalculateAggregateWithNU = calculateAggregateWithNU;
  calculateAggregateWithNU = function () {
    originalCalculateAggregateWithNU.apply(this, arguments);
    if (document.getElementById('natResult').style.display !== 'none') {
      addButtons('nat');
    }
  };

  const originalCalculateNUAndAggregate = calculateNUAndAggregate;
  calculateNUAndAggregate = function () {
    originalCalculateNUAndAggregate.apply(this, arguments);
    if (document.getElementById('nuResult').style.display !== 'none') {
      addButtons('nu');
    }
  };
}

// Set up program type radio buttons and weights information
function setupProgramTypeRadios() {
    // NAT program type radio buttons
    const natComputingRadio = document.getElementById('natComputing');
    const natEngineeringRadio = document.getElementById('natEngineering');
    const natComputingWeights = document.getElementById('natComputingWeights');
    const natEngineeringWeights = document.getElementById('natEngineeringWeights');

    // NU program type radio buttons
    const nuComputingRadio = document.getElementById('nuComputing');
    const nuEngineeringRadio = document.getElementById('nuEngineering');
    const nuBusinessRadio = document.getElementById('nuBusiness');

    const nuComputingWeights = document.getElementById('nuComputingWeights');
    const nuEngineeringWeights = document.getElementById('nuEngineeringWeights');
    const nuBusinessWeights = document.getElementById('nuBusinessWeights');

    // Function to handle NAT program type change
    function handleNATProgramTypeChange() {
        if (natComputingRadio.checked) {
            natComputingWeights.style.display = 'block';
            natEngineeringWeights.style.display = 'none';
            // Show computing and business degrees
            document.getElementById('natComputingBusinessDegree').style.display = 'block';
            document.getElementById('engineeringDegrees').style.display = 'none';
        } else {
            natComputingWeights.style.display = 'none';
            natEngineeringWeights.style.display = 'block';
            // Show engineering degrees
            document.getElementById('natComputingBusinessDegree').style.display = 'none';
            document.getElementById('engineeringDegrees').style.display = 'block';
        }
    }

    // Function to handle NU program type change
    function handleNUProgramTypeChange() {
        if (nuComputingRadio.checked) {
            nuComputingWeights.style.display = 'block';
            nuEngineeringWeights.style.display = 'none';
            nuBusinessWeights.style.display = 'none';
            // Show computing degrees
            document.getElementById('nuComputingDegrees').style.display = 'block';
            document.getElementById('nuBusinessDegrees').style.display = 'none';
            document.getElementById('nuEngineeringDegrees').style.display = 'none';
        } else if (nuEngineeringRadio.checked) {
            nuComputingWeights.style.display = 'none';
            nuEngineeringWeights.style.display = 'block';
            nuBusinessWeights.style.display = 'none';
            // Show engineering degrees
            document.getElementById('nuComputingDegrees').style.display = 'none';
            document.getElementById('nuBusinessDegrees').style.display = 'none';
            document.getElementById('nuEngineeringDegrees').style.display = 'block';
        } else if (nuBusinessRadio.checked) {
            nuComputingWeights.style.display = 'none';
            nuEngineeringWeights.style.display = 'none';
            nuBusinessWeights.style.display = 'block';
            // Show business degrees
            document.getElementById('nuComputingDegrees').style.display = 'none';
            document.getElementById('nuBusinessDegrees').style.display = 'block';
            document.getElementById('nuEngineeringDegrees').style.display = 'none';
        }
    }

    // Add event listeners for NAT radio buttons
    if (natComputingRadio && natEngineeringRadio) {
        natComputingRadio.addEventListener('change', handleNATProgramTypeChange);
        natEngineeringRadio.addEventListener('change', handleNATProgramTypeChange);
        // Initialize NAT weights visibility
        handleNATProgramTypeChange();
    }

    // Add event listeners for NU radio buttons
    if (nuComputingRadio && nuEngineeringRadio && nuBusinessRadio) {
        nuComputingRadio.addEventListener('change', handleNUProgramTypeChange);
        nuEngineeringRadio.addEventListener('change', handleNUProgramTypeChange);
        nuBusinessRadio.addEventListener('change', handleNUProgramTypeChange);
        // Initialize NU weights visibility
        handleNUProgramTypeChange();
    }
}

// Set up FAQs functionality
function setupFAQs() {
    const faqContainer = document.getElementById('faq-container');
    const categoryNav = document.getElementById('faq-category-nav');
    const searchBar = document.getElementById('faq-search-bar');

    if (!faqContainer || !categoryNav || !searchBar) {
        return; // FAQs tab not loaded yet
    }

    // Check if FAQs are already loaded to prevent duplicates
    if (faqContainer.children.length > 0) {
        return; // FAQs already loaded
    }

    // Load and display FAQs
    Promise.all([
        fetch('FAQs/student_faqs.json').then(response => response.json()),
        fetch('FAQs/official_faqs.json').then(response => response.json())
    ])
    .then(([studentFaqs, officialFaqs]) => {
        const data = [...studentFaqs, ...officialFaqs];
        const faqsByCategory = data.reduce((acc, faq) => {
            const { category } = faq;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(faq);
            return acc;
        }, {});

        // Create category navigation
        for (const category in faqsByCategory) {
            const categoryId = 'category-' + category.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();
            const navLink = document.createElement('button');
            navLink.textContent = category;
            navLink.classList.add('btn', 'btn-outline-primary', 'btn-sm');
            navLink.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth' });
            });
            categoryNav.appendChild(navLink);
        }

        // Create FAQ content
        for (const category in faqsByCategory) {
            const categoryId = 'category-' + category.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('faq-category', 'mb-4');
            categoryContainer.id = categoryId;
            
            const categoryTitle = document.createElement('h3');
            categoryTitle.classList.add('category-title', 'fw-bold', 'mb-3', 'text-primary');
            categoryTitle.textContent = category;
            categoryContainer.appendChild(categoryTitle);

            faqsByCategory[category].forEach(faq => {
                const faqItem = document.createElement('div');
                faqItem.classList.add('faq-item', 'card', 'mb-2', 'shadow-sm');
                faqItem.dataset.question = faq.question.toLowerCase();
                faqItem.dataset.answer = faq.answer.toLowerCase();
                faqItem.dataset.category = faq.category.toLowerCase();

                const answerText = faq.answer
                    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
                    .replace(/\n/g, '<br>');

                faqItem.innerHTML = `
                    <div class="card-header py-2 cursor-pointer faq-question">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="fw-semibold">${faq.question}</span>
                            <i class="bi bi-chevron-down text-muted"></i>
                        </div>
                    </div>
                    <div class="card-body py-3 faq-answer" style="display: none;">
                        ${answerText}
                    </div>
                `;

                categoryContainer.appendChild(faqItem);

                const question = faqItem.querySelector('.faq-question');
                const answer = faqItem.querySelector('.faq-answer');
                const icon = question.querySelector('.bi');

                question.addEventListener('click', () => {
                    const wasActive = faqItem.classList.contains('active');
                    
                    // Close all other FAQ items
                    document.querySelectorAll('.faq-item.active').forEach(item => {
                        item.classList.remove('active');
                        const otherAnswer = item.querySelector('.faq-answer');
                        const otherIcon = item.querySelector('.bi');
                        otherAnswer.style.display = 'none';
                        otherIcon.classList.remove('bi-chevron-up');
                        otherIcon.classList.add('bi-chevron-down');
                    });
                    
                    if (!wasActive) {
                        faqItem.classList.add('active');
                        answer.style.display = 'block';
                        icon.classList.remove('bi-chevron-down');
                        icon.classList.add('bi-chevron-up');
                    }
                });
            });
            faqContainer.appendChild(categoryContainer);
        }
    })
    .catch(error => console.error('Error fetching FAQs:', error));
    
    // Search functionality
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allFaqItems = document.querySelectorAll('.faq-item');
        const allCategoryTitles = document.querySelectorAll('.category-title');

        let visibleCategories = new Set();

        allFaqItems.forEach(item => {
            const questionText = item.dataset.question;
            const answerText = item.dataset.answer;
            const categoryText = item.dataset.category;
            
            const isVisible = questionText.includes(searchTerm) || answerText.includes(searchTerm);
            item.style.display = isVisible ? 'block' : 'none';

            if (isVisible) {
                visibleCategories.add(categoryText);
            }
        });

        allCategoryTitles.forEach(title => {
            const category = title.textContent.toLowerCase();
            const isVisible = visibleCategories.has(category);
            title.style.display = isVisible ? 'block' : 'none';
        });
    });
}

// Set up download result image functionality
function downloadResultImage(resultType) {
    let resultImageContainer = document.createElement("div");
    resultImageContainer.style.width = "400px";
    resultImageContainer.style.margin = "50px auto";
    resultImageContainer.style.padding = "20px";
    resultImageContainer.style.borderRadius = "12px";
    resultImageContainer.style.backgroundColor = "#063377";
    resultImageContainer.style.fontFamily = "'Poppins', sans-serif";
    resultImageContainer.style.color = "#e0e0e0";
    resultImageContainer.style.boxShadow = "0 0 15px rgba(0,0,0,0.4)";
    resultImageContainer.style.position = "relative";

    let watermarkHTML = `
        <div style="text-align: center; font-size: 12px; color: rgba(255, 255, 255, 0.3); margin-bottom: 20px;">
            mtaha-23.github.io/FAST-Aggregate-Calculator
        </div>`;

    if (resultType === "nu") {
        const finalAggregate = document.getElementById("finalMarksNU").innerText || "—";
        const finalNUMarks = document.getElementById("NU_Marks_after_negative_marking").innerText || "—";
        const rawTestMarks = document.getElementById("nuTestMarksNU").innerText || "—";
        const negativeMarks = document.getElementById("negativeMarksNU").innerText || "—";
        
        let programType;
        // Check if it's business program
        const isBusinessProgram = document.getElementById('nuBusiness').checked;
        if (isBusinessProgram)
            programType = "Business";
        else if (document.getElementById('nuComputing').checked)
            programType = "Computing";
        else
            programType = "Engineering";
        
        resultImageContainer.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 8px; color: white;">Final Result (${programType})</h3>
            ${watermarkHTML}
            <div style="display: flex; flex-direction: column; gap: 15px; align-items: center;">
                <div style="width: 100%; background-color: #2e7d32; padding: 15px; border-radius: 12px; text-align: center;">
                    <div style="color: white; font-weight: 500; font-size: 0.85rem;">Final Aggregate</div>
                    <div style="color: white; font-size: 1.4rem; font-weight: 700;">${finalAggregate}</div>
                </div>
                <div style="width: 100%; background-color: #1565c0; padding: 15px; border-radius: 12px; text-align: center;">
                    <div style="color: white; font-weight: 500; font-size: 0.85rem;">Final NU Marks</div>
                    <div style="color: white; font-size: 1.4rem; font-weight: 700;">${finalNUMarks}</div>
                </div>
                <div style="width: 100%; background-color: #1565c0; padding: 15px; border-radius: 12px; text-align: center;">
                    <div style="color: white; font-weight: 500; font-size: 0.85rem;">NU Test Marks</div>
                    <div style="color: white; font-size: 1.4rem; font-weight: 700;">${rawTestMarks}</div>
                </div>
                <div style="width: 100%; background-color: #ba5554; padding: 15px; border-radius: 12px; text-align: center;">
                    <div style="color: white; font-weight: 500; font-size: 0.85rem;">NU Negative Mark</div>
                    <div style="color: white; font-size: 1.4rem; font-weight: 700;">${negativeMarks}</div>
                </div>
            </div>`;
    } else if (resultType === "nat") {
        const finalAggregate = document.getElementById("finalAggregateWithNU").innerText || "—";

        resultImageContainer.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 8px; color: white;">Final Result</h3>
            ${watermarkHTML}
            <div style="display: flex; justify-content: center;">
                <div style="width: 100%; background-color: #2e7d32; padding: 20px; border-radius: 12px; text-align: center;">
                    <div style="color: white; font-weight: 500; font-size: 0.85rem;">Final Aggregate</div>
                    <div style="color: white; font-size: 1.6rem; font-weight: 700;">${finalAggregate}</div>
                </div>
            </div>`;
    } else {
        alert("Invalid result type");
        return;
    }

    document.body.appendChild(resultImageContainer);

    html2canvas(resultImageContainer, {
        backgroundColor: null,
        scale: 2
    }).then(canvas => {
        const downloadLink = document.createElement("a");
        downloadLink.download = "FAST_Result.png";
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.click();
        document.body.removeChild(resultImageContainer);
    }).catch(error => {
        console.error("Image generation failed:", error);
        document.body.removeChild(resultImageContainer);
    });
}



