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

    // terms
    document.getElementById("termsH4").innerHTML = localSettings.lang == "fr" ? "Conditions Générales d'Utilisation" : "Terms Of Use";
    if (localSettings.lang == "fr") {
        document.getElementById("frTerms").style.display = "block";
        document.getElementById("enTerms").style.display = "none";
    } else {
        document.getElementById("enTerms").style.display = "block";
        document.getElementById("frTerms").style.display = "none";
    }

    // privacy
    document.getElementById("privacyH4").innerHTML = localSettings.lang == "fr" ? "Politique de confidentialité" : "Privacy Policy";
    if (localSettings.lang == "fr") {
        document.getElementById("frPrivacy").style.display = "block";
        document.getElementById("enPrivacy").style.display = "none";
    } else {
        document.getElementById("enPrivacy").style.display = "block";
        document.getElementById("frPrivacy").style.display = "none";
    }
}

document.getElementById("lang").addEventListener("click", switchLanguage)
function switchLanguage() {
    let kv = {};
    kv["lang"] = localSettings.lang == "fr" ? "en" : "fr";
    set(kv)
    getAll(updateAll);
}

function updateAll() {
    // console.log(localSettings);
    updtLang();
    updtTheme();
    INPUT_MAX_LENGTH = localSettings.post ? AGGREGATE_MAX_LENGTH : (localSettings.const ? DEFAULT_MAX_LENGTH : AGGREGATE_MAX_LENGTH);
}

function initUpdateAll() {
    updateAll();
}

getAll(initUpdateAll);