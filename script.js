// Initialize data when page loads
let hookData = [];

function initializeData() {
  fetch('hookLineData.json')
    .then(response => response.json())
    .then(data => {
      hookData = data;
      document.getElementById("hookCount").disabled = false;
    })
    .catch(error => {
      console.error('Error loading JSON:', error);
      document.getElementById("hookFields").innerHTML = 
        '<p style="color:red;">Error loading hook data</p>';
    });
}

window.onload = initializeData;

// Generate hook fields based on count
function generateHookFields() {
  const count = parseInt(document.getElementById("hookCount").value);
  const inputType = document.getElementById("inputtype").value;
  const container = document.getElementById("hookFields");
  container.innerHTML = "";

  if (count >= 1 && count <= 4) {
    for (let i = 1; i <= count; i++) {
      const div = document.createElement("div");
      div.classList.add("hook-section");

      // Create dropdown options for lineNo
      const selectOptions = hookData.map(item => 
        `<option value="${item.lineNo}">${item.lineNo}</option>`
      ).join("");

      let fieldsHTML = `
        <h4>Hook ${i}</h4>
        <div class="form-row">
      `;

      if (inputType === "Planning") {
        fieldsHTML += `
          <div class="form-group">
            <label>Line No:</label>
            <select id="line_no_${i}" required oninput="checkInputs(${i})">
              <option value="">--Select Line--</option>
              ${selectOptions}
            </select>
          </div>
          <div class="form-group">
            <label>Piece Rate Tons:</label>
            <input type="number" id="piece_rate_tons_${i}" required oninput="checkInputs(${i})">
          </div>
        </div>
        <div id="find_section_${i}" style="display: none;">
          <div class="button-container">
            <button id="find_button_${i}" onclick="calculateResults(${i})">CALCULATE PR EARNING TONS</button>
            <button id="employee_button_${i}" onclick="goToEmployeePage(${i})">PIECE RATE EARNINGS</button>
            <button id="incentive_button_${i}" onclick="showEmployeeIncentives(${i})">EMPLOYEE INCENTIVE SUMMARY</button>
          </div>
          <div id="calc_results_${i}" style="display: none;"></div>
          <div id="earnings_results_${i}" style="display: none;"></div>
          <div id="employee_incentive_results_${i}" style="display: none;"></div>

        </div>
      `;
      } else {
        fieldsHTML += `
          <div class="form-group">
            <label>No of Slings:</label>
            <input type="number" id="slings_${i}" required oninput="checkInputs(${i})">
          </div>
          <div class="form-group">
            <label>Per Sling:</label>
            <input type="number" id="per_sling_${i}" required oninput="checkInputs(${i})">
          </div>
        </div>
        <div id="find_section_${i}" style="display: none;">
          <div class="button-container">
            <button id="find_button_${i}" onclick="calculateResults1(${i})">CALCULATE</button>
          </div>
          <div id="results_${i}" style="display: none;"></div>
        </div>
      `;
      }

      div.innerHTML = fieldsHTML;
      container.appendChild(div);
    }
  } else {
    container.innerHTML = "<p style='color:red;'>Please enter a number between 1 and 4</p>";
  }
}

// Check if required inputs are filled
function checkInputs(hookIndex) {
  const inputType = document.getElementById("inputtype").value;
  let ready = false;

  if (inputType === "Planning") {
    const lineNo = document.getElementById(`line_no_${hookIndex}`).value;
    const pieceRateTons = document.getElementById(`piece_rate_tons_${hookIndex}`).value;
    ready = lineNo && pieceRateTons;
  } else {
    const noOfSlings = document.getElementById(`slings_${hookIndex}`).value;
    const perSling = document.getElementById(`per_sling_${hookIndex}`).value;
    ready = noOfSlings && perSling;
  }

  const findSection = document.getElementById(`find_section_${hookIndex}`);
  findSection.style.display = ready ? 'block' : 'none';
  document.getElementById(`results_${hookIndex}`).style.display = 'none';
}

// Calculate and display results
function calculateResults(hookIndex) {
  const inputType = document.getElementById("inputtype").value;

  // Hide other sections
  document.getElementById(`employee_incentive_results_${hookIndex}`).style.display = "none";
  if (inputType === "Planning") {
    document.getElementById(`earnings_results_${hookIndex}`).style.display = "none";
    var resultsDiv = document.getElementById(`calc_results_${hookIndex}`);
  } else {
    var resultsDiv = document.getElementById(`results_${hookIndex}`);
  }

  resultsDiv.style.display = "none";  // Hide before showing updated content

  if (inputType === "Planning") {
    const lineNo = document.getElementById(`line_no_${hookIndex}`).value;
    const pieceRateTons = parseFloat(document.getElementById(`piece_rate_tons_${hookIndex}`).value) || 0;

    if (!lineNo || isNaN(pieceRateTons)) {
      alert("Please fill all required fields.");
      return;
    }

    const hookInfo = hookData.find(item => item.lineNo === lineNo);
    const datum = hookInfo ? parseFloat(hookInfo.datumPerCrane) || 0 : 0;
    let prEarningTons = pieceRateTons - datum;
    if (prEarningTons < 0) prEarningTons = 0;

    resultsDiv.innerHTML = `
      <div class="results-section">
        <div class="form-row">
          <div class="form-group">
            <label>Datum Per Crane:</label>
            <input type="number" value="${datum.toFixed(2)}" readonly>
          </div>
          <div class="form-group">
            <label>PR Earning Tons:</label>
            <input type="number" value="${prEarningTons.toFixed(2)}" readonly>
          </div>
        </div>
      </div>
    `;
  } else {
    const noOfSlings = parseFloat(document.getElementById(`slings_${hookIndex}`).value) || 0;
    const perSling = parseFloat(document.getElementById(`per_sling_${hookIndex}`).value) || 0;

    if (isNaN(noOfSlings) || isNaN(perSling)) {
      alert("Please fill all required fields.");
      return;
    }

    const totalTons = noOfSlings * perSling;

    resultsDiv.innerHTML = `
      <div class="results-section">
        <div class="form-row">
          <div class="form-group">
            <label>Total Tons:</label>
            <input type="number" value="${totalTons.toFixed(2)}" readonly>
          </div>
        </div>
      </div>
    `;
  }

  resultsDiv.style.display = "block";
}


function goToEmployeePage(hookIndex) {
  const lineNo = document.getElementById(`line_no_${hookIndex}`).value;
  const pieceRateTons = parseFloat(document.getElementById(`piece_rate_tons_${hookIndex}`).value) || 0;

  if (!lineNo || isNaN(pieceRateTons)) {
    alert("Please fill all required fields.");
    return;
  }

  const hookInfo = hookData.find(item => item.lineNo === lineNo);
  const datum = hookInfo ? parseFloat(hookInfo.datumPerCrane) || 0 : 0;

  const rate1 = parseFloat(hookInfo["101 -150%"] || 0);
  const rate2 = parseFloat(hookInfo["151 - 200%"] || 0);
  const rate3 = parseFloat(hookInfo["Above 200 %"] || 0);

  const pieceEarningTons = Math.max(pieceRateTons - datum, 0);
  const bandLimit = datum * 0.5;

  const tons1 = Math.min(pieceEarningTons, bandLimit);
  const remainingAfter1 = pieceEarningTons - tons1;
  const tons2 = Math.min(remainingAfter1, bandLimit);
  const tons3 = Math.max(remainingAfter1 - tons2, 0);

  const earning1 = tons1 * rate1;
  const earning2 = tons2 * rate2;
  const earning3 = tons3 * rate3;

  const totalEarning = earning1 + earning2 + earning3;

  const earningsDiv = document.getElementById(`earnings_results_${hookIndex}`);
  document.getElementById(`calc_results_${hookIndex}`).style.display = "none";
  document.getElementById(`employee_incentive_results_${hookIndex}`).style.display = "none";

  earningsDiv.innerHTML = `
    <div class="results-section">
      <div class="form-row">
        <div class="form-group">
          <label>Datum Per Crane:</label>
          <input type="number" value="${datum.toFixed(2)}" readonly>
        </div>
        <div class="form-group">
          <label>Piece Rate Tons:</label>
          <input type="number" value="${pieceRateTons.toFixed(2)}" readonly>
        </div>
      </div>
      <hr>
      <div class="form-row">
        <div class="form-group">
          <label>100-150% (Tons):</label>
          <input type="number" value="${tons1.toFixed(2)}" readonly>
        </div>
        <div class="form-group">
          <label>Rate:</label>
          <input type="number" value="${rate1.toFixed(2)}" readonly>
        </div>
        <div class="form-group">
          <label>Earning:</label>
          <input type="number" value="${earning1.toFixed(2)}" readonly>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>150-200% (Tons):</label>
          <input type="number" value="${tons2.toFixed(2)}" readonly>
        </div>
        <div class="form-group">
          <label>Rate:</label>
          <input type="number" value="${rate2.toFixed(2)}" readonly>
        </div>
        <div class="form-group">
          <label>Earning:</label>
          <input type="number" value="${earning2.toFixed(2)}" readonly>
        </div>
      </div>
      ${tons3 > 0 ? `
        <div class="form-row">
          <div class="form-group">
            <label>Above 200% (Tons):</label>
            <input type="number" value="${tons3.toFixed(2)}" readonly>
          </div>
          <div class="form-group">
            <label>Rate:</label>
            <input type="number" value="${rate3.toFixed(2)}" readonly>
          </div>
          <div class="form-group">
            <label>Earning:</label>
            <input type="number" value="${earning3.toFixed(2)}" readonly>
          </div>
        </div>
      ` : ''}
      <hr>
      <div class="form-row">
        <div class="form-group">
          <label><strong>Total Piece Rate Earning:</strong></label>
          <input type="number" value="${totalEarning.toFixed(2)}" readonly>
        </div>
      </div>
    </div>
  `;

  earningsDiv.style.display = "block";
}

function showEmployeeIncentives(hookIndex) {
  const inputType = document.getElementById("inputtype").value;
  const lineNo = document.getElementById(`line_no_${hookIndex}`).value;
  const pieceRateTons = parseFloat(document.getElementById(`piece_rate_tons_${hookIndex}`).value) || 0;

  if (!lineNo || isNaN(pieceRateTons)) {
    alert("Please fill all required fields.");
    return;
  }

  // Hide other sections
  if (inputType === "Planning") {
    document.getElementById(`calc_results_${hookIndex}`).style.display = "none";
    document.getElementById(`earnings_results_${hookIndex}`).style.display = "none";
  } else {
    document.getElementById(`results_${hookIndex}`).style.display = "none";
  }

  const container = document.getElementById(`employee_incentive_results_${hookIndex}`);
  container.innerHTML = "";
  container.style.display = "block";

  const hookInfo = hookData.find(item => item.lineNo === lineNo);
  const datum = parseFloat(hookInfo?.datumPerCrane || 0);

  const rate1 = parseFloat(hookInfo["101 -150%"] || 0);
  const rate2 = parseFloat(hookInfo["151 - 200%"] || 0);
  const rate3 = parseFloat(hookInfo["Above 200 %"] || 0);

  const pieceEarningTons = Math.max(pieceRateTons - datum, 0);
  const bandLimit = datum * 0.5;

  const tons1 = Math.min(pieceEarningTons, bandLimit);
  const tons2 = Math.min(pieceEarningTons - tons1, bandLimit);
  const tons3 = Math.max(pieceEarningTons - tons1 - tons2, 0);

  const earning1 = tons1 * rate1;
  const earning2 = tons2 * rate2;
  const earning3 = tons3 * rate3;

  const totalEarning = earning1 + earning2 + earning3;

  const roleFields = [
    "Tindal per vessel on board",
    "Maistry per vessel on Shore",
    "Winch driver per hook on board",
    "Signal Man per hook on board",
    "Mazdoor per hook on board",
    "Tally clerk per hook on Shore",
    "Mazdoor per hook on Shore"
  ];

let html = `
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
    <h4>Employee Incentive Summary</h4>
    <button type="button" onclick="toggleAbsentFields(${hookIndex})">UPDATE ABSENTEES DETAILS</button>
  </div>
`;
  for (const role of roleFields) {
    const count = hookInfo[role] || 0;
    const roleId = role.replace(/[^a-zA-Z0-9]/g, "_") + "_" + hookIndex;

    html += `
      <div class="form-row">
        <div class="form-group">
          <label>${role}</label>
          <input type="number" id="count_${roleId}" value="${count}" readonly>
        </div>
        <div class="form-group absent-field" style="display: none;">
        <label>Absent:</label>
        <input type="number" id="absent_${roleId}" value="0" min="0" max="${count}" 
          oninput="updateFinalIncentive('${roleId}', ${totalEarning})">
      </div>

        <div class="form-group">
          <label>Incentive:</label>
          <input type="number" id="incentive_${roleId}" value="${totalEarning.toFixed(2)}" readonly>
        </div>
        <div class="form-group">
          <label>Total:</label>
          <input type="number" id="total_${roleId}" value="${(count * totalEarning).toFixed(2)}" readonly>
        </div>
      </div>
    `;
  }

  // Handle DECD logic
  const winchDriver = hookInfo["Winch driver per hook on board"];
  const decdCount = (winchDriver === 1) ? 0 : (hookInfo["DECD per hook on Shore"] || 0);
  const decdRoleId = "DECD_per_hook_on_Shore_" + hookIndex;

  html += `
    <div class="form-row">
      <div class="form-group">
        <label>DECD per hook on Shore:</label>
        <input type="number" id="count_${decdRoleId}" value="${decdCount}" readonly>
      </div>
      <div class="form-group absent-field" style="display: none;">
        <label>Absent:</label>
        <input type="number" id="absent_${decdRoleId}" value="0" min="0" max="${decdCount}"
          oninput="updateFinalIncentive('${decdRoleId}', ${totalEarning})">
      </div>

      <div class="form-group">
        <label>Incentive:</label>
        <input type="number" id="incentive_${decdRoleId}" value="${totalEarning.toFixed(2)}" readonly>
      </div>
      <div class="form-group">
        <label>Total:</label>
        <input type="number" id="total_${decdRoleId}" value="${(decdCount * totalEarning).toFixed(2)}" readonly>
      </div>
    </div>
  `;

  // Add this at the end of the html content before setting container.innerHTML

html += `
  <hr>
  <div class="form-row">
    <div class="form-group">
      <label><strong>Total Employees (after absentee adjustment):</strong></label>
      <input type="number" id="total_employees_${hookIndex}" value="0" readonly>
    </div>
  </div>
`;

container.innerHTML = `<div class="results-section">${html}</div>`;
calculateTotalEmployees(hookIndex); // Call to update on first load
calculateGrandTotalEmployees();


  //container.innerHTML = `<div class="results-section">${html}</div>`;
}


// Update fields when input type changes
document.getElementById("inputtype").addEventListener("change", () => {
  const hookCount = document.getElementById("hookCount").value;
  if (hookCount) generateHookFields();
});
function updateFinalIncentive(roleId, incentive) {
  const count = parseFloat(document.getElementById(`count_${roleId}`).value) || 0;
  const absent = parseFloat(document.getElementById(`absent_${roleId}`).value) || 0;
  const totalField = document.getElementById(`total_${roleId}`);

  if (absent > count) {
    totalField.value = "Invalid";
    totalField.style.border = "2px solid red";
  } else {
    totalField.style.border = "";
    const adjusted = (count - absent) * incentive;
    totalField.value = adjusted.toFixed(2);
  }

  // Extract hookIndex from roleId string
  const match = roleId.match(/_(\d+)$/);
  if (match) {
    const hookIndex = match[1];
    calculateTotalEmployees(hookIndex);
  }
  calculateGrandTotalEmployees();

}


function toggleAbsentFields(hookIndex) {
  const container = document.getElementById(`employee_incentive_results_${hookIndex}`);
  const absentFields = container.querySelectorAll(".absent-field");
  const button = container.querySelector("button");

  const isHidden = [...absentFields].every(f => f.style.display === "none");

  absentFields.forEach(field => {
    field.style.display = isHidden ? "block" : "none";
  });

  button.textContent = isHidden ? "HIDE ABSENTEES" : "UPDATE ABSENTEES DETAILS";
}
function calculateResults1(hookIndex) {
  const slingsInput = document.getElementById(`slings_${hookIndex}`);
  const perSlingInput = document.getElementById(`per_sling_${hookIndex}`);
  const resultsDiv = document.getElementById(`results_${hookIndex}`);

  const noOfSlings = parseFloat(slingsInput.value) || 0;
  const perSling = parseFloat(perSlingInput.value) || 0;

  if (isNaN(noOfSlings) || isNaN(perSling)) {
    alert("Please enter valid numbers for slings and per sling.");
    return;
  }

  const totalTons = noOfSlings * perSling;

  resultsDiv.innerHTML = `
    <div class="results-section">
      <div class="form-row">
        <div class="form-group">
          <label>Total Tons:</label>
          <input type="number" value="${totalTons.toFixed(2)}" readonly>
        </div>
      </div>
    </div>
  `;

  resultsDiv.style.display = "block";
}

function calculateTotalEmployees(hookIndex) {
  const roles = [
    "Tindal per vessel on board",
    "Maistry per vessel on Shore",
    "Winch driver per hook on board",
    "Signal Man per hook on board",
    "Mazdoor per hook on board",
    "Tally clerk per hook on Shore",
    "Mazdoor per hook on Shore",
    "DECD per hook on Shore"
  ];

  let total = 0;

  roles.forEach(role => {
    const roleId = role.replace(/[^a-zA-Z0-9]/g, "_") + "_" + hookIndex;
    const count = parseFloat(document.getElementById(`count_${roleId}`)?.value || 0);
    const absent = parseFloat(document.getElementById(`absent_${roleId}`)?.value || 0);
    const present = Math.max(count - absent, 0);
    total += present;
  });

  const totalField = document.getElementById(`total_employees_${hookIndex}`);
  if (totalField) totalField.value = total.toFixed(0);
}

function calculateGrandTotalEmployees() {
  const hookCount = parseInt(document.getElementById("hookCount").value) || 0;
  let totalEmployees = 0;
  let allSectionsVisible = true;

  for (let i = 1; i <= hookCount; i++) {
    const hookSection = document.getElementById(`employee_incentive_results_${i}`);
    const totalField = document.getElementById(`total_employees_${i}`);
    
    if (hookSection && hookSection.style.display === "block" && totalField) {
      totalEmployees += parseInt(totalField.value || 0);
    } else {
      allSectionsVisible = false;
    }
  }

  const grandDiv = document.getElementById("grandTotalEmployees");
  const grandField = document.getElementById("grand_total_employees");

  if (allSectionsVisible && totalEmployees > 0) {
    grandDiv.style.display = "block";
    grandField.value = totalEmployees;
  } else {
    grandDiv.style.display = "none";
    grandField.value = "";
  }
}


