

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


// Call classifyRisk function
//classifyRisk(totalScore);






/*function applyMitigation(checkboxID) {
    let mitigationRadioYes = document.querySelector(`input[name='${checkboxID}Mitigation']:checked`);
    let mitigationAction = document.getElementById(checkboxID + 'MitigationAction').value;

    if (mitigationRadioYes && mitigationRadioYes.value === 'Yes' && mitigationAction) {
      totalScore = totalScore - 50; // recalculate the total score by subtracting 50
      document.getElementById('totalScore').innerText = "Total Score: " + totalScore;
      classifyRisk(totalScore);

      // disable the Apply button once the action is applied
      document.getElementById('applyButton' + checkboxID).disabled = true;
    } else {
      alert("Mitigation action must be filled out and radio button must be set to 'Yes'.");
    }
    // Update localStorage with current scores
    updateLocalStorage();
}
*/

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
    if (score <= 21) {
      document.getElementById('classification').innerText = "Classification: No special approval required";
    } else if (score <= 35) {
      document.getElementById('classification').innerText = "Classification: Ops Manager Approval required";
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
