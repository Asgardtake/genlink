// Функция за създаване на админ логин попъп
function createAdminLoginPopup() {
  const modal = document.createElement("div");
  modal.id = "adminUserPopup";
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: #000000cc; display: flex; align-items: center; justify-content: center;
    z-index: 9999;
  `;

  modal.innerHTML = ` 
    <div style="width: 320px; background: #fff; padding: 20px; border-radius: 8px; position: relative;">
      <h3 style="margin-top:0">Genlink Администратор</h3>
      <input id="adminUsername" type="text" placeholder="Потребителско име" style="width:100%; padding:8px; margin:10px 0;">
      <input id="adminPassword" type="password" placeholder="Парола" style="width:100%; padding:8px; margin-bottom:10px;">
      <div id="adminLoginError" style="color:red; font-size:14px; margin-bottom:8px;"></div>
      <button id="adminLoginButton" style="width:100%; background:#29ca8e; color:#fff; border:none; padding:10px;">Вход</button>
    </div>
  `;

  document.body.appendChild(modal);

  const loginButton = document.getElementById("adminLoginButton");
  const usernameInput = document.getElementById("adminUsername");
  const passwordInput = document.getElementById("adminPassword");
  const errorDiv = document.getElementById("adminLoginError");

  loginButton.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Глобална проверка за празни полета
    if (!username || !password) {
      errorDiv.textContent = "Попълни всички полета.";
      return;
    }

    // Валидация за username
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
      errorDiv.textContent = "Потребителското име трябва да съдържа само латиница, цифри, точки или долни черти.";
      return;
    }
    if (!username.endsWith("_gsu.admin")) {
      errorDiv.textContent = "Грешно потребителско име!";
      return;
    }

    // Валидация за password
const passwordRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/';~]+$/;

    if (!passwordRegex.test(password)) {
      errorDiv.textContent = "Паролата съдържа неразрешени символи.";
      return;
    }
    if (password.length < 6) {
      errorDiv.textContent = "Паролата трябва да бъде поне 6 символа.";
      return;
    }
    if (!/[A-Z]/.test(password)) {
      errorDiv.textContent = "Паролата трябва да съдържа поне една главна буква.";
      return;
    }
    if (!/[0-9]/.test(password)) {
      errorDiv.textContent = "Паролата трябва да съдържа поне една цифра.";
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/';~]/.test(password)) {
      errorDiv.textContent = "Паролата трябва да съдържа поне един специален символ.";
      return;
    }

    // Ако всичко е валидно, правим заявка
    errorDiv.textContent = "";

    fetch("/api/admin_login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          sessionStorage.setItem("adminLoggedIn", "true");
          location.reload();
        } else {
          errorDiv.textContent = "Невалидни данни.";
        }
      })
      .catch(() => {
        errorDiv.textContent = "Грешка при връзка със сървъра.";
      });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const greetingBlock = document.getElementById("adminGreeting");
if (sessionStorage.getItem("adminLoggedIn") !== "true" && greetingBlock) {
  greetingBlock.style.display = "none";
}

  if (sessionStorage.getItem("adminLoggedIn") !== "true") {
    createAdminLoginPopup();
  } else {
    loadUsers();
  }
});

function loadUsers() {
  const container = document.querySelector(".col-md-4.col-sm-4[style*='width:100%']");
  container.innerHTML = ""; // Изчистваме всичко

  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.marginTop = "20px";
  table.style.borderCollapse = "separate";
  table.style.borderSpacing = "0";

  const headerRow = document.createElement("tr");
  const headers = ["Потребителско име", "E-mail", "Парола", "GenLink"];
  headers.forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    th.style.borderBottom = "2px solid #29ca8e";
    th.style.padding = "12px";
    th.style.textAlign = "left";
    th.style.fontSize = "16px";
    th.style.color = "#29ca8e";
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  fetch(`${window.location.origin}/api/users`)
    .then((response) => response.json())
    .then((users) => {
      users.forEach((user) => {
        const row = document.createElement("tr");
        row.style.transition = "background 0.2s ease";
        row.style.cursor = user.Username.endsWith("_gsu.admin") ? "default" : "pointer";

        
        // Потребителско име
        const usernameCell = document.createElement("td");
        usernameCell.style.backgroundColor = "transparent";
        usernameCell.style.transition = "all 0.3s ease";
        usernameCell.style.padding = "10px";
        usernameCell.style.textAlign = "left";

        if (user.Username.endsWith("_gsu.admin")) {
          const fullUsername = user.Username;
          const maskedUsername = 
            fullUsername.length > 5 
              ? fullUsername.slice(0, 3) + '*****' + fullUsername.slice(-2) + '...'
              : fullUsername;
          usernameCell.textContent = maskedUsername;
        } else {
          usernameCell.textContent = user.Username || "";
        }
        row.appendChild(usernameCell);

        if (user.Username.endsWith("_gsu.admin")) {
          // Ако е админ
          const adminInfoCell = document.createElement("td");
          adminInfoCell.textContent = "Админски профил";
          adminInfoCell.style.color = "#e74c3c";
          adminInfoCell.style.fontSize = "14px";
          adminInfoCell.style.fontWeight = "normal";
          adminInfoCell.style.padding = "10px";
          adminInfoCell.style.textAlign = "left";

          const emptyCell1 = document.createElement("td");
          emptyCell1.textContent = "—";
          emptyCell1.style.padding = "10px";
          emptyCell1.style.textAlign = "left";

          const emptyCell2 = document.createElement("td");
          emptyCell2.textContent = "—";
          emptyCell2.style.padding = "10px";
          emptyCell2.style.textAlign = "left";

          row.appendChild(adminInfoCell);
          row.appendChild(emptyCell1);
          row.appendChild(emptyCell2);
        } else {
          // Ако е нормален потребител
          const emailCell = document.createElement("td");
          emailCell.style.backgroundColor = "transparent";
          emailCell.style.transition = "all 0.3s ease";
          emailCell.textContent = user.Email || "";
          emailCell.style.padding = "10px";
          emailCell.style.textAlign = "left";
          row.appendChild(emailCell);


          const passwordCell = document.createElement("td");
          passwordCell.style.backgroundColor = "transparent";
          passwordCell.style.transition = "all 0.3s ease";
          passwordCell.textContent = user.Password || "";
          passwordCell.style.padding = "10px";
          passwordCell.style.textAlign = "left";
          row.appendChild(passwordCell);


          const linkCell = document.createElement("td");
          linkCell.style.backgroundColor = "transparent";
          linkCell.style.transition = "all 0.3s ease";
          linkCell.style.padding = "10px";
          linkCell.style.lineHeight = "1.8";
          linkCell.style.textAlign = "left";

          const links = [user.Link1, user.Link2, user.Link3].filter(Boolean);
          if (links.length > 0) {
            links.forEach((link) => {
              const linkElement = document.createElement("span");
              linkElement.textContent = link;
              linkElement.style.display = "block";
              linkElement.style.color = "#333";
              linkElement.style.marginBottom = "8px";
              linkCell.appendChild(linkElement);
            });
          } else {
            linkCell.textContent = "—";
          }
          row.appendChild(linkCell);
        }

        // Едва тук вземаме всички клетки
        const adminCells = row.querySelectorAll("td");

        if (user.Username.endsWith("_gsu.admin")) {
          if (adminCells.length > 0) {
            adminCells[0].style.borderTopLeftRadius = "10px";
            adminCells[0].style.borderBottomLeftRadius = "10px";
            adminCells[adminCells.length - 1].style.borderTopRightRadius = "10px";
            adminCells[adminCells.length - 1].style.borderBottomRightRadius = "10px";
          }
          row.style.backgroundColor = "#ffecec";
          adminCells.forEach((cell) => {
            cell.style.backgroundColor = "#ffecec";
            cell.style.transition = "all 0.3s ease";
          });
        } else {
          row.addEventListener("mouseenter", () => {
            if (adminCells.length > 0) {
              adminCells[0].style.borderTopLeftRadius = "10px";
              adminCells[0].style.borderBottomLeftRadius = "10px";
              adminCells[adminCells.length - 1].style.borderTopRightRadius = "10px";
              adminCells[adminCells.length - 1].style.borderBottomRightRadius = "10px";
              adminCells.forEach((cell) => {
                cell.style.backgroundColor = "#29ca8e";
                cell.style.color = "#fff";              
                // Ако има вложени спанове (GenLink), оцвети и тях
                const spans = cell.querySelectorAll("span");
                spans.forEach(span => {
                  span.style.color = "#fff";
              });
            });
            }
          });

          row.addEventListener("mouseleave", () => {
            adminCells.forEach((cell) => {
              cell.style.backgroundColor = "transparent";
              cell.style.color = "#333"; 
          
              // Ако има вложени спанове (GenLink), връщаме и техния цвят
              const spans = cell.querySelectorAll("span");
              spans.forEach(span => {
                span.style.color = "#333";
              });
            });
          });

          row.addEventListener("click", () => {
            showUserPopup(user);
          });
        }

        table.appendChild(row);
      });

      container.appendChild(table);
    })
    .catch((err) => {
      console.error("⚠️ Грешка при зареждане на потребителите:", err);
      const error = document.createElement("p");
      error.textContent = "⚠️ Грешка при зареждане на потребителите.";
      error.style.color = "#e74c3c";
      error.style.padding = "10px";
      container.appendChild(error);
    });
}

function adminLogout() {
  sessionStorage.removeItem("adminLoggedIn");

  // Скриваме секцията с таблицата
  const container = document.querySelector(".col-md-4.col-sm-4[style*='width:100%']");
  if (container) container.innerHTML = "";

  // Скриваме поздравителния текст
  const greetingBlock = document.getElementById("adminGreeting");
  if (greetingBlock) greetingBlock.remove();

  // Показваме попъпа за логин
  createAdminLoginPopup();
}
// Попъп за всеки ред
  function showUserPopup(user) {
    const modal = document.createElement("div");
    modal.id = "userPopupModal"; //Даваме ID
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: #000000cc; display: flex; align-items: center; justify-content: center;
      z-index: 9999;
    `;
  
    const content = document.createElement("div");
    content.style.cssText = `
      background: white; padding: 24px; border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: sans-serif;
      display: inline-block;
    `;
  
    const links = [user.Link1, user.Link2, user.Link3].filter(Boolean);
const linkInputs = links.length > 0
  ? links.map((link, i) => `<input type="text" value="${link}" style="width:100%; padding:8px; margin-bottom: 10px;" placeholder="Линк ${i + 1}">`).join("")
  : `<p style="color:#888; font-size:14px;">Няма запазени линкове</p>`;

  
    content.innerHTML = `
  <h3 style="margin-top:0; margin-bottom: 16px;">Информация за <span style="color:#29ca8e;">${user.Username || "потребителя"}</span></h3>
  <p style="font-size:12px; font-weight:regular; color:#999; margin-bottom: 16px; line-height: 1.8;">
    <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM4 20v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1H4z"/>
    </svg>
    Потребителско име: латиница, до 15 символа, без специални.<br>
    <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
    Имейл: валиден формат, само латиница, известни домейни.<br>
    <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;">
      <path d="M12 17c.83 0 1.5-.67 1.5-1.5S12.83 14 12 14s-1.5.67-1.5 1.5S11.17 17 12 17zm6-5V8c0-3.31-2.69-6-6-6S6 4.69 6 8v4c-1.1 0-2 .9-2 2v6h16v-6c0-1.1-.9-2-2-2zM8 8c0-2.21 1.79-4 4-4s4 1.79 4 4v4H8V8z"/>
    </svg>
    Парола: мин. 6 символа, 1 главна буква, 1 цифра, 1 спец. символ.
  </p>
  
  <div style="display: flex; gap: 10px; margin-bottom: 4px;">
    <label style="flex:1; font-size: 14px;">Потребителско име</label>
    <label style="flex:1; font-size: 14px;">E-mail</label>
    <label style="flex:1; font-size: 14px;">Парола</label>
  </div>
  
  <div style="display: flex; gap: 10px; margin-bottom: 8px;">
    <input id="popupUsername" type="text" value="${user.Username || ''}" style="flex:1; min-width: 160px; padding: 8px;" placeholder="Потребителско име">
    <input id="popupEmail" type="text" value="${user.Email || ''}" style="flex:1; min-width: 160px; padding: 8px;" placeholder="E-mail">
    <input id="popupPassword" type="text" value="${user.Password || ''}" style="flex:1; min-width: 160px; padding: 8px;" placeholder="Парола">
  </div>
  
  <div id="popupUsernameError" style="color:#e74c3c; font-size:13px; margin-bottom:8px;"></div>
  <div id="popupEmailError" style="color:#e74c3c; font-size:13px; margin-bottom:8px;"></div>
  <div id="popupPasswordError" style="color:#e74c3c; font-size:13px; margin-bottom:8px;"></div>
  <div id="popupGlobalError" style="color:#e74c3c; font-size:13px; margin-bottom:8px;"></div>
  
  ${linkInputs}
  
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
    <button id="deleteUserBtn"
      style="padding:6px 12px; background:white; color:#e74c3c; border:1px solid #e74c3c; border-radius:4px; font-size:13px;">
      Изтрий акаунта
    </button>
    <div style="display: flex; gap: 10px;">
      <button id="saveUserBtn" style="padding:8px 16px; background:#29ca8e; color:white; border:none; border-radius:4px;">Запази</button>
      <button id="cancelUserPopupBtn" style="padding:8px 16px; background:#e74c3c; color:white; border:none; border-radius:4px;">Отмяна</button>
    </div>
  </div>
  `;
  
    modal.appendChild(content);
    document.body.appendChild(modal);
  
    // Бутон "Отмяна"
    const cancelBtn = content.querySelector("#cancelUserPopupBtn");
    cancelBtn.addEventListener("click", () => {
      modal.remove();
    });

  const popupUsername = content.querySelector("#popupUsername");
  const popupEmail = content.querySelector("#popupEmail");
  const popupPassword = content.querySelector("#popupPassword");
  const usernameError = content.querySelector("#popupUsernameError");
  const emailError = content.querySelector("#popupEmailError");
  const passwordError = content.querySelector("#popupPasswordError");
  const globalError = content.querySelector("#popupGlobalError");

  function checkGlobalEmptyFields() {
    const usernameVal = popupUsername.value.trim();
    const emailVal = popupEmail.value.trim();
    const passVal = popupPassword.value.trim();

    if (!usernameVal || !emailVal || !passVal) {
      globalError.textContent = "Моля, попълнете всички полета.";
    } else {
      globalError.textContent = "";
    }
  }

  function validatePopupUsername() {
    const value = popupUsername.value.trim();
    if (!value) return false;
    if (!/^[a-zA-Z0-9._-]+$/.test(value) || value.length > 15) {
      usernameError.textContent = "Грешно потребителско име";
      return false;
    }
    usernameError.textContent = "";
    return true;
  }

  function validatePopupEmail() {
    const value = popupEmail.value.trim();
    if (!value) return false;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domainPart = value.split(".").pop()?.toLowerCase() || "";
    const allowedTLDs = ["com","net","org","edu","info","gov","biz","co","bg","de","fr","uk","us","it","es","ru","jp","cn","ca","au","nl","se","no","fi","pl","gr","ch","at","cz","sk","ro","rs","tr","ua","kr","br","mx","ar","za","dk","be","nz","in","pt","hu","lt","lv","ee","si","hr","il","ae","sa","ie"];
    if (/[А-Яа-я]/.test(value) || !emailPattern.test(value) || domainPart.length < 2 || !allowedTLDs.includes(domainPart)) {
      emailError.textContent = "Грешно въведен мейл";
      return false;
    }
    emailError.textContent = "";
    return true;
  }

  function validatePopupPassword() {
    const value = popupPassword.value.trim();
    if (!value) return false;
   const valid = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/';~]+$/.test(value)
            && /[A-Z]/.test(value)
            && /[0-9]/.test(value)
            && /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/';~]/.test(value)
            && value.length >= 6;

    if (!valid) {
      passwordError.textContent = "Грешно въведена парола";
      return false;
    }
    passwordError.textContent = "";
    return true;
  }

  popupUsername.addEventListener("input", () => {
    validatePopupUsername();
    checkGlobalEmptyFields();
  });
  popupEmail.addEventListener("input", () => {
    validatePopupEmail();
    checkGlobalEmptyFields();
  });
  popupPassword.addEventListener("input", () => {
    validatePopupPassword();
    checkGlobalEmptyFields();
  });

  popupUsername.addEventListener("blur", checkGlobalEmptyFields);
  popupEmail.addEventListener("blur", checkGlobalEmptyFields);
  popupPassword.addEventListener("blur", checkGlobalEmptyFields);

  popupUsername.addEventListener("paste", checkGlobalEmptyFields);
  popupEmail.addEventListener("paste", checkGlobalEmptyFields);
  popupPassword.addEventListener("paste", checkGlobalEmptyFields);

  content.querySelector("#saveUserBtn").addEventListener("click", () => {
    const usernameVal = popupUsername.value.trim();
    const emailVal = popupEmail.value.trim();
    const passVal = popupPassword.value.trim();

    if (!usernameVal || !emailVal || !passVal) {
      globalError.textContent = "Моля, попълнете всички полета.";
      return;
    }

    globalError.textContent = "";
    const validUser = validatePopupUsername();
    const validEmail = validatePopupEmail();
    const validPass = validatePopupPassword();
    if (!validUser || !validEmail || !validPass) return;

    fetch("/api/update-user", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    oldUsername: user.Username, // старото потребителско име (за да знаем кой е бил)
    newUsername: usernameVal,
    newEmail: emailVal,
    newPassword: passVal
  }),
})
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP статус: ${res.status}`);
    }
    return res.json();
  })
.then((data) => {
  if (data.success) {
    showAlertModal("✅ Успешно запазихте промените.");
    modal.remove();
    loadUsers();
  } else {
    // Ако получим съобщение от сървъра (например username/email съществува)
    globalError.textContent = "❌ " + (data.message || "Неуспешно запазване.");
  }
})
.catch((err) => {
  if (err.message && err.message.includes("409")) {
    globalError.textContent = "❌ Потребителско име или имейл вече съществуват.";
  } else {
    console.error("⚠️ Грешка при update:", err);
    globalError.textContent = "⚠️ Възникна грешка при връзка със сървъра.";
  }
});
  });

  const deleteBtn = content.querySelector("#deleteUserBtn");
  deleteBtn.addEventListener("click", () => {
    showConfirmModal(`Наистина ли искаш да изтриеш акаунта на "${user.Username}"?`, () => {
      fetch(`/api/delete-user/${encodeURIComponent(user.Username)}`, {
        method: "DELETE"
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP статус: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (data.success) {
            showAlertModal("Акаунтът беше успешно изтрит.");
  
            // Премахваме реда от таблицата
            const rows = document.querySelectorAll("table tr");
            rows.forEach((row, i) => {
              if (i === 0) return;
              const usernameCell = row.querySelector("td");
              if (usernameCell && usernameCell.textContent.trim() === user.Username) {
                row.remove();
              }
            });
  
            modal.remove();
          } else {
            showAlertModal("❌ Неуспешно изтриване: " + (data.message || "неизвестна грешка."));
          }
        })
        .catch(err => {
          showAlertModal("⚠️ Възникна грешка при връзка със сървъра или при обработка на отговора.");
          console.error("❌ Delete error:", err);
        });
    });
  }); 
}
function showConfirmModal(message, onConfirm) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
    z-index: 10000;
  `;

  const box = document.createElement("div");
  box.style.cssText = `
    background: white; padding: 20px; border-radius: 6px;
    width: 320px; text-align: center; font-family: sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;

  box.innerHTML = `
    <p style="margin-bottom: 20px; color: #333;">${message}</p>
    <div style="display: flex; justify-content: center; gap: 10px;">
      <button id="confirmYes" style="padding: 8px 16px; background: #29ca8e; color: white; border: none; border-radius: 4px;">OK</button>
      <button id="confirmNo" style="padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 4px;">Cancel</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  box.querySelector("#confirmYes").addEventListener("click", () => {
    overlay.remove();
    if (typeof onConfirm === "function") onConfirm();
  });

  box.querySelector("#confirmNo").addEventListener("click", () => {
    overlay.remove();
  });
}

function showAlertModal(message) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
    z-index: 10000;
  `;

  const box = document.createElement("div");
  box.style.cssText = `
    background: white; padding: 20px; border-radius: 6px;
    width: 320px; text-align: center; font-family: sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;

  box.innerHTML = `
    <p style="margin-bottom: 20px; color: #333;">${message}</p>
    <button style="padding: 8px 16px; background: #29ca8e; color: white; border: none; border-radius: 4px;">OK</button>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  box.querySelector("button").addEventListener("click", () => {
    overlay.remove();
  });
}

// Version: v1.1.3 | Last updated: 2025-04-29
