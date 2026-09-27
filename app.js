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

function createAvatarSVG(avatar) {
  const avatarChoices = {
    skinColor: "#f6c7a5",
    hairColor: "#24160f",
    eyeColor: "#222222",
    accessory: "none",
    accessoryColor: "#e63946",
    mouth: "grinning"
  };
  } = avatar;

  /*
    The hair is now the complete avatar shape.
    There is no separate face circle.
  */

  const avatarShape = `
    <path
      d="
        M30 190
        L30 92
        Q30 42 60 18
        Q100 -8 140 18
        Q170 42 170 92
        L170 190
        Q155 207 132 202
        L100 190
        L68 202
        Q45 207 30 190
        Z
      "
      fill="${hairColor}"
      stroke="#222"
      stroke-width="3"
    />
  `;

  /*
    A skin-colored face area is drawn directly on top of the hair.
    This is not a circle; it follows the central face shape.
  */
  const faceArea = `
    <path
      d="
        M53 91
        Q53 54 100 50
        Q147 54 147 91
        L143 143
        Q137 174 100 181
        Q63 174 57 143
        Z
      "
      fill="${skinColor}"
    />
  `;

  const eyes = `
    <circle cx="75" cy="111" r="6" fill="${eyeColor}" />
    <circle cx="125" cy="111" r="6" fill="${eyeColor}" />
  `;

  let mouthGraphic = "";

  if (mouth === "grinning") {
    mouthGraphic = `
      <path
        d="M70 143 Q100 171 130 143 Q126 169 100 174 Q74 169 70 143 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="3"
      />
    `;
  }

  if (mouth === "braces") {
    mouthGraphic = `
      <path
        d="M70 143 Q100 171 130 143 Q126 169 100 174 Q74 169 70 143 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="3"
      />

      <path
        d="M78 151 L78 164 M89 157 L89 170 M100 160 L100 172
           M111 157 L111 170 M122 151 L122 164"
        stroke="#4d96ff"
        stroke-width="3"
      />
    `;
  }

  if (mouth === "fangs") {
    mouthGraphic = `
      <path
        d="M72 145 Q100 166 128 145 Q123 172 100 174 Q77 172 72 145 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="3"
      />

      <path
        d="M82 150 L87 166 L93 153
           M107 153 L113 166 L118 150"
        fill="#fff"
        stroke="#222"
        stroke-width="2"
      />
    `;
  }

  if (mouth === "frown") {
    mouthGraphic = `
      <pat
function createAvatarSVG(avatar) {
  const {
    skinColor = "#f6c7a5",
    hairColor = "#24160f",
    eyeColor = "#222222",
    accessory = "none",
    accessoryColor = "#e63946",
    mouth = "grinning",
    backgroundColor = "#eef1f6"
  } = avatar;

  // Main avatar shape. There is no face circle.
  const avatarShape = `
    <path
      d="
        M30 190
        L30 92
        Q30 42 60 18
        Q100 -8 140 18
        Q170 42 170 92
        L170 190
        Q155 207 132 202
        L100 190
        L68 202
        Q45 207 30 190
        Z
      "
      fill="${hairColor}"
      stroke="#222"
      stroke-width="3"
    />
  `;

  // Face area inside the avatar shape.
  const faceArea = `
    <path
      d="
        M53 91
        Q53 54 100 50
        Q147 54 147 91
        L143 143
        Q137 174 100 181
        Q63 174 57 143
        Z
      "
      fill="${skinColor}"
    />
  `;

  const eyes = `
    <circle
      cx="75"
      cy="111"
      r="6"
      fill="${eyeColor}"
    />

    <circle
      cx="125"
      cy="111"
      r="6"
      fill="${eyeColor}"
    />
  `;

  let mouthGraphic = "";

  if (mouth === "grinning") {
    mouthGraphic = `
      <path
        d="M70 143 Q100 171 130 143 Q126 169 100 174 Q74 169 70 143 Z"
        fill="#ffffff"
        stroke="#222"
        stroke-width="3"
      />
    `;
  }

  if (mouth === "braces") {
    mouthGraphic = `
      <path
        d="M70 143 Q100 171 130 143 Q126 169 100 174 Q74 169 70 143 Z"
        fill="#ffffff"
        stroke="#222"
        stroke-width="3"
      />

      <path
        d="
          M78 151 L78 164
          M89 157 L89 170
          M100 160 L100 172
          M111 157 L111 170
          M122 151 L122 164
        "
        fill="none"
        stroke="#2563eb"
        stroke-width="3"
      />
    `;
  }

  if (mouth === "fangs") {
    mouthGraphic = `
      <path
        d="M72 145 Q100 166 128 145 Q123 172 100 174 Q77 172 72 145 Z"
        fill="#ffffff"
        stroke="#222"
        stroke-width="3"
      />

      <path
        d="
          M82 150 L87 166 L93 153
          M107 153 L113 166 L118 150
        "
        fill="#ffffff"
        stroke="#222"
        stroke-width="2"
      />
    `;
  }

  if (mouth === "frown") {
    mouthGraphic = `
      <path
        d="M78 164 Q100 144 122 164"
        fill="none"
        stroke="#222"
        stroke-width="4"
        stroke-linecap="round"
      />
    `;
  }

  if (mouth === "beak") {
    mouthGraphic = `
      <path
        d="M100 137 L78 160 L122 160 Z"
        fill="#f4a261"
        stroke="#222"
        stroke-width="3"
      />
    `;
  }

  if (mouth === "lion") {
    mouthGraphic = `
      <path
        d="M69 143 Q100 171 131 143 Q126 176 100 180 Q74 176 69 143 Z"
        fill="#ffffff"
        stroke="#222"
        stroke-width="3"
      />

      <path
        d="
          M76 148 L82 168
          L88 153 L94 172
          L100 155 L106 172
          L112 153 L118 168
          L124 148
        "
        fill="#ffffff"
        stroke="#222"
        stroke-width="2"
      />
    `;
  }

  let accessoryGraphic = "";

  if (accessory === "beard") {
    accessoryGraphic = `
      <path
        d="
          M64 141
          Q70 184 100 193
          Q130 184 136 141
          Q124 153 100 156
          Q76 153 64 141
          Z
        "
        fill="${accessoryColor}"
        stroke="#222"
        stroke-width="3"
      />
    `;
  }

  if (accessory === "unicorn") {
    accessoryGraphic = `
      <path
        d="M100 48 L86 8 L114 8 Z"
        fill="${accessoryColor}"
        stroke="#222"
        stroke-width="3"
      />

      <path
        d="
          M90 18 L110 18
          M93 28 L108 28
          M96 38 L105 38
        "
        stroke="#ffffff"
        stroke-width="3"
      />
    `;
  }

  if (accessory === "top-hat") {
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

      <rect
        x="59"
        y="51"
        width="82"
        height="9"
        fill="#222"
      />
    `;
  }

  if (accessory === "halo") {
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
  }

  if (accessory === "beret") {
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
  }

  if (accessory === "band") {
    accessoryGraphic = `
      <path
        d="M34 76 Q100 42 166 76"
        fill="none"
        stroke="${accessoryColor}"
        stroke-width="11"
      />
    `;
  }

  if (accessory === "nose-stud") {
    accessoryGraphic = `
      <circle
        cx="101"
        cy="132"
        r="4"
        fill="${accessoryColor}"
        stroke="#222"
        stroke-width="2"
      />
    `;
  }

  if (accessory === "nose-bullring") {
    accessoryGraphic = `
      <path
        d="M91 133 Q100 146 109 133"
        fill="none"
        stroke="${accessoryColor}"
        stroke-width="4"
      />

      <circle
        cx="91"
        cy="133"
        r="3"
        fill="${accessoryColor}"
      />

      <circle
        cx="109"
        cy="133"
        r="3"
        fill="${accessoryColor}"
      />
    `;
  }

  return `
    <svg
      viewBox="0 0 200 220"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Custom avatar"
    >
      <rect
        width="200"
        height="220"
        rx="24"
        fill="${backgroundColor}"
      />

      ${avatarShape}
      ${faceArea}
      ${accessoryGraphic}
      ${eyes}
      ${mouthGraphic}
    </svg>
  `;
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

