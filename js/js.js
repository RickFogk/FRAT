

function handleMitigationAction(buttonId) {
  var button = document.getElementById(buttonId);
  var checkboxId = button.getAttribute('data-checkbox-id');
  var checkbox = document.getElementById('checkbox' + checkboxId);
  var checkboxValue = parseInt(checkbox.value);

  var mitigationScore = checkboxValue / 2;
  totalScore -= mitigationScore;

  document.getElementById('totalScore').innerHTML = "Total Score: " + totalScore;

  // after applying the mitigation, disable the button to prevent multiple clicks
  button.disabled = true;
}

// Retrieve Total_Score from localStorage
var totalScore = 0;
var checkedItems = {};


// Update the display with the initial scores
document.getElementById('totalScore').innerHTML = "Total Score: " + totalScore;

// Function to update localStorage with current scores
function updateLocalStorage() {
    localStorage.setItem('Total_Score', totalScore);
}

/*
//Calculate Score Function
function calculateScore(value, checkbox) {
  // retrieve the checkbox's id number
  var checkboxId = checkbox.id.replace('checkbox', '');

  if (checkbox.checked) {
    totalScore += value;
    checkedItems[checkbox.id] = value;
  } else {
    totalScore -= checkedItems[checkbox.id];
    delete checkedItems[checkbox.id];
  }

  document.getElementById('totalScore').innerHTML = "Total Score: " + totalScore;
  classifyRisk(totalScore); // <---- ADD THIS LINE

  // Show/Hide the mitigation elements based on the Total_Score and whether the checkbox is checked
  var mitigationElements = document.getElementById('mitigation' + checkboxId);
  
  var inputs = mitigationElements.querySelectorAll('input, button');
  

    if (totalScore > 21 && checkbox.checked) {
      mitigationElements.style.display = 'block';
      for (var j = 0; j < inputs.length; j++) {
        inputs[j].disabled = false;
      }
    } else {
      mitigationElements.style.display = 'none';
    }
  }
*/
/*
function calculateScore(value, checkbox) {
  var checkboxId = checkbox.id.replace('checkbox', '');

  if (checkbox.checked) {
    totalScore += value;
    checkedItems[checkbox.id] = value;
    checkbox.disabled = true;  // disable the checkbox
  } else {
    totalScore -= checkedItems[checkbox.id];
    delete checkedItems[checkbox.id];
  }

  document.getElementById('totalScore').innerHTML = "Total Score: " + totalScore;
  classifyRisk(totalScore);

  var mitigationElements = document.getElementById('mitigation' + checkboxId);
  if (mitigationElements) {
    var inputs = mitigationElements.querySelectorAll('input, button');

    if (totalScore > 21 && checkbox.checked) {
      mitigationElements.style.display = 'block';
      for (var j = 0; j < inputs.length; j++) {
        inputs[j].disabled = false;
      }
    } else {
      mitigationElements.style.display = 'none';
    }
  }
}
*/
//Calculate Score Function
function calculateScore(value, checkbox) {
  var checkboxId = checkbox.id.replace('checkbox', '');

  if (checkbox.checked) {
    totalScore += value;
    checkedItems[checkbox.id] = value;
    
  } else {
    totalScore -= checkedItems[checkbox.id];
    //delete checkedItems[checkbox.id];
  }

  document.getElementById('totalScore').innerHTML = "Total Score: " + totalScore;
  classifyRisk(totalScore); 

  // Show/Hide the mitigation elements based on the Total_Score and whether the checkbox is checked
  var mitigationElements = document.getElementById('mitigation' + checkboxId);
  
  if (totalScore > 21 && checkbox.checked) {
    mitigationElements.style.display = 'block';
    var dropdown = mitigationElements.querySelector('select');
    var applyButton = mitigationElements.querySelector('button');
    if (dropdown) dropdown.disabled = false;
    if (applyButton) applyButton.disabled = false;
  } else {
    mitigationElements.style.display = 'none';
  }
}




function applyMitigation(button) {
  //var checkboxId = button.getAttribute('data-checkbox-id'); 
  var checkboxId = button.getAttribute('data-checkbox-id').replace('checkbox','');
 

  var checkbox = document.getElementById('checkbox' + checkboxId);
  
  
  // Check if checkbox exists
  if(checkbox) {
    var checkboxValue = parseInt(checkbox.value);
    var mitigationScore = checkboxValue / 2;
    totalScore -= mitigationScore; // subtract the mitigation score from total score
    checkbox.value = checkboxValue - mitigationScore; // update the checkbox value
    
    document.getElementById('totalScore').innerHTML = "Total Score: " + totalScore;

    // after applying the mitigation, disable the button to prevent multiple clicks
    button.disabled = true;
  } else {
    console.log('Element with id checkbox' + checkboxId + ' not found');
  }
}


function classifyRisk(score) {
  var classificationElement = document.getElementById('classification');
    if (score <= 21) {
      document.getElementById('classification').innerText = "Classification: No special approval required";
      classificationElement.style.color = 'blue';
    } else if (score <= 50) {
      document.getElementById('classification').innerText = "Classification: Ops Manager Approval required";
      classificationElement.style.color = 'red';
    } else {
      document.getElementById('classification').innerText = "Classification: Director Approval required";
    }
    // Update localStorage with current scores
    updateLocalStorage();
}

// Event listener for checkboxes
var checkboxes = document.querySelectorAll('input[type=checkbox]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        var value = parseInt(checkbox.value);
        calculateScore(value, checkbox);
    });
});

// Event listener for Apply buttons
var applyButtons = document.querySelectorAll('.apply-button');
applyButtons.forEach(button => {
  button.addEventListener('click', function(event) {
      event.preventDefault(); // prevent form submission
      applyMitigation(this); // pass the button element itself
  });

});

function resetForm() {
  // Reset the score
  totalScore = 0;
  document.getElementById('totalScore').innerHTML = "Total Score: 0";
  classifyRisk(totalScore);

  // Reset the checkboxes
  for (var key in checkedItems) {
    var checkbox = document.getElementById(key);
    if (checkbox) {
      checkbox.checked = false;
      checkbox.disabled = false;
    }

    // Hide mitigation elements
    var mitigationElements = document.getElementById('mitigation' + key.replace('checkbox', ''));
    if (mitigationElements) {
      mitigationElements.style.display = 'none';
      var inputs = mitigationElements.querySelectorAll('input, button');
      for (var j = 0; j < inputs.length; j++) {
        inputs[j].disabled = true;
      }
    }
  }

  // Clear the checked items object
  checkedItems = {};
}

//IMSAFE Section
// IMSAFE Section
document.getElementById('imsafeButton').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('imsafeSection').style.display = 'block';
});

document.getElementById('calculateImsafe').addEventListener('click', function() {
  var illness = parseInt(document.getElementById('illness').value);
  var medication = parseInt(document.getElementById('medication').value);
  var stress = parseInt(document.getElementById('stress').value);
  var alcohol = parseInt(document.getElementById('alcohol').value);
  var fatigue = parseInt(document.getElementById('fatigue').value);
  var emotion = parseInt(document.getElementById('emotion').value);

  var imsafeScore = illness + medication + stress + alcohol + fatigue + emotion;

  document.getElementById('imsafeScoreDisplay').innerHTML = "IMSAFE Score: " + imsafeScore;
});
