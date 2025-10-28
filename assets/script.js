function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function addWeeks(date, weeks) {
  return addDays(date, weeks * 7);
}
function daysBetween(a, b) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const start = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const end = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((end - start) / msPerDay);
}
function formatDate(d, locale = "en-US") {
  return d.toLocaleDateString(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

// Use translations passed from PHP (via wp_localize_script)
const i18n = window.pregnancyCalculatorI18n || {};

// Get locale from i18n or default
const locale = i18n.locale || 'en_US';

// Convert WordPress locale to JavaScript locale format (e.g., 'de_DE' -> 'de-DE')
const jsLocale = locale.replace('_', '-');

document.addEventListener("DOMContentLoaded", () => {
  const calculator = document.querySelector(".pregnancy-calculator");
  const results = document.getElementById("pregnancy-results");
  const form = document.getElementById("pregnancy-form");
  const progressSection = document.getElementById("pregnancy-progress");
  const noteSection = document.getElementById("pregnancy-note");

  // Read data attributes for configuration
  const showProgressBar = calculator.getAttribute("data-show-progress-bar") !== "false";
  const showNote = calculator.getAttribute("data-show-note") !== "false";
  const showWeeksCount = calculator.getAttribute("data-show-weeks-count") !== "false";
  const alignment = calculator.getAttribute("data-alignment") || "center";
  
  // Read custom text values
  const customTitle = calculator.getAttribute("data-custom-title") || "";
  const customSubtitle = calculator.getAttribute("data-custom-subtitle") || "";
  const progressFillColor = calculator.getAttribute("data-progress-fill-color") || "";
  
  // Read progress text color (new attribute)
  const progressTextColor = calculator.getAttribute("data-progress-text-color") || "";
  const weeksCountColor = calculator.getAttribute("data-weeks-count-color") || "";
  
  // Read custom month names - PHP already passes translated month names
  const customMonthNames = calculator.getAttribute("data-month-names");
  let monthNames = [];
  if (customMonthNames) {
    try {
      monthNames = JSON.parse(customMonthNames);
    } catch (e) {
      // Silently fail and use fallback month names
    }
  }
  
  // Fallback to i18n translations if parsing failed or resulted in empty array
  if (!monthNames || monthNames.length === 0) {
    monthNames = [
      i18n.january, i18n.february, i18n.march, i18n.april, 
      i18n.may, i18n.june, i18n.july, i18n.august, 
      i18n.september, i18n.october, i18n.november, i18n.december
    ];
  }
  
  // Read placeholder texts - use i18n translations as fallback
  const placeholderDay = calculator.getAttribute("data-placeholder-day") || i18n.placeholderDay;
  const placeholderMonth = calculator.getAttribute("data-placeholder-month") || i18n.placeholderMonth;
  const placeholderYear = calculator.getAttribute("data-placeholder-year") || i18n.placeholderYear;
  
  // Read custom note text - use i18n translation as fallback
  const customNoteText = calculator.getAttribute("data-custom-note") || i18n.customNote;
  
  // Read note colors
  const noteBgColor = calculator.getAttribute("data-note-bg-color") || "";
  const noteTextColor = calculator.getAttribute("data-note-text-color") || "";
  
  // Read dropdown style
  const dropdownStyle = calculator.getAttribute("data-dropdown-style") || "light";
  const dropdownBgColor = calculator.getAttribute("data-dropdown-bg-color") || "";
  
  // Read validation message - use i18n translation as fallback
  const validationMessage = calculator.getAttribute("data-validation-message") || i18n.validationMessage;

  // Apply custom progress colors if specified
  function applyProgressColors() {
    if (progressFillColor) {
      const fillElements = document.querySelectorAll('.progress-fill, .fill');
      fillElements.forEach(element => {
        element.style.backgroundColor = progressFillColor;
      });
    }
    if (progressTextColor) {
      const textElements = document.querySelectorAll('.progress-text');
      textElements.forEach(element => {
        element.style.color = progressTextColor;
      });
    }
  }

  const daySelect = document.getElementById("lmp-day");
  const monthSelect = document.getElementById("lmp-month");
  const yearSelect = document.getElementById("lmp-year");

  // Add placeholder for days
  const dayPlaceholder = document.createElement("option");
  dayPlaceholder.value = "";
  dayPlaceholder.textContent = placeholderDay;
  dayPlaceholder.disabled = true;
  dayPlaceholder.selected = true;
  daySelect.appendChild(dayPlaceholder);

  // Days 1-31
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    daySelect.appendChild(opt);
  }

  // Add placeholder for months
  const monthPlaceholder = document.createElement("option");
  monthPlaceholder.value = "";
  monthPlaceholder.textContent = placeholderMonth;
  monthPlaceholder.disabled = true;
  monthPlaceholder.selected = true;
  monthSelect.appendChild(monthPlaceholder);

  // Populate months with translated names
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = monthNames[m - 1];
    monthSelect.appendChild(opt);
  }

  // Add placeholder for years
  const yearPlaceholder = document.createElement("option");
  yearPlaceholder.value = "";
  yearPlaceholder.textContent = placeholderYear;
  yearPlaceholder.disabled = true;
  yearPlaceholder.selected = true;
  yearSelect.appendChild(yearPlaceholder);

  // Only current year and previous year
  const thisYear = new Date().getFullYear();
  for (let y = thisYear; y >= thisYear - 1; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }

  // Apply dropdown styling based on dark/light mode
  function applyDropdownStyles() {
    const selects = [daySelect, monthSelect, yearSelect];
    selects.forEach(select => {
      // Custom background color takes priority
      if (dropdownBgColor) {
        select.style.backgroundColor = dropdownBgColor;
      } else if (dropdownStyle === 'dark') {
        select.style.backgroundColor = '#2c3e50';
      } else {
        select.style.backgroundColor = '#fff';
      }
      
      // Text color based on style
      if (dropdownStyle === 'dark') {
        select.style.color = '#fff';
        select.style.border = '1px solid #34495e';
      } else {
        select.style.color = '#333';
        select.style.border = '1px solid #ccc';
      }
    });
  }

  // Initial setup
  applyProgressColors();
  applyDropdownStyles();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const day = parseInt(daySelect.value, 10);
    const month = parseInt(monthSelect.value, 10);
    const year = parseInt(yearSelect.value, 10);
    
    // Check if any field is empty (NaN means empty or invalid)
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      results.innerHTML = `<p class="error" style="color: #d32f2f; padding: 15px; background-color: #ffebee; border-radius: 4px; margin: 10px 0;">${validationMessage}</p>`;
      results.style.display = "block";
      return;
    }
    
    const lmp = new Date(year, month - 1, day);

    if (isNaN(lmp.getTime())) {
      results.innerHTML = `<p class="error" style="color: #d32f2f; padding: 15px; background-color: #ffebee; border-radius: 4px; margin: 10px 0;">${i18n.invalidDate}</p>`;
      results.style.display = "block";
      return;
    }

    const today = new Date();
    const EDD = addDays(lmp, 280);
    const conception = addDays(lmp, 14);
    const t1 = lmp;
    const t2 = addWeeks(lmp, 14);
    const t3 = addWeeks(lmp, 28);

    const totalDays = 280;
    const elapsed = Math.max(0, Math.min(totalDays, daysBetween(lmp, today)));
    const remaining = totalDays - elapsed;
    const progressPct = Math.round((elapsed / totalDays) * 100);

    const monthsLeft = Math.floor(remaining / 30.44);
    const daysLeft = Math.round(remaining - monthsLeft * 30.44);

    // Build results HTML based on configuration
    let resultsHTML = `<div class="box">
        <h3>${i18n.due}</h3>
        <p><strong>${formatDate(EDD, jsLocale)}</strong></p>
      </div>`;

    // Add stages section
    resultsHTML += `<div class="box">
        <h3>${i18n.stages}</h3>
        <ul>
          <li>${i18n.lastCycle} <strong>${formatDate(t1, jsLocale)}</strong></li>
          <li>${i18n.conception} <strong>${formatDate(conception, jsLocale)}</strong></li>
          <li>${i18n.t1} <strong>${formatDate(t1, jsLocale)}</strong></li>
          <li>${i18n.t2} <strong>${formatDate(t2, jsLocale)}</strong></li>
          <li>${i18n.t3} <strong>${formatDate(t3, jsLocale)}</strong></li>
        </ul>
      </div>`;

    results.innerHTML = resultsHTML;

    // Handle progress section (separate from results)
    if (progressSection) {
      if (showProgressBar) {
        const weeksStyle = weeksCountColor ? `style="color: ${weeksCountColor}"` : '';
        const progressText = showWeeksCount ? 
          `${i18n.left} <strong ${weeksStyle}>${monthsLeft}</strong> ${i18n.months} <strong ${weeksStyle}>${daysLeft}</strong> ${i18n.days}` :
          `${i18n.progress}: ${progressPct}%`;
        
        // Apply colors with fallbacks - use 'background' instead of 'background-color' to override CSS gradient
        const fillStyle = progressFillColor ? `background: ${progressFillColor}` : 'background: linear-gradient(90deg, #007cba, #0056b3)';
        const textStyle = progressTextColor ? `color: ${progressTextColor}` : '';
        
        progressSection.innerHTML = `
          <div class="progress-bar">
            <div class="progress-fill" style="width:${progressPct}%; ${fillStyle}"></div>
          </div>
          <p class="progress-text" style="${textStyle}">${progressText}</p>
        `;
        progressSection.style.display = "block";
      } else {
        progressSection.style.display = "none";
      }
    }

    // Handle note section
    if (showNote && noteSection) {
      const noteBgStyle = noteBgColor ? `background-color: ${noteBgColor}` : '';
      const noteTextStyle = noteTextColor ? `color: ${noteTextColor}` : '';
      noteSection.innerHTML = `<p class="note-text" style="${noteTextStyle}">${customNoteText}</p>`;
      if (noteBgColor) {
        noteSection.style.backgroundColor = noteBgColor;
      }
      noteSection.style.display = "block";
    } else if (noteSection) {
      noteSection.style.display = "none";
    }
  });
});
