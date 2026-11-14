/* WaitWith — waitlist only. Fill FORM_ENDPOINT and CONTACT_EMAIL before going live. */
const CONFIG = {
  // FormSubmit.co endpoint (Judah approved).
  FORM_ENDPOINT: "https://formsubmit.co/tidymargin08@gmail.com",
  // Footer contact and mailto (Judah approved).
  CONTACT_EMAIL: "tidymargin08@gmail.com",
  // Public site origin, no trailing slash, e.g. "https://<github-username>.github.io/<repo>".
  // Used for FormSubmit _next. Leave empty until the live URL is known; the thank-you then falls back to this page's #/thanks.
  SITE_BASE_URL: "https://tidymargin08-afk.github.io",
};

(function () {
  const AREAS = [
    "Toronto (downtown / midtown)",
    "North York",
    "Scarborough",
    "Etobicoke",
    "Mississauga",
    "Brampton",
    "Vaughan",
    "Markham / Richmond Hill",
    "Other Greater Toronto Area",
  ];

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function isAdmin() {
    return new URLSearchParams(location.search).get("admin") === "1";
  }
  function route() {
    const hash = (location.hash || "#/home").replace(/^#/, "");
    return hash.split("/").filter(Boolean)[0] || "home";
  }
  function contactLine() {
    if (CONFIG.CONTACT_EMAIL) {
      return 'Contact: <a href="mailto:' + escapeHtml(CONFIG.CONTACT_EMAIL) + '">' + escapeHtml(CONFIG.CONTACT_EMAIL) + "</a>";
    }
    return "Contact email will appear here once CONTACT_EMAIL is set in app.js.";
  }
  const PUBLIC_PATH = "waitwith/";

  function thankYouUrl() {
    const hash = "#/thanks";
    const base = String(CONFIG.SITE_BASE_URL || "").replace(/\/$/, "");
    if (base) return base + "/" + PUBLIC_PATH + hash;
    try {
      const u = new URL(location.href);
      u.search = "";
      u.hash = hash;
      return u.toString();
    } catch (e) {
      return hash;
    }
  }

  function formMetaFields(subject, product) {
    return (
      '<input type="hidden" name="_subject" value="' + escapeHtml(subject) + '" />' +
      '<input type="hidden" name="_template" value="table" />' +
      '<input type="hidden" name="product" value="' + escapeHtml(product) + '" />' +
      '<input type="hidden" name="_next" value="' + escapeHtml(thankYouUrl()) + '" />' +
      '<label class="hp" aria-hidden="true">Leave blank<input type="text" name="_honey" id="honey" tabindex="-1" autocomplete="off" /></label>'
    );
  }

  function header() {
    const adminBanner = isAdmin()
      ? '<div class="admin-flag" id="admin-flag">Local-only view (<code>?admin=1</code>). This is not a live operations dashboard. This site does not store waitlist entries on a server.</div>'
      : "";
    return (
      adminBanner +
      '<div class="rename-banner" id="status-banner"><strong>Waitlist only — not yet operating.</strong> WaitWith is a planned, non-medical appointment companion for seniors in the Greater Toronto Area. Insurance, a police vulnerable-sector check, and a privacy review are being completed first. This page does not take bookings or payments.</div>' +
      '<header class="app-header"><a class="brand" href="#/home"><strong>WaitWith</strong></a><nav>' +
      '<a href="#/home">Overview</a>' +
      '<a href="#/home#waitlist-form">Join the waitlist</a>' +
      '<a href="#/privacy">Privacy</a>' +
      "</nav></header>"
    );
  }

  function footer() {
    return (
      '<footer><div class="inner">' +
      "<div><h3>Contact</h3><p>" +
      contactLine() +
      "</p></div>" +
      "<div><h3>Privacy</h3><p>If you join the waitlist, we collect your name, email, GTA area, and any note you choose to add about a parent’s needs, so we can contact you if the service is able to start. Do not include health-card numbers or clinical detail. We do not sell this information. <a href=\"#/privacy\">Full note</a>.</p></div>" +
      "</div></footer>"
    );
  }

  function renderHome() {
    const areaOptions = AREAS.map((a) => '<option value="' + escapeHtml(a) + '">' + escapeHtml(a) + "</option>").join("");
    const formAction = CONFIG.FORM_ENDPOINT ? ' action="' + escapeHtml(CONFIG.FORM_ENDPOINT) + '" method="POST"' : "";
    const connectedNote = CONFIG.FORM_ENDPOINT
      ? '<p class="hint" id="form-connected-note">This form sends to the operator’s inbox.</p>'
      : '<p class="notice warn" id="form-unconnected-note">The waitlist form is not connected yet on this copy. Submissions are not being collected until FORM_ENDPOINT is set in app.js.</p>';

    return (
      header() +
      "<main><section class=\"hero\"><div class=\"flags\"><span class=\"flag warn\">Waitlist only</span><span class=\"flag\">Non-medical</span><span class=\"flag\">Not yet operating</span></div>" +
      "<h1>A companion for a parent’s appointment — when we are ready to offer it.</h1>" +
      '<p class="lede">If it goes ahead, WaitWith would be a bookable, non-medical companion for seniors in the GTA, arranged by an adult child who cannot always attend. The companion would meet the parent at home or the clinic, travel by TTC or taxi (the companion does not drive), wait, take plain-language notes, and send a written summary only with consent.</p></section>' +
      '<div class="card scope"><h2>What this is, and what it is not</h2><p>This is <strong>not</strong> home care, nursing, medical advice, advocacy as a legal representative, or a way to jump a clinic queue. It does not administer medication, interpret test results, or resell appointment slots.</p><p>The service is <strong>not yet operating</strong>. Insurance, a police vulnerable-sector check, and a privacy review are being completed first. Until those are done, this page is only a waitlist. There is no booking form, and no price is offered.</p></div>' +
      '<div class="card" id="waitlist-form"><h2>Join the waitlist</h2><p>Leave your contact details if you would like to hear whether WaitWith can start. Joining the waitlist is not a booking and does not place you in a queue for a specific date.</p>' +
      connectedNote +
      '<form id="waitlist-form-el" novalidate' +
      formAction +
      ">" +
      formMetaFields("WaitWith waitlist", "WaitWith") +
      '<label for="name">Name</label><input id="name" name="name" type="text" required maxlength="80" />' +
      '<label for="email">Email</label><input id="email" name="email" type="email" required />' +
      '<label for="area">GTA area</label><select id="area" name="area" required><option value="">Select an area</option>' +
      areaOptions +
      "</select>" +
      '<label for="needs">Parent’s needs (optional)</label><textarea id="needs" name="needs" maxlength="1500" placeholder="For example: help at a clinic visit, waiting and a plain-language summary. Do not include health-card numbers or clinical details."></textarea>' +
      '<label class="check"><input id="nonmedical" name="nonmedical" type="checkbox" value="yes" required /><div><strong>I understand this would be non-medical, and that WaitWith is not yet operating</strong></div></label>' +
      '<label class="check"><input id="consent" name="consent" type="checkbox" value="yes" required /><div><strong>I agree to be contacted about the WaitWith waitlist</strong><span class="hint">We will only use your details to follow up if the service is able to start. <a href="#/privacy">Privacy note</a>.</span></div></label>' +
      '<div id="form-status" class="form-status" hidden></div>' +
      '<button class="btn block" id="waitlist-submit" type="submit">Join the waitlist</button></form></div></main>' +
      footer()
    );
  }

  function renderPrivacy() {
    return (
      header() +
      '<main><article class="card" id="privacy-note"><h2>Privacy note</h2>' +
      "<p>This is a short note for a waitlist page, not a full legal policy. A fuller review is one of the steps being completed before any service could start.</p>" +
      "<ul>" +
      "<li>If you join the waitlist, we collect your name, email, GTA area, any optional note about a parent’s needs, and your consent to be contacted.</li>" +
      "<li>Please do not include health-card numbers, diagnoses, or other clinical detail in the optional note.</li>" +
      "<li>This static site does not keep a customer database. Once the form is connected, submissions go to the operator’s form inbox.</li>" +
      "<li>We do not sell your information, and we will not use it to offer a booking while the service is not operating.</li>" +
      "<li>To ask a question or request deletion of a submission, use the contact email in the footer once it is listed.</li>" +
      "</ul>" +
      '<p><a href="#/home">Back</a></p></article></main>' +
      footer()
    );
  }

  function renderThanks() {
    return (
      header() +
      '<main><div class="card" id="thanks"><h2>You’re on the waitlist</h2><p>Thank you. Your waitlist request has been sent. This is not a booking, and no visit has been scheduled. We will contact you only if WaitWith is able to start after insurance, the police check, and the privacy review are completed.</p><p><a href="#/home">Back to WaitWith</a></p></div></main>' +
      footer()
    );
  }

  function renderAdmin() {
    const row = (k, v) => "<tr><th>" + escapeHtml(k) + "</th><td>" + (v ? "Set" : "Empty (default)") + "</td></tr>";
    return (
      header() +
      '<main><div class="card" id="admin-view"><h2>Local config status</h2><p>This page only reports whether keys in <code>app.js</code> are filled. It does not list waitlist entries, and it does not mean the service is operating.</p>' +
      "<table><tbody>" +
      row("FORM_ENDPOINT", CONFIG.FORM_ENDPOINT) +
      row("CONTACT_EMAIL", CONFIG.CONTACT_EMAIL) +
      row("SITE_BASE_URL", CONFIG.SITE_BASE_URL) +
      "</tbody></table></div></main>" +
      footer()
    );
  }

  function showStatus(type, text) {
    const el = document.getElementById("form-status");
    if (!el) return;
    el.hidden = false;
    el.className = "form-status " + type;
    el.id = type === "warn" ? "form-not-connected" : "form-status";
    el.textContent = text;
  }

  function bindForm() {
    const form = document.getElementById("waitlist-form-el");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const area = form.area.value;
      const nonmedical = form.nonmedical.checked;
      const consent = form.consent.checked;
      if (!name || !email || !area || !nonmedical || !consent) {
        e.preventDefault();
        showStatus("bad", "Please add your name, email, GTA area, the non-medical acknowledgement, and contact consent.");
        return;
      }
      if (!CONFIG.FORM_ENDPOINT) {
        e.preventDefault();
        showStatus(
          "warn",
          "This form is not connected yet. No message was sent. The operator still needs to set FORM_ENDPOINT in app.js (a FormSubmit.co endpoint)."
        );
        return;
      }
    });
  }

  function render() {
    const app = document.getElementById("app");
    const r = route();
    if (isAdmin() && (r === "home" || r === "admin")) app.innerHTML = renderAdmin();
    else if (r === "privacy") app.innerHTML = renderPrivacy();
    else if (r === "thanks") app.innerHTML = renderThanks();
    else app.innerHTML = renderHome();
    bindForm();
  }

  window.addEventListener("hashchange", render);
  render();
})();
