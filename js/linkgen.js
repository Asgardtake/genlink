// ------------------------------
// ЛИНК ГЕНЕРАТОР МОДУЛ
// ------------------------------
function generateShortUrl() {
    const longUrlInput = document.getElementById("longurl");
    const radioButtonGroup = document.querySelector(".radio-button-group");
    const pathLengthElement = document.getElementById("path-length");
    const shortUrlContainer = document.querySelector(".short-url-container");
    const clearSelectionText = document.querySelector(".clear-selection");

    const longUrl = longUrlInput.value.trim();
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,3}(\/[\w\d\-@#!?%[\]{}_+=*$/&(){}:]*)*$/i;

    if (!longUrl) {
        showPopup("Грешка", "Моля, въведете URL адрес.");
        pathLengthElement.style.display = "none";
        return;
    }

    if (!urlPattern.test(longUrl)) {
        showPopup("Грешка", "Моля, въведете валиден URL, напр. 'https://example.com'");
        pathLengthElement.style.display = "none";
        return;
    }

    const formattedUrl = longUrl.startsWith("http") ? longUrl : `https://${longUrl}`;

    try {
        const url = new URL(formattedUrl);
        const totalLength = url.protocol.length + url.hostname.length + url.pathname.length;

        if (totalLength < 25) {
            showPopup("Грешка", "Въведеният URL е твърде кратък. Минимум 25 символа.");
            pathLengthElement.style.display = "none";
            return;
        }

        let maxLength;
        const selected = document.querySelector('input[name="urlLength"]:checked');
        if (selected) {
            maxLength = parseInt(selected.value, 10);
        } else {
            maxLength = Math.floor(Math.random() * 26) + 5;
        }

        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!?%[]{}_-=+*/$&(){}:";
        const randomSegment = Array.from({ length: maxLength }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
        const shortUrl = `${url.protocol}//${url.hostname}/${randomSegment}`;

        document.getElementById("shorturl").value = shortUrl;
        pathLengthElement.innerHTML = `Генерираните символи са: <span style="color: #00FFC0; font-size: 16px; font-weight: bold;">${randomSegment.length}</span>`;
        pathLengthElement.style.display = "block";

        radioButtonGroup.classList.add("visible");
        if (clearSelectionText) clearSelectionText.style.display = "inline";

        if (!shortUrlContainer.classList.contains("visible")) {
            shortUrlContainer.style.display = "flex";
            setTimeout(() => shortUrlContainer.classList.add("visible"), 10);
        }

        window.hasGeneratedBefore = true;
    } catch {
        showPopup("Грешка", "Невалиден URL.");
        pathLengthElement.style.display = "none";
    }
}
window.generateShortUrl = generateShortUrl;

document.addEventListener("DOMContentLoaded", function () {
    const genButton = document.querySelector(".gen-btn");
    const radioButtonGroup = document.querySelector(".radio-button-group");
    const pathLengthElement = document.getElementById("path-length");
    const longUrlInput = document.getElementById("longurl");
    const shortUrlContainer = document.querySelector(".short-url-container");
    const clearSelectionText = document.querySelector(".clear-selection");
    window.hasGeneratedBefore = false;

    pathLengthElement.style.display = "none";

    function moveButtonForMobile() {
        if (window.innerWidth <= 767) {
            radioButtonGroup.insertAdjacentElement('afterend', genButton);
        } else {
            document.querySelector(".generate-url-container").appendChild(genButton);
        }
    }

    function updateTextForMobile() {
        const radios = document.querySelectorAll(".radio-button-group label input[type='radio']");
        if (radios.length >= 3) {
            if (window.innerWidth <= 767) {
                radios[0].nextSibling.textContent = "5 сим.";
                radios[1].nextSibling.textContent = "10 сим.";
                radios[2].nextSibling.textContent = "15 сим.";
                if (clearSelectionText) clearSelectionText.innerHTML = `<i class="fa fa-times-circle clear-icon"></i> Изчисти`;
            } else {
                radios[0].nextSibling.textContent = "До 5 символа";
                radios[1].nextSibling.textContent = "До 10 символа";
                radios[2].nextSibling.textContent = "До 15 символа";
                if (clearSelectionText) clearSelectionText.innerHTML = `<i class="fa fa-times-circle clear-icon"></i> Изчисти филтъра`;
            }
        }
    }

    function toggleRadioButtons() {
        if (longUrlInput.value.trim()) {
            radioButtonGroup.classList.add("visible");
        } else {
            radioButtonGroup.classList.remove("visible");
        }
    }

    function toggleClearSelection() {
        const radios = document.querySelectorAll('input[name="urlLength"]');
        const selected = Array.from(radios).some(r => r.checked);
        clearSelectionText.style.display = selected ? "inline" : "none";
    }

    function clearSelection() {
        document.querySelectorAll('input[name="urlLength"]').forEach(r => r.checked = false);
        clearSelectionText.style.display = 'none';
    }

    window.clearSelection = clearSelection;

    moveButtonForMobile();
    updateTextForMobile();
    toggleRadioButtons();
    toggleClearSelection();

    window.addEventListener("resize", () => {
        moveButtonForMobile();
        updateTextForMobile();
    });

    longUrlInput.addEventListener("focus", () => {
        if (longUrlInput.value) longUrlInput.select();
    });

    longUrlInput.addEventListener("input", () => {
        toggleRadioButtons();

        if (window.hasGeneratedBefore) {
            shortUrlContainer.style.display = "none";
            shortUrlContainer.classList.remove("visible");
            pathLengthElement.style.display = "none";
            document.getElementById("shorturl").value = "";
            radioButtonGroup.classList.remove("visible");
            document.querySelectorAll('input[name="urlLength"]').forEach(radio => radio.checked = false);
            if (clearSelectionText) clearSelectionText.style.display = "none";
            window.hasGeneratedBefore = false;
        }
    });

    longUrlInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            generateShortUrl();
        }
    });

    document.querySelectorAll('input[name="urlLength"]').forEach(radio => {
        radio.addEventListener("change", () => {
            toggleClearSelection();
            clearSelectionText.style.display = 'inline-flex';
        });
    });

    document.getElementById("saveButton").addEventListener("click", () => {
        const longUrl = longUrlInput.value;
        const shortUrl = document.getElementById('shorturl').value;
        const username = window.loggedInUsername;

        if (!username) {
            showPopup("Грешка", "Няма логнат потребител.");
            return;
        }

        if (!longUrl || !shortUrl) {
            showPopup("Грешка", "Моля, въведете и дълъг, и кратък URL.");
            return;
        }

        fetch('http://localhost:3000/api/save-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ longUrl, shortUrl, username })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) showPopup("Грешка", data.error);
                else showPopup("Успех", data.message);
            })
            .catch(() => showPopup("Грешка", "Възникна грешка при записване на URL."));
    });

    // ❌ Временно деактивираме изчистването на URL-и при зареждане:
    // fetch('http://localhost:3000/api/clear-urls', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' }
    // }).then(res => res.json()).then(data => {
    //     console.log(data.message);
    // }).catch(err => {
    //     console.error("Грешка при изтриване:", err);
    // });
});

// POPUP
function showPopup(title, message) {
    const existingPopup = document.querySelector(".popup-overlay");
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement("div");
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-box">
                <h2>${title}</h2>
                <p>${message}</p>
                <button onclick="this.closest('.popup-overlay').remove()">Затвори</button>
            </div>
        </div>
        <style>
            .popup-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.5); 
                animation: fadeIn 0.3s ease-in-out; z-index: 1000; }
            .popup-box { max-width: 300px; padding: 20px; text-align: center; background: #fff; 
                border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); animation: popupZoomIn 0.4s ease-in-out; }
            .popup-box h2 { margin-bottom: 10px; color: #333; }
            .popup-box p { margin-bottom: 20px; color: #555; }
            .popup-box button { padding: 8px 16px; border: none; background: #29ca8e; color: #fff; 
                cursor: pointer; border-radius: 4px; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes popupZoomIn { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        </style>
    `;
    document.body.appendChild(popup);
}
