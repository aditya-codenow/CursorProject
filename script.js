const $ = (sel) => document.querySelector(sel);

function setText(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
}

function showResult(message, tone = "ok") {
  const result = $("#result");
  if (!result) return;
  result.hidden = false;
  result.textContent = message;
  result.style.borderColor = tone === "ok" ? "rgba(34, 197, 94, 0.25)" : "rgba(255, 107, 107, 0.35)";
  result.style.background = tone === "ok" ? "rgba(34, 197, 94, 0.08)" : "rgba(255, 107, 107, 0.10)";
  result.style.color = tone === "ok" ? "rgba(220, 252, 231, 0.95)" : "rgba(255, 228, 230, 0.96)";
}

function hideResult() {
  const result = $("#result");
  if (!result) return;
  result.hidden = true;
  result.textContent = "";
}

function clearErrors() {
  setText("sourceError", "");
  setText("destinationError", "");
  setText("dateError", "");
  setText("timeError", "");
}

function validate({ source, destination, date, time }) {
  const errors = {};

  if (!String(source ?? "").trim()) errors.source = "Please select a source.";
  if (!String(destination ?? "").trim()) errors.destination = "Please select a destination.";

  if (
    String(source ?? "").trim() &&
    String(destination ?? "").trim() &&
    String(source).trim().toLowerCase() === String(destination).trim().toLowerCase()
  ) {
    errors.destination = "Destination must be different from source.";
  }

  if (!date) errors.date = "Please select a date.";
  if (!time) errors.time = "Please select a time.";

  // If date & time are set, ensure scheduled datetime is not in the past.
  if (date && time) {
    const scheduled = new Date(`${date}T${time}`);
    const now = new Date();
    if (!Number.isNaN(scheduled.getTime()) && scheduled.getTime() < now.getTime() - 60_000) {
      errors.time = "Selected time looks in the past. Please choose a future time.";
    }
  }

  return errors;
}

function readForm() {
  const source = $("#source")?.value ?? "";
  const destination = $("#destination")?.value ?? "";
  const date = $("#date")?.value ?? "";
  const time = $("#time")?.value ?? "";
  const rideType = $("#rideType")?.value ?? "Sedan";

  return { source, destination, date, time, rideType };
}

function setSelectOptions(selectEl, locations) {
  if (!selectEl) return;
  const current = selectEl.value;
  selectEl.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = "Select a location";
  selectEl.appendChild(placeholder);

  for (const loc of locations) {
    const opt = document.createElement("option");
    opt.value = loc.name;
    opt.textContent = loc.name;
    selectEl.appendChild(opt);
  }

  // Try to restore previous selection if still present
  if (current && locations.some((l) => l.name === current)) {
    selectEl.value = current;
  }
}

async function loadLocations() {
  const sourceEl = $("#source");
  const destEl = $("#destination");
  try {
    const res = await fetch("/api/locations", { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const locations = Array.isArray(data.locations) ? data.locations : [];
    if (!locations.length) throw new Error("No locations found");

    setSelectOptions(sourceEl, locations);
    setSelectOptions(destEl, locations);
  } catch (err) {
    if (sourceEl) {
      sourceEl.innerHTML = `<option value="" selected disabled>Unable to load locations</option>`;
      sourceEl.disabled = true;
    }
    if (destEl) {
      destEl.innerHTML = `<option value="" selected disabled>Unable to load locations</option>`;
      destEl.disabled = true;
    }
    showResult("Could not load locations. Please start the Node server and refresh.", "error");
  }
}

function resetForm() {
  const form = $("#bookingForm");
  form?.reset();
  clearErrors();
  hideResult();
  $("#source")?.focus();
}

function formatDateTime(date, time) {
  try {
    const d = new Date(`${date}T${time}`);
    if (Number.isNaN(d.getTime())) return `${date} ${time}`;
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return `${date} ${time}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const form = $("#bookingForm");
  const resetBtn = $("#resetBtn");

  const today = new Date();
  const yyyy = String(today.getFullYear());
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dateMin = `${yyyy}-${mm}-${dd}`;
  const dateInput = $("#date");
  if (dateInput) {
    dateInput.min = dateMin;
    if (!dateInput.value) dateInput.value = dateMin;
  }

  const timeInput = $("#time");
  if (timeInput && !timeInput.value) {
    const t = new Date(today.getTime());
    t.setMinutes(t.getMinutes() + 15);
    const hh = String(t.getHours()).padStart(2, "0");
    const mi = String(t.getMinutes()).padStart(2, "0");
    timeInput.value = `${hh}:${mi}`;
  }

  loadLocations();

  resetBtn?.addEventListener("click", resetForm);

  ["#source", "#destination", "#date", "#time", "#rideType"].forEach((sel) => {
    const ev = sel === "#source" || sel === "#destination" || sel === "#rideType" ? "change" : "input";
    $(sel)?.addEventListener(ev, () => {
      clearErrors();
      hideResult();
    });
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    hideResult();

    const values = readForm();
    const errors = validate(values);

    setText("sourceError", errors.source ?? "");
    setText("destinationError", errors.destination ?? "");
    setText("dateError", errors.date ?? "");
    setText("timeError", errors.time ?? "");

    if (Object.keys(errors).length) {
      showResult("Please fix the highlighted fields and try again.", "error");
      const firstInvalid =
        (errors.source && $("#source")) ||
        (errors.destination && $("#destination")) ||
        (errors.date && $("#date")) ||
        (errors.time && $("#time"));
      firstInvalid?.focus?.();
      return;
    }

    const when = formatDateTime(values.date, values.time);
    showResult(
      `Confirmed: ${values.rideType} from "${values.source.trim()}" to "${values.destination.trim()}" on ${when}.`,
      "ok",
    );
  });
});
