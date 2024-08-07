function showAggregateWithNU() {
    document.getElementById("calculator").style.display = "none";
    document.getElementById("aggregateWithNU").style.display = "block";
    document.getElementById("nuAndAggregate").style.display = "none";
    document.getElementById("logo").style.display = "none";
}

function showNUAndAggregate() {
    document.getElementById("calculator").style.display = "none";
    document.getElementById("aggregateWithNU").style.display = "none";
    document.getElementById("nuAndAggregate").style.display = "block";
    document.getElementById("logo").style.display = "none";
}

function goBack() {
    document.getElementById("calculator").style.display = "block";
    document.getElementById("aggregateWithNU").style.display = "none";
    document.getElementById("nuAndAggregate").style.display = "none";
    document.getElementById("logo").style.display = "block";
    document.getElementById("logo").classList.add("logo");
    clearInputs();
}

function clearInputs() {
    const inputs = document.querySelectorAll("input[type='number']");
    inputs.forEach(input => input.value = '');
    const results = document.querySelectorAll(".result");
    results.forEach(result => {
        result.style.display = "none";
        result.innerText = '';
    });
}

function calculateAggregateWithNU() {
    const nuNATMarks = parseFloat(document.getElementById("nuNATMarks").value);
    const fscPercentage = parseFloat(document.getElementById("fscPercentage").value);
    const matricPercentage = parseFloat(document.getElementById("matricPercentage").value);

    if (isNaN(nuNATMarks) || isNaN(fscPercentage) || isNaN(matricPercentage)) {
        alert("Please enter valid numbers for all fields.");
        return;
    }

    if (fscPercentage > 100 || matricPercentage > 100) {
        alert("FSC Percentage and Matric Percentage cannot be greater than 100.");
        return;
    }

    const finalAggregate = (nuNATMarks * (1/2)) + (fscPercentage * (4/10)) + (matricPercentage * (1/10));

    const finalAggregateElement = document.getElementById("finalAggregateWithNU");
    finalAggregateElement.innerText = `Final Aggregate: ${finalAggregate.toFixed(2)}`;
    showResult(finalAggregateElement);
}

function calculateNUAndAggregate() {
    const totalAttemptedExceptEnglish = parseFloat(document.getElementById("totalAttemptedExceptEnglish").value);
    const correctExceptEnglish = parseFloat(document.getElementById("correctExceptEnglish").value);
    const totalAttemptedEnglish = parseFloat(document.getElementById("totalAttemptedEnglish").value);
    const correctEnglish = parseFloat(document.getElementById("correctEnglish").value);
    const matricPercentageNU = parseFloat(document.getElementById("matricPercentageNU").value);
    const fscPercentageNU = parseFloat(document.getElementById("fscPercentageNU").value);

    if (isNaN(totalAttemptedExceptEnglish) || isNaN(correctExceptEnglish) || isNaN(totalAttemptedEnglish) || isNaN(correctEnglish) || isNaN(matricPercentageNU) || isNaN(fscPercentageNU)) {
        alert("Please enter valid numbers for all fields.");
        return;
    }

    if (fscPercentageNU > 100 || matricPercentageNU > 100) {
        alert("FSC Percentage and Matric Percentage cannot be greater than 100.");
        return;
    }

    const negativeMarks = ((totalAttemptedExceptEnglish - correctExceptEnglish) * (1/4)) + ((totalAttemptedEnglish - correctEnglish) * ((10/30)/4) );
    
    const marks = correctExceptEnglish + (correctEnglish * (10/30));

    let finalMarksNU = marks - negativeMarks;
    finalMarksNU = (finalMarksNU * (1/2)) + (matricPercentageNU * (1/10)) + (fscPercentageNU * (4/10));

    const nuTestMarksNU = marks;

    const negativeMarksElement = document.getElementById("negativeMarksNU");
    negativeMarksElement.innerText = `Negative Marks: ${negativeMarks.toFixed(2)}`;
    showResult(negativeMarksElement);

    const finalMarksElement = document.getElementById("finalMarksNU");
    finalMarksElement.innerText = `Final Aggregate: ${finalMarksNU.toFixed(2)}`;
    showResult(finalMarksElement);

    const nuTestMarksElement = document.getElementById("nuTestMarksNU");
    nuTestMarksElement.innerText = `NU Test Marks (without negative marking): ${nuTestMarksNU.toFixed(2)}`;
    showResult(nuTestMarksElement);
}

function showResult(element) {
    element.style.display = "block";
    element.classList.add("result");
}

