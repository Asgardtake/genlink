document.addEventListener("DOMContentLoaded", function () {
  const loginTime = sessionStorage.getItem("adminLoginTime");
  const expiredSession = () => {
    sessionStorage.removeItem("adminLoggedIn");
    sessionStorage.removeItem("adminLoginTime");
    sessionStorage.setItem("expiredSession", "true");
    location.reload();
  };

  if (loginTime) {
    const now = Date.now();
    const diff = now - parseInt(loginTime, 10);
    if (diff > 10 * 60 * 1000) {
      expiredSession();
      return;
    }
  }

  const greetingBlock = document.getElementById("adminGreeting");
  if (sessionStorage.getItem("adminLoggedIn") !== "true" && greetingBlock) {
    greetingBlock.style.display = "none";
  }

  if (sessionStorage.getItem("adminLoggedIn") !== "true") {
    createAdminLoginPopup();
    return;
  }

  const profileSection = document.getElementById("profile");
  if (profileSection) {
    profileSection.style.position = "fixed";
    profileSection.style.top = "0";
    profileSection.style.left = "0";
    profileSection.style.width = "100%";
    profileSection.style.zIndex = "1000";
    profileSection.style.backdropFilter = "blur(10px)";
    profileSection.style.transition = "box-shadow 0.3s ease";
  }

  window.addEventListener("scroll", () => {
    if (profileSection) {
      profileSection.style.boxShadow = window.scrollY > 10 ? "0 2px 8px rgba(0,0,0,0.5)" : "none";
    }
  });

  const contactSection = document.getElementById("contact");
  if (contactSection) {
    contactSection.style.paddingTop = "180px";
  }

  const greeting = document.getElementById("adminGreeting");
  if (sessionStorage.getItem("adminLoggedIn") !== "true" && greeting) {
    greeting.style.display = "none";
  }

  const container = document.querySelector(".col-md-4.col-sm-4[style*='width:100%']");
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

        const editIcon = document.createElement("span");
        editIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#999" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34c.38-.38.38-1.01 0-1.39l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`;
        editIcon.style.position = "absolute";
        editIcon.style.top = "10px";
        editIcon.style.right = "10px";
        editIcon.style.opacity = "0";
        editIcon.style.transition = "opacity 0.2s ease";
        editIcon.style.pointerEvents = "none";
        linkCell.appendChild(editIcon);

        row.addEventListener("mouseenter", () => {
          editIcon.style.opacity = "1";
        });
        row.addEventListener("mouseleave", () => {
          editIcon.style.opacity = "0";
        });

        row.appendChild(linkCell);
        table.appendChild(row);
      });
    })
    .catch((err) => {
      const error = document.createElement("p");
      error.textContent = "⚠️ Грешка при зареждане на потребителите.";
      error.style.color = "#e74c3c";
      error.style.padding = "10px";
      container.appendChild(error);
      console.error("Грешка:", err);
    });

  container.appendChild(table);
});
