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
                } else if (value > 100) {
                    this.value = 100;
                    showAlert('Value cannot be greater than 100', 'danger', this.closest('form').id);
                }
                
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
            // Show/hide appropriate input fields
            const isBusiness = document.getElementById('nuBusiness').checked;
            console.log('Is business:', isBusiness);
            
            const computingInputsRow1 = document.getElementById('computingEngineeringInputsRow1');
            const computingInputsRow2 = document.getElementById('computingEngineeringInputsRow2');
            const businessInputs = document.getElementById('businessInputs');
            
            console.log('Elements found:', {
                computingInputsRow1: !!computingInputsRow1,
                computingInputsRow2: !!computingInputsRow2,
                businessInputs: !!businessInputs
            });
            
            if (computingInputsRow1) computingInputsRow1.style.display = isBusiness ? 'none' : '';
            if (computingInputsRow2) computingInputsRow2.style.display = isBusiness ? 'none' : '';
            if (businessInputs) businessInputs.style.display = isBusiness ? '' : 'none';
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
        document.getElementById('computingEngineeringInputsRow1').style.display = '';
        document.getElementById('computingEngineeringInputsRow2').style.display = '';
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
}

// Calculate Aggregate with NU/NAT Marks
function calculateAggregateWithNU() {
    const nuNATMarks = parseFloat(document.getElementById('nuNATMarks').value);
    const fscPercentage = parseFloat(document.getElementById('fscPercentage').value);
    const matricPercentage = parseFloat(document.getElementById('matricPercentage').value);
    const isProgramTypeComputing = document.getElementById('natComputing').checked;

   
    // Calculate with any available values
    let finalAggregate = 0;
    let hasAnyValue = false;
    let componentsUsed = 0;
    
    if (!isNaN(nuNATMarks)) {
        if (isProgramTypeComputing) {
            finalAggregate += nuNATMarks * (1/2);   //50% for computing
        } else {
            finalAggregate += nuNATMarks * (0.33);  //33% for engineering
        }
        hasAnyValue = true;
        componentsUsed++;
    }
    
    if (!isNaN(fscPercentage)) {
        if (fscPercentage > 100) {
            showAlert('FSC Percentage cannot be greater than 100.', 'danger', 'natForm');
            return;
        }
        if (isProgramTypeComputing) {
            finalAggregate += fscPercentage * (4/10);  //40% for computing
        } else {
            finalAggregate += fscPercentage * (0.5); // 50% for engineering
        }
        hasAnyValue = true;
        componentsUsed++;
    }
    
    if (!isNaN(matricPercentage)) {
        if (matricPercentage > 100) {
            showAlert('Matric Percentage cannot be greater than 100.', 'danger', 'natForm');
            return;
        }
        if (isProgramTypeComputing) {
            finalAggregate += matricPercentage * (1/10);  //10% for computing
        } else {
            finalAggregate += matricPercentage * (0.17); // 17% for engineering
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
    const isProgramTypeComputing = document.getElementById('nuComputing').checked;
    const isProgramTypeEngineering = document.getElementById('nuEngineering').checked;
    const isProgramTypeBusiness = document.getElementById('nuBusiness').checked;
    
    if (isProgramTypeBusiness) {
        calculateBusinessAggregate();
    } else {
        calculateComputingEngineeringAggregate();
    }
}

// Calculate for Computing and Engineering programs
function calculateComputingEngineeringAggregate() {
    const totalAttemptedExceptEnglish = parseFloat(document.getElementById('totalAttemptedExceptEnglish').value);
    let correctExceptEnglish = parseFloat(document.getElementById('correctExceptEnglish').value);
    const totalAttemptedEnglish = parseFloat(document.getElementById('totalAttemptedEnglish').value);
    let correctEnglish = parseFloat(document.getElementById('correctEnglish').value);
    const matricPercentageNU = parseFloat(document.getElementById('matricPercentageNU').value);
    const fscPercentageNU = parseFloat(document.getElementById('fscPercentageNU').value);
    const isProgramTypeComputing = document.getElementById('nuComputing').checked;
    
    // Check if at least one input has a value
    const hasAnyValue = !isNaN(totalAttemptedExceptEnglish) || 
                        !isNaN(correctExceptEnglish) || 
                        !isNaN(totalAttemptedEnglish) || 
                        !isNaN(correctEnglish) || 
                        !isNaN(matricPercentageNU) || 
                        !isNaN(fscPercentageNU);
    
    if (!hasAnyValue) {
        document.getElementById('nuResult').style.display = 'none';
        return;
    }

    // Validate percentage values if entered
    if (!isNaN(fscPercentageNU) && fscPercentageNU > 100) {
        showAlert('FSC Percentage cannot be greater than 100.', 'danger', 'nuForm');
        return;
    }
    
    if (!isNaN(matricPercentageNU) && matricPercentageNU > 100) {
        showAlert('Matric Percentage cannot be greater than 100.', 'danger', 'nuForm');
        return;
    }
    
    // Validate that correct questions don't exceed attempted questions
    if (!isNaN(totalAttemptedExceptEnglish) && !isNaN(correctExceptEnglish) && correctExceptEnglish > totalAttemptedExceptEnglish) {
        showAlert('Correct questions cannot exceed attempted questions', 'danger', 'nuForm');
        document.getElementById('correctExceptEnglish').value = totalAttemptedExceptEnglish;
        correctExceptEnglish = totalAttemptedExceptEnglish;
    }
    
    if (!isNaN(totalAttemptedEnglish) && !isNaN(correctEnglish) && correctEnglish > totalAttemptedEnglish) {
        showAlert('Correct questions cannot exceed attempted questions', 'danger', 'nuForm');
        document.getElementById('correctEnglish').value = totalAttemptedEnglish;
        correctEnglish = totalAttemptedEnglish;
    }

    // Calculate with available values
    let negativeMarks = 0;
    let marks = 0;
    let finalMarksNU = 0;
    let isPartial = false;
    
    // Calculate negative marks if we have both attempted and correct
    if (!isNaN(totalAttemptedExceptEnglish) && !isNaN(correctExceptEnglish)) {
        negativeMarks += (totalAttemptedExceptEnglish - correctExceptEnglish) * (1/4);
        marks += correctExceptEnglish;
    } else {
        isPartial = true;
    }
    
    if (!isNaN(totalAttemptedEnglish) && !isNaN(correctEnglish)) {
        negativeMarks += (totalAttemptedEnglish - correctEnglish) * ((10/30)/4);
        marks += (correctEnglish * (10/30));
    } else {
        isPartial = true;
    }
    
    // Calculate final marks after negative marking
    finalMarksNU = marks - negativeMarks;
    
    // Add matric and FSc components if available
    if (!isNaN(finalMarksNU)) {
        let aggregateComponents = 0;
        let aggregateValue = 0;
        
        if (isProgramTypeComputing) {
            aggregateValue += finalMarksNU * (1/2);    //50% for computing
        } else {
            aggregateValue += finalMarksNU * (0.33); // 33% for engineering
        }
        aggregateComponents++;
        
        if (!isNaN(matricPercentageNU)) {
            if (isProgramTypeComputing) {
                aggregateValue += matricPercentageNU * (1/10);  //10% for computing
            } else {
                aggregateValue += matricPercentageNU * (0.17); // 17% for engineering
            }
            aggregateComponents++;
        } else {
            isPartial = true;
        }
        
        if (!isNaN(fscPercentageNU)) {
            if (isProgramTypeComputing) {
                aggregateValue += fscPercentageNU * (4/10); // 40% for computing
            } else {
                aggregateValue += fscPercentageNU * (1/2); // 50% for engineering
            }
            aggregateComponents++;
        } else {
            isPartial = true;
        }
        
        finalMarksNU = aggregateValue;
    }

    // Display results
    document.getElementById('nuResult').style.display = 'block';
    
    // Update the title based on whether calculation is partial
    const titleElement = document.querySelector('#nuResult .card-title');
    if (isPartial) {
        titleElement.textContent = "Your Result (Partial Calculation)";
    } else {
        titleElement.textContent = "Final Result";
    }
    
    // Show final marks
    document.getElementById('finalMarksNU').textContent = !isNaN(finalMarksNU) ? finalMarksNU.toFixed(2) : "N/A";
    
    // Show test marks after negative marking
    const afterNegative = marks - negativeMarks
    document.getElementById('NU_Marks_after_negative_marking').textContent = !isNaN(afterNegative) ? afterNegative.toFixed(2) : "N/A";
    
    // Show test marks
    document.getElementById('nuTestMarksNU').textContent = !isNaN(marks) ? marks.toFixed(2) : "N/A";
    
    // Show negative marks
    document.getElementById('negativeMarksNU').textContent = !isNaN(negativeMarks) ? negativeMarks.toFixed(2) : "N/A";
}

// Calculate for Business programs
function calculateBusinessAggregate() {
    // Get attempted values
    const attemptedMaths = parseFloat(document.getElementById('advMathAttempted').value);
    const attemptedIQ = parseFloat(document.getElementById('iqAttempted').value);
    const attemptedEnglish = parseFloat(document.getElementById('englishAttempted').value);
    
    // Get correct values (these may have been automatically adjusted by validation)
    const correctMaths = parseFloat(document.getElementById('advMathCorrect').value);
    const correctIQ = parseFloat(document.getElementById('iqCorrect').value);
    const correctEnglish = parseFloat(document.getElementById('englishCorrect').value);
    
    // Get other values
    const essay = parseFloat(document.getElementById('essay').value);
    const sscPercentage = parseFloat(document.getElementById('sscPercentage').value);
    const hsscPercentage = parseFloat(document.getElementById('hsscPercentage').value);
    
    // Check if at least one input has a value
    const hasAnyValue = !isNaN(attemptedMaths) || !isNaN(correctMaths) || 
                        !isNaN(attemptedIQ) || !isNaN(correctIQ) || 
                        !isNaN(essay) || !isNaN(attemptedEnglish) || 
                        !isNaN(correctEnglish) || !isNaN(sscPercentage) || 
                        !isNaN(hsscPercentage);
    
    if (!hasAnyValue) {
        document.getElementById('nuResult').style.display = 'none';
        return;
    }

    // Validate percentage values if entered
    if (!isNaN(sscPercentage) && sscPercentage > 100) {
        showAlert('SSC Percentage cannot be greater than 100.', 'danger', 'nuForm');
        return;
    }
    
    if (!isNaN(hsscPercentage) && hsscPercentage > 100) {
        showAlert('HSSC Percentage cannot be greater than 100.', 'danger', 'nuForm');
        return;
    }
    
    // Validate that correct questions don't exceed attempted questions
    if (!isNaN(attemptedMaths) && !isNaN(correctMaths) && correctMaths > attemptedMaths) {
        showAlert('Correct Maths cannot exceed attempted Maths', 'danger', 'nuForm');
        document.getElementById('correctMaths').value = attemptedMaths;
        correctMaths = attemptedMaths;
    }
    
    if (!isNaN(attemptedIQ) && !isNaN(correctIQ) && correctIQ > attemptedIQ) {
        showAlert('Correct IQ cannot exceed attempted IQ', 'danger', 'nuForm');
        document.getElementById('correctIQ').value = attemptedIQ;
        correctIQ = attemptedIQ;
    }
    
    if (!isNaN(attemptedEnglish) && !isNaN(correctEnglish) && correctEnglish > attemptedEnglish) {
        showAlert('Correct English cannot exceed attempted English', 'danger', 'nuForm');
        document.getElementById('correctEnglish').value = attemptedEnglish;
        correctEnglish = attemptedEnglish;
    }

    // Calculate business aggregate
    let totalMarks = 0;
    let negativeMarks = 0;
    let isPartial = false;
    
    // Maths calculation (50 questions, 50 marks)
    if (!isNaN(attemptedMaths) && !isNaN(correctMaths)) {
        totalMarks += correctMaths;
        negativeMarks += (attemptedMaths - correctMaths) * (1/4); // 1/4 negative marking
    } else {
        isPartial = true;
    }
    
    // IQ calculation (25 questions, 25 marks)
    if (!isNaN(attemptedIQ) && !isNaN(correctIQ)) {
        totalMarks += correctIQ;
        negativeMarks += (attemptedIQ - correctIQ) * (1/4); // 1/4 negative marking
    } else {
        isPartial = true;
    }
    
    // Essay (15 marks)
    if (!isNaN(essay)) {
        totalMarks += essay;
    } else {
        isPartial = true;
    }
    
    // English calculation (30 questions, 10 marks)
    if (!isNaN(attemptedEnglish) && !isNaN(correctEnglish)) {
        totalMarks += (correctEnglish * (10/30)); // English is worth 10 marks out of 30 questions
        negativeMarks += (attemptedEnglish - correctEnglish) * ((10/30)/4); // 1/4 negative marking on 10 marks
    } else {
        isPartial = true;
    }
    
    // Calculate final NU test marks after negative marking
    const finalNUMarks = totalMarks - negativeMarks;
    
    // Calculate aggregate (NU Test: 50%, HSSC: 40%, SSC: 10%)
    let aggregateValue = 0;
    
    if (!isNaN(finalNUMarks)) {
        aggregateValue += finalNUMarks * 0.5; // 50% for NU test
    }
    
    if (!isNaN(hsscPercentage)) {
        aggregateValue += hsscPercentage * 0.4; // 40% for HSSC
    } else {
        isPartial = true;
    }
    
    if (!isNaN(sscPercentage)) {
        aggregateValue += sscPercentage * 0.1; // 10% for SSC
    } else {
        isPartial = true;
    }

    // Display results
    document.getElementById('nuResult').style.display = 'block';
    
    // Update the title based on whether calculation is partial
    const titleElement = document.querySelector('#nuResult .card-title');
    if (isPartial) {
        titleElement.textContent = "Your Result (Partial Calculation)";
    } else {
        titleElement.textContent = "Final Result";
    }
    
    // Show final aggregate
    document.getElementById('finalMarksNU').textContent = !isNaN(aggregateValue) ? aggregateValue.toFixed(2) : "N/A";
    
    // Show final NU marks after negative marking
    document.getElementById('NU_Marks_after_negative_marking').textContent = !isNaN(finalNUMarks) ? finalNUMarks.toFixed(2) : "N/A";
    
    // Show total NU test marks
    document.getElementById('nuTestMarksNU').textContent = !isNaN(totalMarks) ? totalMarks.toFixed(2) : "N/A";
    
    // Show negative marks
    document.getElementById('negativeMarksNU').textContent = !isNaN(negativeMarks) ? negativeMarks.toFixed(2) : "N/A";
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
        const isProgramTypeComputing = document.getElementById('natComputing').checked;
        const programType = isProgramTypeComputing ? 'COMPUTING': 'ENGINEERING';
        
        doc.text('NAT Marks Calculation Results', 105, 55, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Program Type: ${programType}`, 20, 65);
        
        // Add weights information
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        if (isProgramTypeComputing) {
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
        const isProgramTypeComputing = document.getElementById('nuComputing').checked;
        const isProgramTypeEngineering = document.getElementById('nuEngineering').checked;
        const isProgramTypeBusiness = document.getElementById('nuBusiness').checked;
        
        let programType = 'COMPUTING';
        if (isProgramTypeEngineering) programType = 'ENGINEERING';
        else if (isProgramTypeBusiness) programType = 'BUSINESS';

        doc.text('NU Marks Calculation Results', 105, 55, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Program Type: ${programType}`, 20, 65);
        
        // Add weights information
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        if (isProgramTypeComputing) {
            doc.text('Weights: NU Test (50%), FSc (40%), Matric (10%)', 20, 72);
        } else if (isProgramTypeEngineering) {
            doc.text('Weights: NU Test (33%), FSc (50%), Matric (17%)', 20, 72);
        } else if (isProgramTypeBusiness) {
            doc.text('Weights: NU Test (50%), HSSC (40%), SSC (10%)', 20, 72);
        }
        
        // Add input values
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Input Values:', 20, 85);
        
        if (isProgramTypeBusiness) {
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
        doc.text('Final Results:', 20, isProgramTypeBusiness ? 185 : 155);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`NU Test Marks: ${nuTestMarksNU}`, 30, isProgramTypeBusiness ? 195 : 165);
        doc.text(`Negative Marks: ${negativeMarksNU}`, 30, isProgramTypeBusiness ? 205 : 175);
        
        doc.setFontSize(16);
        doc.setTextColor(13, 71, 161);
        doc.text(`Final Aggregate: ${finalMarksNU}`, 105, isProgramTypeBusiness ? 225 : 190, { align: 'center' });
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
      const isBusiness = document.getElementById('nuBusiness').checked;
      const programType = isBusiness ? "Business" : "Computing/Engineering";
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
        } else {
            natComputingWeights.style.display = 'none';
            natEngineeringWeights.style.display = 'block';
        }
    }

    // Function to handle NU program type change
    function handleNUProgramTypeChange() {
        if (nuComputingRadio.checked) {
            nuComputingWeights.style.display = 'block';
            nuEngineeringWeights.style.display = 'none';
            nuBusinessWeights.style.display = 'none';
        } else if (nuEngineeringRadio.checked) {
            nuComputingWeights.style.display = 'none';
            nuEngineeringWeights.style.display = 'block';
            nuBusinessWeights.style.display = 'none';
        } else if (nuBusinessRadio.checked) {
            nuComputingWeights.style.display = 'none';
            nuEngineeringWeights.style.display = 'none';
            nuBusinessWeights.style.display = 'block';
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

// Set up download result image functionality
function downloadResultImage(resultType) {
    let tempDiv = document.createElement("div");
    tempDiv.style.width = "400px";
    tempDiv.style.margin = "50px auto";
    tempDiv.style.padding = "20px";
    tempDiv.style.borderRadius = "12px";
    tempDiv.style.backgroundColor = "#063377";
    tempDiv.style.fontFamily = "'Poppins', sans-serif";
    tempDiv.style.color = "#e0e0e0";
    tempDiv.style.boxShadow = "0 0 15px rgba(0,0,0,0.4)";
    tempDiv.style.position = "relative";

    let watermarkHTML = `
        <div style="text-align: center; font-size: 12px; color: rgba(255, 255, 255, 0.3); margin-bottom: 20px;">
            mtaha-23.github.io/FAST-Aggregate-Calculator
        </div>`;

    if (resultType === "nu") {
        const aggregate = document.getElementById("finalMarksNU").innerText || "—";
        const finalNU = document.getElementById("NU_Marks_after_negative_marking").innerText || "—";
        const rawNU = document.getElementById("nuTestMarksNU").innerText || "—";
        const negative = document.getElementById("negativeMarksNU").innerText || "—";
        
        // Check if it's business program
        const isBusiness = document.getElementById('nuBusiness').checked;
        const programType = isBusiness ? "Business" : "Computing/Engineering";

        tempDiv.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 8px; color: white;">Final Result (${programType})</h3>
            ${watermarkHTML}
            <div style="display: flex; flex-direction: column; gap: 15px; align-items: center;">
                <div style="width: 100%; background-color: #2e7d32; padding: 15px; border-radius: 12px; text-align: center;">
                    <div style="color: white; font-weight: 500; font-size: 0.85rem;">Final Aggregate</div>
                    <div style="color: white; font-size: 1.4rem; font-weight: 700;">${aggregate}</div>
                </div>
                <div style="width: 100%; background-color: #1565c0; padding: 15px; border-radius: 12px; text-align: center;">
                    <div style="color: white; font-weight: 500; font-size: 0.85rem;">Final NU Marks</div>
                    <div style="color: white; font-size: 1.4rem; font-weight: 700;">${finalNU}</div>
                </div>
                <div style="width: 100%; background-color: #1565c0; padding: 15px; border-radius: 12px; text-align: center;">
                    <div style="color: white; font-weight: 500; font-size: 0.85rem;">NU Test Marks</div>
                    <div style="color: white; font-size: 1.4rem; font-weight: 700;">${rawNU}</div>
                </div>
                <div style="width: 100%; background-color: #ba5554; padding: 15px; border-radius: 12px; text-align: center;">
                    <div style="color: white; font-weight: 500; font-size: 0.85rem;">NU Negative Mark</div>
                    <div style="color: white; font-size: 1.4rem; font-weight: 700;">${negative}</div>
                </div>
            </div>`;
    } else if (resultType === "nat") {
        const finalAggregate = document.getElementById("finalAggregateWithNU").innerText || "—";

        tempDiv.innerHTML = `
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

    document.body.appendChild(tempDiv);

    html2canvas(tempDiv, {
        backgroundColor: null,
        scale: 2
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "FAST_Result.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        document.body.removeChild(tempDiv);
    }).catch(error => {
        console.error("Image generation failed:", error);
        document.body.removeChild(tempDiv);
    });
}



