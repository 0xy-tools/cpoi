const DEFAULT_MAX_LENGTH = 1700;
const AGGREGATE_MAX_LENGTH = 60000;

function home() {
    document.getElementById("settings").style.display = "block"
    document.getElementById("settings").innerHTML = "⚙";
    
    document.getElementById("footerLinkContainer").style.display = "block";
    document.getElementById("easySection").style.display = localSettings.mode == "easy" ? "block" : "none";
    document.getElementById("settingsSection").style.display = "none";
    document.getElementById("classicSection").style.display = localSettings.mode == "easy" ? "none" : "block";
    document.getElementById("qrCodeSection").style.display = "none";
    document.getElementById("termsSection").style.display = "none";
    document.getElementById("topBackPolicy").style.display = "none";
    document.getElementById("policySection").style.display = "none";
    document.getElementById("advancedSection").style.display = localSettings.mode == "advanced" ? "block" : "none";
}

function autoFocus() {
    if (localSettings.mode == "easy")
        document.getElementById("autoInput").focus();
    else
        document.getElementById("dataInput").focus();
}

function showTerms() {
    document.getElementById("topBackPolicy").style.display = "none";
    document.getElementById("policySection").style.display = "none";
    document.getElementById("settings").style.display = "none";
    document.getElementById("qrGenButton").style.transform = "scale(0)";
    document.getElementById("easySection").style.display = "none";
    document.getElementById("settingsSection").style.display = "none";
    document.getElementById("classicSection").style.display = "none";
    document.getElementById("qrCodeSection").style.display = "none";
    document.getElementById("termsSection").style.display = "block";
    document.getElementById("advancedSection").style.display = "none"
    document.getElementById("footerLinkContainer").style.display = "none";
}

function showPrivacy(back = () => {home();}) {
    document.getElementById("settings").style.display = "none";
    document.getElementById("qrGenButton").style.transform = "scale(0)";
    document.getElementById("easySection").style.display = "none";
    document.getElementById("settingsSection").style.display = "none";
    document.getElementById("classicSection").style.display = "none";
    document.getElementById("qrCodeSection").style.display = "none";
    document.getElementById("termsSection").style.display = "none";
    document.getElementById("advancedSection").style.display = "none"
    document.getElementById("topBackPolicy").style.display = "block";
    document.getElementById("policySection").style.display = "block";
    document.getElementById("footerLinkContainer").style.display = "none";

    document.getElementById("backFromPolicy").onclick = back;
    document.getElementById("topBackPolicy").onclick = back;
}

function updtTheme() {
    if (localSettings.theme == "dark") {
        document.documentElement.style.setProperty('--r', '#FE3420');
        document.documentElement.style.setProperty('--rv', '#FF7769');
        document.documentElement.style.setProperty('--re', '#FE3420');
        document.documentElement.style.setProperty('--g', '#CEFE20');
        document.documentElement.style.setProperty('--gv', '#DCFF69');
        document.documentElement.style.setProperty('--b', '#207DFE');
        document.documentElement.style.setProperty('--bt', '#121415');
        document.documentElement.style.setProperty('--bv', '#4572B1');
        document.documentElement.style.setProperty('--be', '#4572B1');
        document.documentElement.style.setProperty('--o', '#FE8020');
        document.documentElement.style.setProperty('--ot', '#151412');
        document.documentElement.style.setProperty('--ov', '#FFA969');
        document.documentElement.style.setProperty('--y', '#FEC220');
        document.documentElement.style.setProperty('--yv', '#FFD469');
        document.documentElement.style.setProperty('--n', '#1B1B1E');
        document.documentElement.style.setProperty('--nno', '#1B1B1E00');
        document.documentElement.style.setProperty('--nho', '#1B1B1E99');
        document.documentElement.style.setProperty('--w', '#FBFFFE');
        document.documentElement.style.setProperty('--nv', '#444146');
        document.documentElement.style.setProperty('--wv', '#B4B3B6');
        document.documentElement.style.setProperty('--gray', '#6D676E');
        document.documentElement.style.setProperty('--bgv', '#333333');
        document.documentElement.style.setProperty('--bg', '#000000');
        document.documentElement.style.setProperty('--fg', '#ffffff');
        document.documentElement.style.setProperty('--fgv', '#cccccc');
        document.documentElement.style.setProperty('--svgn', 'brightness(0.8)');
        document.documentElement.style.setProperty('--svgh', 'brightness(1)');
    } else {
        document.documentElement.style.setProperty('--r', '#FE3420');
        document.documentElement.style.setProperty('--rv', '#FF7769');
        document.documentElement.style.setProperty('--re', '#FE3420');
        document.documentElement.style.setProperty('--g', '#CEFE20');
        document.documentElement.style.setProperty('--gv', '#DCFF69');
        document.documentElement.style.setProperty('--b', '#207DFE');
        document.documentElement.style.setProperty('--bt', '#E1ECFF');
        document.documentElement.style.setProperty('--bv', '#4572B1');
        document.documentElement.style.setProperty('--be', '#4572B1');
        document.documentElement.style.setProperty('--o', '#FE8020');
        document.documentElement.style.setProperty('--ot', '#FFEDE1');
        document.documentElement.style.setProperty('--ov', '#FFA969');
        document.documentElement.style.setProperty('--y', '#FEC220');
        document.documentElement.style.setProperty('--yv', '#FFD469');
        document.documentElement.style.setProperty('--n', '#d4d4d4');
        document.documentElement.style.setProperty('--nno', '#1B1B1E00');
        document.documentElement.style.setProperty('--nho', '#1B1B1E99');
        document.documentElement.style.setProperty('--w', '#FBFFFE');
        document.documentElement.style.setProperty('--nv', '#444146');
        document.documentElement.style.setProperty('--wv', '#B4B3B6');
        document.documentElement.style.setProperty('--gray', '#6D676E');
        document.documentElement.style.setProperty('--fgv', '#333333');
        document.documentElement.style.setProperty('--fg', '#000000');
        document.documentElement.style.setProperty('--bg', '#ffffff');
        document.documentElement.style.setProperty('--bgv', '#eeeeee');
        document.documentElement.style.setProperty('--svgn', 'brightness(0.2)');
        document.documentElement.style.setProperty('--svgh', 'brightness(0)');
    }
}

function updtLang() {
    // general interface
    document.getElementById("lang").innerHTML = localSettings.lang == "fr" ? "FR" : "EN";
    document.getElementById("cButton").innerHTML = localSettings.lang == "fr" ? "Copier" : "Copy";
    document.getElementById("pButton").innerHTML = localSettings.lang == "fr" ? "Coller" : "Paste";
    document.getElementById("aButton").innerHTML = localSettings.lang == "fr" ? "Copier/Coller" : "Copy/Paste";
    document.getElementById("bottomTerms").innerHTML = localSettings.lang == "fr" ? "Conditions Générales d'Utilisation" : "Terms Of Use";
    document.getElementById("bottomPrivacy").innerHTML = localSettings.lang == "fr" ? "Politique de confidentialité" : "Privacy Policy";

    // advanced
    document.getElementById("settingPost").innerHTML = localSettings.lang == "fr" ? (localSettings.post ? "méthode POST" : "méthode GET") : (localSettings.post ? "POST method" : "GET method");
    document.getElementById("settingConst").innerHTML = localSettings.lang == "fr" ? (localSettings.const ? "Inéditable" : "Agrégeable") : (localSettings.const ? "Uneditable" : "Aggregable");

    // settings
    document.getElementById("settingsH4").innerHTML = localSettings.lang == "fr" ? "Paramètres" : "Settings";
    document.getElementById("themeTitle").innerHTML = localSettings.lang == "fr" ? "Thème" : "Theme";
    document.getElementById("deleteTitle").innerHTML = localSettings.lang == "fr" ? "Supprimer après" : "Delete after";
    document.getElementById("settingTheme").innerHTML = localSettings.lang == "fr" ? (localSettings.theme == "dark" ? "Sombre" : "Clair") : (localSettings.theme == "dark" ? "Dark" : "Light");
    document.getElementById("displayTerms").innerHTML = localSettings.lang == "fr" ? "Conditions Générales d'Utilisation" : "Terms Of Use";

    // mode
    if (localSettings.mode == "classic")
        document.getElementById("settingMode").innerHTML = localSettings.lang == "fr" ? "Classique" : "Classic";
    else if (localSettings.mode == "advanced")
        document.getElementById("settingMode").innerHTML = localSettings.lang == "fr" ? "Avancé" : "Advanced";
    else
        document.getElementById("settingMode").innerHTML = localSettings.lang == "fr" ? "Simplifié" : "Simplified";

    // type
    if (localSettings.type == "u")
        document.getElementById("settingTimeDelete").innerHTML = (localSettings.lang == "fr" ? "Collage" : "Pasting") + "<br><span class='verysmall'>(30min max)</span>";
    else if (localSettings.type == "s")
        document.getElementById("settingTimeDelete").innerHTML = "5min";
    else if (localSettings.type == "l")
        document.getElementById("settingTimeDelete").innerHTML = "12h";
    else
        document.getElementById("settingTimeDelete").innerHTML = "30min";

    document.getElementById("saveSettings").innerHTML = localSettings.lang == "fr" ? "Enregistrer" : "Save";

    // inputs/outputs
    document.getElementById("autoInput").placeholder = localSettings.lang == "fr" ? "Entrez votre texte à copier ou votre code ici" : "Enter your text to copy or your code here";
    document.getElementById("dataInput").placeholder = localSettings.lang == "fr" ? "Entrez votre texte à copier ici" : "Enter your text to copy here";
    document.getElementById("codeInput").placeholder = localSettings.lang == "fr" ? "Entrez votre code de presse papier ici" : "Enter your clipboard code here";

    // settings instance value (not really language dependant)
    document.getElementById("settingInstance").value = localSettings.instance;

    // terms
    document.getElementById("termsH4").innerHTML = localSettings.lang == "fr" ? "Conditions Générales d'Utilisation" : "Terms Of Use";
    document.getElementById("byClickText").innerText = localSettings.lang == "fr" ? `En cliquant "J'accepte" ou en utilisant nos services, vous acceptez les CGU ci-dessus.` : `By clicking "I agree" or using our services, you agree to the TOU above.`
    if (localSettings.lang == "fr") {
        document.getElementById("frTerms").style.display = "block";
        document.getElementById("enTerms").style.display = "none";
    } else {
        document.getElementById("enTerms").style.display = "block";
        document.getElementById("frTerms").style.display = "none";
    }
    document.getElementById("privacyLink").innerText = localSettings.lang == "fr" ? "Politique de confidentialité" : "Privacy Policy";
    document.getElementById("iagreeButton").innerHTML = localSettings.lang == "fr" ? "J'accepte" : "I agree";

    // privacy
    document.getElementById("privacyH4").innerHTML = localSettings.lang == "fr" ? "Politique de confidentialité" : "Privacy Policy";
    if (localSettings.lang == "fr") {
        document.getElementById("frPrivacy").style.display = "block";
        document.getElementById("enPrivacy").style.display = "none";
    } else {
        document.getElementById("enPrivacy").style.display = "block";
        document.getElementById("frPrivacy").style.display = "none";
    }
    document.getElementById("backFromPolicy").innerHTML = localSettings.lang == "fr" ? "Retour" : "Back";

    // get the extensions
    document.getElementById("getBExt").innerHTML = localSettings.lang == "fr" ? "Installez l'extension !" : "Get the browser extension!";
}

document.getElementById("lang").addEventListener("click", switchLanguage)
function switchLanguage() {
    let kv = {};
    kv["lang"] = localSettings.lang == "fr" ? "en" : "fr";
    set(kv)
    getAll(updateAll);
}

document.getElementById("settingTheme").addEventListener("click", switchTheme)
function switchTheme() {
    let kv = {};
    kv["theme"] = localSettings.theme == "dark" ? "light" : "dark";
    set(kv)
    getAll(updateAll);
}

document.getElementById("settingMode").addEventListener("click", switchMode)
function switchMode() {
    let kv = {};
    if (localSettings.mode == "easy") {
        kv["mode"] = "classic";
    } else if (localSettings.mode == "classic") {
        kv["mode"] = "advanced";
    } else {
        kv["mode"] = "easy";
    }

    set(kv)
    getAll(updateAll);
}

document.getElementById("settingTimeDelete").addEventListener("click", switchTimeDelete)
function switchTimeDelete() {
    let kv = {};
    if (localSettings.type == "n") {
        kv["type"] = "u";
    } else if (localSettings.type == "u") {
        kv["type"] = "s";
    } else if (localSettings.type == "s") {
        kv["type"] = "l";
    } else {
        kv["type"] = "n";
    }

    set(kv)
    getAll(updateAll);
}

document.getElementById("settingConst").addEventListener("click", switchConst)
function switchConst() {
    let kv = {};
    kv["const"] = localSettings.const ? false : true;
    set(kv)
    getAll(updateAll);
}

document.getElementById("settingPost").addEventListener("click", switchPost)
function switchPost() {
    let kv = {};
    kv["post"] = localSettings.post ? false : true;
    set(kv)
    getAll(updateAll);
}

function saveInstance() {
    if (localSettings.instance == document.getElementById("settingInstance").value)
        return;
    let kv = {};
    kv["instance"] = document.getElementById("settingInstance").value;
    set(kv)
    getAll(updateAll);
}


// Get QR CODE info

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

function getQRCode() {
    const addressFinal = window.location.search;
    if (addressFinal == "")
        return;
    addressArgs = parseURLParams(addressFinal);
    // console.log(addressArgs);
    if (!addressArgs.hasOwnProperty("qr")) return; //addressArgs["qr"] === undefined

    // uncomment to auto set language
    // if (addressArgs["l"]) set({l:addressArgs["l"]});
    // set({tou:true}, updateAll());
    // temporary set TOU to make it easier when copying
    localSettings.tou = true;
    if (addressArgs["p"]) {
        if (localSettings.mode == "easy") {
            document.getElementById("autoInput").value = addressArgs["p"];
            setTimeout(() => {
                document.getElementById("aButton").click();
            }, 200);
        } else {
            document.getElementById("codeInput").value = addressArgs["p"];
            setTimeout(() => {
                document.getElementById("pButton").click();
            }, 200);
        }
    }

}

// Initializing and updating all settings

function updateAll() {
    // console.log(localSettings);
    updtLang();
    updtTheme();
    INPUT_MAX_LENGTH = localSettings.post ? AGGREGATE_MAX_LENGTH : (localSettings.const ? DEFAULT_MAX_LENGTH : AGGREGATE_MAX_LENGTH);
}

function initUpdateAll() {
    updateAll();
    home();
    autoFocus();

    getQRCode()
    // display TOU
    if (localSettings.tou == false) showTerms();
}

getAll(initUpdateAll);

document.getElementById("settingReset").addEventListener("click", () => {
    removeAll(() => {
        getAll(initUpdateAll);
    })
})