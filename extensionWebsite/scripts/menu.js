const DEFAULT_MAX_LENGTH = 1700;
const AGGREGATE_MAX_LENGTH = 60000;

function urlEncode(input) {
    // let input = encodeHTMLEntities(rawInput);
    if (localSettings.post == false)
        return input.split('').map(c => {
            if (/[a-zA-Z0-9\-_.~?]/.test(c)) {
                return c;
            } else {
                return encodeURIComponent(c).toUpperCase();
            }
        }).join('');
    else return input;
}

function decodeHTMLEntities(text) {
    const tempElement = document.createElement('textarea');
    tempElement.innerHTML = text;
    return tempElement.value;
}

function encodeHTMLEntities(text) {
    const tempElement = document.createElement('div');
    tempElement.textContent = text;
    return tempElement.innerHTML;
}

// COMMINUCATION FUNCTIONS

const regex = /^[a-z]{1,6}\-[a-z]{1,6}\-[a-z]{1,6}$/;
let lastStringRequest = "";
let lastCode = "";
let INPUT_MAX_LENGTH = 1800;

function setError(idObj, message) {
    document.getElementById(idObj).innerHTML = message;
}

const popUp = document.getElementById("infoTempPopUp")
popUp.style.display = "none";
function setTempPopUp(visible, title = "", content = "") {
    popUp.style.display = visible ? "flex" : "none";
    popUp.innerHTML = `
    <h2>${title}</h2>
    <p>${content}</p>
    `;
}

// function chunkString(str, length) {
//     return str.match(new RegExp('(.{1,' + length + '}\s)\s*', 'g'));
// }
function chunkString(inputString, maxLength) {
    const chunks = [];
    let start = 0;

    while (start < inputString.length) {
        let newString = inputString.slice(start, start + maxLength);
        if (newString.includes("%3Cscript")) {
            let subStrings = newString.split("%3Cscript");
            for (let index = 0; index < subStrings.length; index++) {
                let s = "";
                if (index > 0)
                    s += "ipt";
                s += subStrings[index];
                if (index < subStrings.length - 1)
                    s += "%3Cscr";
                chunks.push(s);
            }
        }
        else
            chunks.push(newString);
        start += maxLength;
    }

    return chunks;
}

function updateAndClipboardCopy(obj, rawValue, isCode = false) {
    let value = decodeHTMLEntities(rawValue);
    console.log(value);
    obj.value = value;
    lastCode = value;
    navigator.clipboard.writeText(value);
    if (isCode) {
        document.getElementById("qrcode").innerHTML = "";
        document.getElementById("qrGenButton").style.transform = "scale(1)";
        new QRCode(document.getElementById("qrcode"), `${localSettings.instance}?qr=1&l=${localSettings.lang}&e=${urlEncode(value)}`);
        document.getElementById("qrValue").innerHTML = `${localSettings.instance}?qr=1&l=${localSettings.lang}&e=${urlEncode(value)}`;
    }
}

function recursiveSend(ret, contents, code = "") {
    console.log(contents);
    for (const c of contents) {
        console.log(c.length, c);
    }
    if (contents.length > 0) {
        let req = "";
        if (code == "")
            req = `${localSettings.instance}?l=${lang}&t=${localSettings.type}&c=${contents.shift()}`;
        else
            req = `${localSettings.instance}?a=${code}:${contents.shift()}`;

        setTempPopUp(true, localSettings.lang == "fr" ? "Envoi en cours..." : "Sending...", localSettings.lang == "fr" ? `${contents.length} fragments restants` : `${contents.length} fragments left`)
        fetch(req)
            .then(response => response.text())
            .then(text => {
                if (code == "") code = text.startsWith("\n") ? text.slice(1) : text
                setTimeout(() => {
                    recursiveSend(ret, contents, code);
                }, 200);
            });
    }
    else {
        updateAndClipboardCopy(ret, code, true);
        setTempPopUp(false);
        if (localSettings.mode == "easy") document.getElementById("autoOutput").style.transform = "scale(1)";
    }
}

function getCodeFromCPOI(ret, mode, content, lang = 'en') {
    if (content == lastStringRequest) ret.value = lastCode;
    if (mode == '') setError("dataInput", `${localSettings.lang == "fr" ? "Erreur interne" : "Internal error"} :/`);
    if (content == '' || content.length > INPUT_MAX_LENGTH) return setError("dataInput", `${localSettings.lang == "fr" ? "Longueur maximale : " : "Max length: "} ${INPUT_MAX_LENGTH} !`);
    lastStringRequest = content;

    if (localSettings.post == false) {
        if (content.includes("%3Cscript")) {
            if (INPUT_MAX_LENGTH == DEFAULT_MAX_LENGTH)
                return setError("dataInputInfo", `${localSettings.lang == "fr" ? "Ne peut pas contenir &lt;script&gt;. Utilisez POST ou Agrégeable." : "Can't contain &lt;script&gt;. Use POST or Aggregable."}`);
            else return recursiveSend(ret, chunkString(content, DEFAULT_MAX_LENGTH));
        }

        if (content.length <= DEFAULT_MAX_LENGTH)
            fetch(`${localSettings.instance}?l=${lang}&t=${localSettings.type}${localSettings.const ? "&m=const" : ""}&${mode}=${content}`)
                .then(response => response.text())
                .then(text => {
                    updateAndClipboardCopy(ret, text.startsWith("\n") ? text.slice(1) : text, true);
                });
        else recursiveSend(ret, chunkString(content, DEFAULT_MAX_LENGTH));
    }
    else {
        fetch(`${localSettings.instance}/index.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'l': lang,
                't': localSettings.type,
                'c': content,
                'm': `post;${localSettings.const ? "const" : ""}`
            })
        })
            .then(response => response.text())
            .then(text => {
                // console.log(text);
                if (regex.test(text.startsWith("\n") ? text.slice(1) : text))
                    updateAndClipboardCopy(ret, text.startsWith("\n") ? text.slice(1) : text, true);
                else
                    updateAndClipboardCopy(ret, text.startsWith("\n") ? text.slice(1) : text);
                document.getElementById("autoOutput").style.transform = "scale(1)";
            })
            .catch(error => console.error('Error:', error));
    }
}

function getClipboardFromCPOI(ret, code) {
    if (code == '' || regex.test(code) == false) return setError("codeInputInfo", `"${code}" ${localSettings.lang == "fr" ? "ne ressemble pas à un code valide" : "doesn't look like a valid code"}`);
    if (localSettings.post == false) {
        fetch(`${localSettings.instance}?p=${code}`)
            .then(response => response.text())
            .then(text => {
                updateAndClipboardCopy(ret, text.startsWith("\n") ? text.slice(1) : text);
            });
    } else {
        fetch(`${localSettings.instance}/index.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'p': code
            })
        })
            .then(response => response.text())
            .then(text => {
                // console.log(response);
                updateAndClipboardCopy(ret, text.startsWith("\n") ? text.slice(1) : text);
            })
            .catch(error => console.error('Error:', error));
    }
}


function getEasyFromCPOI(ret, content, lang = 'en') {
    if (content == lastStringRequest) return ret.value = lastCode;
    if (content == '' || content.length > INPUT_MAX_LENGTH) return setError("autoInputInfo", `${localSettings.lang == "fr" ? "Longueur maximale : " : "Max length: "} ${INPUT_MAX_LENGTH} !`);
    lastStringRequest = content;

    if (localSettings.post == false) {
        if (content.includes("%3Cscript")) {
            if (INPUT_MAX_LENGTH == DEFAULT_MAX_LENGTH)
                return setError("autoInputInfo", `${localSettings.lang == "fr" ? "Ne peut pas contenir &lt;script&gt;. Utilisez POST ou Agrégeable." : "Can't contain &lt;script&gt;. Use POST or Aggregable."}`);
            else return recursiveSend(ret, chunkString(content, DEFAULT_MAX_LENGTH));
        }

        console.log(`${localSettings.instance}?l=${lang}&t=${localSettings.type}${localSettings.const ? "&m=const" : ""}&e=${content}`);
        // console.log(`${localSettings.instance}?${lang}&e=${urlEncode(content)}`);
        if (content.length <= DEFAULT_MAX_LENGTH)
            fetch(`${localSettings.instance}?l=${lang}&t=${localSettings.type}&e=${content}`)
                .then(response => response.text())
                .then(text => {
                    if (regex.test(text.startsWith("\n") ? text.slice(1) : text))
                        updateAndClipboardCopy(ret, text.startsWith("\n") ? text.slice(1) : text, true);
                    else
                        updateAndClipboardCopy(ret, text.startsWith("\n") ? text.slice(1) : text);
                    document.getElementById("autoOutput").style.transform = "scale(1)";
                });
        else recursiveSend(ret, chunkString(content, DEFAULT_MAX_LENGTH));
    } else {
        fetch(`${localSettings.instance}/index.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'l': lang,
                't': localSettings.type,
                'e': content,
                'm': `post;${localSettings.const ? "const" : ""}`
            })
        })
            .then(response => response.text())
            .then(text => {
                // console.log(text);
                if (regex.test(text.startsWith("\n") ? text.slice(1) : text))
                    updateAndClipboardCopy(ret, text.startsWith("\n") ? text.slice(1) : text, true);
                else
                    updateAndClipboardCopy(ret, text.startsWith("\n") ? text.slice(1) : text);
                document.getElementById("autoOutput").style.transform = "scale(1)";
            })
            .catch(error => console.error('Error:', error));
    }
}

document.getElementById("autoOutput").style.transform = "scale(0)";
document.getElementById("qrGenButton").style.transform = "scale(0)";

// COPY PASTE BUTTONS

document.getElementById("aButton").addEventListener("click", () => { getEasyFromCPOI(document.getElementById("autoOutput"), urlEncode(document.getElementById("autoInput").value), localSettings.lang); });
document.getElementById("cButton").addEventListener("click", () => { getCodeFromCPOI(document.getElementById("codeInput"), 'c', urlEncode(document.getElementById("dataInput").value), localSettings.lang) });
document.getElementById("pButton").addEventListener("click", () => { getClipboardFromCPOI(document.getElementById("dataInput"), document.getElementById("codeInput").value) });

function home() {
    document.getElementById("easySection").style.display = localSettings.mode == "easy" ? "block" : "none";
    document.getElementById("settingsSection").style.display = "none";
    document.getElementById("classicSection").style.display = localSettings.mode == "easy" ? "none" : "block";
    document.getElementById("qrCodeSection").style.display = "none";
    document.getElementById("termsSection").style.display = "none";
    document.getElementById("advancedSection").style.display = localSettings.mode == "advanced" ? "block" : "none";
}

// SUBMENUS

function showTerms() {
    document.getElementById("settings").style.display = "none"
    document.getElementById("qrGenButton").style.transform = "scale(0)";
    document.getElementById("easySection").style.display = "none";
    document.getElementById("settingsSection").style.display = "none";
    document.getElementById("classicSection").style.display = "none";
    document.getElementById("qrCodeSection").style.display = "none";
    document.getElementById("termsSection").style.display = "block";
    document.getElementById("advancedSection").style.display = "none"
}
document.getElementById("displayTerms").addEventListener("click", showTerms)

document.getElementById("iagreeButton").addEventListener("click", () => {
    set({ tou: true });
    document.getElementById("settings").style.display = "block"
    document.getElementById("settings").innerHTML = "⚙";
    home();
    autoFocus();
})


let inSettings = false;
document.getElementById("settings").addEventListener("click", () => {
    if (inSettings) {
        document.getElementById("settings").innerHTML = "⚙";
        saveInstance();
        inSettings = false;
        home();
        autoFocus();
    } else {
        document.getElementById("settings").innerHTML = "⨯";
        document.getElementById("qrIcon").src = "../images/qrcode.svg";
        inSettings = true;
        inQrcode = false;
        document.getElementById("settingsSection").style.display = "block";
        document.getElementById("easySection").style.display = "none";
        document.getElementById("classicSection").style.display = "none";
        document.getElementById("qrCodeSection").style.display = "none";
    }
});

let inQrcode = false;
document.getElementById("qrGenButton").addEventListener("click", () => {
    if (inQrcode) {
        document.getElementById("qrIcon").src = "../images/qrcode.svg";
        inQrcode = false;
        home();
    } else {
        document.getElementById("settings").innerHTML = "⚙";
        document.getElementById("qrIcon").src = "../images/cross.svg";
        inQrcode = true;
        inSettings = false;
        document.getElementById("settingsSection").style.display = "none";
        document.getElementById("easySection").style.display = "none";
        document.getElementById("classicSection").style.display = "none";
        document.getElementById("qrCodeSection").style.display = "block";
    }
});

document.getElementById("saveSettings").addEventListener("click", () => {
    document.getElementById("settings").innerHTML = "⚙";
    saveInstance();
    inSettings = false;
    home();
    autoFocus();
});

function autoFocus() {
    if (localSettings.mode == "easy")
        document.getElementById("autoInput").focus();
    else
        document.getElementById("dataInput").focus();
}

// KEYBOARD SHORTCUTS

var autoInput = document.getElementById("autoInput");
var dataInput = document.getElementById("dataInput");
var codeInput = document.getElementById("codeInput");
var ctrlPressed = false;
autoInput.addEventListener("keydown", function (e) {
    // console.log(e.code);

    if (e.key === "Enter") {
        if (ctrlPressed)
            document.getElementById("aButton").click();
    } else if (e.key === "Control") {
        ctrlPressed = true;
    }

    if (urlEncode(autoInput.value).length > INPUT_MAX_LENGTH)
        setError("autoInputInfo", `${localSettings.lang == "fr" ? "Longueur maximale : " : "Max length: "} ${INPUT_MAX_LENGTH} (${INPUT_MAX_LENGTH - urlEncode(autoInput.value).length})`);
    else if (urlEncode(autoInput.value).includes("%3Cscript") && INPUT_MAX_LENGTH == DEFAULT_MAX_LENGTH && localSettings.post == false)
        setError("autoInputInfo", `${localSettings.lang == "fr" ? "Ne peut pas contenir &lt;script&gt;. Utilisez POST ou Agrégeable." : "Can't contain &lt;script&gt;. Use POST or Aggregable."}`);
    else
        setError("autoInputInfo", "");
});
autoInput.addEventListener("keyup", function (e) {
    if (e.key === "Control") {
        ctrlPressed = false;
    }
});

dataInput.addEventListener("keydown", function (e) {
    // console.log(e.code);

    if (e.key === "Enter") {
        if (ctrlPressed)
            document.getElementById("cButton").click();
    } else if (e.key === "Control") {
        ctrlPressed = true;
    }

    if (urlEncode(dataInput.value).length > INPUT_MAX_LENGTH)
        setError("dataInputInfo", `${localSettings.lang == "fr" ? "Longueur maximale : " : "Max length: "} ${INPUT_MAX_LENGTH} (${INPUT_MAX_LENGTH - urlEncode(dataInput.value).length})`);
    else if (urlEncode(dataInput.value).includes("%3Cscript") && INPUT_MAX_LENGTH == DEFAULT_MAX_LENGTH && localSettings.post == false)
        setError("dataInputInfo", `${localSettings.lang == "fr" ? "Ne peut pas contenir &lt;script&gt;. Utilisez POST ou Agrégeable." : "Can't contain &lt;script&gt;. Use POST or Aggregable."}`);
    else
        setError("dataInputInfo", "");
});
dataInput.addEventListener("keyup", function (e) {
    if (e.key === "Control") {
        ctrlPressed = false;
    }
});

codeInput.addEventListener("keydown", function (e) {
    // console.log(e.code);

    if (e.key === "Enter") {
        if (ctrlPressed)
            document.getElementById("pButton").click();
    } else if (e.key === "Control") {
        ctrlPressed = true;
    }
});
codeInput.addEventListener("keyup", function (e) {
    if (e.key === "Control") {
        ctrlPressed = false;
    }
});

// POST ping

function sendPing(json = false) {
    setTempPopUp(true, `Waiting...`, "");
    if (json)
        // json requests not supported by server yet
        fetch(`${localSettings.instance}/index.php`, {
            method: 'POST',
            body: JSON.stringify({ 'ping': 'yes' }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.text())
            .then(data => {
                // console.log(response);
                console.log("JSON", data);
                setTempPopUp(true, `POST`, data);
            })
            .catch(error => console.error('Error:', error));
    else
        fetch(`${localSettings.instance}/index.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'ping': 'yes'
            })
        })
            .then(response => response.text())
            .then(data => {
                // console.log(response);
                console.log("URL", data);
                setTempPopUp(true, `POST`, data);
            })
            .catch(error => console.error('Error:', error));
}