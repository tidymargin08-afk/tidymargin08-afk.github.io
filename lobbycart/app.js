/* LobbyCart — static site. Fill the CONFIG keys below before going live. */
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
  const ITEMS = [
    { id: "eggs", name: "Ontario brown eggs", pack: "Farm-packaged dozen, when a supplier is confirmed", hue: "#f3e0b8", icon: "egg" },
    { id: "honey", name: "Ontario wildflower honey", pack: "Farm-packaged jar, size to be confirmed", hue: "#e8b84a", icon: "jar" },
    { id: "maple", name: "Ontario maple syrup", pack: "Farm-packaged bottle, size to be confirmed", hue: "#c46a2d", icon: "bottle" },
    { id: "apples", name: "Dried apple rings", pack: "Ontario apples, pack size to be confirmed", hue: "#e08a6a", icon: "apple" },
    { id: "oats", name: "Rolled oats", pack: "Bulk bag, size to be confirmed", hue: "#ddd0b0", icon: "bag" },
    { id: "coffee", name: "Coffee beans, medium roast", pack: "Roasted in Ontario, pack size to be confirmed", hue: "#8b5a3c", icon: "bean" },
    { id: "towels", name: "Recycled paper towels", pack: "Bulk pack, size to be confirmed", hue: "#d9e2d6", icon: "roll" },
    { id: "tomatoes", name: "Canned tomatoes", pack: "Bulk cans, size to be confirmed", hue: "#d15a45", icon: "can" },
    { id: "oil", name: "Extra-virgin olive oil", pack: "Bulk bottle, size to be confirmed", hue: "#c9c56a", icon: "bottle" },
    { id: "soap", name: "Dish soap refill", pack: "Bulk bottle, size to be confirmed", hue: "#9ec3c8", icon: "bottle" },
  ];

  const ICONS = {
    egg: '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="26" rx="12" ry="15" fill="#fff8e7" stroke="#5a4630" stroke-width="1.6"/><ellipse cx="20" cy="22" rx="3" ry="4" fill="#f3e0b8" opacity=".7"/></svg>',
    jar: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="16" y="8" width="16" height="5" rx="1.5" fill="#d9c8a0" stroke="#5a4630" stroke-width="1.4"/><path d="M18 13h12v24c0 3-2.5 5-6 5s-6-2-6-5V13z" fill="#e8b84a" stroke="#5a4630" stroke-width="1.5"/></svg>',
    bottle: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="21" y="6" width="6" height="8" rx="1" fill="#d9c8a0" stroke="#5a4630" stroke-width="1.3"/><path d="M16 16h16l-1.5 24a6 6 0 0 1-6 5.5 6 6 0 0 1-6-5.5L16 16z" fill="currentColor" stroke="#5a4630" stroke-width="1.4" opacity=".9"/></svg>',
    apple: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 16c8 0 13 8 13 16 0 7-5 11-13 11S11 39 11 32c0-8 5-16 13-16z" fill="#e08a6a" stroke="#5a4630" stroke-width="1.4"/><path d="M24 16c0-5 3-9 7-10" stroke="#5a4630" stroke-width="1.4" fill="none"/></svg>',
    bag: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 18h20l-2 24H16L14 18z" fill="#efe6cc" stroke="#5a4630" stroke-width="1.4"/><path d="M18 18c0-5 3-9 6-9s6 4 6 9" fill="none" stroke="#5a4630" stroke-width="1.4"/></svg>',
    bean: '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="22" cy="26" rx="10" ry="14" transform="rotate(-25 22 26)" fill="#6b3f2a" stroke="#3a2418" stroke-width="1.3"/><ellipse cx="32" cy="20" rx="7" ry="10" transform="rotate(20 32 20)" fill="#8b5a3c" stroke="#3a2418" stroke-width="1.2"/></svg>',
    roll: '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="16" rx="14" ry="7" fill="#f4f1ea" stroke="#5a4630" stroke-width="1.3"/><path d="M10 16v18c0 4 6.3 7 14 7s14-3 14-7V16" fill="#efebe0" stroke="#5a4630" stroke-width="1.3"/></svg>',
    can: '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="12" rx="11" ry="5" fill="#d15a45" stroke="#5a4630" stroke-width="1.3"/><path d="M13 12v24c0 3 5 5.5 11 5.5s11-2.5 11-5.5V12" fill="#c44b38" stroke="#5a4630" stroke-width="1.3"/></svg>',
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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

  const PUBLIC_PATH = "lobbycart/";

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

  function paymentConfigured() {
    return Boolean(CONFIG.PAYMENT_LINK_URL || CONFIG.ETRANSFER_EMAIL);
  }

  function refundBeforePayment() {
    return (
      '<div class="policy" id="refund-before-payment"><h2>Please read the refund policy first</h2>' +
      "<p>If an item cannot be sourced after the cut-off, that item is refunded in full before pickup day. If you miss the pickup window, we hold your bag until Saturday noon; after that we donate what we cannot restock and refund only items we can return. There is no change-of-mind refund after the cut-off, because we buy from suppliers against prepaid totals. This draft applies once a paid drop is running. <a href=\"#/policy\">Full draft</a>.</p></div>"
    );
  }

  function interacInstructions() {
    if (!CONFIG.ETRANSFER_EMAIL) return "";
    return (
      '<div id="etransfer-instructions">' +
      "<p>When the first drop is confirmed, payment is by Interac e-Transfer to <strong id=\"etransfer-email\">" +
      escapeHtml(CONFIG.ETRANSFER_EMAIL) +
      "</strong>.</p>" +
      '<p id="etransfer-do-not-pay"><strong>Do not send money yet.</strong> Suppliers and prices are not confirmed. We will email you the exact total once the first drop’s supplier and prices are confirmed. Then send an Interac e-Transfer to ' +
      escapeHtml(CONFIG.ETRANSFER_EMAIL) +
      ", and put your order name and your own name in the message. We confirm by email.</p></div>"
    );
  }

  function header() {
    const adminBanner = isAdmin()
      ? '<div class="admin-flag" id="admin-flag">Local-only view (<code>?admin=1</code>). This is not a live organiser dashboard. This site does not store orders on a server — any form data goes only to the configured form inbox, if it is connected.</div>'
      : "";
    return (
      adminBanner +
      '<div class="demo-banner"><strong>Pre-order / first drop forming.</strong> Suppliers, prices and a pickup building are not confirmed yet. Nothing on this page is a live catalogue or a charge.</div>' +
      '<header class="app-header"><a class="brand" href="#/home"><span class="brand-mark">Lobby<span>Cart</span></span><span class="brand-sub">One Toronto condo · first drop forming</span></a>' +
      '<nav class="header-nav">' +
      '<a href="#/home">This week</a>' +
      '<a href="#/home#interest-form">Pre-order request</a>' +
      '<a href="#/policy">Refund policy</a>' +
      '<a href="#/privacy">Privacy</a>' +
      "</nav></header>"
    );
  }

  function footer() {
    return (
      '<footer><div class="inner">' +
      '<div class="footer-block"><h3>Contact</h3><p>' +
      contactLine() +
      "</p></div>" +
      '<div class="footer-block"><h3>Privacy</h3><p>If you submit the pre-order form, we collect your name, email, building or unit, and the items you marked, so we can contact you about the first drop. We do not sell this information. Nothing is stored in a project database on this site. <a href="#/privacy">Full note</a>.</p></div>' +
      '<div class="footer-block"><h3>Refunds</h3><p>A draft refund and missed-pickup policy applies once a paid drop is confirmed. <a href="#/policy">Read the draft</a>.</p></div>' +
      "</div></footer>"
    );
  }

  function paymentBlock() {
    if (!paymentConfigured()) {
      return (
        '<section class="card" id="payment-step" data-payment-state="closed">' +
        "<h2>Payment</h2>" +
        '<p id="payment-closed-message">Payments open once the first drop is confirmed; we will email you the exact total and how to pay.</p>' +
        "</section>"
      );
    }
    const card = CONFIG.PAYMENT_LINK_URL
      ? '<p><a class="btn" id="payment-link" href="' +
        escapeHtml(CONFIG.PAYMENT_LINK_URL) +
        '" target="_blank" rel="noopener noreferrer">Pay with card (secure payment link)</a></p>'
      : "";
    return (
      '<section class="card" id="payment-step" data-payment-state="open">' +
      "<h2>How payment will work</h2>" +
      refundBeforePayment() +
      interacInstructions() +
      card +
      "</section>"
    );
  }

  function renderHome() {
    const cards = ITEMS.map((p) => {
      return (
        '<article class="sku" data-sku="' +
        p.id +
        '"><div class="sku-art" style="background:' +
        p.hue +
        ";color:" +
        p.hue +
        '">' +
        (ICONS[p.icon] || "") +
        '</div><div class="sku-body"><h3>' +
        escapeHtml(p.name) +
        '</h3><p class="sku-meta">' +
        escapeHtml(p.pack) +
        '</p><p class="planned-note">Planned for the first drop. Price and supplier are not confirmed.</p></div></article>'
      );
    }).join("");

    const itemChecks = ITEMS.map((p) => {
      return (
        '<label class="pay-option"><input type="checkbox" name="items" value="' +
        escapeHtml(p.name) +
        '" /><div><strong>' +
        escapeHtml(p.name) +
        "</strong></div></label>"
      );
    }).join("");

    const formAction = CONFIG.FORM_ENDPOINT ? ' action="' + escapeHtml(CONFIG.FORM_ENDPOINT) + '" method="POST"' : "";
    const connectedNote = CONFIG.FORM_ENDPOINT
      ? '<p class="hint" id="form-connected-note">This form sends to the operator’s inbox.</p>'
      : '<p class="notice warn" id="form-unconnected-note">The interest form is not connected yet on this copy. Submissions are not being collected until FORM_ENDPOINT is set in app.js.</p>';

    return (
      header() +
      "<main>" +
      '<section class="hero"><div><p class="pill neutral">Pre-order / first drop forming</p><h1>Weekly staples from Ontario farms and bulk suppliers, waiting in your lobby.</h1><p class="lede">This is a planned weekly pre-order for one Toronto condo: shelf-stable and farm-packaged goods, bought only after a hard cut-off, collected at one lobby pickup. It is not a “cheapest groceries” service. The first drop is still forming — suppliers, prices, the building, and a cut-off date are not confirmed yet. Use the form below to register interest. We will only ask you to pay once a drop is confirmed.</p><div class="meta-row"><span class="pill">Local and bulk, at fair prices</span><span class="pill">One pickup point, once a building is confirmed</span></div></div>' +
      '<div class="status-card"><span class="pill">Forming</span><h2>No cut-off is set yet</h2><p>A hard weekly cut-off and a Thursday-evening lobby window will be published when the first drop is confirmed. Until then, this page only collects interest.</p></div></section>' +
      '<div class="steps"><div class="step"><div class="n">Step 1</div><h3>Tell us what you want</h3><p>Name the building or unit and the staples you would pre-order. This is an interest request, not a paid order.</p></div><div class="step"><div class="n">Step 2</div><h3>We confirm a drop</h3><p>When a supplier list, prices, and condo-board permission are in place, we email the cut-off and the exact total. You then pay by Interac e-Transfer. Do not send money before that email.</p></div><div class="step"><div class="n">Step 3</div><h3>Collect at the lobby</h3><p>One pickup point, one window. The draft missed-pickup policy will apply to paid drops.</p></div></div>' +
      '<div class="section-head"><h2>Planned first-drop list</h2><p>Intended items only. No supplier names or prices are listed, because none are confirmed.</p></div>' +
      '<div class="catalog">' +
      cards +
      "</div>" +
      '<aside class="policy" id="refund-teaser"><h2>Refund policy (draft, shown up front)</h2><p>If an item cannot be sourced after the cut-off, that item is refunded in full before pickup day. If you miss the pickup window, we hold your bag until Saturday noon. After that, we donate what we cannot restock and refund only items we can return. There is no change-of-mind refund after the cut-off. This is a draft, not a legal terms document, and it applies only once a paid drop is running. <a href="#/policy">Read the full draft.</a></p></aside>' +
      '<section class="card" id="interest-form" style="margin-top:36px"><h2>Pre-order request</h2><p>Register interest for the first drop. This does not charge you and does not reserve stock.</p>' +
      connectedNote +
      '<form id="interest-form-el" novalidate' +
      formAction +
      ">" +
      formMetaFields("LobbyCart pre-order", "LobbyCart") +
      '<label for="name">Name</label><input id="name" name="name" type="text" required maxlength="80" />' +
      '<label for="email">Email</label><input id="email" name="email" type="email" required />' +
      '<label for="building">Building or unit</label><input id="building" name="building" type="text" required maxlength="120" placeholder="Condo name and unit, or the building you have in mind" />' +
      "<label>Items you would pre-order</label><div class=\"pay-options\" id=\"item-choices\">" +
      itemChecks +
      "</div>" +
      '<label for="notes">Anything else? (optional)</label><textarea id="notes" name="notes" maxlength="1500"></textarea>' +
      '<label class="pay-option" style="margin-top:16px"><input id="consent" name="consent" type="checkbox" value="yes" required /><div><strong>I agree to be contacted about the first LobbyCart drop</strong><span>We will only use your details to follow up about this pre-order. <a href="#/privacy">Privacy note</a>.</span></div></label>' +
      '<div id="form-status" class="form-status" hidden></div>' +
      '<button class="btn block" id="interest-submit" type="submit">Send pre-order request</button></form></section>' +
      '<div style="margin-top:24px">' +
      paymentBlock() +
      "</div></main>" +
      footer()
    );
  }

  function renderPolicy() {
    return (
      header() +
      '<main><article class="card" style="max-width:720px" id="refund-policy">' +
      "<h2>Refund and missed-pickup policy (draft)</h2>" +
      "<p>This draft will apply once a paid drop is confirmed. It is not a legal contract, and it is not in force while the first drop is still forming.</p>" +
      "<ul>" +
      "<li>Do not send money until we email you the exact total for a confirmed drop. Then pay by Interac e-Transfer to the phone number on this page, and put your order name and your own name in the message. We confirm by email.</li>" +
      "<li>If a listed item is unavailable after the cut-off, we refund that item in full and leave it off your pickup bag, before pickup day.</li>" +
      "<li>If you miss the published lobby window, we hold your bag until Saturday noon. We will not deliver to individual units.</li>" +
      "<li>Bags unclaimed after Saturday noon may be donated. We refund only items we can return or restock.</li>" +
      "<li>There is no refund for a change of mind after the cut-off, because we buy from suppliers against prepaid totals.</li>" +
      "</ul>" +
      "<p>Prepaid group buying depends on trust. A live drop also needs written condo-board permission, which has not been obtained yet.</p>" +
      '<p><a href="#/home">Back</a></p></article></main>' +
      footer()
    );
  }

  function renderPrivacy() {
    return (
      header() +
      '<main><article class="card" style="max-width:720px" id="privacy-note"><h2>Privacy note</h2>' +
      "<p>This is a short note for a small pre-order page, not a full legal policy.</p>" +
      "<ul>" +
      "<li>If you submit the form, we collect your name, email, building or unit, the items you marked, and any optional note, so we can contact you about the first LobbyCart drop.</li>" +
      "<li>We also record that you consented to be contacted.</li>" +
      "<li>We do not ask for payment card numbers on this site. When a drop is confirmed, payment is by Interac e-Transfer after we email the exact total. Do not send money before that email.</li>" +
      "<li>This static site does not keep a customer database. Once the form is connected, submissions go to the operator’s form inbox (FormSubmit or the same kind of endpoint).</li>" +
      "<li>We do not sell your information or use it for unrelated marketing.</li>" +
      "<li>To ask a question or request deletion of a submission, use the contact email in the footer once it is listed.</li>" +
      "</ul>" +
      '<p><a href="#/home">Back</a></p></article></main>' +
      footer()
    );
  }

  function renderThanks() {
    return (
      header() +
      '<main><div class="card" id="thanks" style="max-width:640px"><h2>Pre-order request received</h2><p>Thank you. Your pre-order request has been sent. This does not reserve stock and is not a paid order.</p>' +
      refundBeforePayment() +
      interacInstructions() +
      '<p style="margin-top:16px"><a href="#/home">Back to LobbyCart</a></p></div></main>' +
      footer()
    );
  }

  function renderAdmin() {
    const row = (k, v) =>
      "<tr><th>" + escapeHtml(k) + "</th><td>" + (v ? "Set" : "Empty (default)") + "</td></tr>";
    return (
      header() +
      '<main><div class="card" id="admin-view"><h2>Local config status</h2><p>This page only reports whether keys in <code>app.js</code> are filled. It does not list customers, and it does not mean a drop is running.</p>' +
      '<table><tbody>' +
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
    if (type === "warn") el.id = "form-not-connected";
    el.textContent = text;
  }

  function selectedItems(form) {
    return Array.from(form.querySelectorAll('input[name="items"]:checked')).map((i) => i.value);
  }

  function bindForm() {
    const form = document.getElementById("interest-form-el");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const building = form.building.value.trim();
      const consent = form.consent.checked;
      const items = selectedItems(form);
      if (!name || !email || !building || !consent) {
        e.preventDefault();
        showStatus("bad", "Please add your name, email, building or unit, and contact consent.");
        return;
      }
      if (!items.length) {
        e.preventDefault();
        showStatus("bad", "Please choose at least one item you would pre-order.");
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
      // Let the browser POST to FORM_ENDPOINT.
    });
  }

  function render() {
    const app = document.getElementById("app");
    const r = route();
    if (isAdmin() && (r === "home" || r === "admin")) app.innerHTML = renderAdmin();
    else if (r === "policy") app.innerHTML = renderPolicy();
    else if (r === "privacy") app.innerHTML = renderPrivacy();
    else if (r === "thanks") app.innerHTML = renderThanks();
    else app.innerHTML = renderHome();
    bindForm();
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("popstate", render);
  render();
})();
