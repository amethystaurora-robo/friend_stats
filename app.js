"use strict";

/* -----------------------------
   DOM elements
----------------------------- */

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

const competitionTypeFilter = document.querySelector(
  "#competition-type-filter"
);

const competitionAvatarFilter = document.querySelector(
  "#competition-avatar-filter"
);

const clearCompetitionFilters = document.querySelector(
  "#clear-competition-filters"
);

const displayCompetitionsButton = document.querySelector(
  "#display-competitions-button"
);

const chartCanvas = document.querySelector("#points-chart");

/* -----------------------------
   Application state
----------------------------- */

let avatars = loadData("avatars");
let entries = loadData("entries");
let pointsChart = null;

let editingAvatarId = null;
let editingEntryId = null;


const competitionSelection = new Set(
  avatars.map(avatar => avatar.id)
);

let competitionsAreVisible = false;

const avatarChoices = {
  ghostColor: "#ff0000",
  eyeColor: "#222222",
  mouth: "grinning",
  accessories: []
};

let selectedAccessoryType = null;

/* -----------------------------
   Utilities
----------------------------- */

function loadData(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Could not load ${key}:`, error);
    return [];
  }
}

function saveData() {
  localStorage.setItem("avatars", JSON.stringify(avatars));
  localStorage.setItem("entries", JSON.stringify(entries));
}

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function ensureIds() {
  let changed = false;

  avatars.forEach(avatar => {
    if (!avatar.id) {
      avatar.id = createId();
      changed = true;
    }
  });

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

ensureIds();

function getAvatarName(avatarId) {
  const avatar = avatars.find(avatar => avatar.id === avatarId);
  return avatar ? avatar.name : "Unknown avatar";
}

function calculateTotalPoints(avatarId) {
  return entries.reduce((total, entry) => {
    const results = Array.isArray(entry.results)
      ? entry.results
      : [];

    const result = results.find(
      item => item.avatarId === avatarId
    );

    return total + Number(result?.points || 0);
  }, 0);
}

/* -----------------------------
   Avatar SVG
----------------------------- */

function createAvatarSVG(avatar = {}) {
  const {
    ghostColor = "#ff0000",
    eyeColor = "#222222",
    mouth = "grinning",
    accessories = [],
    backgroundColor = "#eef1f6"
  } = avatar;

  const accessoryMap = new Map(
    Array.isArray(accessories)
      ? accessories.map(accessory => [
          accessory.type,
          accessory.color || "#ff0000"
        ])
      : []
  );

  let mouthGraphic = "";

  if (mouth === "grinning") {
    mouthGraphic = `
      <path
        d="M68 139 Q100 174 132 139
           Q127 172 100 177
           Q73 172 68 139 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="3"
      />
    `;
  }

  if (mouth === "smile") {
    mouthGraphic = `
      <path
        d="M76 148 Q100 168 124 148"
        fill="none"
        stroke="#222"
        stroke-width="5"
        stroke-linecap="round"
      />
    `;
  }

  if (mouth === "frown") {
    mouthGraphic = `
      <path
        d="M76 166 Q100 143 124 166"
        fill="none"
        stroke="#222"
        stroke-width="5"
        stroke-linecap="round"
      />
    `;
  }

  if (mouth === "braces") {
    mouthGraphic = `
      <path
        d="M68 139 Q100 174 132 139
           Q127 172 100 177
           Q73 172 68 139 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="3"
      />

      <path
        d="M78 148 V164
           M89 155 V171
           M100 157 V173
           M111 155 V171
           M122 148 V164"
        fill="none"
        stroke="#2563eb"
        stroke-width="3"
      />
    `;
  }

  if (mouth === "fangs") {
    mouthGraphic = `
      <path
        d="M70 141 Q100 170 130 141
           Q125 171 100 176
           Q75 171 70 141 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="3"
      />

      <path
        d="M80 146 L87 166 L94 151
           M106 151 L113 166 L120 146"
        fill="#fff"
        stroke="#222"
        stroke-width="2"
      />
    `;
  }

  if (mouth === "tongue") {
    mouthGraphic = `
      <path
        d="M76 126 Q100 143 124 126
           Q120 153 100 156
           Q80 153 76 126 Z"
        fill="#7d2635"
        stroke="#222"
        stroke-width="2"
      />

      <path
        d="M88 146 Q100 137 112 146
           Q110 157 100 159
           Q90 157 88 146 Z"
        fill="#f07886"
        stroke="#222"
        stroke-width="2"
      />
    `;
  }

  if (mouth === "missing-tooth") {
    mouthGraphic = `
      <path
        d="M76 130 Q100 145 124 130
           Q120 151 100 153
           Q80 151 76 130 Z"
        fill="#54202b"
        stroke="#222"
        stroke-width="2"
      />

      <path
        d="M91 132 Q97 130 103 133
           L102 143 Q97 146 92 142 Z"
        fill="#fff"
        stroke="#222"
        stroke-width="1.5"
      />
    `;
  }

  let accessoryGraphic = "";

  if (accessoryMap.has("halo")) {
    accessoryGraphic += `
      <ellipse
        cx="100"
        cy="14"
        rx="54"
        ry="13"
        fill="none"
        stroke="${accessoryMap.get("halo")}"
        stroke-width="8"
      />
    `;
  }

  if (accessoryMap.has("earrings")) {
    const color = accessoryMap.get("earrings");

    accessoryGraphic += `
      <circle
        cx="57"
        cy="124"
        r="7"
        fill="none"
        stroke="${color}"
        stroke-width="4"
      />

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
        d="M61 88 Q75 76 89 88
           L86 106 Q75 113 64 106 Z"
        fill="${color}"
        stroke="#222"
        stroke-width="2"
      />

      <path
        d="M62 87 L47 70 M88 87 L103 70"
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
        d="M100 78
           C94 62 87 40 94 7
           C102 22 111 32 119 39
           C114 54 107 68 100 78 Z"
        fill="${color}"
        stroke="#222"
        stroke-width="3"
      />
    `;
  }

  if (accessoryMap.has("mustache")) {
    const color = accessoryMap.get("mustache");

    accessoryGraphic += `
      <path
        d="M100 137
           C91 128 78 127 70 136
           C77 148 89 151 100 142
           C111 151 123 148 130 136
           C122 127 109 128 100 137 Z"
        fill="${color}"
        stroke="#222"
        stroke-width="2"
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

      <rect
        x="61"
        y="51"
        width="78"
        height="9"
        fill="#222"
      />
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
        d="M64 139
           Q70 180 100 190
           Q130 180 136 139
           Q124 151 100 154
           Q76 151 64 139 Z"
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
        d="M48 55
           Q67 13 111 15
           Q145 17 154 50
           Q120 61 78 59
           Q60 59 48 55 Z"
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
    accessoryGraphic += `
      <path
        d="M34 76 Q100 42 166 76"
        fill="none"
        stroke="${accessoryMap.get("band")}"
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

      <path
        d="M28 190
           L28 88
           Q28 42 58 20
           Q100 -8 142 20
           Q172 42 172 88
           L172 190
           Q158 207 143 190
           Q128 211 112 190
           Q100 207 88 190
           Q72 211 57 190
           Q42 207 28 190 Z"
        fill="${ghostColor}"
        stroke="#222"
        stroke-width="3"
      />

      ${accessoryGraphic}

      <circle cx="75" cy="108" r="6" fill="${eyeColor}" />
      <circle cx="125" cy="108" r="6" fill="${eyeColor}" />

      ${mouthGraphic}
    </svg>
  `;
}

/* -----------------------------
   Avatar customisation
----------------------------- */

function getAvatarOptions() {
  return {
    ...avatarChoices,
    accessories: avatarChoices.accessories.map(item => ({
      ...item
    }))
  };
}

function updateAvatarPreview() {
  if (!avatarPreview) {
    return;
  }

  avatarPreview.innerHTML = createAvatarSVG({
    ...avatarChoices,
    backgroundColor: "#e8eef7"
  });
}

function updateAccessoryButtonStates() {
  document.querySelectorAll("[data-accessory]")
    .forEach(button => {
      const selected = avatarChoices.accessories.some(
        accessory =>
          accessory.type === button.dataset.accessory
      );

      button.classList.toggle("selected", selected);
    });
}

function updateAccessoryColorStates() {
  const selectedAccessory =
    avatarChoices.accessories.find(
      item => item.type === selectedAccessoryType
    );

  document.querySelectorAll("[data-accessory-color]")
    .forEach(button => {
      button.classList.toggle(
        "selected",
        Boolean(
          selectedAccessory &&
          selectedAccessory.color ===
            button.dataset.accessoryColor
        )
      );
    });
}

document.querySelectorAll("[data-option]")
  .forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();

      const option = button.dataset.option;
      const value = button.dataset.value;

      if (option === "accessory") {
        return;
      }

      if (
        !Object.prototype.hasOwnProperty.call(
          avatarChoices,
          option
        )
      ) {
        return;
      }

      avatarChoices[option] = value;

      document
        .querySelectorAll(`[data-option="${option}"]`)
        .forEach(item => {
          item.classList.remove("selected");
        });

      button.classList.add("selected");
      updateAvatarPreview();
    });
  });

document.querySelectorAll("[data-accessory]")
  .forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();

      const type = button.dataset.accessory;
      selectedAccessoryType = type;

      const existingIndex =
        avatarChoices.accessories.findIndex(
          accessory => accessory.type === type
        );

      if (existingIndex >= 0) {
        avatarChoices.accessories.splice(
          existingIndex,
          1
        );
        selectedAccessoryType = null;
      } else {
        avatarChoices.accessories.push({
          type,
          color: "#ff0000"
        });
      }

      updateAccessoryButtonStates();
      updateAccessoryColorStates();
      updateAvatarPreview();
    });
  });

document.querySelectorAll("[data-accessory-color]")
  .forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();

      if (!selectedAccessoryType) {
        return;
      }

      const accessory =
        avatarChoices.accessories.find(
          item => item.type === selectedAccessoryType
        );

      if (!accessory) {
        return;
      }

      accessory.color = button.dataset.accessoryColor;

      updateAccessoryColorStates();
      updateAvatarPreview();
    });
  });

/* -----------------------------
   Avatar display
----------------------------- */

function displayAvatars() {
  if (!avatarList) {
    return;
  }

  if (avatars.length === 0) {
    avatarList.innerHTML =
      "<p>No avatars created yet.</p>";
    return;
  }

  avatarList.innerHTML = avatars.map(avatar => `
    <article
      class="avatar-card"
      data-avatar-id="${escapeHTML(avatar.id)}"
    >
      ${createAvatarSVG({
        ...avatar,
        accessories: Array.isArray(avatar.accessories)
          ? avatar.accessories
          : []
      })}

      <h3>${escapeHTML(avatar.name)}</h3>

      <p class="total">
        ${calculateTotalPoints(avatar.id)} points
      </p>

<div class="avatar-actions">
  <button
    type="button"
    class="edit-avatar-button"
    data-edit-avatar="${escapeHTML(avatar.id)}"
  >
    Edit avatar
  </button>

  <button
    type="button"
    class="delete-avatar-button"
    data-delete-avatar="${escapeHTML(avatar.id)}"
  >
    Delete avatar
  </button>
</div>

    </article>
  `).join("");
}

function startEditingAvatar(avatarId) {
  const avatar = avatars.find(item => item.id === avatarId);

  if (!avatar) {
    return;
  }

  editingAvatarId = avatarId;

  const nameInput = document.querySelector("#avatar-name");

  if (nameInput) {
    nameInput.value = avatar.name || "";
  }

  avatarChoices.ghostColor =
    avatar.ghostColor || "#ff0000";

  avatarChoices.eyeColor =
    avatar.eyeColor || "#222222";

  avatarChoices.mouth =
    avatar.mouth || "grinning";

  avatarChoices.accessories = Array.isArray(
    avatar.accessories
  )
    ? avatar.accessories.map(accessory => ({
        ...accessory
      }))
    : [];

  document
    .querySelectorAll("[data-option]")
    .forEach(button => {
      const option = button.dataset.option;
      const value = button.dataset.value;

      button.classList.toggle(
        "selected",
        avatarChoices[option] === value
      );
    });

  updateAccessoryButtonStates();

  selectedAccessoryType =
    avatarChoices.accessories[0]?.type || null;

  updateAccessoryColorStates();
  updateAvatarPreview();

  const submitButton = avatarForm?.querySelector(
    'button[type="submit"]'
  );

  addAvatarCancelButton();
  if (submitButton) {
    submitButton.textContent = "Save avatar changes";
  }

  avatarForm?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


function cancelEditingAvatar() {
  editingAvatarId = null;

if (avatarForm) {
  avatarForm.addEventListener("submit", event => {
    event.preventDefault();

    const nameInput = document.querySelector(
      "#avatar-name"
    );

    const name = nameInput?.value.trim();

    if (!name) {
      alert("Enter an avatar name.");
      return;
    }

    if (editingAvatarId) {
      const avatar = avatars.find(
        item => item.id === editingAvatarId
      );

      if (avatar) {
        avatar.name = name;
        avatar.ghostColor = avatarChoices.ghostColor;
        avatar.eyeColor = avatarChoices.eyeColor;
        avatar.mouth = avatarChoices.mouth;
        avatar.accessories =
          avatarChoices.accessories.map(accessory => ({
            ...accessory
          }));
      }

      alert("Avatar updated.");
    } else {
      const avatar = {
        id: createId(),
        name,
        ghostColor: avatarChoices.ghostColor,
        eyeColor: avatarChoices.eyeColor,
        mouth: avatarChoices.mouth,
        accessories:
          avatarChoices.accessories.map(accessory => ({
            ...accessory
          }))
      };

      avatars.push(avatar);
      competitionSelection.add(avatar.id);

      alert("Avatar created.");
    }

    saveData();
    cancelEditingAvatar();
    refreshPage();
  });
}


  updateAccessoryButtonStates();
  updateAccessoryColorStates();
  updateAvatarPreview();

  const submitButton = avatarForm?.querySelector(
    'button[type="submit"]'
  );

  if (submitButton) {
    submitButton.textContent = "Create avatar";
  }

  document
    .querySelector("#cancel-avatar-edit")
    ?.remove();
}

function addAvatarCancelButton() {
  if (!avatarForm || editingAvatarId === null) {
    return;
  }

  if (document.querySelector("#cancel-avatar-edit")) {
    return;
  }

  const cancelButton = document.createElement("button");

  cancelButton.type = "button";
  cancelButton.id = "cancel-avatar-edit";
  cancelButton.className = "cancel-button";
  cancelButton.textContent = "Cancel avatar editing";

  cancelButton.addEventListener(
    "click",
    cancelEditingAvatar
  );

  avatarForm.appendChild(cancelButton);
}


function displayComparisonOptions() {
  if (!avatarOneSelect || !avatarTwoSelect) {
    return;
  }

  const options = avatars.map(avatar => `
    <option value="${escapeHTML(avatar.id)}">
      ${escapeHTML(avatar.name)}
    </option>
  `).join("");

  avatarOneSelect.innerHTML = options;
  avatarTwoSelect.innerHTML = options;

  if (avatars.length > 1) {
    avatarTwoSelect.selectedIndex = 1;
  }
}

/* -----------------------------
   Competition form
----------------------------- */

function displayPointsFields() {
  if (!pointsFields) {
    return;
  }

  if (avatars.length === 0) {
    pointsFields.innerHTML =
      "<p>Create an avatar first.</p>";
    return;
  }

  pointsFields.innerHTML = avatars.map(avatar => {
    const selected =
      competitionSelection.has(avatar.id);

    return `
      <div class="points-row">
        <label>
          <input
            type="checkbox"
            class="competition-avatar-checkbox"
            data-competition-avatar="${escapeHTML(
              avatar.id
            )}"
            ${selected ? "checked" : ""}
          >

          ${escapeHTML(avatar.name)}
        </label>

        <input
          class="avatar-points"
          data-avatar-id="${escapeHTML(avatar.id)}"
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

document.addEventListener("change", event => {
  const checkbox = event.target.closest(
    "[data-competition-avatar]"
  );

  if (!checkbox) {
    return;
  }

  const avatarId =
    checkbox.dataset.competitionAvatar;

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

if (entryForm) {
  entryForm.addEventListener("submit", event => {
    event.preventDefault();

    if (avatars.length < 2) {
      alert(
        "You need at least two avatars for a competition."
      );
      return;
    }

    const typeInput = document.querySelector(
      "#competition-type"
    );

    const dateInput = document.querySelector(
      "#competition-date"
    );

    const notesInput = document.querySelector(
      "#competition-notes"
    );

    const results = [
      ...document.querySelectorAll(".avatar-points")
    ]
      .filter(input =>
        competitionSelection.has(input.dataset.avatarId)
      )
      .map(input => ({
        avatarId: input.dataset.avatarId,
        points: Number(input.value || 0)
      }));

    if (results.length < 2) {
      alert(
        "Select at least two avatars for the competition."
      );
      return;
    }

    const updatedEntry = {
      id: editingEntryId || createId(),
      type: typeInput?.value.trim() || "Competition",
      date: dateInput?.value || "",
      notes: notesInput?.value.trim() || "",
      results
    };

    if (editingEntryId) {
      const index = entries.findIndex(
        entry => entry.id === editingEntryId
      );

      if (index !== -1) {
        entries[index] = updatedEntry;
      }

      alert("Competition updated.");
    } else {
      entries.push(updatedEntry);
      alert("Competition created.");
    }

    saveData();
    cancelEditingEntry();
    refreshPage();
  });
}


    const typeInput = document.querySelector(
      "#competition-type"
    );

    const dateInput = document.querySelector(
      "#competition-date"
    );

    const notesInput = document.querySelector(
      "#competition-notes"
    );

    entries.push({
      id: createId(),
      type: typeInput?.value.trim() || "Competition",
      date: dateInput?.value || "",
      notes: notesInput?.value.trim() || "",
      results
    });

    saveData();

    competitionSelection.clear();

    entryForm.reset();

    avatars.forEach(avatar => {
      competitionSelection.add(avatar.id);
    });

    refreshPage();
  });
}

/* -----------------------------
   Competition filters
----------------------------- */

function displayCompetitionFilters() {
  if (
    !competitionAvatarFilter ||
    !competitionTypeFilter
  ) {
    return;
  }

  const selectedAvatarValues = [
    ...competitionAvatarFilter.selectedOptions
  ].map(option => option.value);

  const selectedTypeValues = [
    ...competitionTypeFilter.selectedOptions
  ].map(option => option.value);

  const types = [
    ...new Set(
      entries
        .map(entry => String(entry.type || "").trim())
        .filter(Boolean)
    )
  ].sort();

  competitionAvatarFilter.innerHTML = `
    <option value="all">All avatars</option>

    ${avatars.map(avatar => `
      <option value="${escapeHTML(avatar.id)}">
        ${escapeHTML(avatar.name)}
      </option>
    `).join("")}
  `;

  competitionTypeFilter.innerHTML = types.map(type => `
    <option value="${escapeHTML(type)}">
      ${escapeHTML(type)}
    </option>
  `).join("");

  [...competitionAvatarFilter.options]
    .forEach(option => {
      option.selected =
        selectedAvatarValues.includes(option.value);
    });

  [...competitionTypeFilter.options]
    .forEach(option => {
      option.selected =
        selectedTypeValues.includes(option.value);
    });
}

function displayEntries() {
  if (!entryList) {
    return;
  }

  if (!competitionsAreVisible) {
    entryList.innerHTML = `
      <p>
        Select avatars or competition types, then click
        “Display competitions.”
      </p>
    `;
    return;
  }

  const selectedAvatarValues = [
    ...competitionAvatarFilter.selectedOptions
  ].map(option => option.value);

  const selectedTypeValues = [
    ...competitionTypeFilter.selectedOptions
  ].map(option => option.value);

  const allAvatarsSelected =
    selectedAvatarValues.includes("all");

  const selectedAvatarIds = new Set(
    selectedAvatarValues.filter(value => value !== "all")
  );

  const selectedTypes = new Set(selectedTypeValues);

  const hasAvatarFilter =
    !allAvatarsSelected &&
    selectedAvatarIds.size > 0;

  const hasTypeFilter =
    selectedTypes.size > 0;

  if (!hasAvatarFilter && !hasTypeFilter) {
    entryList.innerHTML = `
      <p>
        Select at least one avatar or competition type.
      </p>
    `;
    return;
  }

  const filteredEntries = entries
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
        selectedTypes.has(
          String(entry.type || "").trim()
        );

      return matchesAvatar && matchesType;
    })
    .sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

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
        <strong>
          ${Number(result.points || 0)} points
        </strong>
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

         <div class="entry-actions">
           <button
             type="button"
             class="edit-entry-button"
             data-edit-entry="${escapeHTML(entry.id)}"
           >
             Edit competition
           </button>
         
           <button
             type="button"
             class="delete-entry-button"
             data-delete-entry="${escapeHTML(entry.id)}"
           >
             Delete competition
           </button>
         </div>

        </div>
      </details>
    `;
  }).join("");
}

competitionTypeFilter?.addEventListener(
  "change",
  displayEntries
);

competitionAvatarFilter?.addEventListener(
  "change",
  event => {
    const select = event.currentTarget;
    const allOption = [...select.options].find(
      option => option.value === "all"
    );

    if (allOption) {
      const selectedValues = [
        ...select.selectedOptions
      ].map(option => option.value);

      if (selectedValues.includes("all")) {
        [...select.options].forEach(option => {
          option.selected = option.value === "all";
        });
      } else if (
        selectedValues.length ===
        select.options.length - 1
      ) {
        [...select.options].forEach(option => {
          option.selected = option.value === "all";
        });
      }
    }

    displayEntries();
  }
);

displayCompetitionsButton?.addEventListener(
  "click",
  () => {
    const hasAvatarFilter =
      competitionAvatarFilter.selectedOptions.length > 0;

    const hasTypeFilter =
      competitionTypeFilter.selectedOptions.length > 0;

    if (!hasAvatarFilter && !hasTypeFilter) {
      competitionsAreVisible = false;
      displayEntries();
      return;
    }

    competitionsAreVisible = true;
    displayEntries();
  }
);

clearCompetitionFilters?.addEventListener(
  "click",
  () => {
    [...competitionAvatarFilter.options].forEach(option => {
      option.selected = false;
    });

    [...competitionTypeFilter.options].forEach(option => {
      option.selected = false;
    });

    competitionsAreVisible = false;
    displayEntries();
  }
);

/* -----------------------------
   Avatar creation
----------------------------- */

if (avatarForm) {
  avatarForm.addEventListener("submit", event => {
    event.preventDefault();

    const nameInput = document.querySelector(
      "#avatar-name"
    );

    const name = nameInput?.value.trim();

    if (!name) {
      return;
    }

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

/* -----------------------------
   Comparison
----------------------------- */

compareButton?.addEventListener("click", () => {
  if (!comparisonResult) {
    return;
  }

  const firstId = avatarOneSelect?.value;
  const secondId = avatarTwoSelect?.value;

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

  if (!firstAvatar || !secondAvatar) {
    return;
  }

  const firstTotal = calculateTotalPoints(firstId);
  const secondTotal = calculateTotalPoints(secondId);
  const difference = Math.abs(
    firstTotal - secondTotal
  );

  let message;

  if (firstTotal > secondTotal) {
    message =
      `${firstAvatar.name} is ahead by ` +
      `${difference} points.`;
  } else if (secondTotal > firstTotal) {
    message =
      `${secondAvatar.name} is ahead by ` +
      `${difference} points.`;
  } else {
    message = "The avatars are tied.";
  }

  comparisonResult.innerHTML = `
    <p>
      ${escapeHTML(firstAvatar.name)}:
      ${firstTotal} points
    </p>

    <p>
      ${escapeHTML(secondAvatar.name)}:
      ${secondTotal} points
    </p>

    <p>${escapeHTML(message)}</p>
  `;
});

/* -----------------------------
   Delete functions
----------------------------- */

function deleteAvatar(avatarId) {
  const avatar = avatars.find(
    item => item.id === avatarId
  );

  if (!avatar) {
    return;
  }

  const confirmed = confirm(
    `Delete "${avatar.name}"? This cannot be undone.`
  );

  if (!confirmed) {
    return;
  }

  avatars = avatars.filter(
    item => item.id !== avatarId
  );

  entries = entries
    .map(entry => ({
      ...entry,
      results: Array.isArray(entry.results)
        ? entry.results.filter(
            result => result.avatarId !== avatarId
          )
        : []
    }))
    .filter(entry => entry.results.length > 0);

  competitionSelection.delete(avatarId);

  saveData();
  refreshPage();
}

function deleteEntry(entryId) {
  const entry = entries.find(
    item => item.id === entryId
  );

  if (!entry) {
    return;
  }

  const confirmed = confirm(
    "Delete this competition? This cannot be undone."
  );

  if (!confirmed) {
    return;
  }

  entries = entries.filter(
    item => item.id !== entryId
  );

  saveData();
  refreshPage();
}

function startEditingEntry(entryId) {
  const entry = entries.find(item => item.id === entryId);

  if (!entry) {
    return;
  }

  editingEntryId = entryId;

  const typeInput = document.querySelector(
    "#competition-type"
  );

  const dateInput = document.querySelector(
    "#competition-date"
  );

  const notesInput = document.querySelector(
    "#competition-notes"
  );

  if (typeInput) {
    typeInput.value = entry.type || "";
  }

  if (dateInput) {
    dateInput.value = entry.date || "";
  }

  if (notesInput) {
    notesInput.value = entry.notes || "";
  }

  const resultMap = new Map(
    (entry.results || []).map(result => [
      result.avatarId,
      result.points
    ])
  );

  competitionSelection.clear();

  avatars.forEach(avatar => {
    const checkbox = document.querySelector(
      `[data-competition-avatar="${avatar.id}"]`
    );

    const pointsInput = document.querySelector(
      `.avatar-points[data-avatar-id="${avatar.id}"]`
    );

    const hasResult = resultMap.has(avatar.id);

    if (hasResult) {
      competitionSelection.add(avatar.id);
    }

    if (checkbox) {
      checkbox.checked = hasResult;
    }

    if (pointsInput) {
      pointsInput.disabled = !hasResult;
      pointsInput.value = hasResult
        ? resultMap.get(avatar.id)
        : 0;
    }
  });

  const submitButton = entryForm?.querySelector(
    'button[type="submit"]'
  );

  if (submitButton) {
    submitButton.textContent =
      "Save competition changes";
  }

  addEntryCancelButton();

  entryForm?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function cancelEditingEntry() {
  editingEntryId = null;

  if (entryForm) {
    entryForm.reset();
  }

  competitionSelection.clear();

  avatars.forEach(avatar => {
    competitionSelection.add(avatar.id);
  });

  const submitButton = entryForm?.querySelector(
    'button[type="submit"]'
  );

  if (submitButton) {
    submitButton.textContent = "Save competition";
  }

  document
    .querySelector("#cancel-entry-edit")
    ?.remove();

  displayPointsFields();
}

function addEntryCancelButton() {
  if (!entryForm || editingEntryId === null) {
    return;
  }

  if (document.querySelector("#cancel-entry-edit")) {
    return;
  }

  const cancelButton = document.createElement("button");

  cancelButton.type = "button";
  cancelButton.id = "cancel-entry-edit";
  cancelButton.className = "cancel-button";
  cancelButton.textContent =
    "Cancel competition editing";

  cancelButton.addEventListener(
    "click",
    cancelEditingEntry
  );

  entryForm.appendChild(cancelButton);
}


document.addEventListener("click", event => {
  const editAvatarButton = event.target.closest(
    "[data-edit-avatar]"
  );

  if (editAvatarButton) {
    startEditingAvatar(
      editAvatarButton.dataset.editAvatar
    );
    return;
  }

  const deleteAvatarButton = event.target.closest(
    "[data-delete-avatar]"
  );

  if (deleteAvatarButton) {
    deleteAvatar(
      deleteAvatarButton.dataset.deleteAvatar
    );
    return;
  }

  const editEntryButton = event.target.closest(
    "[data-edit-entry]"
  );

  if (editEntryButton) {
    startEditingEntry(
      editEntryButton.dataset.editEntry
    );
    return;
  }

  const deleteEntryButton = event.target.closest(
    "[data-delete-entry]"
  );

  if (deleteEntryButton) {
    deleteEntry(
      deleteEntryButton.dataset.deleteEntry
    );
  }
});


/* -----------------------------
   Chart
----------------------------- */

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
  if (
    !chartCanvas ||
    typeof Chart === "undefined"
  ) {
    return;
  }

  const labels = [
    ...new Set(entries.map(entry => entry.date))
  ].filter(Boolean).sort();

  const datasets = avatars.map((avatar, index) => {
    let runningTotal = 0;

    const data = labels.map(date => {
      entries
        .filter(entry => entry.date === date)
        .forEach(entry => {
          const results = Array.isArray(entry.results)
            ? entry.results
            : [];

          const result = results.find(
            item => item.avatarId === avatar.id
          );

          if (result) {
            runningTotal += Number(result.points || 0);
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

  pointsChart = new Chart(
    chartCanvas.getContext("2d"),
    {
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
    }
  );
}

/* -----------------------------
   Refresh
----------------------------- */

function refreshPage() {
  displayAvatars();
  displayPointsFields();
  displayComparisonOptions();
  displayCompetitionFilters();
  displayEntries();
  updateChart();
}

/* -----------------------------
   Initialisation
----------------------------- */

updateAccessoryButtonStates();
updateAccessoryColorStates();
updateAvatarPreview();
refreshPage();
