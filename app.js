const avatarList = document.querySelector("#avatar-list");
const avatarForm = document.querySelector("#avatar-form");
const entryForm = document.querySelector("#entry-form");
const pointsFields = document.querySelector("#points-fields");
const entryList = document.querySelector("#entry-list");

const avatarOneSelect = document.querySelector("#avatar-one");
const avatarTwoSelect = document.querySelector("#avatar-two");
const compareButton = document.querySelector("#compare-button");
const comparisonResult = document.querySelector("#comparison-result");

const avatarPreview = document.querySelector("#avatar-preview");

let avatars = JSON.parse(localStorage.getItem("avatars") || "[]");
let entries = JSON.parse(localStorage.getItem("entries") || "[]");
let pointsChart = null;

const avatarChoices = {
  ghostColor: "#ff0000",
  eyeColor: "#222222",
  accessory: "none",
  accessoryColor: "#e63946",
  mouth: "grinning"
};

function getAvatarOptions() {
  return {
    ...avatarChoices
  };
}

function createAvatarSVG(avatar = {}) {
  const {
    ghostColor = "#ff0000",
    eyeColor = "#222222",
    accessory = "none",
    accessoryColor = "#e63946",
    mouth = "grinning",
    backgroundColor = "#eef1f6"
  } = avatar;

  /*
    One complete ghost silhouette.

    The long, flowing lower sections create the ghost's
    long-hair / floating-ghost appearance.
  */
  const ghostShape = `
    <path
      d="
        M28 190
        L28 88
        Q28 42 58 20
        Q100 -8 142 20
        Q172 42 172 88
        L172 190

        Q158 207 143 190
        Q128 211 112 190
        Q100 207 88 190
        Q72 211 57 190
        Q42 207 28 190
        Z
      "
      fill="${ghostColor}"
      stroke="#222"
      stroke-width="3"
      stroke-linejoin="round"
    />
  `;

  const eyes = `
    <circle cx="75" cy="108" r="6" fill="${eyeColor}" />
    <circle cx="125" cy="108" r="6" fill="${eyeColor}" />
  `;

  let mouthGraphic = "";

  if (mouth === "grinning") {
    mouthGraphic = `
      <path
        d="M70 140 Q100 168 130 140 Q126 166 100 171 Q74 166 70 140 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="3"
      />
    `;
  } else if (mouth === "braces") {
    mouthGraphic = `
      <path
        d="M70 140 Q100 168 130 140 Q126 166 100 171 Q74 166 70 140 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="3"
      />
      <path
        d="
          M78 148 L78 161
          M89 154 L89 167
          M100 157 L100 169
          M111 154 L111 167
          M122 148 L122 161
        "
        fill="none"
        stroke="#2563eb"
        stroke-width="3"
      />
    `;
  } else if (mouth === "fangs") {
    mouthGraphic = `
      <path
        d="M72 142 Q100 164 128 142 Q123 169 100 171 Q77 169 72 142 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="3"
      />
      <path
        d="M82 147 L87 163 L93 150 M107 150 L113 163 L118 147"
        fill="#fff"
        stroke="#222"
        stroke-width="2"
      />
    `;
  } else if (mouth === "frown") {
    mouthGraphic = `
      <path
        d="M78 162 Q100 142 122 162"
        fill="none"
        stroke="#222"
        stroke-width="4"
        stroke-linecap="round"
      />
    `;
  } else if (mouth === "lion") {
    mouthGraphic = `
      <path
        d="M69 140 Q100 168 131 140 Q126 173 100 177 Q74 173 69 140 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="3"
      />
      <path
        d="
          M76 145 L82 165
          L88 150 L94 169
          L100 152 L106 169
          L112 150 L118 165
          L124 145
        "
        fill="#fff"
        stroke="#222"
        stroke-width="2"
      />
    `;
  }

  let accessoryGraphic = "";

  if (accessory === "glasses") {
    accessoryGraphic = `
      <g
        fill="none"
        stroke="${accessoryColor}"
        stroke-width="5"
      >
        <rect x="52" y="91" width="43" height="32" rx="8" />
        <rect x="105" y="91" width="43" height="32" rx="8" />
        <path d="M95 103 H105" />
        <path d="M52 102 L40 96" />
        <path d="M148 102 L160 96" />
      </g>
    `;
  } else if (accessory === "beard") {
    accessoryGraphic = `
      <path
        d="
          M64 139
          Q70 180 100 190
          Q130 180 136 139
          Q124 151 100 154
          Q76 151 64 139
          Z
        "
        fill="${accessoryColor}"
        stroke="#222"
        stroke-width="3"
      />
    `;
  } else if (accessory === "unicorn") {
    accessoryGraphic = `
      <path
        d="M100 48 L86 8 L114 8 Z"
        fill="${accessoryColor}"
        stroke="#222"
        stroke-width="3"
      />
    `;
  } else if (accessory === "top-hat") {
    accessoryGraphic = `
      <rect
        x="59"
        y="24"
        width="82"
        height="42"
        rx="5"
        fill="${accessoryColor}"
        stroke="#222"
        stroke-width="3"
      />
      <rect
        x="47"
        y="59"
        width="106"
        height="13"
        rx="5"
        fill="${accessoryColor}"
        stroke="#222"
        stroke-width="3"
      />
      <rect x="59" y="51" width="82" height="9" fill="#222" />
    `;
  } else if (accessory === "halo") {
    accessoryGraphic = `
      <ellipse
        cx="100"
        cy="15"
        rx="53"
        ry="13"
        fill="none"
        stroke="${accessoryColor}"
        stroke-width="8"
      />
    `;
  } else if (accessory === "beret") {
    accessoryGraphic = `
      <path
        d="
          M48 55
          Q67 13 111 15
          Q145 17 154 50
          Q120 61 78 59
          Q60 59 48 55
          Z
        "
        fill="${accessoryColor}"
        stroke="#222"
        stroke-width="3"
      />
      <circle
        cx="106"
        cy="22"
        r="6"
        fill="${accessoryColor}"
        stroke="#222"
        stroke-width="2"
      />
    `;
  } else if (accessory === "band") {
    accessoryGraphic = `
      <path
        d="M34 76 Q100 42 166 76"
        fill="none"
        stroke="${accessoryColor}"
        stroke-width="11"
      />
    `;
  } else if (accessory === "nose-bullring") {
    accessoryGraphic = `
      <path
        d="M91 133 Q100 146 109 133"
        fill="none"
        stroke="${accessoryColor}"
        stroke-width="4"
      />
      <circle cx="91" cy="133" r="3" fill="${accessoryColor}" />
      <circle cx="109" cy="133" r="3" fill="${accessoryColor}" />
    `;
  }

  return `
    <svg
      viewBox="0 0 200 220"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Custom ghost avatar"
    >
      <rect
        width="200"
        height="220"
        rx="24"
        fill="${backgroundColor}"
      />

      ${ghostShape}
      ${accessoryGraphic}
      ${eyes}
      ${mouthGraphic}
    </svg>
  `;
}


document.querySelectorAll("[data-option]").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();

    const option = button.dataset.option;
    const value = button.dataset.value;

    if (!Object.prototype.hasOwnProperty.call(avatarChoices, option)) {
      return;
    }

    avatarChoices[option] = value;

    document
      .querySelectorAll(`[data-option="${option}"]`)
      .forEach(item => item.classList.remove("selected"));

    button.classList.add("selected");
    updateAvatarPreview();
  });
});

const accessoryColorInput = document.querySelector("#accessory-color");

if (accessoryColorInput) {
  accessoryColorInput.addEventListener("input", event => {
    avatarChoices.accessoryColor = event.target.value;
    updateAvatarPreview();
  });
}

function updateAvatarPreview() {
  if (!avatarPreview) return;

  avatarPreview.innerHTML = createAvatarSVG({
    ...avatarChoices,
    backgroundColor: "#e8eef7"
  });
}


document
  .querySelector('[data-option="ghostColor"]')
  ?.classList.add("selected");

document
  .querySelector('[data-option="eyeColor"]')
  ?.classList.add("selected");

document
  .querySelector('[data-option="accessory"]')
  ?.classList.add("selected");

document
  .querySelector('[data-option="mouth"]')
  ?.classList.add("selected");

updateAvatarPreview();


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

