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

// Calculate Score Function
function calculateScore(value, checkbox) {
  var checkboxId = checkbox.id.replace('checkbox', '');

  if (checkbox.checked) {
    if (!checkedItems.hasOwnProperty(checkbox.id)) {
      totalScore += value;
      checkedItems[checkbox.id] = value;
    }
  } else {
    if (checkedItems.hasOwnProperty(checkbox.id)) {
      totalScore -= checkedItems[checkbox.id];
      delete checkedItems[checkbox.id];
    }
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


// Create an object to store checkbox IDs and scores
let appliedMitigations = {};

function applyMitigation(button) {
  var checkboxId = button.getAttribute('data-checkbox-id').replace('checkbox','');
  var checkbox = document.getElementById('checkbox' + checkboxId);

  // Check if checkbox exists
  if(checkbox) {
    var originalValue = parseInt(checkbox.value);
    var mitigationScore = originalValue / 2;
    var oldTotalScore = totalScore; // store the original total score
    totalScore -= mitigationScore; // subtract the mitigation score from total score
    var newValue = originalValue - mitigationScore;
    checkbox.value = newValue; // update the checkbox value
    checkedItems[checkbox.id] = newValue; // update the value in checkedItems

    document.getElementById('totalScore').innerHTML = "Total Score: " + totalScore;

    // after applying the mitigation, disable the button to prevent multiple clicks
    button.disabled = true;

    // Store mitigation data
    appliedMitigations[checkboxId] = {
      'Selected Checkbox ID': checkboxId,
      'Original Value': originalValue,
      'Mitigation Score': mitigationScore,
      'New Checkbox Value': newValue,
      'Original Total Score': oldTotalScore,
      'New Total Score': totalScore
    };

    // Update localStorage with current scores
    updateLocalStorage();
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

document.getElementById('resetImsafe').addEventListener('click', function() {
  document.getElementById('illness').value = '0';
  document.getElementById('medication').value = '0';
  document.getElementById('stress').value = '0';
  document.getElementById('alcohol').value = '0';
  document.getElementById('fatigue').value = '0';
  document.getElementById('emotion').value = '0';
  document.getElementById('imsafeScoreDisplay').innerHTML = '';
});

//-----------------------------------------------------------------


// -----------------------------------------------------------------
// Function to create the HTML table
function createTable() {
  // Get the table container
  var tableContainer = document.getElementById('tableContainer');

  // Create table elements
  var table = document.createElement('table');
  var thead = document.createElement('thead');
  var tbody = document.createElement('tbody');
  var headerRow = document.createElement('tr');

  // Create table headers
  var headers = ["Checkbox Name", "Value"];
  headers.forEach(function(header) {
    var th = document.createElement('th');
    th.appendChild(document.createTextNode(header));
    headerRow.appendChild(th);
  });

  // Add the header row to the table header
  thead.appendChild(headerRow);

  // Add each checked item to the table body
  for (var checkboxId in checkedItems) {
    var row = document.createElement('tr');

    // Get the label text of the input element
    var checkbox = document.getElementById(checkboxId);
    var checkboxName = checkbox.parentElement.innerText.trim();

    var nameCell = document.createElement('td');
    nameCell.appendChild(document.createTextNode(checkboxName));
    row.appendChild(nameCell);

    var valueCell = document.createElement('td');
    valueCell.appendChild(document.createTextNode(checkedItems[checkboxId]));
    row.appendChild(valueCell);

    tbody.appendChild(row);
  }

  // Add the header and body to the table
  table.appendChild(thead);
  table.appendChild(tbody);

  // Remove any existing table from the container
  while (tableContainer.firstChild) {
    tableContainer.firstChild.remove();
  }

  // Add the new table to the container
  tableContainer.appendChild(table);

  // Add total score to the container
  var totalScoreDiv = document.createElement('div');
  totalScoreDiv.innerHTML = "Total Score: " + totalScore;
  tableContainer.appendChild(totalScoreDiv);
}

// Update the table when the state of a checkbox changes
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', createTable);
});

// Update the table when a mitigation is applied
applyButtons.forEach(button => {
  button.addEventListener('click', function(event) {
    event.preventDefault(); // prevent form submission
    applyMitigation(this); // pass the button element itself
    createTable();
  });
});

// Add event listener to prevent form submission
document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();
});

// CREATE TABLE2
// Function to create the HTML table
function createTable2() {
  // Get the form elements
  var formElements = document.getElementById('flightInfoForm').elements;

  // Get the table container
  var tableContainer2 = document.getElementById('tableContainer2');

  // Create table elements
  var table = document.createElement('table');
  var thead = document.createElement('thead');
  var tbody = document.createElement('tbody');
  var headerRow = document.createElement('tr');

  // Create table headers
  var headers = ["Label", "Value"];
  headers.forEach(function(header) {
    var th = document.createElement('th');
    th.appendChild(document.createTextNode(header));
    headerRow.appendChild(th);
  });

  // Add the header row to the table header
  thead.appendChild(headerRow);

  // Add each form element to the table body
  for (var i = 0; i < formElements.length; i++) {
    if (formElements[i].type !== "submit") { // skip the submit button
      var row = document.createElement('tr');

      var nameCell = document.createElement('td');
      nameCell.appendChild(document.createTextNode(formElements[i].name));
      row.appendChild(nameCell);

      var valueCell = document.createElement('td');
      valueCell.appendChild(document.createTextNode(formElements[i].value));
      row.appendChild(valueCell);

      tbody.appendChild(row);
    }
  }

  // Add the header and body to the table
  table.appendChild(thead);
  table.appendChild(tbody);

  // Remove any existing table from the container
  while (tableContainer2.firstChild) {
    tableContainer2.firstChild.remove();
  }

  // Add the new table to the container
  tableContainer2.appendChild(table);
}

// Event listener for form submission
document.getElementById('flightInfoForm').addEventListener('submit', function(event) {
  event.preventDefault();
  createTable2();
});



// Call the createTable function initially to create the table
createTable();
