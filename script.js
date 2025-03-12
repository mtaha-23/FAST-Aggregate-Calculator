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
});

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
    
    // NU calculator inputs
    const nuInputs = document.querySelectorAll('.calc-input[data-calc="nu"]');
    nuInputs.forEach(input => {
        input.addEventListener('input', function() {
            calculateNUAndAggregate();
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
    } else if (formId === 'nuForm') {
        document.getElementById('nuResult').style.display = 'none';
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

    // Calculate with any available values
    let finalAggregate = 0;
    let hasAnyValue = false;
    let componentsUsed = 0;
    
    if (!isNaN(nuNATMarks)) {
        finalAggregate += nuNATMarks * (1/2);
        hasAnyValue = true;
        componentsUsed++;
    }
    
    if (!isNaN(fscPercentage)) {
        if (fscPercentage > 100) {
            showAlert('FSC Percentage cannot be greater than 100.', 'danger', 'natForm');
            return;
        }
        finalAggregate += fscPercentage * (4/10);
        hasAnyValue = true;
        componentsUsed++;
    }
    
    if (!isNaN(matricPercentage)) {
        if (matricPercentage > 100) {
            showAlert('Matric Percentage cannot be greater than 100.', 'danger', 'natForm');
            return;
        }
        finalAggregate += matricPercentage * (1/10);
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
        
        aggregateValue += finalMarksNU * (1/2);
        aggregateComponents++;
        
        if (!isNaN(matricPercentageNU)) {
            aggregateValue += matricPercentageNU * (1/10);
            aggregateComponents++;
        } else {
            isPartial = true;
        }
        
        if (!isNaN(fscPercentageNU)) {
            aggregateValue += fscPercentageNU * (4/10);
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

// Feedback form submission
document.addEventListener('DOMContentLoaded', function() {
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
});