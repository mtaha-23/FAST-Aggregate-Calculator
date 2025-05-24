// Constants
const CONSTANTS = {
    MOBILE_BREAKPOINT: 768,
    RATING_REMINDER_DELAY: 25000,
    MAX_PERCENTAGE: 100,
    MIN_PERCENTAGE: 0,
    COMPUTING_WEIGHTS: {
        NU_NAT: 0.5,
        FSC: 0.4,
        MATRIC: 0.1
    },
    ENGINEERING_WEIGHTS: {
        NU_NAT: 0.33,
        FSC: 0.5,
        MATRIC: 0.17
    }
};

// Utility functions
const utils = {
    showAlert(message, type, formId) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const form = document.getElementById(formId);
        if (form) {
            form.insertBefore(alertDiv, form.firstChild);
            setTimeout(() => alertDiv.remove(), 5000);
        }
    },

    validatePercentage(value) {
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        return num >= CONSTANTS.MIN_PERCENTAGE && num <= CONSTANTS.MAX_PERCENTAGE;
    },

    formatPercentage(value) {
        return parseFloat(value).toFixed(2);
    },

    clearForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
        
        const resultContainer = form.querySelector('.result-container');
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }
        
        const alerts = form.querySelectorAll('.alert');
        alerts.forEach(alert => alert.remove());
    }
};

// Main Calculator Class
class Calculator {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.initializeTooltips();
        this.setupDynamicCalculation();
        this.setupClearButtons();
        this.setupTabSwitching();
        this.setupOptionCards();
        this.setupInputValidation();
        this.setupFeedbackForm();
        this.setupRatingReminder();
        this.setupHamburgerMenu();
        this.setupThemeToggle();
        this.setupPDFGeneration();
        this.setupShareButtons();
        this.setupProgramTypeRadios();
        this.checkMobileDevice();
    }

    initializeTooltips() {
        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
    }

    setupDynamicCalculation() {
        // NAT calculator inputs
        document.querySelectorAll('.calc-input[data-calc="nat"]').forEach(input => {
            input.addEventListener('input', () => this.calculateAggregateWithNU());
        });

        // NU calculator inputs
        document.querySelectorAll('.calc-input[data-calc="nu"]').forEach(input => {
            input.addEventListener('input', () => this.calculateNUAndAggregate());
        });

        // Program type radio buttons
        this.setupProgramTypeRadios();
    }

    calculateAggregateWithNU() {
        const programType = document.querySelector('input[name="natProgramType"]:checked').value;
        const weights = programType === 'computing' ? CONSTANTS.COMPUTING_WEIGHTS : CONSTANTS.ENGINEERING_WEIGHTS;

        const nuNATMarks = parseFloat(document.getElementById('nuNATMarks').value) || 0;
        const matricPercentage = parseFloat(document.getElementById('matricPercentage').value) || 0;
        const fscPercentage = parseFloat(document.getElementById('fscPercentage').value) || 0;

        if (!this.validateInputs(nuNATMarks, matricPercentage, fscPercentage)) {
            return;
        }

        const aggregate = (
            nuNATMarks * weights.NU_NAT +
            matricPercentage * weights.MATRIC +
            fscPercentage * weights.FSC
        );

        this.displayResult('natResult', aggregate);
    }

    calculateNUAndAggregate() {
        const programType = document.querySelector('input[name="nuProgramType"]:checked').value;
        const weights = programType === 'computing' ? CONSTANTS.COMPUTING_WEIGHTS : CONSTANTS.ENGINEERING_WEIGHTS;

        const correctExceptEnglish = parseFloat(document.getElementById('correctExceptEnglish').value) || 0;
        const totalAttemptedExceptEnglish = parseFloat(document.getElementById('totalAttemptedExceptEnglish').value) || 0;
        const correctEnglish = parseFloat(document.getElementById('correctEnglish').value) || 0;
        const totalAttemptedEnglish = parseFloat(document.getElementById('totalAttemptedEnglish').value) || 0;
        const matricPercentage = parseFloat(document.getElementById('matricPercentageNU').value) || 0;
        const fscPercentage = parseFloat(document.getElementById('fscPercentageNU').value) || 0;

        if (!this.validateNUInputs(correctExceptEnglish, totalAttemptedExceptEnglish, correctEnglish, totalAttemptedEnglish)) {
            return;
        }

        const nuMarks = this.calculateNUMarks(correctExceptEnglish, totalAttemptedExceptEnglish, correctEnglish, totalAttemptedEnglish);
        const aggregate = (
            nuMarks * weights.NU_NAT +
            matricPercentage * weights.MATRIC +
            fscPercentage * weights.FSC
        );

        this.displayResult('nuResult', aggregate, nuMarks);
    }

    validateInputs(nuNATMarks, matricPercentage, fscPercentage) {
        if (!utils.validatePercentage(nuNATMarks) || !utils.validatePercentage(matricPercentage) || !utils.validatePercentage(fscPercentage)) {
            utils.showAlert('Please enter valid percentages between 0 and 100', 'danger', 'natForm');
            return false;
        }
        return true;
    }

    validateNUInputs(correctExceptEnglish, totalAttemptedExceptEnglish, correctEnglish, totalAttemptedEnglish) {
        if (correctExceptEnglish > totalAttemptedExceptEnglish || correctEnglish > totalAttemptedEnglish) {
            utils.showAlert('Correct questions cannot exceed attempted questions', 'danger', 'nuForm');
            return false;
        }
        return true;
    }

    calculateNUMarks(correctExceptEnglish, totalAttemptedExceptEnglish, correctEnglish, totalAttemptedEnglish) {
        const exceptEnglishMarks = (correctExceptEnglish / totalAttemptedExceptEnglish) * 80;
        const englishMarks = (correctEnglish / totalAttemptedEnglish) * 20;
        return exceptEnglishMarks + englishMarks;
    }

    displayResult(resultId, aggregate, nuMarks = null) {
        const resultContainer = document.getElementById(resultId);
        const resultValue = resultContainer.querySelector('.result-value');
        
        resultContainer.style.display = 'block';
        if (nuMarks !== null) {
            resultValue.innerHTML = `
                <div class="result-item">
                    <span class="result-label">NU Test Marks:</span>
                    <span class="result-value">${utils.formatPercentage(nuMarks)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Final Aggregate:</span>
                    <span class="result-value">${utils.formatPercentage(aggregate)}%</span>
                </div>
            `;
        } else {
            resultValue.innerHTML = `
                <div class="result-item">
                    <span class="result-label">Final Aggregate:</span>
                    <span class="result-value">${utils.formatPercentage(aggregate)}%</span>
                </div>
            `;
        }
    }

    setupClearButtons() {
        // Implementation of setupClearButtons method
    }

    setupTabSwitching() {
        // Implementation of setupTabSwitching method
    }

    setupOptionCards() {
        // Implementation of setupOptionCards method
    }

    setupInputValidation() {
        // Implementation of setupInputValidation method
    }

    setupFeedbackForm() {
        // Implementation of setupFeedbackForm method
    }

    setupRatingReminder() {
        // Implementation of setupRatingReminder method
    }

    setupHamburgerMenu() {
        // Implementation of setupHamburgerMenu method
    }

    setupThemeToggle() {
        // Implementation of setupThemeToggle method
    }

    setupPDFGeneration() {
        // Implementation of setupPDFGeneration method
    }

    setupShareButtons() {
        // Implementation of setupShareButtons method
    }

    setupProgramTypeRadios() {
        // Implementation of setupProgramTypeRadios method
    }

    checkMobileDevice() {
        // Implementation of checkMobileDevice method
    }
}

// PDF Generation
function generatePDF(resultType) {
    const form = document.getElementById(resultType === 'nat' ? 'natForm' : 'nuForm');
    if (!form) return;

    const programType = form.querySelector(`input[name="${resultType}ProgramType"]:checked`).value;
    const programTypeText = programType === 'computing' ? 'Computing' : 'Engineering';

    let content = `
        <div class="pdf-template">
            <h2>FAST NUCES Aggregate Calculator Results</h2>
            <p>Program Type: ${programTypeText}</p>
            <div class="results">
    `;

    if (resultType === 'nat') {
        const nuNATMarks = document.getElementById('nuNATMarks').value;
        const matricPercentage = document.getElementById('matricPercentage').value;
        const fscPercentage = document.getElementById('fscPercentage').value;
        const aggregate = document.querySelector('#natResult .result-value').textContent;

        content += `
            <p>NU/NAT Marks: ${nuNATMarks}%</p>
            <p>Matric Percentage: ${matricPercentage}%</p>
            <p>FSc Percentage: ${fscPercentage}%</p>
            <p>Final Aggregate: ${aggregate}</p>
        `;
    } else {
        const correctExceptEnglish = document.getElementById('correctExceptEnglish').value;
        const totalAttemptedExceptEnglish = document.getElementById('totalAttemptedExceptEnglish').value;
        const correctEnglish = document.getElementById('correctEnglish').value;
        const totalAttemptedEnglish = document.getElementById('totalAttemptedEnglish').value;
        const matricPercentage = document.getElementById('matricPercentageNU').value;
        const fscPercentage = document.getElementById('fscPercentageNU').value;
        const results = document.querySelectorAll('#nuResult .result-value');

        content += `
            <p>Correct Questions (Except English): ${correctExceptEnglish}/${totalAttemptedExceptEnglish}</p>
            <p>Correct Questions (English): ${correctEnglish}/${totalAttemptedEnglish}</p>
            <p>Matric Percentage: ${matricPercentage}%</p>
            <p>FSc Percentage: ${fscPercentage}%</p>
            <p>NU Test Marks: ${results[0].textContent}</p>
            <p>Final Aggregate: ${results[1].textContent}</p>
        `;
    }

    content += `
            </div>
            <p class="footer">Generated on ${new Date().toLocaleString()}</p>
        </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>FAST NUCES Aggregate Calculator Results</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { padding: 20px; }
                    .pdf-template { max-width: 800px; margin: 0 auto; }
                    .results { margin: 20px 0; }
                    .footer { margin-top: 30px; font-size: 0.9em; color: #666; }
                </style>
            </head>
            <body>
                ${content}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Share functionality
function setupShareButtons() {
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', () => {
            const resultType = button.getAttribute('data-result-type');
            const shareText = getShareText(resultType);
            copyResult(shareText);
        });
    });
}

function getShareText(resultType) {
    const form = document.getElementById(resultType === 'nat' ? 'natForm' : 'nuForm');
    if (!form) return '';

    const programType = form.querySelector(`input[name="${resultType}ProgramType"]:checked`).value;
    const programTypeText = programType === 'computing' ? 'Computing' : 'Engineering';

    let text = `FAST NUCES Aggregate Calculator Results (${programTypeText}):\n\n`;

    if (resultType === 'nat') {
        const nuNATMarks = document.getElementById('nuNATMarks').value;
        const matricPercentage = document.getElementById('matricPercentage').value;
        const fscPercentage = document.getElementById('fscPercentage').value;
        const aggregate = document.querySelector('#natResult .result-value').textContent;

        text += `NU/NAT Marks: ${nuNATMarks}%\n`;
        text += `Matric Percentage: ${matricPercentage}%\n`;
        text += `FSc Percentage: ${fscPercentage}%\n`;
        text += `Final Aggregate: ${aggregate}\n`;
    } else {
        const correctExceptEnglish = document.getElementById('correctExceptEnglish').value;
        const totalAttemptedExceptEnglish = document.getElementById('totalAttemptedExceptEnglish').value;
        const correctEnglish = document.getElementById('correctEnglish').value;
        const totalAttemptedEnglish = document.getElementById('totalAttemptedEnglish').value;
        const matricPercentage = document.getElementById('matricPercentageNU').value;
        const fscPercentage = document.getElementById('fscPercentageNU').value;
        const results = document.querySelectorAll('#nuResult .result-value');

        text += `Correct Questions (Except English): ${correctExceptEnglish}/${totalAttemptedExceptEnglish}\n`;
        text += `Correct Questions (English): ${correctEnglish}/${totalAttemptedEnglish}\n`;
        text += `Matric Percentage: ${matricPercentage}%\n`;
        text += `FSc Percentage: ${fscPercentage}%\n`;
        text += `NU Test Marks: ${results[0].textContent}\n`;
        text += `Final Aggregate: ${results[1].textContent}\n`;
    }

    text += `\nCalculated using FAST NUCES Aggregate Calculator`;
    return text;
}

function copyResult(text) {
    navigator.clipboard.writeText(text).then(() => {
        utils.showAlert('Results copied to clipboard!', 'success', 'natForm');
    }).catch(() => {
        utils.showAlert('Failed to copy results', 'danger', 'natForm');
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    
    // Set up PDF generation
    document.querySelectorAll('.generate-pdf-btn').forEach(button => {
        button.addEventListener('click', () => {
            const resultType = button.getAttribute('data-result-type');
            generatePDF(resultType);
        });
    });

    // Set up share functionality
    setupShareButtons();
});