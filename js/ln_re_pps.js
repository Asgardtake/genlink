  // ------------------------------
  // Проверка дали даден RGB цвят е светъл (за контраст)
  // ------------------------------
  function isColorLight(rgbString) {
    if (!rgbString.startsWith("rgb")) return false;
    const [r, g, b] = rgbString
      .replace("rgb(", "")
      .replace(")", "")
      .split(",")
      .map(c => parseInt(c.trim()));
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 186; // стойност над 186 се счита за "светъл" цвят
  }
  // ------------------------------
  // Scroll-based dynamic color update
  // ------------------------------
  // Променя цветовете на username, кръга и точките в зависимост от цвета на менюто
  function updateNavbarColorsByBackground() {
    const usernameEl = document.querySelector(".username-span");
    const initialsEl = document.querySelector(".initials-circle");
    const dotsEl = document.querySelector(".user-menu-dots");
    if (!usernameEl || !initialsEl || !dotsEl) return;
    // Взимаме текущия background цвят на navbar-а
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;
    const bgColor = window.getComputedStyle(navbar).backgroundColor;
    const isLightBg = isColorLight(bgColor); // проверка дали е светъл фон
    if (isLightBg) {
      // Ако е светъл: username черен, кръг зелен с бели букви, точки зелени
      usernameEl.style.color = "#000";
      initialsEl.style.backgroundColor = "#29ca8e";
      initialsEl.style.color = "#fff";
      dotsEl.style.color = "#29ca8e";
    } else {
      // Ако е тъмен: username бял, кръг бял със зелени букви, точки бели
      usernameEl.style.color = "#fff";
      initialsEl.style.backgroundColor = "#fff";
      initialsEl.style.color = "#29ca8e";
      dotsEl.style.color = "#fff";
    }
  }
// Функция: визуализира логнатия потребител в навигацията
// ------------------------------
function showLoggedInNavbar(username) {
  const navbarRight = document.querySelector(".navbar-right");

  // Ако няма контейнер или вече има потребител – спирай
  if (!navbarRight || navbarRight.querySelector(".user-display")) return;

  // 🔥 Премахваме бутоните „Вход“ и „Регистрация“
  const loginBtn = navbarRight.querySelector('a[href="profile.html"]');
  const regBtn = navbarRight.querySelector(".genrnav");
  if (loginBtn) loginBtn.parentElement.remove();
  if (regBtn) regBtn.parentElement.remove();


  const li = document.createElement("li");
  li.className = "user-display";
  li.style.display = "flex";
  li.style.alignItems = "center";
  li.style.gap = "6px";

  const usernameSpan = document.createElement("span");
  usernameSpan.textContent = username;
  usernameSpan.className = "username-span";
  usernameSpan.style.fontWeight = "500";
  usernameSpan.style.fontSize = "16px";
  usernameSpan.style.color = "#fff";

  const initials = username.slice(0, 2).toUpperCase();
  const circleSpan = document.createElement("span");
  circleSpan.className = "initials-circle";
  circleSpan.textContent = initials;
  circleSpan.style.fontSize = "14px";
  circleSpan.style.fontWeight = "bold";
  circleSpan.style.width = "28px";
  circleSpan.style.height = "28px";
  circleSpan.style.borderRadius = "50%";
  circleSpan.style.display = "inline-flex";
  circleSpan.style.alignItems = "center";
  circleSpan.style.justifyContent = "center";
  circleSpan.style.marginLeft = "4px";
  circleSpan.style.backgroundColor = "#fff";
  circleSpan.style.color = "#29ca8e";

  const menuDots = document.createElement("span");
  menuDots.className = "user-menu-dots";
  menuDots.textContent = "⋮";
  menuDots.style.width = "18px";
  menuDots.style.textAlign = "center";
  menuDots.style.fontSize = "24px";
  menuDots.style.fontWeight = "bolder";
  menuDots.style.cursor = "pointer";
  menuDots.style.lineHeight = "1";
  menuDots.style.color = "#fff";

  li.appendChild(usernameSpan);
  li.appendChild(circleSpan);
  li.appendChild(menuDots);
  navbarRight.appendChild(li);

  // dropdown меню
  menuDots.addEventListener("click", function (e) {
    e.stopPropagation();
    const existingDropdown = document.getElementById("userDropdownMenu");
    if (existingDropdown) {
      existingDropdown.remove();
      return;
    }

    const dropdown = document.createElement("div");
    dropdown.id = "userDropdownMenu";
    dropdown.style.position = "absolute";
    dropdown.style.top = "100%";
    dropdown.style.right = "0";
    dropdown.style.marginTop = "20px";
    dropdown.style.backgroundColor = "#fff";
    dropdown.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
    dropdown.style.borderRadius = "8px";
    dropdown.style.overflow = "hidden";
    dropdown.style.minWidth = "140px";
    dropdown.style.zIndex = "9999";

    const profileItem = document.createElement("a");
    profileItem.href = "uzerprofile.html";
    profileItem.textContent = "Моят профил";
    profileItem.style.display = "block";
    profileItem.style.padding = "10px 16px";
    profileItem.style.color = "#333";
    profileItem.style.textDecoration = "none";
    profileItem.style.fontSize = "14px";
    profileItem.style.borderBottom = "1px solid #eee";
    profileItem.addEventListener("mouseover", () => {
      profileItem.style.background = "#29ca8e";
      profileItem.style.color = "#fff";
    });
    profileItem.addEventListener("mouseout", () => {
      profileItem.style.background = "transparent";
      profileItem.style.color = "#333";
    });

    const logoutItem = document.createElement("a");
    logoutItem.href = "#";
    logoutItem.textContent = "Изход";
    logoutItem.style.display = "block";
    logoutItem.style.padding = "10px 16px";
    logoutItem.style.color = "#e74c3c";
    logoutItem.style.textDecoration = "none";
    logoutItem.style.fontSize = "14px";
    logoutItem.addEventListener("mouseover", () => {
      logoutItem.style.background = "#D9001E";
      logoutItem.style.color = "#fff";
    });
    logoutItem.addEventListener("mouseout", () => {
      logoutItem.style.background = "transparent";
      logoutItem.style.color = "#e74c3c";
    });

    logoutItem.addEventListener("click", () => {
      fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      }).then(() => location.reload());
    });

    dropdown.appendChild(profileItem);
    dropdown.appendChild(logoutItem);
    menuDots.style.position = "relative";
    menuDots.appendChild(dropdown);

    document.addEventListener("click", function outsideClickHandler(e) {
      if (!dropdown.contains(e.target)) {
        dropdown.remove();
        document.removeEventListener("click", outsideClickHandler);
      }
    });
  });
  // Извикваме веднъж при логин, и после при всяко скролване
  updateNavbarColorsByBackground();
  window.addEventListener("scroll", updateNavbarColorsByBackground);
}
document.addEventListener("DOMContentLoaded", function () {
  const regForm = document.getElementById("regForm");
  const logForm = document.getElementById("logForm");
  const regUsernameInput = document.getElementById("regUsername");
  const regPassInput = document.getElementById("regPass");
  const regRepeatInput = document.getElementById("regRepeat");
  const regEmailInput = document.getElementById("regEmail"); 
  const logUsernameInput = document.getElementById("logUsername");
  const logEmailInput = document.getElementById("logEmail");
  const logPassInput = document.getElementById("logPass");  
  window.closeModal = closeModal;
  window.openModal = openModal;

  // ------------------------------
  // ФУНКЦИЯ: изчистване на грешки
  // ------------------------------
  function clearAllErrors() {
    // Регистрация
    const registerErrors = document.querySelectorAll("#registerModal div[id$='Error']");
    registerErrors.forEach(el => el.remove());
    [regUsernameInput, regPassInput, regRepeatInput, regEmailInput].forEach(el => {
      if (el) el.style.marginBottom = "15px";
    });
    // Логин
    const loginErrors = document.querySelectorAll("#loginModal div[id$='Error']");
    loginErrors.forEach(el => el.remove());
    [logUsernameInput, logEmailInput, logPassInput].forEach(el => {
      if (el) el.style.marginBottom = "15px";
    });
    // Глобална login грешка
    const globalLoginError = document.getElementById("loginGlobalError");
    if (globalLoginError) globalLoginError.remove();
  }

  // ------------------------------
  // ФУНКЦИЯ: изчистване на форми
  // ------------------------------
  function clearFormFields(form) {
    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        input.checked = false;
      } else {
        input.value = "";
      }
    });
  }

  // ------------------------------
  // TOOLTIP адаптация за мобилни
  // ------------------------------
  function toggleTooltipsForMobile() {
    const isMobile = window.innerWidth <= 768;
    const tooltipIcons = document.querySelectorAll("span svg");
    const tooltips = document.querySelectorAll("div[style*='background-color: #333']");
    tooltipIcons.forEach(icon => {
      icon.parentNode.style.display = isMobile ? "none" : "flex";
    });
    tooltips.forEach(tip => {
      tip.style.display = isMobile ? "none" : "block";
    });
  }
// ------------------------------
// ИНИЦИАЛИЗАЦИЯ при зареждане
// ------------------------------
// Изчистваме всички стойности във формите за регистрация и вход
clearFormFields(regForm);
clearFormFields(logForm);
// Премахваме всички съобщения за грешки и възстановяваме стиловете по подразбиране
clearAllErrors(); //Чисти всичко при презареждане
// Скрии tooltip-и ако е мобилен изглед
toggleTooltipsForMobile();
// Повторно при resize – адаптира tooltip-ите според размера на екрана
window.addEventListener("resize", toggleTooltipsForMobile);
// ФУНКЦИЯ: Отваряне на модален прозорец (popup)
function openModal(modalId, overlayId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById(overlayId);
  // Показваме модала и overlay-а
  modal.style.display = "block";
  overlay.style.display = "block";
  // Премахваме "hide" класовете и добавяме "show" за анимация
  modal.classList.remove("hide");
  overlay.classList.remove("hide");
  requestAnimationFrame(() => {
    modal.classList.add("show");
    overlay.classList.add("show");
  });
  // Позволяваме затваряне с клавиша Escape
  document.addEventListener("keydown", escCloseHandler);
}
// ФУНКЦИЯ: Затваряне на модален прозорец
function closeModal(modalId, overlayId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById(overlayId);
  // Скриваме "show" класовете и добавяме "hide" за анимация
  modal.classList.remove("show");
  overlay.classList.remove("show");
  modal.classList.add("hide");
  overlay.classList.add("hide");
  // Изчистваме формите и грешките според типа модал
  if (modalId === "registerModal") {
    clearFormFields(regForm);
    clearAllErrors();
  } else if (modalId === "loginModal") {
    clearFormFields(logForm);
    clearAllErrors(); // ← добавено тук!
  }
  // След края на анимацията скриваме напълно елементите от изгледа
  modal.addEventListener("animationend", function handleModalEnd() {
    modal.style.display = "none";
    modal.classList.remove("hide");
  }, { once: true });
  overlay.addEventListener("animationend", function handleOverlayEnd() {
    overlay.style.display = "none";
    overlay.classList.remove("hide");
  }, { once: true });
  // Премахваме слушателя за клавиша Escape
  document.removeEventListener("keydown", escCloseHandler);
}
// ФУНКЦИЯ: Затваряне на модал с клавиша Escape
function escCloseHandler(e) {
  if (e.key === "Escape") {
    // Проверка кой модал е отворен и съответно го затваряме
    if (document.getElementById("registerModal").classList.contains("show")) {
      closeModal("registerModal", "registerModalOverlay");
    } else if (document.getElementById("loginModal").classList.contains("show")) {
      closeModal("loginModal", "loginModalOverlay");
    }
  }
}
// Отваряне на модали при клик
// При клик на бутона „Регистрация“
document.querySelector(".genrnav")?.addEventListener("click", () => {
  openModal("registerModal", "registerModalOverlay");
});
// При клик на бутона „Вход“
document.querySelector('a[href="profile.html"]')?.addEventListener("click", (e) => {
  e.preventDefault(); // Спираме стандартното поведение на линка
  openModal("loginModal", "loginModalOverlay");
});
// При клик извън модалите – затваряме прозореца
document.getElementById("registerModalOverlay")?.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeModal("registerModal", "registerModalOverlay");
});
document.getElementById("loginModalOverlay")?.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeModal("loginModal", "loginModalOverlay");
});
// Глобални shortcut функции за отваряне и затваряне
window.closeLoginModal = () => closeModal("loginModal", "loginModalOverlay");
window.closeRegisterModal = () => closeModal("registerModal", "registerModalOverlay");

  async function checkUsernameInDB(username) {
  try {
    const res = await fetch(`/api/check-username/${encodeURIComponent(username)}`, {
      credentials: "include"
    });
    const data = await res.json();
    return data.exists;
  } catch (error) {
    console.error("Грешка при проверка на username:", error);
    return false;
  }
}


async function checkEmailInDB(email) {
  try {
    const res = await fetch(`/api/check-email/${encodeURIComponent(email)}`, {
      credentials: "include"
    });
    const data = await res.json();
    return data.exists;
  } catch (error) {
    console.error("Грешка при проверка на email:", error);
    return false;
  }
}

// ------------------------------
// REGISTER POPUP
// ------------------------------
// ------------------------------
// Username validation – проверка на валидността на потребителското име
// ------------------------------
// Функция: показва съобщение за грешка под полето за потребителско име
function showUsernameError(message) {
  // Проверка дали вече има съществуващ елемент за грешка
  let errorEl = document.getElementById("usernameError");
  // Ако няма – създаваме нов <div> с нужните стилове и го поставяме след input-а
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "usernameError";
    // Стилове за съобщението
    errorEl.style.color = "#e74c3c";
    errorEl.style.marginTop = "4px";
    errorEl.style.fontSize = "14px";
    errorEl.style.marginBottom = "15px";
    errorEl.style.width = "100%";
    // Изравняваме отстоянието вляво според input-а
    const computedStyles = window.getComputedStyle(regUsernameInput);
    errorEl.style.paddingLeft = computedStyles.paddingLeft;
    // Вмъкваме го в DOM-а
    regUsernameInput.insertAdjacentElement("afterend", errorEl);
  }
  // Премахваме margin отдолу на полето и показваме съобщението
  regUsernameInput.style.marginBottom = "0px";
  errorEl.textContent = message;
}
// Функция: премахва съществуващото съобщение за грешка под username полето
function clearUsernameError() {
  const errorEl = document.getElementById("usernameError");
  if (errorEl) errorEl.remove();
  regUsernameInput.style.marginBottom = "15px";
}
// Функция: проверява дали въведеното потребителско име е валидно
async function validateUsername(showRequiredMsg = false) {
  const value = regUsernameInput.value.trim();
  const validPattern = /^[a-zA-Z0-9._-]+$/;

  if (value === "") {
    if (showRequiredMsg) showUsernameError("Моля, въведете потребителско име.");
    else clearUsernameError();
    return false;
  }

  if (!validPattern.test(value)) {
    showUsernameError("Позволени са само латински букви, цифри, точка (.), долна черта (_) и тире (-).");
    return false;
  }

  if (value.length > 15) {
    showUsernameError("Потребителското име не може да е по-дълго от 15 символа.");
    return false;
  }

  // 🧠 НОВО: проверка чрез бекенд API
  const isTaken = await checkUsernameInDB(value.toLowerCase());
  if (isTaken) {
    showUsernameError("Това потребителско име вече е заето.");
    return false;
  }

  clearUsernameError();
  return true;
}
// Събития за live валидация
// При напускане на полето
regUsernameInput.addEventListener("blur", () => validateUsername(true));
// При промяна на стойността
regUsernameInput.addEventListener("input", () => {
  const value = regUsernameInput.value.trim();
  if (value === "") clearUsernameError();
  else validateUsername(true);
});
// При поставяне на текст чрез paste
regUsernameInput.addEventListener("paste", () => {
  setTimeout(() => validateUsername(true), 10);
});

// ------------------------------
// Password validation – проверка на валидността на въведената парола
// ------------------------------
// Функция: показва съобщение за грешка под полето за парола
function showPasswordError(message) {
  // Проверка дали вече има съществуващ елемент за грешка
  let errorEl = document.getElementById("passwordError");
  // Ако няма – създаваме нов <div> с текст и стилове
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "passwordError";
    // Стилове за съобщението
    errorEl.style.color = "#e74c3c";
    errorEl.style.marginTop = "4px";
    errorEl.style.fontSize = "14px";
    errorEl.style.marginBottom = "15px";
    errorEl.style.width = "100%";
    // Вземаме лявото отстояние на input-а
    const computedStyles = window.getComputedStyle(regPassInput);
    errorEl.style.paddingLeft = computedStyles.paddingLeft;
    // Добавяме елемента в DOM под input полето
    regPassInput.insertAdjacentElement("afterend", errorEl);
  }
  // Коригираме margin на input-а и задаваме текста
  regPassInput.style.marginBottom = "0px";
  errorEl.textContent = message;
}
// Функция: премахва съществуващото съобщение за грешка
function clearPasswordError() {
  const errorEl = document.getElementById("passwordError");
  if (errorEl) errorEl.remove();
  regPassInput.style.marginBottom = "15px";
}
// Функция: проверява дали въведената парола отговаря на изискванията
function validatePassword(showRequiredMsg = false) {
  const value = regPassInput.value.trim();
  // Проверка за празно поле
  if (value === "") {
    if (showRequiredMsg) showPasswordError("Моля, въведете парола.");
    else clearPasswordError();
    return false;
  }
  // Проверка за позволени символи – само латиница и разрешени спец. символи
  if (!/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/'`;~]+$/.test(value)) {
    showPasswordError("Позволена е само латиница и стандартни символи.");
    return false;
  }
  // Проверка: поне една главна буква
  if (!/[A-Z]/.test(value)) {
    showPasswordError("Паролата трябва да съдържа поне една главна буква.");
    return false;
  }
  // Проверка: поне една цифра
  if (!/[0-9]/.test(value)) {
    showPasswordError("Паролата трябва да съдържа поне една цифра.");
    return false;
  }
  // Проверка: поне един специален символ от изброените
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/'`;~]/.test(value)) {
    showPasswordError("Паролата трябва да съдържа поне един специален символ.");
    return false;
  }
  // Проверка: дължина минимум 6 символа
  if (value.length < 6) {
    showPasswordError("Паролата трябва да е поне 6 символа.");
    return false;
  }
  // Ако всичко е валидно – премахваме съобщението
  clearPasswordError();
  return true;
}
// Събития за live валидация
// При напускане на полето (blur)
regPassInput.addEventListener("blur", () => validatePassword(true));
// При всяко въвеждане в полето (input)
regPassInput.addEventListener("input", () => {
  const value = regPassInput.value.trim();
  if (value === "") clearPasswordError();
  else validatePassword(true);
});
// При поставяне на текст (paste)
regPassInput.addEventListener("paste", () => setTimeout(() => validatePassword(true), 10));

// ------------------------------
// Repeat password validation – проверка дали повторената парола съвпада с оригиналната
// ------------------------------
// Функция: показва съобщение за грешка под полето за повторна парола
function showRepeatPasswordError(message) {
  // Проверяваме дали вече има DOM елемент за грешка
  let errorEl = document.getElementById("repeatPasswordError");
  // Ако няма – създаваме нов <div> със съобщение
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "repeatPasswordError";
    // Стилове за визуализация
    errorEl.style.color = "#e74c3c";
    errorEl.style.marginTop = "4px";
    errorEl.style.fontSize = "14px";
    errorEl.style.marginBottom = "15px";
    errorEl.style.width = "100%";
    // Изравняваме отстоянието с input-а
    const computedStyles = window.getComputedStyle(regRepeatInput);
    errorEl.style.paddingLeft = computedStyles.paddingLeft;
    // Добавяме грешката под input полето
    regRepeatInput.insertAdjacentElement("afterend", errorEl);
  }
  // Нулираме margin под input-а и добавяме текста
  regRepeatInput.style.marginBottom = "0px";
  errorEl.textContent = message;
}
// Функция: премахва грешката и връща нормалния margin на input-а
function clearRepeatPasswordError() {
  const errorEl = document.getElementById("repeatPasswordError");
  if (errorEl) errorEl.remove();
  regRepeatInput.style.marginBottom = "15px";
}
// Функция: валидация дали повторната парола съвпада с първичната
function validateRepeatPassword(showRequiredMsg = false) {
  const value = regRepeatInput.value.trim();
  const original = regPassInput.value.trim();
  // Ако полето е празно
  if (value === "") {
    if (showRequiredMsg) showRepeatPasswordError("Моля, повторете паролата.");
    else clearRepeatPasswordError();
    return false;
  }
  // Ако не съвпада с основната парола
  if (value !== original) {
    showRepeatPasswordError("Паролите не съвпадат.");
    return false;
  }
  // Всичко е наред
  clearRepeatPasswordError();
  return true;
}
// Събития за live валидация
// При напускане на полето (blur)
regRepeatInput.addEventListener("blur", () => validateRepeatPassword(true));
// При писане (input)
regRepeatInput.addEventListener("input", () => {
  const value = regRepeatInput.value.trim();
  if (value === "") clearRepeatPasswordError();
  else validateRepeatPassword(true);
});
// При поставяне (paste)
regRepeatInput.addEventListener("paste", () => setTimeout(() => validateRepeatPassword(true), 10));

// ------------------------------
// Email validation – проверка на полето за имейл при регистрация
// ------------------------------
// Функция: показва съобщение за грешка под полето за имейл
function showEmailError(message) {
  // Проверяваме дали вече има DOM елемент за грешка
  let errorEl = document.getElementById("emailError");
  // Ако няма – създаваме нов <div> за съобщението
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "emailError";
    // Стилове на съобщението
    errorEl.style.color = "#e74c3c";
    errorEl.style.marginTop = "4px";
    errorEl.style.fontSize = "14px";
    errorEl.style.marginBottom = "15px";
    errorEl.style.width = "100%";
    // Изравняваме padding-а спрямо input полето
    const computedStyles = window.getComputedStyle(regEmailInput);
    errorEl.style.paddingLeft = computedStyles.paddingLeft;
    // Добавяме съобщението под input полето
    regEmailInput.insertAdjacentElement("afterend", errorEl);
  }
  // Зануляваме долното отстояние на input полето
  regEmailInput.style.marginBottom = "0px";
  // Поставяме текста на грешката
  errorEl.textContent = message;
}
// Функция: премахва съобщението за грешка и възстановява стила
function clearEmailError() {
  const errorEl = document.getElementById("emailError");
  if (errorEl) errorEl.remove();
  regEmailInput.style.marginBottom = "15px";
}
// Функция: извършва валидация на стойността в полето за имейл
async function validateEmail(showRequiredMsg = false) {
  const value = regEmailInput.value.trim();

  if (value === "") {
    if (showRequiredMsg) showEmailError("Моля, въведете имейл.");
    else clearEmailError();
    return false;
  }

  if (/[A-Z]/.test(value)) {
    showEmailError("Имейлът не трябва да съдържа главни букви.");
    return false;
  }

  if (!/^[\x00-\x7F]+$/.test(value)) {
    showEmailError("Имейлът трябва да съдържа само латински символи.");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value)) {
    showEmailError("Невалиден имейл адрес.");
    return false;
  }

  const domainSuffix = value.split(".").pop();
  if (domainSuffix.length < 2) {
    showEmailError("Домейнът на имейла трябва да е поне 2 символа.");
    return false;
  }

  // 🔁 НОВО: проверка в базата чрез API
  const isTaken = await checkEmailInDB(value.toLowerCase());
  if (isTaken) {
    showEmailError("Имейлът вече е използван.");
    return false;
  }

  clearEmailError();
  return true;
}

// Live събития за валидация на имейл
// При напускане на полето (blur)
regEmailInput.addEventListener("blur", () => validateEmail(true));
// При промяна (въвеждане на символи)
regEmailInput.addEventListener("input", () => {
  const value = regEmailInput.value.trim();
  if (value === "") clearEmailError();
  else validateEmail(true);
});
// При поставяне с paste → валидираме със закъснение
regEmailInput.addEventListener("paste", () => {
  setTimeout(() => validateEmail(true), 10);
});

// ------------------------------
// Checkbox validation – проверка на отметката за условията
// ------------------------------
// Хващаме чекбокса от формата за регистрация
const regTermsCheckbox = document.getElementById("termsCheckbox");
// Функция: показва съобщение за грешка под чекбокса
function showTermsError(message) {
  // Проверка дали вече има съществуващ елемент за грешка
  let errorEl = document.getElementById("termsError");
  // Ако няма – създаваме нов <div> за съобщението
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "termsError";
    // Стилове за визуализация
    errorEl.style.color = "#e74c3c";
    errorEl.style.marginTop = "4px";
    errorEl.style.fontSize = "14px";
    errorEl.style.marginBottom = "15px";
    errorEl.style.width = "100%";
    // Добавяме го под <label> елемента
    const label = regTermsCheckbox.closest("label");
    label.insertAdjacentElement("afterend", errorEl);
  }
  // Поставяме текста на грешката
  errorEl.textContent = message;
}
// Функция: премахва съобщението за грешка
function clearTermsError() {
  const errorEl = document.getElementById("termsError");
  if (errorEl) errorEl.remove();
}
// Функция: валидира дали чекбоксът е маркиран
function validateTerms(showRequiredMsg = false) {
  // Ако не е маркиран
  if (!regTermsCheckbox.checked) {
    // Ако се изисква показване на грешка – показваме
    if (showRequiredMsg) {
      showTermsError("Моля, приемете условията.");
    } else {
      clearTermsError();
    }
    return false;
  }
  // Ако е маркиран – премахваме всяка грешка
  clearTermsError();
  return true;
}
function removeError(input) {
  const nextEl = input.nextElementSibling;
  if (nextEl && nextEl.tagName === "DIV" && nextEl.style.color === "rgb(231, 76, 60)") {
    nextEl.remove();
  }
  input.style.marginBottom = "15px";
}
// ------------------------------
// CTA submit
// ------------------------------
// CTA submit – изпраща заявка към бекенда
regForm.addEventListener("submit", async function (e) {
  e.preventDefault(); // Спираме стандартното поведение

  const isValidUsername = await validateUsername(true);
  const isValidPassword = validatePassword(true);
  const isValidRepeat = validateRepeatPassword(true);
  const isValidEmail = await validateEmail(true);
  const isValidTerms = validateTerms(true);

  if (!isValidUsername || !isValidPassword || !isValidRepeat || !isValidEmail || !isValidTerms) {
    return;
  }

  // Вземаме стойностите от формата
  const username = regUsernameInput.value.trim();
  const password = regPassInput.value.trim();
  const email = regEmailInput.value.trim().toLowerCase();

  try {
    // Изпращаме заявката към API-то
const response = await fetch('/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ username, password, email }),
  credentials: "include"
});

    const data = await response.json();

    if (data.success) {
      // ✅ Регистрацията е успешна → затваряме popup-а
      closeModal("registerModal", "registerModalOverlay");

      // След кратка пауза отваряме login popup
      setTimeout(() => {
        openModal("loginModal", "loginModalOverlay");        
      }, 300);
    } else {
      // ❌ Грешка от сървъра
      alert("Сървърна грешка при регистрацията.");
    }
  } catch (error) {
    console.error("Грешка при заявка за регистрация:", error);
    alert("Неуспешна заявка към сървъра.");
  }
});
// Reset margins initially
regUsernameInput.style.marginBottom = "15px";
regPassInput.style.marginBottom = "15px";
regRepeatInput.style.marginBottom = "15px";
// Clear all on page load
clearFormFields(regForm);
clearFormFields(logForm);
});

// ------------------------------
// LOGIN POPUP
// ------------------------------  
// ------------------------------
// Username Validation
// ------------------------------
// Вземаме полето за потребителско име от login формата
const logUsernameInput = document.getElementById("logUsername");
// Примерна "база" с допустими usernames
// ---------- Създаване на tooltip и иконка ----------
// Създаваме SVG иконка за info tooltip
const tooltipIcon = document.createElement("span");
tooltipIcon.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#29ca8e" viewBox="0 0 16 16">
    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12zm0-6a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 8zm0-4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
  </svg>
`;
// Стилове за иконката
tooltipIcon.style.position = "absolute";
tooltipIcon.style.top = "50%";
tooltipIcon.style.right = "16px";
tooltipIcon.style.transform = "translateY(-50%)";
tooltipIcon.style.width = "20px";
tooltipIcon.style.height = "20px";
tooltipIcon.style.display = "flex";
tooltipIcon.style.alignItems = "center";
tooltipIcon.style.justifyContent = "center";
tooltipIcon.style.cursor = "pointer";
tooltipIcon.style.zIndex = "2";
// Tooltip текст (показва се при hover)
const tooltipText = document.createElement("div");
tooltipText.textContent = "Макс. брой позволени символи е 15.";
tooltipText.style.position = "absolute";
tooltipText.style.bottom = "125%";
tooltipText.style.right = "0";
tooltipText.style.backgroundColor = "#333";
tooltipText.style.color = "#fff";
tooltipText.style.padding = "6px 8px";
tooltipText.style.borderRadius = "4px";
tooltipText.style.fontSize = "13px";
tooltipText.style.whiteSpace = "nowrap";
tooltipText.style.zIndex = "999";
tooltipText.style.opacity = "0";
tooltipText.style.transition = "opacity 0.2s ease";
tooltipText.style.pointerEvents = "none";
// Hover ефект за tooltip
tooltipIcon.addEventListener("mouseenter", () => {
  tooltipText.style.opacity = "1";
});
tooltipIcon.addEventListener("mouseleave", () => {
  tooltipText.style.opacity = "0";
});
tooltipIcon.appendChild(tooltipText);
// ---------- Позициониране ----------
// Обвиваме input-а и иконката в общ контейнер
const container = document.createElement("div");
container.style.position = "relative";
container.style.width = "100%";
// Вмъкваме новия контейнер преди input-a и прехвърляме input-а и иконката вътре
logUsernameInput.parentNode.insertBefore(container, logUsernameInput);
container.appendChild(logUsernameInput);
container.appendChild(tooltipIcon);
// ---------- Функции за грешки ----------
// Показва съобщение за грешка под username полето
function showLogUsernameError(message) {
  let errorEl = document.getElementById("logUsernameError");
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "logUsernameError";
    errorEl.style.color = "#e74c3c";
    errorEl.style.marginTop = "4px";
    errorEl.style.fontSize = "14px";
    errorEl.style.marginBottom = "15px";
    errorEl.style.width = "100%";
    const computedStyles = window.getComputedStyle(logUsernameInput);
    errorEl.style.paddingLeft = computedStyles.paddingLeft;
    // Добавяме грешката под контейнера
    container.insertAdjacentElement("afterend", errorEl);
  }
  logUsernameInput.style.marginBottom = "0px";
  errorEl.textContent = message;
}
// Премахва грешката, ако има
function clearLogUsernameError() {
  const errorEl = document.getElementById("logUsernameError");
  if (errorEl) errorEl.remove();
  logUsernameInput.style.marginBottom = "15px";
}
// ---------- Валидация ----------
// Главна функция за валидиране на username
async function validateLogUsername(showRequiredMsg = false) {
  const value = logUsernameInput.value.trim();
  const validPattern = /^[a-z0-9._-]+$/i;

  if (value === "") {
    if (showRequiredMsg) showLogUsernameError("Моля, въведете потребителско име.");
    else clearLogUsernameError();
    return false;
  }

  if (!validPattern.test(value)) {
    showLogUsernameError("Позволени са само латински букви, цифри, точка (.), долна черта (_) и тире (-).");
    return false;
  }

  if (value.length > 15) {
    showLogUsernameError("Потребителското име не може да е по-дълго от 15 символа.");
    return false;
  }

  try {
    const res = await fetch(`/api/check-username/${encodeURIComponent(value.toLowerCase())}`);
    const data = await res.json();
    if (!data.exists) {
      showLogUsernameError("Няма потребител с такова име.");
      return false;
    }
  } catch (err) {
    console.error("Грешка при проверка на username:", err);
    showLogUsernameError("Проблем при връзка със сървъра.");
    return false;
  }

  clearLogUsernameError();
  return true;
}

// ---------- Събития за live валидация ----------
// При въвеждане
logUsernameInput.addEventListener("input", () => {
  if (logUsernameInput.value.length > 15) {
    logUsernameInput.value = logUsernameInput.value.slice(0, 15);
  }
  const value = logUsernameInput.value.trim();
  if (value === "") clearLogUsernameError();
  else validateLogUsername(true);
});
// При загуба на фокус
logUsernameInput.addEventListener("blur", () => validateLogUsername(true));
// При paste – валидираме след малко забавяне
logUsernameInput.addEventListener("paste", () => {
  setTimeout(() => {
    if (logUsernameInput.value.length > 15) {
      logUsernameInput.value = logUsernameInput.value.slice(0, 15);
    }
    validateLogUsername(true);
  }, 10);
});
// Задаваме начално отстояние
logUsernameInput.style.marginBottom = "15px";

// ------------------------------
// E-mail Validation
// ------------------------------
// Вземаме полето за e-mail от login формата
const logEmailInput = document.getElementById("logEmail");
// Функция: показва съобщение за грешка под e-mail полето
function showLogEmailError(message) {
  let errorEl = document.getElementById("logEmailError");
  // Ако няма вече съществуващо съобщение – създаваме ново
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "logEmailError";
    errorEl.style.color = "#e74c3c";
    errorEl.style.marginTop = "4px";
    errorEl.style.fontSize = "14px";
    errorEl.style.marginBottom = "15px";
    errorEl.style.width = "100%";
    // Запазваме оригиналното отместване на input-а
    const computedStyles = window.getComputedStyle(logEmailInput);
    errorEl.style.paddingLeft = computedStyles.paddingLeft;
    // Поставяме грешката под полето
    logEmailInput.insertAdjacentElement("afterend", errorEl);
  }
  // Задаваме самото съобщение
  logEmailInput.style.marginBottom = "0px";
  errorEl.textContent = message;
}
// Функция: премахва съобщението за грешка (ако има)
function clearLogEmailError() {
  const errorEl = document.getElementById("logEmailError");
  if (errorEl) errorEl.remove();
  logEmailInput.style.marginBottom = "15px"; // възстановяваме отстоянието
}
// Главна функция: проверява валидността на e-mail-a
async function validateLogEmail(showRequiredMsg = false) {
  const value = logEmailInput.value.trim();

  if (value === "") {
    if (showRequiredMsg) showLogEmailError("Моля, въведете имейл.");
    else clearLogEmailError();
    return false;
  }

  if (/[A-Z]/.test(value)) {
    showLogEmailError("Имейлът не трябва да съдържа главни букви.");
    return false;
  }

  if (!/^[\x00-\x7F]+$/.test(value)) {
    showLogEmailError("Имейлът трябва да съдържа само латински символи.");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const domainSuffix = value.split(".").pop();
  if (!emailPattern.test(value) || domainSuffix.length < 2) {
    showLogEmailError("Невалиден имейл адрес.");
    return false;
  }

  try {
    const res = await fetch(`/api/check-email/${encodeURIComponent(value.toLowerCase())}`);
    const data = await res.json();
    if (!data.exists) {
      showLogEmailError("Няма потребител с такъв имейл.");
      return false;
    }
  } catch (err) {
    console.error("Грешка при проверка на email:", err);
    showLogEmailError("Проблем при връзка със сървъра.");
    return false;
  }

  clearLogEmailError();
  return true;
}

// Събития за live валидация
// При напускане на полето – валидираме
logEmailInput.addEventListener("blur", () => validateLogEmail(true));
// При промяна на съдържанието – валидираме в реално време
logEmailInput.addEventListener("input", () => {
  const value = logEmailInput.value.trim();
  if (value === "") clearLogEmailError(); // ако е изтрито – махаме грешката
  else validateLogEmail(true);
});
// При paste – леко забавяне и после валидираме
logEmailInput.addEventListener("paste", () => {
  setTimeout(() => validateLogEmail(true), 10);
});
// Начално отстояние на полето
logEmailInput.style.marginBottom = "15px";
// ------------------------------
// Password Validation (Tooltip + Container за input)
// ------------------------------
// Вземаме полето за парола от login формата
const logPassInput = document.getElementById("logPass");
// Примерни валидни пароли (използвани за проверка в login)
// Създаваме визуален контейнер около input-а
// Създаваме <div>, който ще обвие полето за парола и иконката
const passWrapper = document.createElement("div");
passWrapper.style.position = "relative";
passWrapper.style.width = "100%";
// Поставяме новия контейнер на мястото на оригиналното поле
logPassInput.parentNode.insertBefore(passWrapper, logPassInput);
// Преместваме самото поле вътре в новия wrapper
passWrapper.appendChild(logPassInput);
// Добавяме tooltip и иконка (информация)
// Създаваме иконка с въпросителна (SVG)
const passTooltipIcon = document.createElement("span");
passTooltipIcon.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#29ca8e" viewBox="0 0 16 16">
    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12zm0-6a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 8zm0-4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
  </svg>
`;
// Стилове за позициониране на иконката вътре в input-а
passTooltipIcon.style.position = "absolute";
passTooltipIcon.style.top = "50%";
passTooltipIcon.style.right = "16px";
passTooltipIcon.style.transform = "translateY(-50%)";
passTooltipIcon.style.width = "20px";
passTooltipIcon.style.height = "20px";
passTooltipIcon.style.display = "flex";
passTooltipIcon.style.alignItems = "center";
passTooltipIcon.style.justifyContent = "center";
passTooltipIcon.style.cursor = "pointer";
passTooltipIcon.style.zIndex = "2";
// Tooltip текст – обяснява правилата за символи
const passTooltipText = document.createElement("div");
passTooltipText.textContent = "Позволени специални символи: ! @ # $ % ^ & * ( ) _ - + =";
// Стилове на tooltip-а (изскачащото съобщение)
passTooltipText.style.position = "absolute";
passTooltipText.style.bottom = "125%";
passTooltipText.style.right = "0";
passTooltipText.style.backgroundColor = "#333";
passTooltipText.style.color = "#fff";
passTooltipText.style.padding = "6px 8px";
passTooltipText.style.borderRadius = "4px";
passTooltipText.style.fontSize = "13px";
passTooltipText.style.whiteSpace = "nowrap";
passTooltipText.style.zIndex = "999";
passTooltipText.style.opacity = "0";
passTooltipText.style.transition = "opacity 0.2s ease";
passTooltipText.style.pointerEvents = "none";
// Покажи tooltip-а при hover
passTooltipIcon.addEventListener("mouseenter", () => {
  passTooltipText.style.opacity = "1";
});
// Скрий tooltip-а при изход
passTooltipIcon.addEventListener("mouseleave", () => {
  passTooltipText.style.opacity = "0";
});
// Поставяме текста вътре в иконката
passTooltipIcon.appendChild(passTooltipText);
// Добавяме иконката вътре в passWrapper
passWrapper.appendChild(passTooltipIcon);

// ------------------------------
// Грешки при login парола
// ------------------------------
/**
 * Показва съобщение за грешка под полето за парола при login.
 * @param {string} message - текстът на грешката, който ще се покаже.
 */
function showLogPasswordError(message) {
  // Проверка дали вече има елемент за грешка
  let errorEl = document.getElementById("logPasswordError");
  // Ако няма — създаваме нов <div> за грешката
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "logPasswordError";
    // Стилове за визуализация на съобщението
    errorEl.style.color = "#e74c3c"; // червен текст
    errorEl.style.fontSize = "14px";
    errorEl.style.marginTop = "10px";
    errorEl.style.width = "fit-content";
    errorEl.style.paddingLeft = window.getComputedStyle(logPassInput).paddingLeft;
    // Абсолютна позиция спрямо контейнера (passWrapper)
    errorEl.style.position = "absolute";
    errorEl.style.bottom = "-35px";
    // Вмъкване в DOM
    passWrapper.appendChild(errorEl);
  }
  // Възстановяване на margin-bottom на input полето
  logPassInput.style.marginBottom = "15px";
  // Задаване на текста на грешката
  errorEl.textContent = message;
}
/**
 * Премахва съществуващото съобщение за грешка под login паролата.
 */
function clearLogPasswordError() {
  const errorEl = document.getElementById("logPasswordError");
  if (errorEl) errorEl.remove();
  // Възстановяване на отстоянието на полето
  logPassInput.style.marginBottom = "15px";
}

// ------------------------------
// Валидация
// ------------------------------
/**
 * Валидира въведената парола при login.
 * @param {boolean} showRequiredMsg - дали да показва съобщения при празно поле.
 * @returns {boolean} - true ако е валидна, false ако има грешка.
 */
function validateLogPassword(showRequiredMsg = false) {
  const value = logPassInput.value.trim();
  // Проверка дали е въведена парола
  if (value === "") {
    if (showRequiredMsg) {
      // Показваме съобщение ако се изисква (при submit, например)
      showLogPasswordError("Моля, въведете парола.");
    } else {
      // Иначе просто изчистваме грешката
      clearLogPasswordError();
    }
    return false;
  }
  // Проверка за позволени символи — само латиница и стандартни символи
  if (!/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/'`;~`]+$/.test(value)) {
    showLogPasswordError("Позволена е само латиница.");
    return false;
  }
  // Задължително поне една главна буква
  if (!/[A-Z]/.test(value)) {
    showLogPasswordError("Паролата трябва да съдържа поне една главна буква.");
    return false;
  }
  // Задължително поне една цифра
  if (!/[0-9]/.test(value)) {
    showLogPasswordError("Паролата трябва да съдържа поне една цифра.");
    return false;
  }
  // Задължително поне един специален символ от изброените
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/'`;~`]/.test(value)) {
    showLogPasswordError("Паролата трябва да съдържа поне един специален символ.");
    return false;
  }
  // Ако всичко е валидно — изчистваме грешката
  clearLogPasswordError();
  return true;
}
// Събития
// Когато потребителят въвежда текст в полето за парола
logPassInput.addEventListener("input", () => {
  const value = logPassInput.value.trim();
  if (value === "") {
    // Ако полето е празно — изчистваме съобщението за грешка
    clearLogPasswordError();
  } else {
    // Ако има текст — валидираме веднага
    validateLogPassword(true);
  }
});
// Когато потребителят премести фокуса извън полето (blur)
// → валидираме съдържанието
logPassInput.addEventListener("blur", () => validateLogPassword(true));
// Когато потребителят постави текст с paste
// → валидираме съдържанието след кратко забавяне,
//   за да се „улови“ новата стойност
logPassInput.addEventListener("paste", () => {
  setTimeout(() => validateLogPassword(true), 10);
});
logPassInput.style.marginBottom = "15px";

// ------------------------------
// Forgot password link
// ------------------------------
const forgotPasswordLink = document.querySelector(".modal-link");
forgotPasswordLink.addEventListener("click", function (e) {
  e.preventDefault();
  // Премахваме старото съобщение, ако има
  const oldMessage = document.getElementById("forgotPasswordMessage");
  if (oldMessage) oldMessage.remove();
  // Създаваме съобщението
  const message = document.createElement("div");
  message.id = "forgotPasswordMessage";
  message.textContent = "Беше пратен линк на мейла ти. Следвай стъпките в него.";
  // Стилове
  message.style.textAlign = "center";
  message.style.width = "100%";
  message.style.marginTop = "16px";
  message.style.marginBottom = "10px";
  message.style.color = "#29ca8e";
  message.style.fontSize = "14px";
  message.style.fontWeight = "500";
  // Поставяме съобщението под заглавието <h2 class="modal-title">
  const title = document.querySelector("#loginModal .modal-title");
  if (title) {
    title.insertAdjacentElement("afterend", message);
  }
  // Автоматично изчистване след 4 секунди
  setTimeout(() => {
    message.remove();
  }, 4000);
});

// ------------------------------
// Link: Login → Register
// ------------------------------
// Взимаме линка "Регистрация" от login формата
const registerLinkFromLogin = document.getElementById("openRegisterFromLogin");
// Проверяваме дали линкът съществува (може да го няма в някои случаи)
if (registerLinkFromLogin) {
  // Добавяме обработчик на събитието click
  registerLinkFromLogin.addEventListener("click", function (e) {
    e.preventDefault(); // Спираме стандартното поведение на линка

    // 1. Затваряме login модалния прозорец
    closeModal("loginModal", "loginModalOverlay");

    // 2. След кратко забавяне (300ms = времето за анимация на затваряне)
    //    отваряме registration модалния прозорец
    setTimeout(() => {
      openModal("registerModal", "registerModalOverlay");
    }, 300); // анимацията ти е 300ms
  });
}
// ------------------------------
// Link: Register → Login
// ------------------------------
// Взимаме линка "Вход" от регистрационната форма
const loginLinkFromRegister = document.getElementById("openLoginFromRegister");

// Проверяваме дали той съществува в DOM-а (може да го няма в някои случаи)
if (loginLinkFromRegister) {
  // Добавяме event listener за клик върху линка
  loginLinkFromRegister.addEventListener("click", function (e) {
    e.preventDefault(); // Спираме стандартното поведение на линка
    // Затваряме регистрационния модален прозорец (popup)
    closeModal("registerModal", "registerModalOverlay");
    // Изчакваме 300ms (за да приключи анимацията) и след това отваряме login popup-а
    setTimeout(() => {
      openModal("loginModal", "loginModalOverlay");
    }, 300);
  });
}


// Проверка при зареждане дали вече има логнат потребител (с активна сесия)
fetch("/api/check-session", {
  method: "GET",
  credentials: "include"
})
  .then(res => res.json())
  .then(data => {
    if (data.loggedIn && data.user) {
      window.loggedInUsername = data.user.username;
      showLoggedInNavbar(data.user.username);
    }
  })
  .catch(err => {
    console.error("Грешка при проверка на сесията:", err);
  });



// ------------------------------
// CTA Login
// ------------------------------
logForm.addEventListener("submit", async function (e) {
  e.preventDefault(); // Спираме стандартното поведение на формата

  // Премахваме съществуващо глобално съобщение за грешка, ако има
  const existingGlobalError = document.getElementById("loginGlobalError");
  if (existingGlobalError) existingGlobalError.remove();

  // Валидираме трите полета от login формата
  const isValidUsername = await validateLogUsername(true);
  const isValidEmail = await validateLogEmail(true);
  const isValidPassword = validateLogPassword(true);

  // Ако поне едно е невалидно – прекъсваме
  if (!isValidUsername || !isValidEmail || !isValidPassword) return;

  // Вземаме стойностите от input-ите
  const username = logUsernameInput.value.trim().toLowerCase();
  const email = logEmailInput.value.trim().toLowerCase();
  const password = logPassInput.value.trim();

  let matchedUser = null;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include' // 🟢 Добавено тук!
    });
    

    const data = await response.json();
    console.log("Получен отговор от /api/login:", data);

    if (data.success && data.user && typeof data.user === 'object') {
      matchedUser = data.user;

      if (!matchedUser.username) {
        console.error("matchedUser.username липсва:", matchedUser);
        return;
      }
      showLoggedInNavbar(matchedUser.username);
      location.reload();
    } else {
      const globalError = document.createElement("div");
      globalError.id = "loginGlobalError";
      globalError.textContent = "Невалидни потребителски данни.";
      globalError.style.color = "#e74c3c";
      globalError.style.marginTop = "16px";
      globalError.style.marginBottom = "8px";
      globalError.style.fontSize = "14px";
      globalError.style.fontWeight = "500";
      globalError.style.textAlign = "center";
      logForm.insertBefore(globalError, logForm.querySelector("button"));
      return;
    }
  } catch (error) {
    console.error("Грешка при заявка към сървъра:", error);
    const globalError = document.createElement("div");
    globalError.id = "loginGlobalError";
    globalError.textContent = "Сървърна грешка. Моля, опитайте по-късно.";
    globalError.style.color = "#e74c3c";
    globalError.style.marginTop = "16px";
    globalError.style.marginBottom = "8px";
    globalError.style.fontSize = "14px";
    globalError.style.fontWeight = "500";
    globalError.style.textAlign = "center";
    logForm.insertBefore(globalError, logForm.querySelector("button"));
    return;
  }
    
  // Скриваме модалния прозорец за логин
  closeModal("loginModal", "loginModalOverlay");
  // Вземаме дясната част на навигацията
  const navbarRight = document.querySelector(".navbar-right");
  if (!navbarRight) return;
  // Ако вече е логнат потребител, не презаписваме
  if (navbarRight.querySelector(".user-display")) return;
  // Премахваме бутоните „Вход“ и „Регистрация“
  const loginBtn = navbarRight.querySelector('a[href="profile.html"]');
  const regBtn = navbarRight.querySelector(".genrnav");
  if (loginBtn) loginBtn.parentElement.remove();
  if (regBtn) regBtn.parentElement.remove();
  // Създаваме нов елемент за логнат потребител (username + кръг + точки)
  const li = document.createElement("li");
  li.className = "user-display";
  li.style.display = "flex";
  li.style.alignItems = "center";
  li.style.gap = "6px";
  // Показваме username
  const usernameSpan = document.createElement("span");
  usernameSpan.textContent = matchedUser.username;
  usernameSpan.className = "username-span";
  usernameSpan.style.fontWeight = "500";
  usernameSpan.style.fontSize = "16px";
  usernameSpan.style.color = "#fff"; // по подразбиране бял цвят
  // Вземаме първите две букви от username (главни) и ги показваме в кръг
  const initials = matchedUser.username.slice(0, 2).toUpperCase();
  const circleSpan = document.createElement("span");
  circleSpan.className = "initials-circle";
  circleSpan.textContent = initials;
  circleSpan.style.fontSize = "14px";
  circleSpan.style.fontWeight = "bold";
  circleSpan.style.width = "28px";
  circleSpan.style.height = "28px";
  circleSpan.style.borderRadius = "50%";
  circleSpan.style.display = "inline-flex";
  circleSpan.style.alignItems = "center";
  circleSpan.style.justifyContent = "center";
  circleSpan.style.marginLeft = "4px";
  circleSpan.style.backgroundColor = "#fff"; // фон по подразбиране
  circleSpan.style.color = "#29ca8e"; // зелени букви
  // Добавяме три вертикални точки (⋮) за допълнително меню
  const menuDots = document.createElement("span");
  menuDots.className = "user-menu-dots";
  menuDots.textContent = "⋮"; 
  menuDots.style.width = "18px";
  menuDots.style.textAlign = "center";
  menuDots.style.fontSize = "24px";
  menuDots.style.fontWeight = "bolder";
  menuDots.style.cursor = "pointer";
  menuDots.style.lineHeight = "1";
  menuDots.style.color = "#fff"; // по подразбиране бял цвят
  // Добавяме трите елемента в <li>
  li.appendChild(usernameSpan);
  li.appendChild(circleSpan);
  li.appendChild(menuDots);
  navbarRight.appendChild(li);
// ------------------------------
// Проверка за активна сесия при зареждане
// ------------------------------
fetch('/api/check-session', {
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => {
    if (data.loggedIn && data.user?.username) {
      showLoggedInNavbar(data.user.username);
    }
  })
  .catch(err => console.error("Грешка при check-session:", err));
});

// Version: v1.0.3 | Last updated: 2025-05-11
