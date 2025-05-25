document.addEventListener('DOMContentLoaded', function() {
    // Initialize view counter
    initializeViewCounter();

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
    setupShareButtons();

    // Set up program type radio buttons
    setupProgramTypeRadios();
});

// View Counter Function
function initializeViewCounter() {
    const viewNumberElement = document.getElementById("viewNumber");
    const scriptURL = "https://script.google.com/macros/s/AKfycbzQwcTqF7mv3Xjp5m-nCCCMstAnAGOJ23VpXmADr2oLdBhXinR4hVoHUKqVwPhMPv7Z/exec";

    if (!viewNumberElement) {
        console.error("View counter element not found");
        return;
    }

    // Set initial loading state
    viewNumberElement.innerText = "Loading...";

    // Check if this is a new visit
    const lastVisit = localStorage.getItem("lastVisitCalc");
    const today = new Date().toDateString();
    const isNewVisit = !lastVisit || lastVisit !== today;

    console.log("Visit status:", {
        lastVisit,
        today,
        isNewVisit
    });

    // Create a unique callback name
    const callbackName = 'viewCounterCallback_' + Math.random().toString(36).substr(2, 9);
    
    // Create and append the script tag
    const script = document.createElement('script');
    
    script.src = `${scriptURL}?action=${isNewVisit ? 'increment' : 'get'}&callback=${callbackName}`;
    
    // Add timeout fallback
    const timeoutId = setTimeout(() => {
        console.warn("View count fetch timed out");
        viewNumberElement.innerText = "1000+";
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
    }, 8000); // 8 seconds timeout

    // Create the callback function
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        console.log("Received data:", data);
        viewNumberElement.innerText = data.value;
        if (isNewVisit) {
            localStorage.setItem("lastVisitCalc", today);
        }
        // Clean up
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
    };

    script.onerror = function() {
        clearTimeout(timeoutId);
        console.error("Failed to load view counter");
        viewNumberElement.innerText = "1000+";
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
    };

    document.body.appendChild(script);
}

// Set up rating reminder popup
function setupRatingReminder() {
    // Check if the user has already seen the popup in this session
    if (!sessionStorage.getItem('ratingReminderShown')) {
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
        });
    });
}

// Set up dynamic calculation as user types
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
    nuProgramTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            calculateNUAndAggregate();
            // Show/hide appropriate weights info
            document.getElementById('nuComputingWeights').style.display = this.value === 'computing' ? 'block' : 'none';
            document.getElementById('nuEngineeringWeights').style.display = this.value === 'engineering' ? 'block' : 'none';
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
            titleElement.textContent = "Your Result";
        }
        
        document.getElementById('finalAggregateWithNU').textContent = resultText;
        document.getElementById('natResult').style.display = 'block';
    } else {
        document.getElementById('natResult').style.display = 'none';
    }
}

// Calculate NU Marks and Aggregate
function calculateNUAndAggregate() {
    const totalAttemptedExceptEnglish = parseFloat(document.getElementById('totalAttemptedExceptEnglish').value);
    const correctExceptEnglish = parseFloat(document.getElementById('correctExceptEnglish').value);
    const totalAttemptedEnglish = parseFloat(document.getElementById('totalAttemptedEnglish').value);
    const correctEnglish = parseFloat(document.getElementById('correctEnglish').value);
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
    
    // Calculate final marks
    finalMarksNU = marks - negativeMarks;
    
    // Add matric and FSc components if available
    if (!isNaN(finalMarksNU)) {
        let aggregateComponents = 0;
        let aggregateValue = 0;
        
        if (isProgramTypeComputing) {
            aggregateValue += finalMarksNU * (1/2);    //50% for computing
        } else {
            aggregateValue += finalMarksNU * (0.33); // 30% for engineering
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
        titleElement.textContent = "Your Result";
    }
    
    // Show final marks
    document.getElementById('finalMarksNU').textContent = !isNaN(finalMarksNU) ? finalMarksNU.toFixed(2) : "N/A";
    
    // Show test marks
    document.getElementById('nuTestMarksNU').textContent = !isNaN(marks) ? marks.toFixed(2) : "N/A";
    
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

            fetch("https://script.google.com/macros/s/AKfycbxvuGgbM_2eb_82fHAK-RaYdxVSAWPMB0g53fYlX0O7PR44QREq0ZzZiYjRmpxsQIoQ/exec", {  
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
    
    // Apply the saved theme or device preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
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
        const programType = isProgramTypeComputing ? 'COMPUTING': 'ENGINEERING';

        doc.text('NU Marks Calculation Results', 105, 55, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Program Type: ${programType}`, 20, 65);
        
        // Add weights information
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        if (isProgramTypeComputing) {
            doc.text('Weights: NU Test (50%), FSc (40%), Matric (10%)', 20, 72);
        } else {
            doc.text('Weights: NU Test (33%), FSc (50%), Matric (17%)', 20, 72);
        }
        
        // Add input values
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Input Values:', 20, 85);
        
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
        
        // Add results
        const finalMarksNU = document.getElementById('finalMarksNU').textContent;
        const nuTestMarksNU = document.getElementById('nuTestMarksNU').textContent;
        const negativeMarksNU = document.getElementById('negativeMarksNU').textContent;
        
        doc.setFontSize(14);
        doc.text('Final Results:', 20, 155);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`NU Test Marks: ${nuTestMarksNU}`, 30, 165);
        doc.text(`Negative Marks: ${negativeMarksNU}`, 30, 175);
        
        doc.setFontSize(16);
        doc.setTextColor(13, 71, 161);
        doc.text(`Final Aggregate: ${finalMarksNU}`, 105, 190, { align: 'center' });
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

// Set up share buttons functionality
function setupShareButtons() {
  // Function to generate share text based on result type
  function getShareText(resultType) {
    if (resultType === 'nat') {
      const finalAggregate = document.getElementById('finalAggregateWithNU').textContent;
      return `I calculated my FAST NUCES aggregate score: ${finalAggregate}! Calculate yours at https://mtaha-23.github.io/FAST-Aggregate-Calculator/`;
    } else if (resultType === 'nu') {
      const finalMarks = document.getElementById('finalMarksNU').textContent;
      const nuTestMarks = document.getElementById('nuTestMarksNU').textContent;
      const negativeMarks = document.getElementById('negativeMarksNU').textContent;
      return `I calculated my FAST NUCES results - Final Aggregate: ${finalMarks}, NU Test Marks: ${nuTestMarks}, Negative Marks: ${negativeMarks}. Calculate yours at https://mtaha-23.github.io/FAST-Aggregate-Calculator/`;
    }
    return '';
  }

  // Function to copy result to clipboard
  function copyResult(resultType) {
    const shareText = getShareText(resultType);
    
    navigator.clipboard.writeText(shareText)
      .then(() => {
        showAlert('Result copied to clipboard!', 'success', resultType === 'nat' ? 'natForm' : 'nuForm');
      })
      .catch(() => {
        showAlert('Failed to copy to clipboard', 'danger', resultType === 'nat' ? 'natForm' : 'nuForm');
      });
  }

  // Add copy button to the NAT result container
  function addCopyButtonToNat() {
    const resultContainer = document.getElementById('natResult');
    if (!resultContainer) return;
    
    // Check if buttons container already exists
    let buttonsContainer = document.querySelector('.nat-buttons-container');
    if (!buttonsContainer) {
      // Create buttons container
      buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'nat-buttons-container d-flex justify-content-between mt-3';
      
      // Get the PDF button and remove it from its current position
      const pdfButton = document.querySelector('.generate-pdf-btn[data-result-type="nat"]');
      if (pdfButton) {
        pdfButton.parentNode.removeChild(pdfButton);
        
        // Create left side container for PDF and Copy buttons
        const leftButtons = document.createElement('div');
        leftButtons.className = 'd-flex gap-2';
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'btn btn-outline-primary copy-btn';
        copyButton.setAttribute('data-result-type', 'nat');
        copyButton.innerHTML = '<i class="bi bi-clipboard me-2"></i> Copy Result';
        
        // Add event listener to copy button
        copyButton.addEventListener('click', function() {
          copyResult('nat');
        });
        
        // Add buttons to left container
        leftButtons.appendChild(copyButton);
        leftButtons.appendChild(pdfButton);
        
        // Get the clear button
        const clearButton = document.querySelector('.clear-btn[data-form="natForm"]');
        
        // Add elements to buttons container
        buttonsContainer.appendChild(leftButtons);
        if (clearButton) {
          const rightButtons = document.createElement('div');
          rightButtons.appendChild(clearButton.cloneNode(true));
          buttonsContainer.appendChild(rightButtons);
          
          // Remove the original clear button
          clearButton.parentNode.removeChild(clearButton);
          
          // Add event listener to the new clear button
          rightButtons.querySelector('.clear-btn').addEventListener('click', function() {
            clearForm('natForm');
          });
        }
        
        // Insert buttons container after the result container
        resultContainer.after(buttonsContainer);
      }
    }
  }
  
  // Add copy button to the NU result container
  function addCopyButtonToNu() {
    const resultContainer = document.getElementById('nuResult');
    if (!resultContainer) return;
    
    // Check if buttons container already exists
    let buttonsContainer = document.querySelector('.nu-buttons-container');
    if (!buttonsContainer) {
      // Create buttons container
      buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'nu-buttons-container d-flex justify-content-between mt-3';
      
      // Get the PDF button and remove it from its current position
      const pdfButton = document.querySelector('.generate-pdf-btn[data-result-type="nu"]');
      if (pdfButton) {
        pdfButton.parentNode.removeChild(pdfButton);
        
        // Create left side container for PDF and Copy buttons
        const leftButtons = document.createElement('div');
        leftButtons.className = 'd-flex gap-2';
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'btn btn-outline-primary copy-btn';
        copyButton.setAttribute('data-result-type', 'nu');
        copyButton.innerHTML = '<i class="bi bi-clipboard me-2"></i> Copy Result';
        
        // Add event listener to copy button
        copyButton.addEventListener('click', function() {
          copyResult('nu');
        });
        
        // Add buttons to left container
        leftButtons.appendChild(copyButton);
        leftButtons.appendChild(pdfButton);
        
        // Get the clear button
        const clearButton = document.querySelector('.clear-btn[data-form="nuForm"]');
        
        // Add elements to buttons container
        buttonsContainer.appendChild(leftButtons);
        if (clearButton) {
          const rightButtons = document.createElement('div');
          rightButtons.appendChild(clearButton.cloneNode(true));
          buttonsContainer.appendChild(rightButtons);
          
          // Remove the original clear button
          clearButton.parentNode.removeChild(clearButton);
          
          // Add event listener to the new clear button
          rightButtons.querySelector('.clear-btn').addEventListener('click', function() {
            clearForm('nuForm');
          });
        }
        
        // Insert buttons container after the result container
        resultContainer.after(buttonsContainer);
      }
    }
  }

  // Modify the calculateAggregateWithNU function to add copy button
  const originalCalculateAggregateWithNU = calculateAggregateWithNU;
  calculateAggregateWithNU = function() {
    originalCalculateAggregateWithNU.apply(this, arguments);
    
    // Add copy button if results are displayed
    if (document.getElementById('natResult').style.display !== 'none') {
      addCopyButtonToNat();
    }
  };
  
  // Modify the calculateNUAndAggregate function to add copy button
  const originalCalculateNUAndAggregate = calculateNUAndAggregate;
  calculateNUAndAggregate = function() {
    originalCalculateNUAndAggregate.apply(this, arguments);
    
    // Add copy button if results are displayed
    if (document.getElementById('nuResult').style.display !== 'none') {
      addCopyButtonToNu();
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
    const nuComputingWeights = document.getElementById('nuComputingWeights');
    const nuEngineeringWeights = document.getElementById('nuEngineeringWeights');

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
        } else {
            nuComputingWeights.style.display = 'none';
            nuEngineeringWeights.style.display = 'block';
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
    if (nuComputingRadio && nuEngineeringRadio) {
        nuComputingRadio.addEventListener('change', handleNUProgramTypeChange);
        nuEngineeringRadio.addEventListener('change', handleNUProgramTypeChange);
        // Initialize NU weights visibility
        handleNUProgramTypeChange();
    }
}