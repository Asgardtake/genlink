// Функция за създаване на админ логин попъп
// Показва модален прозорец за въвеждане на потребителско име и парола
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

  document.getElementById("adminLoginButton").addEventListener("click", () => {
    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value.trim();
    const errorDiv = document.getElementById("adminLoginError");

    // Първо глобална проверка за празни полета
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
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*(),.?\":{}|<>_\-+=\[\]\\\/'`;~]+$/;
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
    if (!/[!@#$%^&*(),.?\":{}|<>_\-+=\[\]\\\/'`;~]/.test(password)) {
      errorDiv.textContent = "Паролата трябва да съдържа поне един специален символ.";
      return;
    }

    // Ако стигне до тук — всичко е наред
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
