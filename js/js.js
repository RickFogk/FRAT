var totalScore = 0;
var checkedItems = {};

function updateLocalStorage() {
    localStorage.setItem('Total_Score', totalScore);
}

var selectedCheckboxes = [];

function calculateScore(value, checkbox) {
  var checkboxId = checkbox.id.replace('checkbox', '');

  if (checkbox.checked) {
    if (!checkedItems.hasOwnProperty(checkbox.id)) {
      totalScore += value;
      checkedItems[checkbox.id] = value;
      selectedCheckboxes.push(checkbox.id);
    }
  } else {
    if (checkedItems.hasOwnProperty(checkbox.id)) {
      totalScore -= checkedItems[checkbox.id];
      delete checkedItems[checkbox.id];
      selectedCheckboxes = selectedCheckboxes.filter(id => id !== checkbox.id);
    }
  }

  document.getElementById('totalScore').innerHTML = "Total Score: " + totalScore;
  updateMitigationVisibility();

  if (totalScore > 21) {
    document.getElementById('totalScore').style.color = "red";
  } else {
    document.getElementById('totalScore').style.color = "black";
  }
}

let appliedMitigations = {};

function applyMitigation(button) {
  var checkboxId = button.getAttribute('data-checkbox-id').replace('checkbox','');
  var checkbox = document.getElementById('checkbox' + checkboxId);

  if(checkbox) {
    var originalValue = parseInt(checkbox.value);
    var mitigationScore = originalValue / 2;
    var oldTotalScore = totalScore;
    totalScore -= mitigationScore;
    var newValue = originalValue - mitigationScore;
    checkbox.value = newValue;
    checkedItems[checkbox.id] = newValue;

    document.getElementById('totalScore').innerHTML = "Total Score: " + totalScore;
    button.disabled = true;

    appliedMitigations[checkboxId] = {
      'Selected Checkbox ID': checkboxId,
      'Original Value': originalValue,
      'Mitigation Score': mitigationScore,
      'New Checkbox Value': newValue,
      'Original Total Score': oldTotalScore,
      'New Total Score': totalScore
    };

    updateLocalStorage();
  } else {
    console.log('Element with id checkbox' + checkboxId + ' not found');
  }

  updateMitigationVisibility();
}

function updateMitigationVisibility() {
  for (var i = 0; i < selectedCheckboxes.length; i++) {
    var checkboxId = selectedCheckboxes[i];
    var checkbox = document.getElementById(checkboxId);
    var mitigationElement = document.getElementById('mitigation' + checkboxId.replace('checkbox', ''));

    if (totalScore > 21 && checkbox.checked) {
      mitigationElement.style.display = 'block';
    } else {
      mitigationElement.style.display = 'none';
    }
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

  updateLocalStorage();
}

var checkboxes = document.querySelectorAll('input[type=checkbox]');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    var value = parseInt(checkbox.value);
    calculateScore(value, checkbox);
  });
});

// Event listener for radio buttons
var radioButtons = document.querySelectorAll('input[type=radio]');
radioButtons.forEach(radioButton => {
  radioButton.addEventListener('change', function() {
    var mitigationElement = this.closest('.mitigation');
    var dropdown = mitigationElement.querySelector('select');
    var applyButton = mitigationElement.querySelector('button');

    if (this.value === 'Yes') {
      // If 'Yes' is selected, enable the dropdown and apply button
      if (dropdown) dropdown.disabled = false;
      if (applyButton) applyButton.disabled = false;
    } else {
      // If 'No' is selected, disable the dropdown and apply button
      if (dropdown) dropdown.disabled = true;
      if (applyButton) applyButton.disabled = true;
    }
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

function updateMitigationVisibility() {
  // Loop over all the selected checkboxes
  for (var i = 0; i < selectedCheckboxes.length; i++) {
    var checkboxId = selectedCheckboxes[i];
    var checkbox = document.getElementById(checkboxId);

    // Get the associated mitigation element
    var mitigationElement = document.getElementById('mitigation' + checkboxId.replace('checkbox', ''));

    // If the totalScore is greater than 21 and the checkbox is checked, show the mitigation element
    if (totalScore > 21 && checkbox.checked) {
      mitigationElement.style.display = 'block';
    } else {
      // Otherwise, hide the mitigation element
      mitigationElement.style.display = 'none';
    }
  }
}

function applyMitigation(button) {
  var checkboxId = button.getAttribute('data-checkbox-id');
  var checkbox = document.getElementById(checkboxId);

  // Check if checkbox exists
  if (checkbox) {
    // Subtract half the value of the checkbox from the total score
    var checkboxValue = parseInt(checkbox.value);
    totalScore -= checkboxValue / 2;

    // Now update the total score on the page
    document.getElementById('totalScore').innerText = totalScore;

    updateMitigationVisibility();
  } else {
    console.log('Element with id ' + checkboxId + ' not found');
  }
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
  var headers = ["Condition", "Value"];
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
