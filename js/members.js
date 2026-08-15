// Members-only area: decrypts data/members.enc.js in the browser with the
// shared member password (PBKDF2 -> AES-256-GCM via WebCrypto).
(function () {
  const loginView = document.getElementById("login-view");
  const membersView = document.getElementById("members-view");
  const form = document.getElementById("login-form");
  const pwInput = document.getElementById("password");
  const errEl = document.getElementById("login-error");
  const signOutBtn = document.getElementById("sign-out");

  const b64ToU8 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  async function decrypt(password) {
    const blob = window.MEMBERS_ENC;
    const encdr = new TextEncoder();
    const baseKey = await crypto.subtle.importKey("raw", encdr.encode(password), "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: b64ToU8(blob.salt), iterations: blob.iter, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64ToU8(blob.iv) }, key, b64ToU8(blob.data));
    return JSON.parse(new TextDecoder().decode(plain));
  }

  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  function render(d) {
    // Officers
    document.getElementById("officers-body").innerHTML = d.officers.map((o) =>
      `<tr${o.officer ? ' class="is-officer"' : ""}><td>${esc(o.name)}</td><td>${esc(o.role)}</td></tr>`
    ).join("");

    // Roster
    document.getElementById("roster-grid").innerHTML = d.roster.map((m) => `
      <div class="roster-card">
        <div class="r-name">${esc(m.name)}${m.spouse ? ` <span style="font-weight:400;color:var(--ink-faint);font-size:15px;">(${esc(m.spouse)})</span>` : ""}${m.new ? '<span class="new-badge">New</span>' : ""}</div>
        <div class="r-bday">&#127856; ${esc(m.birthday)}</div>
        <div class="r-line">&#128222; <a href="tel:${esc(m.phone.replace(/[^0-9+]/g, ""))}">${esc(m.phone)}</a></div>
        <div class="r-line">&#127968; ${esc(m.address)}</div>
        <div class="r-line">&#9993;&#65039; <a href="mailto:${esc(m.email)}">${esc(m.email)}</a></div>
      </div>`).join("");

    // Leave of absence + honorary
    document.getElementById("leave-list").innerHTML =
      d.leaveOfAbsence.map((n) => `<li><b>${esc(n)}</b></li>`).join("");
    document.getElementById("honorary-list").innerHTML =
      d.honorary.map((h) => `<li><b>${esc(h.name)}</b>${h.deceased ? " &dagger;" : ""}</li>`).join("");

    // Meetings
    document.getElementById("meetings-body").innerHTML = d.meetings.map((m) => `
      <tr>
        <td class="month">${esc(m.date)}</td>
        <td><b>${esc(m.program)}</b><br>
            <span style="color:var(--ink-faint);font-size:14px;">${esc(m.location)}</span><br>
            <span style="font-size:14px;">Hostesses: ${esc(m.hostesses)}</span></td>
      </tr>`).join("");

    // Reminders
    document.getElementById("reminders-body").innerHTML = d.reminders.map((r) =>
      `<tr><td class="month">${esc(r.month)}</td><td>${esc(r.items)}</td></tr>`
    ).join("");

    document.getElementById("members-year").textContent = d.year;
  }

  async function unlock(password, silent) {
    try {
      const data = await decrypt(password);
      sessionStorage.setItem("cl_pw", password);
      render(data);
      loginView.hidden = true;
      membersView.hidden = false;
      window.scrollTo(0, 0);
    } catch (e) {
      sessionStorage.removeItem("cl_pw");
      if (!silent) {
        errEl.textContent = "That password isn't correct. Please try again.";
        pwInput.select();
      }
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errEl.textContent = "";
    const btn = form.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Unlocking…";
    unlock(pwInput.value, false).finally(() => {
      btn.disabled = false;
      btn.textContent = "Enter Members Area";
    });
  });

  signOutBtn.addEventListener("click", function () {
    sessionStorage.removeItem("cl_pw");
    membersView.hidden = true;
    loginView.hidden = false;
    pwInput.value = "";
    errEl.textContent = "";
  });

  // Auto-unlock if already signed in this browser session
  const saved = sessionStorage.getItem("cl_pw");
  if (saved) unlock(saved, true);
})();
