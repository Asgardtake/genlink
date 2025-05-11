// Отваря попъп за потвърждение на изтриване на линк
function openDeletePopup(onConfirm) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";

  const modal = document.createElement("div");
  modal.style.background = "#fff";
  modal.style.borderRadius = "10px";
  modal.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";
  modal.style.width = "90%";
  modal.style.maxWidth = "400px";
  modal.style.padding = "24px";
  modal.style.position = "relative";
  modal.style.zIndex = "10000";

  const closeBtn = document.createElement("span");
  closeBtn.innerHTML = "&times;";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "14px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "22px";
  closeBtn.style.color = "#999";
  closeBtn.style.fontWeight = "bold";

  const title = document.createElement("h2");
  title.textContent = "Изтриване на линк";
  title.style.marginTop = "0";
  title.style.color = "#e74c3c";
  title.style.fontSize = "20px";

  const msg = document.createElement("p");
  msg.textContent = "Наистина ли искаш да изтриеш този линк? Това действие не може да бъде върнато.";
  msg.style.margin = "16px 0";
  msg.style.fontSize = "15px";

  const buttons = document.createElement("div");
  buttons.style.display = "flex";
  buttons.style.justifyContent = "center";
  buttons.style.gap = "20px";
  buttons.style.marginTop = "20px";

  const yesBtn = document.createElement("button");
  yesBtn.textContent = "Да";
  yesBtn.style.padding = "8px 20px";
  yesBtn.style.background = "#e74c3c";
  yesBtn.style.color = "#fff";
  yesBtn.style.border = "none";
  yesBtn.style.borderRadius = "6px";
  yesBtn.style.cursor = "pointer";

  const noBtn = document.createElement("button");
  noBtn.textContent = "Не";
  noBtn.style.padding = "8px 20px";
  noBtn.style.background = "#999";
  noBtn.style.color = "#fff";
  noBtn.style.border = "none";
  noBtn.style.borderRadius = "6px";
  noBtn.style.cursor = "pointer";

  const closePopup = () => overlay.remove();

  yesBtn.onclick = () => {
    closePopup();
    if (typeof onConfirm === "function") onConfirm();
  };
  noBtn.onclick = closePopup;
  closeBtn.onclick = closePopup;

  buttons.appendChild(yesBtn);
  buttons.appendChild(noBtn);
  modal.appendChild(closeBtn);
  modal.appendChild(title);
  modal.appendChild(msg);
  modal.appendChild(buttons);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// Зарежда линковете от базата чрез session и server.js
async function loadGeneratedLinks() {
  try {
    const sessionRes = await fetch('/api/check-session');
    const sessionData = await sessionRes.json();
    if (!sessionData.loggedIn || !sessionData.user || !sessionData.user.username) return;

    const username = sessionData.user.username;
    const response = await fetch(`/api/userlinks/${username}`);
    const data = await response.json();

    if (data.success && Array.isArray(data.links)) {
      const inputs = ["genlo", "genlt", "genltr"];
      const inputsMap = {
        genlo: 'Link1',
        genlt: 'Link2',
        genltr: 'Link3'
      };

      inputs.forEach((id, index) => {
        const input = document.getElementById(id);
        if (!input) return;

        input.value = data.links[index] || "";
        input.readOnly = true;

        const wrapper = document.createElement("div");
        wrapper.style.paddingRight = "60px";        
        wrapper.style.position = "relative";
        wrapper.style.display = "flex";
        wrapper.style.justifyContent = "space-between";
        wrapper.style.alignItems = "center";
        wrapper.style.width = "100%";
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        input.style.width = "100%";
        input.style.flex = "1";

        const deleteBtn = document.createElement("div");
        deleteBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="background:#e74c3c; border-radius:50%; padding:2px; cursor:pointer;">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;
        deleteBtn.style.marginLeft = "10px";
        wrapper.appendChild(deleteBtn);

        const toggleDeleteVisibility = () => {
          deleteBtn.style.display = input.value.trim() ? "block" : "none";
        };

        toggleDeleteVisibility();
        input.addEventListener("input", toggleDeleteVisibility);

        deleteBtn.addEventListener("click", () => {
          openDeletePopup(() => {
            const field = inputsMap[id];
            fetch(`/api/deletelink/${username}/${index + 1}`, {
              method: 'DELETE'
            })
              .then(res => res.json())
              .then(result => {
                if (result.success) {
                  input.value = "";
                  toggleDeleteVisibility();
                } else {
                  alert("Грешка при изтриване.");
                }
              });
          });
        });

        input.addEventListener("click", () => {
          if (!input.value.trim()) return;
        
          try {
            navigator.clipboard.writeText(input.value);
        
            const copiedBox = document.createElement("div");
            copiedBox.style.display = "flex";
            copiedBox.style.alignItems = "center";
            copiedBox.style.position = "absolute";
            copiedBox.style.right = "100px";
            copiedBox.style.top = "50%";
            copiedBox.style.transform = "translateY(-50%)";
            copiedBox.style.backgroundColor = "#29ca8e";
            copiedBox.style.padding = "4px 8px";            
            copiedBox.style.zIndex = "2";
            copiedBox.classList.add("copied-feedback");
        
            copiedBox.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" stroke-width="2" style="border-radius:50%; flex-shrink:0;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              <span style="margin-left:6px; color:#fff; font-size:13px;">Копирано в clipboard !</span>
            `;
        
            const old = wrapper.querySelector(".copied-feedback");
            if (old) old.remove();
            wrapper.appendChild(copiedBox);
        
            input.style.backgroundColor = "#29ca8e";
            input.style.color = "#fff";
            input.style.borderRadius = "6px";
            
            setTimeout(() => {
              input.style.backgroundColor = "";
              input.style.color = "";
              input.style.borderRadius = "0";
              copiedBox.remove();
            }, 800);
        
          } catch (err) {
            console.warn("Clipboard write failed:", err);
          }
        });
      });
    } else {
      console.error("Грешка при зареждане на линковете:", data.message || data);
    }
  } catch (err) {
    console.error("Неуспешна заявка за линкове:", err);
  }
}



// ===================== DOMContentLoaded START =====================
document.addEventListener("DOMContentLoaded", () => {
  loadGeneratedLinks();

  fetch('/api/check-session', {
    method: 'GET',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      if (!data.loggedIn || !data.user) {
        window.location.href = "index.html";
        return;
      }

      const user = data.user;

      if (data.passwordChanged) {
        // 🔒 БЛОКИРАМЕ НАВИГАЦИЯТА още преди да покажем попъпа
        history.pushState(null, null, location.href);
        window.__genlinkBlockPopState = () => history.pushState(null, null, location.href);
        window.addEventListener("popstate", window.__genlinkBlockPopState);

        window.__genlinkBlockKeys = (e) => {
          if ((e.key === "F5") || (e.ctrlKey && e.key === "r")) e.preventDefault();
        };
        window.addEventListener("keydown", window.__genlinkBlockKeys);

        window.__genlinkBlockUnload = (e) => {};

        window.addEventListener("beforeunload", window.__genlinkBlockUnload);

        // Попъп за успешно сменена парола
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.backgroundColor = "rgba(0,0,0,0.6)";
        overlay.style.zIndex = "9999";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";

        const modal = document.createElement("div");
        modal.style.background = "#fff";
        modal.style.padding = "30px";
        modal.style.borderRadius = "12px";
        modal.style.maxWidth = "400px";
        modal.style.width = "90%";
        modal.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
        modal.style.position = "relative";

        modal.innerHTML = `
          <h2 style="font-size: 20px; margin-bottom: 16px;">✅ Паролата е сменена</h2>
          <p style="font-size: 14px; color: #333; margin-bottom: 20px;">
            Паролата е сменена успешно. Моля, излез от акаунта си и влез отново с новата парола.
          </p>
          <button id="logoutBtn" style="
            padding: 10px 20px;
            background-color: #29ca8e;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
          ">Изход и нов вход</button>
        `;

        const logoutBtn = modal.querySelector("#logoutBtn");
        logoutBtn.addEventListener("click", async () => {
          // 🧹 Премахваме заключванията преди logout
          window.onbeforeunload = null;
          window.removeEventListener("beforeunload", window.__genlinkBlockUnload);
          window.removeEventListener("keydown", window.__genlinkBlockKeys);
          window.removeEventListener("popstate", window.__genlinkBlockPopState);

          try {
            const res = await fetch("/api/logout", {
              method: "POST",
              credentials: "include"
            });
            if (res.ok) {
              window.location.href = "index.html";
            } else {
              alert("Грешка при изход.");
            }
          } catch (err) {
            console.error("Logout грешка:", err);
            alert("Сървърна грешка при изход.");
          }
        });

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
      }

      // Попълване на полетата
      const usernameInput = document.getElementById("profileUsername");
      const emailInput = document.getElementById("profileEmail");

      if (usernameInput) usernameInput.value = user.username || "";
      if (emailInput) emailInput.value = user.email || "";

      if (typeof showLoggedInNavbar === "function") {
        showLoggedInNavbar(user.username);
        // === 🔽 ВАЛИДАЦИЯ И ЗАПАЗВАНЕ НА ДАННИ В ПРОФИЛА 🔽 ===
const saveBtn = document.getElementById("saveBtn");
let originalUsername = user.username;
let originalEmail = user.email;

const usernameInput = document.getElementById("profileUsername");
const emailInput = document.getElementById("profileEmail");

function showProfileError(input, message) {
  clearProfileError(input);
  const error = document.createElement("div");
  error.className = "input-error";
  error.textContent = message;
  error.style.color = "#e74c3c";
  error.style.fontSize = "14px";
  error.style.marginTop = "4px";
  error.style.marginBottom = "10px";
  input.style.marginBottom = "0";
  input.parentNode.insertBefore(error, input.nextSibling);
}

function clearProfileError(input) {
  const next = input.nextSibling;
  if (next && next.classList && next.classList.contains("input-error")) {
    next.remove();
  }
  input.style.marginBottom = "15px";
}

function validateUsername(username) {
  if (/[А-Яа-я]/.test(username)) return "Само латиница и цифри.";
  if (!/^[a-z0-9._-]+$/.test(username)) return "Позволени: малки букви, цифри, точка, тире, долна черта.";
  if (username.length > 15) return "До 15 символа.";
  if (username.length < 3) return "Минимум 3 символа.";
  return "";
}

function validateEmail(email) {
  if (/[А-Яа-я]/.test(email)) return "Само латиница.";
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) return "Невалиден имейл.";
  return "";
}

function checkProfileValidity() {
  const newUsername = usernameInput.value.trim();
  const newEmail = emailInput.value.trim();

  clearProfileError(usernameInput);
  clearProfileError(emailInput);

  let valid = true;

  const userErr = validateUsername(newUsername);
  const mailErr = validateEmail(newEmail);

  if (userErr) {
    showProfileError(usernameInput, userErr);
    valid = false;
  }

  if (mailErr) {
    showProfileError(emailInput, mailErr);
    valid = false;
  }

  const changed = (newUsername !== originalUsername || newEmail !== originalEmail);

  if (valid && changed) {
    saveBtn.classList.remove("disabled-btn");
    saveBtn.style.backgroundColor = "#29ca8e";
    saveBtn.style.color = "#fff";
    saveBtn.style.cursor = "pointer";
    saveBtn.dataset.enabled = "true";
  } else {
    saveBtn.classList.add("disabled-btn");
    saveBtn.style.backgroundColor = "";
    saveBtn.style.color = "";
    saveBtn.style.cursor = "default";
    saveBtn.dataset.enabled = "false";
  }
}

usernameInput.addEventListener("input", checkProfileValidity);
emailInput.addEventListener("input", checkProfileValidity);

saveBtn.addEventListener("click", async () => {
  if (saveBtn.dataset.enabled !== "true") return;

  const updatedUsername = usernameInput.value.trim();
  const updatedEmail = emailInput.value.trim();

  try {
    const res = await fetch("/api/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ username: updatedUsername, email: updatedEmail })
    });

    const result = await res.json();
    if (result.success) {
      let changes = [];
      if (updatedUsername !== originalUsername) changes.push("потребителското име");
      if (updatedEmail !== originalEmail) changes.push("имейла");
    
      originalUsername = updatedUsername;
      originalEmail = updatedEmail;
    
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.zIndex = "9999";
      
      const modal = document.createElement("div");
      modal.style.background = "#fff";
      modal.style.borderRadius = "10px";
      modal.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";
      modal.style.width = "90%";
      modal.style.maxWidth = "400px";
      modal.style.padding = "24px";
      modal.style.position = "relative";
      modal.style.zIndex = "10000";
      modal.style.textAlign = "center";
      
      const closeBtn = document.createElement("span");
      closeBtn.innerHTML = "&times;";
      closeBtn.style.position = "absolute";
      closeBtn.style.top = "10px";
      closeBtn.style.right = "14px";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.fontSize = "22px";
      closeBtn.style.color = "#999";
      closeBtn.style.fontWeight = "bold";
      closeBtn.onclick = () => overlay.remove();
      
      const msg = document.createElement("p");
      msg.style.margin = "0 0 20px";
      msg.style.fontSize = "15px";
      msg.style.color = "#333";
      msg.textContent =
        changes.length === 2
          ? "Успешно са променени: потребителското име и имейлът."
          : changes[0] === "имейла"
            ? "Успешно променен мейл."
            : "Успешно променено потребителско име.";
      
      const okBtn = document.createElement("button");
      okBtn.textContent = "Затвори";
      okBtn.style.padding = "10px 20px";
      okBtn.style.backgroundColor = "#29ca8e";
      okBtn.style.color = "#fff";
      okBtn.style.border = "none";
      okBtn.style.borderRadius = "6px";
      okBtn.style.cursor = "pointer";
      okBtn.style.fontWeight = "bold";
      
      okBtn.onclick = () => overlay.remove();
      
      modal.appendChild(closeBtn);
      modal.appendChild(msg);
      modal.appendChild(okBtn);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      
      
    
      checkProfileValidity();
    }
    
  } catch (err) {
    console.error("Грешка при запис:", err);
    alert("Сървърна грешка при запис.");
  }
});

      }
    })
    .catch(err => {
      console.error("Грешка при зареждане на потребителските данни:", err);
      window.location.href = "index.html";
    });
});


window.addEventListener("pageshow", (event) => {
  if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
    fetch('/api/check-session', {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (!data.loggedIn || !data.user) {
          window.location.href = "index.html";
        }
      })
      .catch(() => {
        window.location.href = "index.html";
      });
  }
});
// ------------------------------
// ПРОМЯНА НА ПАРОЛА – POPUP
// ------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const link = document.getElementById("changePassLink");
  if (!link) return;

  link.addEventListener("click", async (e) => {
    e.preventDefault();

    const res = await fetch("/api/check-session", {
      method: "GET",
      credentials: "include"
    });
    const session = await res.json();
    if (!session || !session.user || !session.user.password) {
      alert("Грешка при зареждане на паролата.");
      return;
    }
    const currentPassword = session.user.password;

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0,0,0,0.6)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";

    const modal = document.createElement("div");
    modal.style.background = "#fff";
    modal.style.padding = "30px";
    modal.style.borderRadius = "12px";
    modal.style.maxWidth = "400px";
    modal.style.width = "90%";
    modal.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
    modal.style.position = "relative";

    modal.innerHTML = `
    <h2 style="margin: 0 0 16px 0; font-size: 20px;">Промяна на парола</h2>
    <label style="display:block; margin-bottom: 8px; font-weight: normal;">Стара парола</label>
    <input type="password" disabled value="${currentPassword}" style="margin-bottom:16px; width:100%; padding:10px; border:1px solid #ccc; border-radius:6px;">
    <label style="display:block; margin-bottom: 8px; font-weight: normal;">Нова парола</label>
    <input type="password" id="newPass" style="margin-bottom:16px; width:100%; padding:10px; border:1px solid #ccc; border-radius:6px;">
    <label style="display:block; margin-bottom: 8px; font-weight: normal;">Повтори паролата</label>
    <input type="password" id="repeatPass" style="margin-bottom:32px; width:100%; padding:10px; border:1px solid #ccc; border-radius:6px;">
    <button id="changePassBtn" disabled style="padding:10px 20px; background-color:#29ca8e; color:#fff; border:none; border-radius:6px; cursor:pointer; opacity:0.6;">Промени</button>
  `;
  

  overlay.addEventListener("click", (e) => {
    const successMsg = modal.querySelector("h2");
    const isSuccess = successMsg?.textContent?.includes("Паролата е сменена");
  
    if (!isSuccess && e.target === overlay) {
      overlay.remove();
    }
  });
  

    const newPassInput = modal.querySelector("#newPass");
    const repeatPassInput = modal.querySelector("#repeatPass");
    const changeBtn = modal.querySelector("#changePassBtn");
    function showChangePassError(input, message) {
      clearChangePassError(input);
      const error = document.createElement("div");
      error.className = "input-error";
      error.textContent = message;
      error.style.color = "#e74c3c";
      error.style.fontSize = "14px";
      error.style.marginTop = "4px";
      error.style.marginBottom = "10px";
      input.style.marginBottom = "0";
      input.parentNode.insertBefore(error, input.nextSibling);
    }
    
    function clearChangePassError(input) {
      const next = input.nextSibling;
      if (next && next.classList && next.classList.contains("input-error")) {
        next.remove();
      }
      input.style.marginBottom = "15px";
    }
    

    function validatePassword(val) {
      if (/[а-яА-ЯёЁ]/.test(val)) return "Позволена е само латиница.";
      if (!/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/'`;~]+$/.test(val)) {
        return "Позволена е само латиница и стандартни символи.";
      }
      if (!/[A-Z]/.test(val)) return "Паролата трябва да съдържа поне една главна буква.";
      if (!/[0-9]/.test(val)) return "Паролата трябва да съдържа поне една цифра.";
      if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/'`;~]/.test(val)) return "Паролата трябва да съдържа поне един специален символ.";
      if (val.length < 6) return "Паролата трябва да е поне 6 символа.";
      return "";
    }
    
    
    let newPassTouched = false;
    let repeatPassTouched = false;
    newPassInput.addEventListener("input", () => {
      newPassTouched = true;
      checkValidity();
    });
    
    repeatPassInput.addEventListener("input", () => {
      repeatPassTouched = true;
      checkValidity();
    });
        
    function checkValidity() {
      const newVal = newPassInput.value.trim();
      const repVal = repeatPassInput.value.trim();
      let isValid = true;
    
      clearChangePassError(newPassInput);
      clearChangePassError(repeatPassInput);
    
      if (newPassTouched) {
        if (newVal === currentPassword) {
          showChangePassError(newPassInput, "Новата парола не трябва да съвпада със старата.");
          isValid = false;
        }
    
        const validStructure =
          /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/'`;~]+$/.test(newVal) &&
          /[A-Z]/.test(newVal) &&
          /[0-9]/.test(newVal) &&
          /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/'`;~]/.test(newVal) &&
          newVal.length >= 6;
    
          const passwordError = validatePassword(newVal);
          if (passwordError) {
            showChangePassError(newPassInput, passwordError);
            isValid = false;
          }
          
      }
    
      if (repeatPassTouched) {
        if (repVal !== newVal) {
          showChangePassError(repeatPassInput, "Паролите не съвпадат.");
          isValid = false;
        }
      }
    
      if (
        isValid &&
        newVal !== "" &&
        repVal !== "" &&
        newPassTouched &&
        repeatPassTouched
      ) {
        changeBtn.disabled = false;
        changeBtn.style.opacity = "1";
      } else {
        changeBtn.disabled = true;
        changeBtn.style.opacity = "0.6";
      }
      
    }
    
    changeBtn.addEventListener("click", async () => {
      const newPassword = newPassInput.value.trim();
      const username = session.user.username;
    
      try {
        const res = await fetch("/api/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, newPassword })
        });
    
        const data = await res.json();
        if (data.success) {
          if (data.success) {
            modal.innerHTML = `
              <h2 style="font-size: 20px; margin-bottom: 16px;">✅ Паролата е сменена</h2>
              <p style="font-size: 14px; color: #333; margin-bottom: 20px;">
                Паролата е сменена успешно. Моля, излез от акаунта си и влез отново с новата парола.
              </p>
              <button id="logoutBtn" style="
                padding: 10px 20px;
                background-color: #29ca8e;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
              ">Изход и нов вход</button>
            `;
          
// 👉 ЕТО ТУК ДОБАВИ ЗАКЛЮЧВАНЕТО:
history.pushState(null, null, location.href);
window.__genlinkBlockPopState = () => history.pushState(null, null, location.href);
window.addEventListener("popstate", window.__genlinkBlockPopState);

window.__genlinkBlockKeys = (e) => {
  if ((e.key === "F5") || (e.ctrlKey && e.key === "r")) e.preventDefault();
};
window.addEventListener("keydown", window.__genlinkBlockKeys);

window.__genlinkBlockUnload = (e) => {};

window.addEventListener("beforeunload", window.__genlinkBlockUnload);

            const logoutBtn = modal.querySelector("#logoutBtn");
            logoutBtn.addEventListener("click", async () => {
              await fetch("/api/logout", {
                method: "POST",
                credentials: "include"
              });
              window.location.href = "index.html";
            });
          }
          

        } else {
          alert("Грешка при запис в базата: " + (data.message || "неуспешно"));
        }
      } catch (err) {
        console.error("Грешка при заявка:", err);
        alert("Сървърна грешка при запис.");
      }
    });
    
    

    newPassInput.addEventListener("input", checkValidity);
    repeatPassInput.addEventListener("input", checkValidity);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  });
});
// Динамични стилове за дизейбълнати елементи (визуален вид)
const style = document.createElement("style");
style.textContent = `
  input[disabled] {
    background-color: #f5f5f5 !important;
    color: #777 !important;
    cursor: not-allowed !important;
  }

  #changePassBtn:disabled {
    background-color: #d8d8d8 !important;
    color: #777 !important;
    cursor: not-allowed !important;
    border: none !important;
    opacity: 1 !important;
  }
`;

document.head.appendChild(style);
