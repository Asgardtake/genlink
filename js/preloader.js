// Създаване на прелоудър елемент с HTML и CSS
const preloader = document.createElement("div");
preloader.innerHTML = `
    <style>
        #preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #f4f4f4;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .loader-bar {
            width: 80%;
            height: 8px;
            background-color: #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
            margin-bottom: 20px;
        }
        .loader-progress {
            width: 0;
            height: 100%;
            background-color: #29ca8e;
            transition: width 0.1s ease-in-out;
        }
        #preloader p {
            color: #555;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            margin: 0;
        }
        #resource-loading {
            color: #777;
            font-size: 14px;
            text-align: center;
            margin-top: 10px;
        }
    </style>
    <div id="preloader">
        <div class="loader-bar">
            <div class="loader-progress"></div>
        </div>
        <p>Зареждане на страницата...</p>
        <div id="resource-loading">Зарежда се: ...</div>
    </div>
`;
document.body.appendChild(preloader);

const progressBar = document.querySelector(".loader-progress");
const resourceLoading = document.getElementById("resource-loading");
let progress = 0;

// Списък с CSS ресурси
const cssResources = Array.from(document.querySelectorAll("link[rel='stylesheet']"));
const otherResources = Array.from(document.querySelectorAll("script, img"));

// Проверка за зареждане на CSS ресурси до 30%
let cssLoaded = 0;
const loadCSSResources = () => {
    cssResources.forEach(resource => {
        const link = new Image();
        link.src = resource.href;
        link.onload = () => {
            cssLoaded++;
            progress = (cssLoaded / cssResources.length) * 30; // Ограничаваме до 30%
            progressBar.style.width = `${progress}%`;
            resourceLoading.textContent = `Зарежда се CSS: ${resource.href.split('/').pop()}`;
            if (cssLoaded === cssResources.length) loadOtherResources(); // Преминава към други ресурси
        };
        link.onerror = () => {
            cssLoaded++;
            progress = (cssLoaded / cssResources.length) * 30;
            progressBar.style.width = `${progress}%`;
            resourceLoading.textContent = `Грешка при зареждане на CSS: ${resource.href.split('/').pop()}`;
            if (cssLoaded === cssResources.length) loadOtherResources();
        };
    });
};

// Зареждане на останалите ресурси
let loadedResources = 0;
const loadOtherResources = () => {
    otherResources.forEach(res => {
        const src = res.src || res.href;
        const element = new Image();
        element.src = src;

        element.onload = () => {
            loadedResources++;
            progress = 30 + (loadedResources / otherResources.length) * 70; // От 30% до 100%
            progressBar.style.width = `${progress}%`;
            resourceLoading.textContent = `Зарежда се: ${src.split('/').pop()}`;
        };

        element.onerror = () => {
            loadedResources++;
            progress = 30 + (loadedResources / otherResources.length) * 70;
            progressBar.style.width = `${progress}%`;
            resourceLoading.textContent = `Грешка при зареждане на: ${src.split('/').pop()}`;
        };
    });
};

// Финализира прелоудъра при пълно зареждане на страницата
window.onload = () => {
    progressBar.style.width = "100%";
    resourceLoading.textContent = "Зареждането завърши!";
    setTimeout(() => {
        preloader.style.opacity = "0";
        preloader.style.transition = "opacity 0.5s ease";
        preloader.addEventListener("transitionend", () => preloader.remove());
    }, 500);
};

// Стартиране на зареждането на CSS ресурси първо
loadCSSResources();
