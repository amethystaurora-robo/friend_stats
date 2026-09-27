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

let competitionSelection = new Set();
let competitionsAreVisible = false;


function ensureAvatarIds() {
  let changed = false;

  avatars.forEach(avatar => {
    if (!avatar.id) {
      avatar.id = createId();
      changed = true;
    }
  });

  if (changed) {
    saveData();
  }
}

ensureAvatarIds();

function ensureEntryIds() {
  let changed = false;

  entries.forEach(entry => {
    if (!entry.id) {
      entry.id = createId();
      changed = true;
    }
  });

  if (changed) {
    saveData();
  }
}

ensureEntryIds();


avatars.forEach(avatar => {
  competitionSelection.add(avatar.id);
});


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
  } else if (mouth === "tongue") {
  mouthGraphic = `
    <path
      d="M76 126 Q100 143 124 126 Q120 153 100 156 Q80 153 76 126 Z"
      fill="#7d2635"
      stroke="#222"
      stroke-width="2"
    />

    <path
      d="M88 146 Q100 137 112 146 Q110 157 100 159 Q90 157 88 146 Z"
      fill="#f07886"
      stroke="#222"
      stroke-width="2"
    />

    <path
      d="M100 145 L100 157"
      stroke="#b94b5b"
      stroke-width="2"
    />
  `;
} else if (mouth === "missing-tooth") {
  mouthGraphic = `
    <path
      d="M76 130 Q100 145 124 130 Q120 151 100 153 Q80 151 76 130 Z"
      fill="#54202b"
      stroke="#222"
      stroke-width="2"
    />

    <path
      d="M91 132 Q97 130 103 133 L102 143 Q97 146 92 142 Z"
      fill="#fff"
      stroke="#222"
      stroke-width="1.5"
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

  if (accessoryMap.has("earrings")) {
  const color = accessoryMap.get("earrings");

  accessoryGraphic += `
    <!-- Left earring -->
    <circle
      cx="57"
      cy="124"
      r="7"
      fill="none"
      stroke="${color}"
      stroke-width="4"
    />

    <!-- Right earring -->
    <circle
      cx="143"
      cy="124"
      r="7"
      fill="none"
      stroke="${color}"
      stroke-width="4"
    />
  `;
}

if (accessoryMap.has("eyepatch")) {
  const color = accessoryMap.get("eyepatch");

  accessoryGraphic += `
    <path
      d="M61 88 Q75 76 89 88 L86 106 Q75 113 64 106 Z"
      fill="${color}"
      stroke="#222"
      stroke-width="2"
    />

    <path
      d="M62 87 L47 70"
      fill="none"
      stroke="${color}"
      stroke-width="4"
      stroke-linecap="round"
    />

    <path
      d="M88 87 L103 70"
      fill="none"
      stroke="${color}"
      stroke-width="4"
      stroke-linecap="round"
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

  pointsFields.innerHTML = avatars.map(avatar => {
    const selected = competitionSelection.has(avatar.id);

    return `
      <div class="points-row">
        <label>
          <input
            type="checkbox"
            class="competition-avatar-checkbox"
            data-competition-avatar="${avatar.id}"
            ${selected ? "checked" : ""}
          >

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
          ${selected ? "" : "disabled"}
        >
      </div>
    `;
  }).join("");
}

const competitionTypeFilter = document.querySelector(
  "#competition-type-filter"
);

const competitionAvatarFilter = document.querySelector(
  "#competition-avatar-filter"
);

const clearCompetitionFilters = document.querySelector(
  "#clear-competition-filters"
);

competitionTypeFilter?.addEventListener("change", displayEntries);

competitionAvatarFilter?.addEventListener("change", displayEntries);

clearCompetitionFilters?.addEventListener("click", () => {
  if (competitionTypeFilter) {
    competitionTypeFilter.value = "";
  }

  if (competitionAvatarFilter) {
    competitionAvatarFilter.value = "";
  }

  displayEntries();
});


function displayCompetitionFilters() {
  const typeSelect = document.querySelector(
    "#competition-type-filter"
  );

  const avatarSelect = document.querySelector(
    "#competition-avatar-filter"
  );

  if (!typeSelect || !avatarSelect) return;

  const currentType = typeSelect.value;
  const currentAvatar = avatarSelect.value;

  const types = [...new Set(
    entries
      .map(entry => entry.type)
      .filter(Boolean)
  )].sort();

  typeSelect.innerHTML = `
    <option value="">All competition types</option>
    ${types.map(type => `
      <option value="${escapeHTML(type)}">
        ${escapeHTML(type)}
      </option>
    `).join("")}
  `;

  avatarSelect.innerHTML = `
    <option value="">All avatars</option>
    ${avatars.map(avatar => `
      <option value="${escapeHTML(avatar.id)}">
        ${escapeHTML(avatar.name)}
      </option>
    `).join("")}
  `;

  if (types.includes(currentType)) {
    typeSelect.value = currentType;
  }

  if (avatars.some(avatar => avatar.id === currentAvatar)) {
    avatarSelect.value = currentAvatar;
  }
}


function displayComparisonOptions() {
  if (!avatarOneSelect || !avatarTwoSelect) return;

  const options = avatars.map(avatar => `
    <option value="${escapeHTML(avatar.id)}">
      ${escapeHTML(avatar.name)}
    </option>
  `).join("");

  avatarOneSelect.innerHTML = options;
  avatarTwoSelect.innerHTML = options;

  if (avatars.length >= 2) {
    avatarTwoSelect.selectedIndex = 1;
  }
}

document.addEventListener("change", event => {
  const checkbox = event.target.closest(
    "[data-competition-avatar]"
  );

  if (!checkbox) return;

  const avatarId = checkbox.dataset.competitionAvatar;
  const pointsInput = document.querySelector(
    `.avatar-points[data-avatar-id="${avatarId}"]`
  );

  if (checkbox.checked) {
    competitionSelection.add(avatarId);

    if (pointsInput) {
      pointsInput.disabled = false;
    }
  } else {
    competitionSelection.delete(avatarId);

    if (pointsInput) {
      pointsInput.disabled = true;
      pointsInput.value = "0";
    }
  }
});


  displayPointsFields();


function displayEntries() {
  if (!entryList) return;

  if (!competitionsAreVisible) {
    entryList.innerHTML = `
      <p>
        Select avatars or competition types, then click
        “Display competitions.”
      </p>
    `;
    return;
  }

  const avatarFilter = document.querySelector(
    "#competition-avatar-filter"
  );

  const typeFilter = document.querySelector(
    "#competition-type-filter"
  );

  const selectedAvatarValues = avatarFilter
    ? [...avatarFilter.selectedOptions].map(option => option.value)
    : [];

  const selectedTypeValues = typeFilter
    ? [...typeFilter.selectedOptions].map(option => option.value)
    : [];

  const allAvatarsSelected =
    selectedAvatarValues.includes("all");

  const selectedAvatarIds = new Set(
    selectedAvatarValues.filter(value => value !== "all")
  );

  const selectedTypes = new Set(selectedTypeValues);

  const hasAvatarFilter =
    !allAvatarsSelected && selectedAvatarIds.size > 0;

  const hasTypeFilter = selectedTypes.size > 0;

  // Prevent displaying everything when no filters were selected.
  if (!hasAvatarFilter && !hasTypeFilter) {
    entryList.innerHTML = `
      <p>
        Select at least one avatar or competition type.
      </p>
    `;
    return;
  }

  const filteredEntries = [...entries]
    .filter(entry => {
      const results = Array.isArray(entry.results)
        ? entry.results
        : [];

      const matchesAvatar =
        !hasAvatarFilter ||
        results.some(result =>
          selectedAvatarIds.has(result.avatarId)
        );

      const matchesType =
        !hasTypeFilter ||
        selectedTypes.has(String(entry.type || "").trim());

      // Avatar and type filters are combined with AND.
      return matchesAvatar && matchesType;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filteredEntries.length === 0) {
    entryList.innerHTML = `
      <p>No competitions match the selected filters.</p>
    `;
    return;
  }

  entryList.innerHTML = filteredEntries.map(entry => {
    const results = Array.isArray(entry.results)
      ? entry.results
      : [];

    const totalPoints = results.reduce(
      (total, result) =>
        total + Number(result.points || 0),
      0
    );

    const resultItems = results.map(result => `
      <li>
        ${escapeHTML(getAvatarName(result.avatarId))}:
        <strong>${Number(result.points || 0)} points</strong>
      </li>
    `).join("");

    return `
      <details
        class="entry"
        data-entry-id="${escapeHTML(entry.id)}"
      >
        <summary>
          <span class="entry-title">
            ${escapeHTML(entry.type || "Competition")}
          </span>

          <span class="entry-summary">
            ${escapeHTML(entry.date || "")}
            · ${results.length} competitors
            · ${totalPoints} total points
          </span>
        </summary>

        <div class="entry-content">
          <ul>
            ${resultItems || "<li>No results recorded.</li>"}
          </ul>

          ${
            entry.notes
              ? `
                <p>
                  <strong>Notes:</strong>
                  ${escapeHTML(entry.notes)}
                </p>
              `
              : ""
          }

          <button
            type="button"
            class="delete-entry-button"
            data-delete-entry="${escapeHTML(entry.id)}"
          >
            Delete competition
          </button>
        </div>
      </details>
    `;
  }).join("");
}

const displayCompetitionsButton = document.querySelector(
  "#display-competitions-button"
);

displayCompetitionsButton?.addEventListener("click", () => {
  const avatarFilter = document.querySelector(
    "#competition-avatar-filter"
  );

  const typeFilter = document.querySelector(
    "#competition-type-filter"
  );

  const selectedAvatars = avatarFilter
    ? [...avatarFilter.selectedOptions]
    : [];

  const selectedTypes = typeFilter
    ? [...typeFilter.selectedOptions]
    : [];

  const allAvatarsSelected = selectedAvatars.some(
    option => option.value === "all"
  );

  const hasAvatarFilter =
    allAvatarsSelected ||
    selectedAvatars.length > 0;

  const hasTypeFilter = selectedTypes.length > 0;

  if (!hasAvatarFilter && !hasTypeFilter) {
    competitionsAreVisible = false;
    displayEntries();
    return;
  }

  competitionsAreVisible = true;
  displayEntries();
});

const clearCompetitionFilters = document.querySelector(
  "#clear-competition-filters"
);

clearCompetitionFilters?.addEventListener("click", () => {
  const avatarFilter = document.querySelector(
    "#competition-avatar-filter"
  );

  const typeFilter = document.querySelector(
    "#competition-type-filter"
  );

  if (avatarFilter) {
    [...avatarFilter.options].forEach(option => {
      option.selected = false;
    });
  }

  if (typeFilter) {
    [...typeFilter.options].forEach(option => {
      option.selected = false;
    });
  }

  competitionsAreVisible = false;
  displayEntries();
});


  entryList.innerHTML = filteredEntries.map(entry => {
    const results = Array.isArray(entry.results)
      ? entry.results
      : [];

    const totalPoints = results.reduce(
      (total, result) => total + Number(result.points || 0),
      0
    );

    const resultItems = results.map(result => `
      <li>
        ${escapeHTML(getAvatarName(result.avatarId))}:
        <strong>${Number(result.points || 0)} points</strong>
      </li>
    `).join("");

    return `
      <details
        class="entry"
        data-entry-id="${escapeHTML(entry.id)}"
      >
        <summary>
          <span class="entry-title">
            ${escapeHTML(entry.type || "Competition")}
          </span>

          <span class="entry-summary">
            ${escapeHTML(entry.date || "")}
            · ${results.length} competitors
            · ${totalPoints} total points
          </span>
        </summary>

        <div class="entry-content">
          <ul>
            ${resultItems || "<li>No results recorded.</li>"}
          </ul>

          ${
            entry.notes
              ? `
                <p>
                  <strong>Notes:</strong>
                  ${escapeHTML(entry.notes)}
                </p>
              `
              : ""
          }

          <button
            type="button"
            class="delete-entry-button"
            data-delete-entry="${escapeHTML(entry.id)}"
          >
            Delete competition
          </button>
        </div>
      </details>
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
    const normalizedAvatar = {
      ...avatar,
      accessories: Array.isArray(avatar.accessories)
        ? avatar.accessories
        : []
    };

    return `
      <article
  class="avatar-card"
  data-avatar-id="${escapeHTML(avatar.id)}"
>
        ${createAvatarSVG(normalizedAvatar)}

        <h3>${escapeHTML(avatar.name)}</h3>

        <p class="total">
          ${calculateTotalPoints(avatar.id)} points
        </p>

        <button
          type="button"
          class="delete-avatar-button"
          data-delete-avatar="${escapeHTML(avatar.id)}"
        >
          Delete avatar
        </button>
      </article>
    `;
  }).join("");
}
function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function refreshPage() {
  displayAvatars();
  displayPointsFields();
  displayComparisonOptions();
  displayCompetitionFilters();
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
    competitionSelection.add(avatar.id);
    
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
    ]
      .filter(input =>
        competitionSelection.has(input.dataset.avatarId)
      )
      .map(input => ({
        avatarId: input.dataset.avatarId,
        points: Number(input.value)
      }));

    if (results.length < 2) {
  alert("Select at least two avatars for the competition.");
  return;
}



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
    competitionSelection.clear();
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
function deleteAvatar(avatarId) {
  const avatar = avatars.find(item => item.id === avatarId);

  if (!avatar) return;

  const confirmed = confirm(
    `Delete "${avatar.name}"? This cannot be undone.`
  );

  if (!confirmed) return;

  avatars = avatars.filter(item => item.id !== avatarId);

  entries = entries
    .map(entry => ({
      ...entry,
      results: Array.isArray(entry.results)
        ? entry.results.filter(result => result.avatarId !== avatarId)
        : []
    }))
    .filter(entry => entry.results.length > 0);

  competitionSelection.delete(avatarId);

  saveData();
  refreshPage();
}

function displayCompetitionFilters() {
  const avatarFilter = document.querySelector(
    "#competition-avatar-filter"
  );

  const typeFilter = document.querySelector(
    "#competition-type-filter"
  );

  if (!avatarFilter || !typeFilter) return;

  const selectedAvatarIds = new Set(
    [...avatarFilter.selectedOptions].map(option => option.value)
  );

  const selectedTypes = new Set(
    [...typeFilter.selectedOptions].map(option => option.value)
  );

  avatarFilter.innerHTML = `
    <option value="all">All avatars</option>
    ${avatars.map(avatar => `
      <option value="${escapeHTML(avatar.id)}">
        ${escapeHTML(avatar.name)}
      </option>
    `).join("")}
  `;

  const competitionTypes = [
    ...new Set(
      entries
        .map(entry => String(entry.type || "").trim())
        .filter(Boolean)
    )
  ].sort((a, b) => a.localeCompare(b));

  typeFilter.innerHTML = competitionTypes.map(type => `
    <option value="${escapeHTML(type)}">
      ${escapeHTML(type)}
    </option>
  `).join("");

  [...avatarFilter.options].forEach(option => {
    if (
      selectedAvatarIds.has(option.value) &&
      option.value !== "all"
    ) {
      option.selected = true;
    }
  });

  [...typeFilter.options].forEach(option => {
    option.selected = selectedTypes.has(option.value);
  });
}
const competitionAvatarFilter = document.querySelector(
  "#competition-avatar-filter"
);

competitionAvatarFilter?.addEventListener("change", event => {
  const select = event.currentTarget;
  const allOption = [...select.options].find(
    option => option.value === "all"
  );

  if (!allOption) return;

  const selectedValues = [...select.selectedOptions]
    .map(option => option.value);

  if (selectedValues.includes("all")) {
    [...select.options].forEach(option => {
      option.selected = option.value === "all";
    });
  } else if (
    selectedValues.length === select.options.length - 1
  ) {
    allOption.selected = true;

    [...select.options].forEach(option => {
      if (option.value !== "all") {
        option.selected = false;
      }
    });
  }
});



function deleteEntry(entryId) {
  const entry = entries.find(item => item.id === entryId);

  if (!entry) return;

  const confirmed = confirm(
    "Delete this competition? This cannot be undone."
  );

  if (!confirmed) return;

  entries = entries.filter(item => item.id !== entryId);

  saveData();
  refreshPage();
}
document.addEventListener("click", event => {
  const avatarButton = event.target.closest("[data-delete-avatar]");

  if (avatarButton) {
    deleteAvatar(avatarButton.dataset.deleteAvatar);
    return;
  }

  const entryButton = event.target.closest("[data-delete-entry]");

  if (entryButton) {
    deleteEntry(entryButton.dataset.deleteEntry);
  }
});

updateAccessoryButtonStates();
updateAccessoryColorStates();
updateAvatarPreview();
refreshPage();


avatars.forEach(avatar => {
  avatar.points = calculateTotalPoints(avatar.id);
});
refreshPage();
