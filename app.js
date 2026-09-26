const avatarList = document.querySelector("#avatar-list");
const avatarForm = document.querySelector("#avatar-form");
const entryForm = document.querySelector("#entry-form");
const pointsFields = document.querySelector("#points-fields");
const entryList = document.querySelector("#entry-list");

const avatarOneSelect = document.querySelector("#avatar-one");
const avatarTwoSelect = document.querySelector("#avatar-two");
const compareButton = document.querySelector("#compare-button");
const comparisonResult = document.querySelector("#comparison-result");

let avatars = JSON.parse(localStorage.getItem("avatars")) || [];
let entries = JSON.parse(localStorage.getItem("entries")) || [];
let pointsChart = null;

const avatarPreview = document.querySelector("#avatar-preview");

function createAvatarSVG({
  skinColor = "#f6c7a5",
  hairColor = "#24160f",
  hairStyle = "short",
  eyeColor = "#222222",
  accessory = "none",
  backgroundColor = "#e8eef7"
}) {
let hair = "";

if (hairStyle === "short") {
  hair = `
    <path
      d="
        M45 76
        Q45 48 58 38
        Q75 23 100 23
        Q125 23 142 38
        Q155 48 155 76
        Q143 61 130 56
        Q115 49 100 49
        Q85 49 70 56
        Q57 61 45 76
        Z
      "
      fill="${hairColor}"
      stroke="#222"
      stroke-width="2"
    />
  `;
}

if (hairStyle === "long") {
  hair = `
    <path
      d="
        M43 82
        Q40 48 58 35
        Q75 22 100 22
        Q125 22 142 35
        Q160 48 157 82
        L151 145
        Q140 158 128 145
        L118 126
        Q109 132 100 132
        Q91 132 82 126
        L72 145
        Q60 158 49 145
        Z
      "
      fill="${hairColor}"
      stroke="#222"
      stroke-width="2"
    />
  `;
}


  let accessoryGraphic = "";

if (accessory === "glasses") {
  accessoryGraphic = `
    <circle
      cx="78"
      cy="88"
      r="13"
      fill="none"
      stroke="#222"
      stroke-width="4"
    />

    <circle
      cx="122"
      cy="88"
      r="13"
      fill="none"
      stroke="#222"
      stroke-width="4"
    />

    <line
      x1="91"
      y1="88"
      x2="109"
      y2="88"
      stroke="#222"
      stroke-width="4"
    />
  `;
}


  if (accessory === "headband") {
    accessoryGraphic = `
      <path
        d="M54 57 Q100 22 146 57"
        fill="none"
        stroke="#e63946"
        stroke-width="9"
      />
    `;
  }

  if (accessory === "crown") {
    accessoryGraphic = `
      <path
        d="M68 39 L75 12 L100 32 L125 12 L132 39 Z"
        fill="#f4c542"
        stroke="#b8860b"
        stroke-width="3"
      />
    `;
  }

  return `
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Custom avatar"
    >
      <rect
        width="200"
        height="200"
        rx="24"
        fill="${backgroundColor}"
      />

      <circle
        cx="100"
        cy="105"
        r="55"
        fill="${skinColor}"
      />

      ${hair}

      <circle cx="78" cy="88" r="5" fill="${eyeColor}"/>
      <circle cx="122" cy="88" r="5" fill="${eyeColor}"/>
      
      <path
        d="M82 122 Q100 134 118 122"

        fill="none"
        stroke="#222"
        stroke-width="4"
        stroke-linecap="round"
      />

      ${accessoryGraphic}
    </svg>
  `;
}

const avatarChoices = {
  skinColor: "#f6c7a5",
  hairColor: "#24160f",
  hairStyle: "short",
  eyeColor: "#222222",
  accessory: "none"
};


function getAvatarOptions() {
  return {
    ...avatarChoices
  };
}

document.querySelectorAll("[data-option]").forEach(button => {
  button.addEventListener("click", () => {
    const option = button.dataset.option;
    const value = button.dataset.value;

    avatarChoices[option] = value;

    document
      .querySelectorAll(`[data-option="${option}"]`)
      .forEach(item => item.classList.remove("selected"));

    button.classList.add("selected");

    updateAvatarPreview();
  });
});

function updateAvatarPreview() {
  avatarPreview.innerHTML = createAvatarSVG({
    ...avatarChoices,
    backgroundColor: "#e8eef7"
  });
}

document
  .querySelector('[data-option="skinColor"]')
  .classList.add("selected");

document
  .querySelector('[data-option="hairColor"]')
  .classList.add("selected");

document
  .querySelector('[data-option="hairStyle"]')
  .classList.add("selected");

document
  .querySelector('[data-option="eyeColor"]')
  .classList.add("selected");

document
  .querySelector('[data-option="accessory"]')
  .classList.add("selected");

updateAvatarPreview();



function saveData() {
  localStorage.setItem("avatars", JSON.stringify(avatars));
  localStorage.setItem("entries", JSON.stringify(entries));
}

function createId() {
  return Date.now().toString();
}

function getAvatarName(avatarId) {
  const avatar = avatars.find(item => item.id === avatarId);
  return avatar ? avatar.name : "Unknown avatar";
}

function calculateTotalPoints(avatarId) {
  return entries.reduce((total, entry) => {
    const result = entry.results.find(item => item.avatarId === avatarId);
    return total + (result ? Number(result.points) : 0);
  }, 0);
}


function displayPointsFields() {
  if (avatars.length === 0) {
    pointsFields.innerHTML = "<p>Create an avatar first.</p>";
    return;
  }

  pointsFields.innerHTML = avatars.map(avatar => `
    <div class="points-row">
      <label for="points-${avatar.id}">
        ${avatar.name}
      </label>

      <input
        id="points-${avatar.id}"
        class="avatar-points"
        data-avatar-id="${avatar.id}"
        type="number"
        min="0"
        step="0.01"
        value="0"
        required
      >
    </div>
  `).join("");
}

function displayComparisonOptions() {
  const options = avatars.map(avatar => `
    <option value="${avatar.id}">${avatar.name}</option>
  `).join("");

  avatarOneSelect.innerHTML = options;
  avatarTwoSelect.innerHTML = options;

  if (avatars.length >= 2) {
    avatarTwoSelect.selectedIndex = 1;
  }
}

function displayEntries() {
  if (entries.length === 0) {
    entryList.innerHTML = "<p>No competitions recorded yet.</p>";
    return;
  }

  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  entryList.innerHTML = sortedEntries.map(entry => {
    const results = entry.results.map(result => `
      <li>
        ${getAvatarName(result.avatarId)}:
        <strong>${result.points} points</strong>
      </li>
    `).join("");

    return `
      <article class="entry">
        <h3>${entry.type}</h3>
        <p><strong>Date:</strong> ${entry.date}</p>
        <ul>${results}</ul>
        ${entry.notes ? `<p><strong>Notes:</strong> ${entry.notes}</p>` : ""}
      </article>
    `;
  }).join("");
}

function updateChart() {
  const labels = [...new Set(entries.map(entry => entry.date))].sort();

  const datasets = avatars.map((avatar, index) => {
    let runningTotal = 0;

    const data = labels.map(date => {
      const entriesOnDate = entries.filter(entry => entry.date === date);

      for (const entry of entriesOnDate) {
        const result = entry.results.find(
          item => item.avatarId === avatar.id
        );

        if (result) {
          runningTotal += Number(result.points);
        }
      }

      return runningTotal;
    });

    return {
      label: avatar.name,
      data,
      borderColor: getChartColor(index),
      backgroundColor: getChartColor(index),
      tension: 0.2
    };
  });

  const chartContext = document
    .querySelector("#points-chart")
    .getContext("2d");

  if (pointsChart) {
    pointsChart.destroy();
  }

  pointsChart = new Chart(chartContext, {
    type: "line",
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function getChartColor(index) {
  const colors = [
    "#253b80",
    "#e63946",
    "#2a9d8f",
    "#f4a261",
    "#8338ec",
    "#ff006e"
  ];

  return colors[index % colors.length];
}

avatarForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.querySelector("#avatar-name").value.trim();

  const avatar = {
    id: createId(),
    name,
    ...getAvatarOptions()
  };

  avatars.push(avatar);

  saveData();
  avatarForm.reset();

  updateAvatarPreview();
  refreshPage();
});


entryForm.addEventListener("submit", event => {
  event.preventDefault();

  if (avatars.length === 0) {
    alert("Create at least one avatar first.");
    return;
  }

  const results = [...document.querySelectorAll(".avatar-points")].map(
    input => ({
      avatarId: input.dataset.avatarId,
      points: Number(input.value)
    })
  );

  const entry = {
    id: createId(),
    type: document.querySelector("#competition-type").value.trim(),
    date: document.querySelector("#competition-date").value,
    notes: document.querySelector("#competition-notes").value.trim(),
    results
  };

  entries.push(entry);

  saveData();

  entryForm.reset();
  refreshPage();
});

compareButton.addEventListener("click", () => {
  const firstId = avatarOneSelect.value;
  const secondId = avatarTwoSelect.value;

  if (!firstId || !secondId) {
    comparisonResult.textContent = "Create at least two avatars first.";
    return;
  }

  if (firstId === secondId) {
    comparisonResult.textContent = "Choose two different avatars.";
    return;
  }

  const firstAvatar = avatars.find(avatar => avatar.id === firstId);
  const secondAvatar = avatars.find(avatar => avatar.id === secondId);

  const firstTotal = calculateTotalPoints(firstId);
  const secondTotal = calculateTotalPoints(secondId);

  const difference = Math.abs(firstTotal - secondTotal);

  let message;

  if (firstTotal > secondTotal) {
    message = `${firstAvatar.name} is ahead by ${difference} points.`;
  } else if (secondTotal > firstTotal) {
    message = `${secondAvatar.name} is ahead by ${difference} points.`;
  } else {
    message = "The avatars are tied.";
  }

  comparisonResult.innerHTML = `
    <p>${firstAvatar.name}: ${firstTotal} points</p>
    <p>${secondAvatar.name}: ${secondTotal} points</p>
    <p>${message}</p>
  `;
});

function displayAvatars() {
  if (avatars.length === 0) {
    avatarList.innerHTML = "<p>No avatars created yet.</p>";
    return;
  }

  avatarList.innerHTML = avatars.map(avatar => {
    const svg = createAvatarSVG(avatar);

    return `
      <article class="avatar-card">
        ${svg}
        <h3>${avatar.name}</h3>
        <p class="total">
          ${calculateTotalPoints(avatar.id)} points
        </p>
      </article>
    `;
  }).join("");
}

function refreshPage() {
  displayAvatars();
  displayPointsFields();
  displayComparisonOptions();
  displayEntries();
  updateChart();
}



refreshPage();

