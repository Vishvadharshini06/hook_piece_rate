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

html += `
  <div class="form-row">
    <div class="form-group">
      <button type="button" onclick="showAccountingSummary(${hookIndex})">ACCOUNTING OF PIECE RATE EARNINGS</button>
    </div>
  </div>
  <div id="accounting_summary_${hookIndex}" style="display: none;"></div>
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
  if (!document.getElementById("grandTotalEarningsContainer")) {
  const container = document.createElement("div");
  container.id = "grandTotalEarningsContainer";
  container.style.display = "none";
  container.style.marginTop = "20px";
  container.innerHTML = `
    <button type="button" onclick="calculateTotalEarnings()">TOTAL EARNINGS</button>
    <div id="grandTotalEarnings" style="margin-top: 10px;"></div>
  `;
  document.getElementById("grandTotalEmployees").after(container);
}



  if (allSectionsVisible && totalEmployees > 0) {
    grandDiv.style.display = "block";
    grandField.value = totalEmployees;
  } else {
    grandDiv.style.display = "none";
    grandField.value = "";
  }

  const earningsContainer = document.getElementById("grandTotalEarningsContainer");
  
if (allSectionsVisible && totalEmployees > 0) {
  grandDiv.style.display = "block";
  grandField.value = totalEmployees;
  document.getElementById("grandTotalEarningsContainer").style.display = "block";  // ✅ show earnings button
} else {
  grandDiv.style.display = "none";
  grandField.value = "";
  document.getElementById("grandTotalEarningsContainer").style.display = "none";   // ✅ hide if invalid
}
}

function showAccountingSummary(hookIndex) {
  const roles = [
    { label: "Tindal per vessel on board", type: "onBoard" },
    { label: "Maistry per vessel on Shore", type: "onShore" },
    { label: "Winch driver per hook on board", type: "onBoard" },
    { label: "Signal Man per hook on board", type: "onBoard" },
    { label: "Mazdoor per hook on board", type: "onBoard" },
    { label: "Tally clerk per hook on Shore", type: "onShore" },
    { label: "Mazdoor per hook on Shore", type: "onShore" },
    { label: "DECD per hook on Shore", type: "onShore" },
  ];

  let onBoardTotal = 0;
  let onShoreTotal = 0;

  for (const role of roles) {
    const roleId = role.label.replace(/[^a-zA-Z0-9]/g, "_") + "_" + hookIndex;
    const count = parseFloat(document.getElementById(`count_${roleId}`)?.value || 0);
    const absent = parseFloat(document.getElementById(`absent_${roleId}`)?.value || 0);
    const incentive = parseFloat(document.getElementById(`incentive_${roleId}`)?.value || 0);

    const present = Math.max(count - absent, 0);
    const total = present * incentive;

    if (role.type === "onBoard") onBoardTotal += total;
    else if (role.type === "onShore") onShoreTotal += total;
  }

  const hookTotal = onBoardTotal + onShoreTotal;

  const container = document.getElementById(`accounting_summary_${hookIndex}`);
  container.innerHTML = `
    <div class="results-section">
      <h4>Accounting of Piece Rate Earnings - Hook ${hookIndex}</h4>
      <div class="form-row">
        <div class="form-group">
          <label>Total On Board Earnings/Chargeable:</label>
          <input type="number" value="${onBoardTotal.toFixed(2)}" readonly>
        </div>
        <div class="form-group">
          <label>Total On Shore Earnings:</label>
          <input type="number" value="${onShoreTotal.toFixed(2)}" readonly>
        </div>
        <div class="form-group">
          <label><strong>Total Earnings for Hook ${hookIndex}:</strong></label>
          <input type="number" value="${hookTotal.toFixed(2)}" readonly>
        </div>
      </div>
    </div>
  `;

  container.style.display = "block";
}


function calculateTotalEarnings() {
  const hookCount = parseInt(document.getElementById("hookCount").value) || 0;
  let totalOnBoard = 0;
  let totalOnShore = 0;

  for (let i = 1; i <= hookCount; i++) {
    const hookVisible = document.getElementById(`employee_incentive_results_${i}`);
    if (!hookVisible || hookVisible.style.display !== "block") continue;

    const roles = [
      { label: "Tindal per vessel on board", type: "onBoard" },
      { label: "Maistry per vessel on Shore", type: "onShore" },
      { label: "Winch driver per hook on board", type: "onBoard" },
      { label: "Signal Man per hook on board", type: "onBoard" },
      { label: "Mazdoor per hook on board", type: "onBoard" },
      { label: "Tally clerk per hook on Shore", type: "onShore" },
      { label: "Mazdoor per hook on Shore", type: "onShore" },
      { label: "DECD per hook on Shore", type: "onShore" }
    ];

    for (const role of roles) {
      const roleId = role.label.replace(/[^a-zA-Z0-9]/g, "_") + "_" + i;
      const count = parseFloat(document.getElementById(`count_${roleId}`)?.value || 0);
      const absent = parseFloat(document.getElementById(`absent_${roleId}`)?.value || 0);
      const incentive = parseFloat(document.getElementById(`incentive_${roleId}`)?.value || 0);
      const present = Math.max(count - absent, 0);
      const earning = present * incentive;

      if (role.type === "onBoard") totalOnBoard += earning;
      else if (role.type === "onShore") totalOnShore += earning;
    }
  }

  const total = totalOnBoard + totalOnShore;
  const displayDiv = document.getElementById("grandTotalEarnings");
  displayDiv.innerHTML = `
    <div class="results-section">
      <div class="form-row">
        <div class="form-group">
          <label>Total On Board Earnings/Chargeable:</label>
          <input type="number" value="${totalOnBoard.toFixed(2)}" readonly>
        </div>
        <div class="form-group">
          <label>Total On Shore Earnings:</label>
          <input type="number" value="${totalOnShore.toFixed(2)}" readonly>
        </div>
      </div>
      <hr>
      <div class="form-row">
        <div class="form-group">
          <label><strong>Grand Total Earnings:</strong></label>
          <input type="number" value="${total.toFixed(2)}" readonly>
        </div>
      </div>
    </div>
  `;
}
function exportToExcel() {
  // Get all the input data
  const date = document.getElementById("myDate").value;
  const vesselName = document.getElementById("vesselName").value;
  const shift = document.getElementById("shift").value;
  const vcnNo = document.getElementById("vcnNo").value;
  const aiShift = document.getElementById("aiShift").value;
  const inputType = document.getElementById("inputtype").value;
  const hookCount = document.getElementById("hookCount").value;
  const grandTotalEmployees = document.getElementById("grand_total_employees")?.value || "";
  
  // Create a file input element to allow selecting existing Excel file
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.xlsx,.xls';
  
  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    let workbook;
    
    try {
      if (file) {
        // Read existing file
        const data = await file.arrayBuffer();
        workbook = XLSX.read(data);
      } else {
        // Create new workbook if no file selected
        workbook = XLSX.utils.book_new();
      }
      
      if (inputType === "Prediction") {
        // Prediction data
        const predictionData = [];
        
        // Add header row if sheet doesn't exist
        if (!workbook.Sheets["Prediction"]) {
          predictionData.push([
            "Date", "VESSEL NAME", "SHIFT", "VCN NO", "A/I SHIFT", 
            "Number of Hooks", "No of Slings", "Per Sling", "Total Tons",
            "Grand Total Employees"
          ]);
        } else {
          // Get existing data if sheet exists
          const existingData = XLSX.utils.sheet_to_json(workbook.Sheets["Prediction"], { header: 1 });
          predictionData.push(...existingData);
        }
        
        // Add new data for each hook
        for (let i = 1; i <= hookCount; i++) {
          const slings = document.getElementById(`slings_${i}`)?.value || "";
          const perSling = document.getElementById(`per_sling_${i}`)?.value || "";
          const totalTons = document.getElementById(`results_${i}`)?.querySelector("input")?.value || "";
          
          predictionData.push([
            date, vesselName, shift, vcnNo, aiShift, 
            i, slings, perSling, totalTons, grandTotalEmployees
          ]);
        }
        
        // Update or add prediction sheet
        const predictionWS = XLSX.utils.aoa_to_sheet(predictionData);
        if (workbook.Sheets["Prediction"]) {
          workbook.Sheets["Prediction"] = predictionWS;
        } else {
          XLSX.utils.book_append_sheet(workbook, predictionWS, "Prediction");
        }
      }
      
      if (inputType === "Planning") {
        // Planning data
        const planningData = [];
        
        // Add header row if sheet doesn't exist
        if (!workbook.Sheets["Planning"]) {
          planningData.push([
            "Date", "VESSEL NAME", "SHIFT", "VCN NO", "A/I SHIFT", 
            "Hook Number", "Line No", "Piece Rate Tons", "Datum Per Crane", 
            "PR Earning Tons", "100-150% (Tons)", "Rate", "Earning", 
            "150-200% (Tons)", "Rate", "Earning", "Above 200% (Tons)", 
            "Rate", "Earning", "Total Piece Rate Earning", 
            "Total Employees (after absentee adjustment)",
            "On Board Earnings/Chargeable", 
            "On Shore Earnings",
            "Hook Total Earnings"
          ]);
        } else {
          // Get existing data if sheet exists
          const existingData = XLSX.utils.sheet_to_json(workbook.Sheets["Planning"], { header: 1 });
          planningData.push(...existingData);
        }
        
        // Variables to accumulate grand totals
        let grandOnBoard = 0;
        let grandOnShore = 0;
        let grandTotal = 0;
        
        // Add new data for each hook
        for (let i = 1; i <= hookCount; i++) {
          const lineNo = document.getElementById(`line_no_${i}`)?.value || "";
          const pieceRateTons = document.getElementById(`piece_rate_tons_${i}`)?.value || "";
          
          const calcResults = document.getElementById(`calc_results_${i}`);
          const datum = calcResults?.querySelectorAll("input")[0]?.value || "";
          const prEarningTons = calcResults?.querySelectorAll("input")[1]?.value || "";
          
          const earningsResults = document.getElementById(`earnings_results_${i}`);
          const tons1 = earningsResults?.querySelectorAll("input")[2]?.value || "";
          const rate1 = earningsResults?.querySelectorAll("input")[3]?.value || "";
          const earning1 = earningsResults?.querySelectorAll("input")[4]?.value || "";
          const tons2 = earningsResults?.querySelectorAll("input")[5]?.value || "";
          const rate2 = earningsResults?.querySelectorAll("input")[6]?.value || "";
          const earning2 = earningsResults?.querySelectorAll("input")[7]?.value || "";
          const tons3 = earningsResults?.querySelectorAll("input")[8]?.value || "";
          const rate3 = earningsResults?.querySelectorAll("input")[9]?.value || "";
          const earning3 = earningsResults?.querySelectorAll("input")[10]?.value || "";
          const totalEarning = earningsResults?.querySelectorAll("input")[11]?.value || "";
          
          const totalEmployees = document.getElementById(`total_employees_${i}`)?.value || "";
          
          // Get accounting summary data for this hook
          const accountingSummary = document.getElementById(`accounting_summary_${i}`);
          let onBoard = 0;
          let onShore = 0;
          let hookTotal = 0;
          
          if (accountingSummary && accountingSummary.style.display === "block") {
            const inputs = accountingSummary.querySelectorAll("input");
            onBoard = parseFloat(inputs[0]?.value) || 0;
            onShore = parseFloat(inputs[1]?.value) || 0;
            hookTotal = parseFloat(inputs[2]?.value) || 0;
            
            // Accumulate grand totals
            grandOnBoard += onBoard;
            grandOnShore += onShore;
            grandTotal += hookTotal;
          }
          
          planningData.push([
            date, vesselName, shift, vcnNo, aiShift, 
            i, lineNo, pieceRateTons, datum, 
            prEarningTons, tons1, rate1, earning1, 
            tons2, rate2, earning2, tons3, 
            rate3, earning3, totalEarning, 
            totalEmployees,
            onBoard,
            onShore,
            hookTotal
          ]);
        }
        
        // Add a blank row before the summary
        planningData.push([]);
        
        // Add grand total summary rows
        planningData.push(["GRAND TOTAL SUMMARY"]);
        planningData.push(["Grand Total Employees:", grandTotalEmployees]);
        planningData.push(["Grand Total On Board Earnings:", grandOnBoard.toFixed(2)]);
        planningData.push(["Grand Total On Shore Earnings:", grandOnShore.toFixed(2)]);
        planningData.push(["Grand Total Earnings:", grandTotal.toFixed(2)]);
        planningData.push([]);
        // Update or add planning sheet
        const planningWS = XLSX.utils.aoa_to_sheet(planningData);
        if (workbook.Sheets["Planning"]) {
          workbook.Sheets["Planning"] = planningWS;
        } else {
          XLSX.utils.book_append_sheet(workbook, planningWS, "Planning");
        }
      }
      
      // Generate Excel file
      XLSX.writeFile(workbook, `Hook_Piece_Rate_data.xlsx`);
      
    } catch (error) {
      console.error("Error processing Excel file:", error);
      alert("Error processing Excel file. Please try again.");
    }
  };
  
  fileInput.click();
}