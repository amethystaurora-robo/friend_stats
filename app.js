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
  accessories: [],
  mouth: "grinning"
};

let selectedAccessoryType = null;

function getAvatarOptions() {
  return {
    ...avatarChoices,
    accessories: avatarChoices.accessories.map(accessory => ({
      ...accessory
    }))
  };
}

function createAvatarSVG(avatar = {}) {
  const {
    ghostColor = "#ff0000",
    eyeColor = "#222222",
    accessories = [],
    mouth = "grinning",
    backgroundColor = "#eef1f6"
  } = avatar;

  const accessoryMap = new Map(
    Array.isArray(accessories)
      ? accessories.map(item => [
          item.type,
          item.color || "#ff0000"
        ])
      : []
  );

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
        d="M68 139 Q100 174 132 139 Q127 172 100 177 Q73 172 68 139 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="3"
      />
    `;
  } else if (mouth === "smile") {
    mouthGraphic = `
      <path
        d="M76 148 Q100 168 124 148"
        fill="none"
        stroke="#222"
        stroke-width="5"
        stroke-linecap="round"
      />
    `;
  } else if (mouth === "frown") {
    mouthGraphic = `
      <path
        d="M76 166 Q100 143 124 166"
        fill="none"
        stroke="#222"
        stroke-width="5"
        stroke-linecap="round"
      />
    `;
  } else if (mouth === "braces") {
    mouthGraphic = `
      <path
        d="M68 139 Q100 174 132 139 Q127 172 100 177 Q73 172 68 139 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="3"
      />
      <path
        d="
          M78 148 V164
          M89 155 V171
          M100 157 V173
          M111 155 V171
          M122 148 V164
        "
        fill="none"
        stroke="#2563eb"
        stroke-width="3"
      />
    `;
  } else if (mouth === "fangs") {
    mouthGraphic = `
      <path
        d="M70 141 Q100 170 130 141 Q125 171 100 176 Q75 171 70 141 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="3"
      />
      <path
        d="M80 146 L87 166 L94 151 M106 151 L113 166 L120 146"
        fill="#fff"
        stroke="#222"
        stroke-width="2"
      />
    `;
  } 

  let accessoryGraphic = "";

  if (accessoryMap.has("halo")) {
    const color = accessoryMap.get("halo");

    accessoryGraphic += `
      <ellipse
        cx="100"
        cy="14"
        rx="54"
        ry="13"
        fill="none"
        stroke="${color}"
        stroke-width="8"
      />
    `;
  }

  if (accessoryMap.has("horn")) {
    const color = accessoryMap.get("horn");

    accessoryGraphic += `
      <path
        d="
          M100 78
          C94 62 87 40 94 7
          C102 22 111 32 119 39
          C114 54 107 68 100 78
          Z
        "
        fill="${color}"
        stroke="#222"
        stroke-width="3"
        stroke-linejoin="round"
      />
      <path
        d="M96 23 L109 33 M94 39 L106 49 M96 55 L103 61"
        fill="none"
        stroke="#fff"
        stroke-width="3"
        opacity="0.75"
      />
    `;
  }

  if (accessoryMap.has("mustache")) {
  const color = accessoryMap.get("mustache");

  accessoryGraphic += `
    <path
      d="
        M100 137
        C91 128 78 127 70 136
        C77 148 89 151 100 142
        C111 151 123 148 130 136
        C122 127 109 128 100 137
        Z
      "
      fill="${color}"
      stroke="#222"
      stroke-width="2"
      stroke-linejoin="round"
    />
  `;
}

  if (accessoryMap.has("top-hat")) {
    const color = accessoryMap.get("top-hat");

    accessoryGraphic += `
      <rect
        x="61"
        y="23"
        width="78"
        height="43"
        rx="5"
        fill="${color}"
        stroke="#222"
        stroke-width="3"
      />
      <rect
        x="47"
        y="59"
        width="106"
        height="13"
        rx="5"
        fill="${color}"
        stroke="#222"
        stroke-width="3"
      />
      <rect x="61" y="51" width="78" height="9" fill="#222" />
    `;
  }

  if (accessoryMap.has("glasses")) {
    const color = accessoryMap.get("glasses");

    accessoryGraphic += `
      <g fill="none" stroke="${color}" stroke-width="5">
        <rect x="52" y="91" width="43" height="32" rx="8" />
        <rect x="105" y="91" width="43" height="32" rx="8" />
        <path d="M95 103 H105" />
        <path d="M52 102 L40 96" />
        <path d="M148 102 L160 96" />
      </g>
    `;
  }

  if (accessoryMap.has("beard")) {
    const color = accessoryMap.get("beard");

    accessoryGraphic += `
      <path
        d="
          M64 139
          Q70 180 100 190
          Q130 180 136 139
          Q124 151 100 154
          Q76 151 64 139
          Z
        "
        fill="${color}"
        stroke="#222"
        stroke-width="3"
      />
    `;
  }

  if (accessoryMap.has("beret")) {
    const color = accessoryMap.get("beret");

    accessoryGraphic += `
      <path
        d="
          M48 55
          Q67 13 111 15
          Q145 17 154 50
          Q120 61 78 59
          Q60 59 48 55
          Z
        "
        fill="${color}"
        stroke="#222"
        stroke-width="3"
      />
      <circle
        cx="106"
        cy="22"
        r="6"
        fill="${color}"
        stroke="#222"
        stroke-width="2"
      />
    `;
  }

  if (accessoryMap.has("band")) {
    const color = accessoryMap.get("band");

    accessoryGraphic += `
      <path
        d="M34 76 Q100 42 166 76"
        fill="none"
        stroke="${color}"
        stroke-width="11"
      />
    `;
  }

  if (accessoryMap.has("nose-bullring")) {
    const color = accessoryMap.get("nose-bullring");

    accessoryGraphic += `
      <path
        d="M91 133 Q100 146 109 133"
        fill="none"
        stroke="${color}"
        stroke-width="4"
      />
      <circle cx="91" cy="133" r="3" fill="${color}" />
      <circle cx="109" cy="133" r="3" fill="${color}" />
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

/* Mouth, ghost color, and eye color buttons */

document.querySelectorAll("[data-option]").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();

    const option = button.dataset.option;
    const value = button.dataset.value;

    if (option === "accessory") return;

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

/* Multiple accessory buttons */

document.querySelectorAll("[data-accessory]").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();

    const type = button.dataset.accessory;
    
    selectedAccessoryType = type;
    
    const existingIndex = avatarChoices.accessories.findIndex(
      accessory => accessory.type === type
    );


    if (existingIndex !== -1) {
      avatarChoices.accessories.splice(existingIndex, 1);

      if (selectedAccessoryType === type) {
        selectedAccessoryType = null;
      }
    } else {
      avatarChoices.accessories.push({
        type,
        color: "#ff0000"
      });

      selectedAccessoryType = type;
    }

    updateAccessoryButtonStates();
    updateAccessoryColorStates();
    updateAvatarPreview();
  });
});

/* Accessory color buttons */

document
  .querySelectorAll("[data-accessory-color]")
  .forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();

      const color = button.dataset.accessoryColor;

      if (!selectedAccessoryType) return;

      const accessory = avatarChoices.accessories.find(
        item => item.type === selectedAccessoryType
      );

      if (!accessory) return;

      accessory.color = color;

      updateAccessoryColorStates();
      updateAvatarPreview();
    });
  });

function updateAccessoryButtonStates() {
  document.querySelectorAll("[data-accessory]").forEach(button => {
    const selected = avatarChoices.accessories.some(
      accessory => accessory.type === button.dataset.accessory
    );

    button.classList.toggle("selected", selected);
  });
}

function updateAccessoryColorStates() {
  const selectedAccessory = avatarChoices.accessories.find(
    accessory => accessory.type === selectedAccessoryType
  );

  document
    .querySelectorAll("[data-accessory-color]")
    .forEach(button => {
      button.classList.toggle(
        "selected",
        Boolean(
          selectedAccessory &&
          selectedAccessory.color === button.dataset.accessoryColor
        )
      );
    });
}

function updateAvatarPreview() {
  if (!avatarPreview) return;

  avatarPreview.innerHTML = createAvatarSVG({
    ...avatarChoices,
    backgroundColor: "#e8eef7"
  });
}

function saveData() {
  localStorage.setItem("avatars", JSON.stringify(avatars));
  localStorage.setItem("entries", JSON.stringify(entries));
}

function createId() {
  return Date.now().toString();
}

function getAvatarName(avatarId) {
  const avatar = avatars.find(avatar => avatar.id === avatarId);
  return avatar ? avatar.name : "Unknown avatar";
}

function calculateTotalPoints(avatarId) {
  return entries.reduce((total, entry) => {
    const result = entry.results.find(
      item => item.avatarId === avatarId
    );

    return total + (result ? Number(result.points) : 0);
  }, 0);
}

function displayPointsFields() {
  if (!pointsFields) return;

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
  if (!avatarOneSelect || !avatarTwoSelect) return;

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
  if (!entryList) return;

  if (entries.length === 0) {
    entryList.innerHTML = "<p>No competitions recorded yet.</p>";
    return;
  }

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
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
        ${entry.notes
          ? `<p><strong>Notes:</strong> ${entry.notes}</p>`
          : ""}
      </article>
    `;
  }).join("");
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

function updateChart() {
  const chartCanvas = document.querySelector("#points-chart");

  if (!chartCanvas || typeof Chart === "undefined") return;

  const labels = [...new Set(entries.map(entry => entry.date))].sort();

  const datasets = avatars.map((avatar, index) => {
    let runningTotal = 0;

    const data = labels.map(date => {
      const entriesOnDate = entries.filter(
        entry => entry.date === date
      );

      entriesOnDate.forEach(entry => {
        const result = entry.results.find(
          item => item.avatarId === avatar.id
        );

        if (result) {
          runningTotal += Number(result.points);
        }
      });

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

  if (pointsChart) {
    pointsChart.destroy();
  }

  pointsChart = new Chart(chartCanvas.getContext("2d"), {
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

function displayAvatars() {
  if (!avatarList) return;

  if (avatars.length === 0) {
    avatarList.innerHTML = "<p>No avatars created yet.</p>";
    return;
  }

  avatarList.innerHTML = avatars.map(avatar => {
    /*
      Compatibility for avatars saved before the multi-accessory update.
    */
    const normalizedAvatar = {
      ...avatar,
      accessories: Array.isArray(avatar.accessories)
        ? avatar.accessories
        : []
    };

    return `
      <article class="avatar-card">
        ${createAvatarSVG(normalizedAvatar)}
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

if (avatarForm) {
  avatarForm.addEventListener("submit", event => {
    event.preventDefault();

    const nameInput = document.querySelector("#avatar-name");
    const name = nameInput.value.trim();

    if (!name) return;

    const avatar = {
      id: createId(),
      name,
      ...getAvatarOptions()
    };

    avatars.push(avatar);
    saveData();

    avatarForm.reset();
    refreshPage();
  });
}

if (entryForm) {
  entryForm.addEventListener("submit", event => {
    event.preventDefault();

    if (avatars.length === 0) {
      alert("Create at least one avatar first.");
      return;
    }

    const results = [
      ...document.querySelectorAll(".avatar-points")
    ].map(input => ({
      avatarId: input.dataset.avatarId,
      points: Number(input.value)
    }));

    const entry = {
      id: createId(),
      type: document
        .querySelector("#competition-type")
        .value
        .trim(),
      date: document.querySelector("#competition-date").value,
      notes: document
        .querySelector("#competition-notes")
        .value
        .trim(),
      results
    };

    entries.push(entry);
    saveData();

    entryForm.reset();
    refreshPage();
  });
}

if (compareButton) {
  compareButton.addEventListener("click", () => {
    const firstId = avatarOneSelect.value;
    const secondId = avatarTwoSelect.value;

    if (!firstId || !secondId) {
      comparisonResult.textContent =
        "Create at least two avatars first.";
      return;
    }

    if (firstId === secondId) {
      comparisonResult.textContent =
        "Choose two different avatars.";
      return;
    }

    const firstAvatar = avatars.find(
      avatar => avatar.id === firstId
    );

    const secondAvatar = avatars.find(
      avatar => avatar.id === secondId
    );

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
}

updateAccessoryButtonStates();
updateAccessoryColorStates();
updateAvatarPreview();
refreshPage();
