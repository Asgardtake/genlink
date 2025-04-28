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
      errorDiv.textContent = "Потребителското име трябва да завършва на '_gsu.admin'.";
      return;
    }

    // Валидация за password
const passwordRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/'`;~]+$/;

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
  table.style.borderCollapse = "collapse";
  table.style.marginTop = "20px";

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
        row.style.cursor = "pointer";

        row.addEventListener("mouseenter", () => {
          row.style.backgroundColor = "#f5f5f5";
        });
        row.addEventListener("mouseleave", () => {
          row.style.backgroundColor = "transparent";
        });

        row.addEventListener("click", () => {
          showUserPopup(user);
        });

        const usernameCell = document.createElement("td");
        usernameCell.textContent = user.Username || "";
        usernameCell.style.padding = "10px";
        usernameCell.style.textAlign = "left";
        row.appendChild(usernameCell);

        const emailCell = document.createElement("td");
        emailCell.textContent = user.Email || "";
        emailCell.style.padding = "10px";
        emailCell.style.textAlign = "left";
        row.appendChild(emailCell);

        const passwordCell = document.createElement("td");
        passwordCell.textContent = user.Password || "";
        passwordCell.style.padding = "10px";
        passwordCell.style.textAlign = "left";
        row.appendChild(passwordCell);

        const linkCell = document.createElement("td");
        linkCell.style.padding = "10px";
        linkCell.style.lineHeight = "1.8";
        linkCell.style.textAlign = "left";
        linkCell.style.position = "relative";

        const links = [user.Link1, user.Link2, user.Link3].filter(Boolean);
        if (links.length > 0) {
          links.forEach((link) => {
            const linkElement = document.createElement("a");
            linkElement.href = link;
            linkElement.textContent = link;
            linkElement.style.display = "block";
            linkElement.style.color = "#333";
            linkElement.style.textDecoration = "none";
            linkElement.style.marginBottom = "8px";
            linkCell.appendChild(linkElement);
          });
        } else {
          linkCell.textContent = "—";
        }

        row.appendChild(linkCell);
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
  if (greetingBlock) greetingBlock.style.display = "none";

  // Показваме попъпа за логин
  createAdminLoginPopup();
}

