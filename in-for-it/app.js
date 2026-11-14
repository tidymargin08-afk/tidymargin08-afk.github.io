/* In For It — static site. Fill the CONFIG keys below before going live. */
const CONFIG = {
  // FormSubmit.co endpoint (Judah approved).
  FORM_ENDPOINT: "https://formsubmit.co/tidymargin08@gmail.com",
  // Stripe Payment Link. Leave empty — there is no Stripe account yet.
  PAYMENT_LINK_URL: "",
  // Interac e-Transfer recipient phone number (Judah approved, Nov 14).
  ETRANSFER_EMAIL: "226-280-5785",
  // Footer contact and mailto (Judah approved).
  CONTACT_EMAIL: "tidymargin08@gmail.com",
  // Public site origin, no trailing slash, e.g. "https://<github-username>.github.io/<repo>".
  // Used for FormSubmit _next. Leave empty until the live URL is known; the thank-you then falls back to this page's #/thanks.
  SITE_BASE_URL: "https://tidymargin08-afk.github.io",
};

(function () {
  const SESSIONS = [
    {
      id: "thu-beginner",
      title: "Thursday beginner doubles",
      level: "Beginner",
      womenOnly: false,
      venue: "Candidate venue: Rosedale Park outdoor courts (public park)",
      address: "20 Scholfield Ave, Toronto",
      note: "First session forming. This time has not been booked, and court availability (including in winter) is not confirmed.",
    },
    {
      id: "sat-intermediate",
      title: "Saturday intermediate rally",
      level: "Intermediate",
      womenOnly: false,
      venue: "Candidate venue: Christie Pits Park outdoor courts (public park)",
      address: "750 Bloor St W, Toronto",
      note: "First session forming. This time has not been booked, and court availability is not confirmed.",
    },
    {
      id: "sun-women",
      title: "Sunday women-only beginners",
      level: "Beginner",
      womenOnly: true,
      venue: "Candidate venue: Withrow Park outdoor courts (public park)",
      address: "725 Logan Ave, Toronto",
      note: "First session forming. This women-only option is planned, not scheduled. The court has not been booked.",
    },
  ];

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function isAdmin() {
    return new URLSearchParams(location.search).get("admin") === "1";
  }
  function route() {
    const hash = (location.hash || "#/sessions").replace(/^#/, "");
    return hash.split("/").filter(Boolean)[0] || "sessions";
  }
  function contactLine() {
    if (CONFIG.CONTACT_EMAIL) {
      return 'Contact: <a href="mailto:' + escapeHtml(CONFIG.CONTACT_EMAIL) + '">' + escapeHtml(CONFIG.CONTACT_EMAIL) + "</a>";
    }
    return "Contact email will appear here once CONTACT_EMAIL is set in app.js.";
  }
  const PUBLIC_PATH = "in-for-it/";
  const PLANNED_FEE = "CA$12";

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
      '<input type="hidden" name="_captcha" value="false" />' +
      '<input type="hidden" name="product" value="' + escapeHtml(product) + '" />' +
      '<input type="hidden" name="_next" value="' + escapeHtml(thankYouUrl()) + '" />' +
      '<label class="hp" aria-hidden="true">Leave blank<input type="text" name="_honey" id="honey" tabindex="-1" autocomplete="off" /></label>'
    );
  }

  function paymentConfigured() {
    return Boolean(CONFIG.PAYMENT_LINK_URL || CONFIG.ETRANSFER_EMAIL);
  }

  function refundBeforePayment() {
    return (
      '<div class="flash warn" id="refund-before-payment"><strong>Please read the refund policy first.</strong> You get a full refund if the session does not run. If you cancel after a court has been booked against your place, we may not be able to refund a fee already passed through to the venue. <a href=\"#/policy\">Full draft</a>.</div>'
    );
  }

  function interacInstructions() {
    if (!CONFIG.ETRANSFER_EMAIL) return "";
    return (
      '<div id="etransfer-instructions">' +
      '<p>The planned fee is <strong id="planned-fee">' +
      PLANNED_FEE +
      " per spot (planned)</strong>.</p>" +
      '<p id="etransfer-do-not-pay"><strong>Do not send money until we email you that a court is booked.</strong> No court is booked yet. Once we confirm a booking by email, send ' +
      PLANNED_FEE +
      ' by Interac e-Transfer to <strong id="etransfer-email">' +
      escapeHtml(CONFIG.ETRANSFER_EMAIL) +
      "</strong>, and put the session name and your own name in the message. You get a full refund if the session does not run. We confirm by email.</p></div>"
    );
  }

  function header() {
    const adminBanner = isAdmin()
      ? '<div class="admin-flag" id="admin-flag">Local-only view (<code>?admin=1</code>). This is not a live organiser dashboard. This site does not store sign-ups on a server.</div>'
      : "";
    return (
      adminBanner +
      '<div class="demo-banner"><strong>First session forming.</strong> Court times have not been booked and no session fee is being charged yet. Example player counts are not shown, because none are real.</div>' +
      '<header class="app-header"><a class="brand" href="#/sessions"><strong>In <em>For</em> It</strong><span>Toronto pickleball · not dating</span></a><nav>' +
      '<a href="#/sessions">Sessions</a>' +
      '<a href="#/sessions#interest-form">Register interest</a>' +
      '<a href="#/conduct">Code of conduct</a>' +
      '<a href="#/policy">Refund policy</a>' +
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
      "<div><h3>Privacy</h3><p>If you submit the interest form, we collect your name, email, neighbourhood, and the session you asked about, so we can contact you when a first session is confirmed. We do not sell this information. <a href=\"#/privacy\">Full note</a>.</p></div>" +
      "<div><h3>Refunds</h3><p>A draft refund policy applies once a paid session is confirmed. <a href=\"#/policy\">Read the draft</a>.</p></div>" +
      "</div></footer>"
    );
  }

  function paymentBlock() {
    if (!paymentConfigured()) {
      return (
        '<section class="card" id="payment-step" data-payment-state="closed" style="margin-top:20px">' +
        "<h2>Payment</h2>" +
        '<p id="payment-closed-message">Payments open once a court is booked; we will email you before anyone should send money.</p></section>'
      );
    }
    const card = CONFIG.PAYMENT_LINK_URL
      ? '<p><a class="btn" id="payment-link" href="' +
        escapeHtml(CONFIG.PAYMENT_LINK_URL) +
        '" target="_blank" rel="noopener noreferrer">Pay with card (secure payment link)</a></p>'
      : "";
    return (
      '<section class="card" id="payment-step" data-payment-state="open" style="margin-top:20px">' +
      "<h2>How payment will work</h2>" +
      refundBeforePayment() +
      interacInstructions() +
      card +
      "</section>"
    );
  }

  function renderSessions() {
    const cards = SESSIONS.map((s) => {
      return (
        '<article class="session" data-session="' +
        s.id +
        '"><div><div class="pills"><span class="pill ball">' +
        escapeHtml(s.level) +
        "</span>" +
        (s.womenOnly ? '<span class="pill women">Women-only (planned)</span>' : "") +
        '<span class="pill">First session forming</span></div><h3>' +
        escapeHtml(s.title) +
        '</h3><p class="meta">' +
        escapeHtml(s.venue) +
        "<br>" +
        escapeHtml(s.address) +
        "<br>" +
        escapeHtml(s.note) +
        "</p><p class=\"meta planned-fee\">" +
        PLANNED_FEE +
        " per spot (planned)</p></div><div><a class=\"btn secondary\" href=\"#/sessions#interest-form\" data-session-pick=\"" +
        s.id +
        '">I\'m interested</a></div></article>'
      );
    }).join("");

    const sessionOptions = SESSIONS.map((s) => {
      return '<option value="' + escapeHtml(s.title) + '">' + escapeHtml(s.title) + (s.womenOnly ? " (women-only, planned)" : "") + "</option>";
    }).join("");

    const formAction = CONFIG.FORM_ENDPOINT ? ' action="' + escapeHtml(CONFIG.FORM_ENDPOINT) + '" method="POST"' : "";
    const connectedNote = CONFIG.FORM_ENDPOINT
      ? '<p class="hint" id="form-connected-note">This form sends to the operator’s inbox.</p>'
      : '<p class="notice warn" id="form-unconnected-note">The interest form is not connected yet on this copy. Submissions are not being collected until FORM_ENDPOINT is set in app.js.</p>';

    return (
      header() +
      "<main>" +
      '<section class="hero"><span class="pill ball">One niche · beginner-friendly pickleball</span><h1>Show up for a game, not a date.</h1><p class="lede">In For It is a planned set of small, capped pickleball sessions at public Toronto parks, for people aged 22–40 who recently moved to the city. It is not a dating app, and there is no matching algorithm or in-app chat. The first session is still forming: no court has been booked, and no fee is being charged yet.</p><div class="pills"><span class="pill">Public venues only</span><span class="pill women">Women-only option planned</span><span class="pill">18+ only</span><span class="pill">Code of conduct + report path</span></div></section>' +
      '<h2 class="display" style="font-size:28px;margin:0 0 12px">Planned sessions</h2>' +
      "<p style=\"color:var(--muted);margin:0 0 16px\">These are session types we would like to run, at real public parks used as candidate venues. Times are not reserved. A session fee, if any, will be set only when a court is booked. Outdoor courts may not be available in late fall and winter; an indoor option would be confirmed before anyone is asked to pay.</p>" +
      '<div class="sessions">' +
      cards +
      "</div>" +
      '<section class="card" id="interest-form" style="margin-top:28px"><h2>Register interest</h2><p>Tell us which planned session you would join. This does not reserve a spot and does not charge you.</p>' +
      connectedNote +
      '<form id="interest-form-el" novalidate' +
      formAction +
      ">" +
      formMetaFields("New In For It sign-up", "In For It") +
      '<label for="name">Name</label><input id="name" name="name" type="text" required maxlength="80" />' +
      '<label for="email">Email</label><input id="email" name="email" type="email" required />' +
      '<label for="neighbourhood">Neighbourhood</label><input id="neighbourhood" name="neighbourhood" type="text" required maxlength="80" placeholder="Where in Toronto you are based" />' +
      '<label for="session">Session you are interested in</label><select id="session" name="session" required><option value="">Select a planned session</option>' +
      sessionOptions +
      "</select>" +
      '<label class="check"><input id="age" name="age" type="checkbox" value="yes" required /><div><strong>I confirm I am 18 or older</strong><span class="hint">Sessions will be 18+ only.</span></div></label>' +
      '<label class="check" id="women-confirm-row" hidden><input id="women-confirm" name="women_confirm" type="checkbox" value="yes" /><div><strong>I confirm this women-only session is for me</strong><span class="hint">Shown when you pick the planned women-only session.</span></div></label>' +
      '<label class="check"><input id="coc" name="conduct" type="checkbox" value="yes" required /><div><strong>I have read the code of conduct</strong><span class="hint"><a href="#/conduct">Open the code of conduct</a>.</span></div></label>' +
      '<label class="check"><input id="consent" name="consent" type="checkbox" value="yes" required /><div><strong>I agree to be contacted about the first session</strong></div></label>' +
      '<div id="form-status" class="form-status" hidden></div>' +
      '<button class="btn block" id="interest-submit" type="submit">Send interest request</button></form></section>' +
      paymentBlock() +
      "</main>" +
      footer()
    );
  }

  function renderConduct() {
    const report = CONFIG.CONTACT_EMAIL
      ? "email the organiser at " + CONFIG.CONTACT_EMAIL
      : "email the organiser at the address listed in the footer once it is published";
    return (
      header() +
      '<main><article class="coc" id="code-of-conduct"><h2>Code of conduct (draft)</h2>' +
      "<p>This draft is for planned sessions. It is not legal advice and has not been reviewed by a lawyer.</p>" +
      "<ol>" +
      "<li><strong>This is not dating.</strong> Sessions are for pickleball only. Do not make unsolicited romantic or sexual advances.</li>" +
      "<li><strong>Public venues only.</strong> Meet and play at the listed public courts. Do not move the group to a private home or car.</li>" +
      "<li><strong>18+ only.</strong> You must be 18 or older to join.</li>" +
      "<li><strong>Show up on time, or cancel.</strong> If a WhatsApp group is opened for a confirmed session, that is where cancellations would go.</li>" +
      "<li><strong>Play fairly and be kind.</strong> No harassment, slurs, intimidation, or comments about bodies. Respect women-only sessions.</li>" +
      "<li><strong>No photos of others without consent.</strong></li>" +
      "<li><strong>Report concerns.</strong> To report a concern, " +
      escapeHtml(report) +
      ". If you or someone else is in immediate danger, contact local emergency services.</li>" +
      "</ol>" +
      '<p><a href="#/sessions">Back to sessions</a></p></article></main>' +
      footer()
    );
  }

  function renderPolicy() {
    return (
      header() +
      '<main><article class="card" id="refund-policy"><h2>Refund policy (draft)</h2>' +
      "<p>This draft will apply once a paid session is confirmed. A court has not been booked yet, and you should not send money until we email you that it has been.</p>" +
      "<ul>" +
      "<li>The planned fee is CA$12 per spot (planned). Do not send money until we email you that a court is booked. Then send CA$12 by Interac e-Transfer to the phone number on this page, and put the session name and your own name in the message. We confirm by email.</li>" +
      "<li>You get a full refund if the session does not run, including if we cancel or a court booking fails.</li>" +
      "<li>If you cancel after a court has been booked against your place, we may not be able to refund a fee already passed through to the venue.</li>" +
      "</ul>" +
      '<p><a href="#/sessions">Back</a></p></article></main>' +
      footer()
    );
  }

  function renderPrivacy() {
    return (
      header() +
      '<main><article class="card" id="privacy-note"><h2>Privacy note</h2>' +
      "<p>This is a short note for a small interest page, not a full legal policy.</p>" +
      "<ul>" +
      "<li>If you submit the form, we collect your name, email, neighbourhood, the session you asked about, and your 18+, conduct, and contact-consent confirmations, so we can email you when a first session is confirmed.</li>" +
      "<li>We do not ask for payment card numbers on this site. When a court is booked, payment is by Interac e-Transfer of the planned CA$12 fee after we email you. Do not send money before that email.</li>" +
      "<li>This static site does not keep a customer database. Once the form is connected, submissions go to the operator’s form inbox.</li>" +
      "<li>We do not sell your information.</li>" +
      "<li>To ask a question or request deletion of a submission, use the contact email in the footer once it is listed.</li>" +
      "</ul>" +
      '<p><a href="#/sessions">Back</a></p></article></main>' +
      footer()
    );
  }

  function renderThanks() {
    return (
      header() +
      '<main><div class="card" id="thanks" style="max-width:640px"><h2>Join request received</h2><p>Thank you. Your join request has been sent. A spot has not been reserved, and you should not send money yet — no court is booked.</p>' +
      refundBeforePayment() +
      interacInstructions() +
      '<p style="margin-top:16px"><a href="#/sessions">Back to In For It</a></p></div></main>' +
      footer()
    );
  }

  function renderAdmin() {
    const row = (k, v) => "<tr><th>" + escapeHtml(k) + "</th><td>" + (v ? "Set" : "Empty (default)") + "</td></tr>";
    return (
      header() +
      '<main><div class="card" id="admin-view"><h2>Local config status</h2><p>This page only reports whether keys in <code>app.js</code> are filled. It does not list players or imply that sessions are running.</p>' +
      "<table><tbody>" +
      row("FORM_ENDPOINT", CONFIG.FORM_ENDPOINT) +
      row("PAYMENT_LINK_URL", CONFIG.PAYMENT_LINK_URL) +
      row("ETRANSFER_EMAIL", CONFIG.ETRANSFER_EMAIL) +
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
    const form = document.getElementById("interest-form-el");
    if (!form) return;
    const session = form.session;
    const womenRow = document.getElementById("women-confirm-row");
    const womenBox = document.getElementById("women-confirm");
    const syncWomen = () => {
      const isWomen = /women-only/i.test(session.value);
      womenRow.hidden = !isWomen;
      womenBox.required = isWomen;
      if (!isWomen) womenBox.checked = false;
    };
    session.addEventListener("change", syncWomen);
    syncWomen();
    form.addEventListener("submit", (e) => {
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const neighbourhood = form.neighbourhood.value.trim();
      const sess = form.session.value;
      const age = form.age.checked;
      const coc = form.conduct.checked;
      const consent = form.consent.checked;
      const womenNeeded = /women-only/i.test(sess);
      if (!name || !email || !neighbourhood || !sess || !age || !coc || !consent || (womenNeeded && !womenBox.checked)) {
        e.preventDefault();
        showStatus("bad", "Please complete name, email, neighbourhood, a session, the 18+ and conduct boxes, contact consent, and the women-only confirmation if it applies.");
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
    if (isAdmin() && (r === "sessions" || r === "admin" || r === "home")) app.innerHTML = renderAdmin();
    else if (r === "conduct") app.innerHTML = renderConduct();
    else if (r === "policy") app.innerHTML = renderPolicy();
    else if (r === "privacy") app.innerHTML = renderPrivacy();
    else if (r === "thanks") app.innerHTML = renderThanks();
    else app.innerHTML = renderSessions();
    bindForm();
  }

  window.addEventListener("hashchange", render);
  render();
})();
