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

// Зарежда линковете на логнатия потребител и добавя бутони за изтриване и копиране
async function loadGeneratedLinks() {
  try {
    const response = await fetch('/api/user-links');
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
            fetch('/api/clear-link', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ field })
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

// Изпълнява се при зареждане на страницата – проверява сесията
// попълва полетата и активира логика за редакция на профила
document.addEventListener("DOMContentLoaded", () => {
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

      const usernameInput = document.getElementById("profileUsername");
      const emailInput = document.getElementById("profileEmail");
      const passwordInput = document.getElementById("profilePassword");

      if (usernameInput) usernameInput.value = user.username || "";
      if (emailInput) emailInput.value = user.email || "";
      if (passwordInput) passwordInput.value = user.password || "";

      const originalData = {
        username: user.username,
        email: user.email,
        password: user.password
      };

      if (typeof showLoggedInNavbar === "function") {
        showLoggedInNavbar(user.username);
      }

      loadGeneratedLinks();

      const linkInputs = ["genlo", "genlt", "genltr"];
      const inputsMap = {
        genlo: 'Link1',
        genlt: 'Link2',
        genltr: 'Link3'
      };

      [usernameInput, emailInput, passwordInput].forEach((input) => {
        input.addEventListener("input", checkForChanges);
        input.addEventListener("blur", checkForChanges);
      });

      // Проверява дали има промени и дали всички полета са валидни,
      // за да се покаже активен бутон "Запази"      
      function checkForChanges() {
        const currentUsername = usernameInput.value.trim();
        const currentEmail = emailInput.value.trim();
        const currentPassword = passwordInput.value.trim();

        const usernameError = validateUsername(currentUsername);
        const emailError = validateEmail(currentEmail);
        const passwordError = validatePassword(currentPassword);

        if (usernameError) showError(usernameInput, usernameError);
        else removeError(usernameInput);

        if (emailError) showError(emailInput, emailError);
        else removeError(emailInput);

        if (passwordError) showError(passwordInput, passwordError);
        else removeError(passwordInput);

        const allMatchOriginal =
          currentUsername === (originalData.username || "") &&
          currentEmail === (originalData.email || "") &&
          currentPassword === (originalData.password || "");

        const allValid = !usernameError && !emailError && !passwordError;

        if (!allMatchOriginal && allValid) {
          enableSaveButton();
        } else {
          disableSaveButton();
        }
      }
      // Създава и показва активен бутон "Запази"
      function enableSaveButton() {
        const saveContainer = document.querySelector(".pricing-bottom");
        if (!saveContainer.querySelector("a.pricing-btn")) {
          const newBtn = document.createElement("a");
          newBtn.href = "#";
          newBtn.textContent = "Запази";
          newBtn.classList.add("section-btn", "pricing-btn");
          saveContainer.innerHTML = "";
          saveContainer.appendChild(newBtn);
        }
      }
      // Показва неактивен сив бутон "Запази"
      function disableSaveButton() {
        const saveContainer = document.querySelector(".pricing-bottom");
        if (!saveContainer.querySelector("p.disabled-btn")) {
          const newP = document.createElement("p");
          newP.className = "section-btn pricing-btn disabled-btn";
          newP.textContent = "Запази";
          saveContainer.innerHTML = "";
          saveContainer.appendChild(newP);
        }
      }
      // Показва съобщение за грешка под дадено поле
      function showError(input, message) {
        removeError(input);
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
      // Премахва съобщение за грешка под дадено поле
      function removeError(input) {
        const next = input.nextSibling;
        if (next && next.classList && next.classList.contains("input-error")) {
          next.remove();
        }
        input.style.marginBottom = "20px";
      }
      // Валидация на потребителско име
      function validateUsername(value) {
        if (!/^[a-z0-9._-]{1,15}$/.test(value.toLowerCase())) {
          return "Позволени: малки латински букви, цифри, точка, тире и долна черта (макс. 15 символа).";
        }
        return "";
      }
      // Валидация на имейл адрес
      function validateEmail(value) {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return "Невалиден e-mail адрес.";
        }
        return "";
      }
       // Валидация на парола
      function validatePassword(value) {
        if (!/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/.test(value)) {
          return "Позволена е само латиница.";
        }
        if (!/[A-Z]/.test(value)) {
          return "Паролата трябва да съдържа поне една главна буква.";
        }
        if (!/[0-9]/.test(value)) {
          return "Паролата трябва да съдържа поне една цифра.";
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(value)) {
          return "Паролата трябва да съдържа поне един специален символ.";
        }
        if (value.length < 6) {
          return "Паролата трябва да е поне 6 символа.";
        }
        return "";
      }
    })
    .catch(err => {
      console.error("Грешка при зареждане на потребителските данни:", err);
      window.location.href = "index.html";
    });
});
// При връщане назад/напред със стрелките на браузъра – проверява отново сесията
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

// Version: v1.0.4 | Last updated: 2025-05-11
