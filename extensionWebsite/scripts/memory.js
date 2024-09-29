if (typeof browser === "undefined") {
    var thisBrowser = chrome;  // If browser is undefined, fall back to chrome
    var firefox = false;
} else {
    var thisBrowser = browser;
    var firefox = true;
}

let localSettings;

/**
 * Get values for key or list of keys
 * @param key 
 * @param callback that will take one arg
 */
function get(key, callback = (value) => { }) {
    if (typeof key == "object") {
        if (firefox)
            thisBrowser.storage.sync.get(key).then((values) => {
                // console.log("VALUE: ", values);
                callback(values);
            }, (reason) => { console.error("ERROR WHILE GETTING SETTINGS", reason); });
        else
            thisBrowser.storage.sync.get(key, (values) => {
                // console.log("VALUE: ", values);
                callback(values);
            });
        return;
    }
    else if (typeof key == "string") {
        if (firefox)
            thisBrowser.storage.sync.get([`${key}`]).then((value) => {
                //console.log("VALUE: ", value);
                callback(value);
            }, (reason) => { console.error("ERROR WHILE GETTING SETTINGS", reason); });
        else
            thisBrowser.storage.sync.get([`${key}`], (value) => {
                //console.log("VALUE: ", value);
                callback(value);
            });
        return;
    }
    else
        return console.log("The following type is not gettable:", key);
}

/**
 * Set key values
 * @param kvObject {key: value, key2: value2...}
 * @returns nothing
 */
function set(kvObject, callback = () => { }) {
    console.log(kvObject);
    if (typeof kvObject == "object") {
        if (firefox)
            browser.storage.sync.set(kvObject).then(() => {
                console.log("Settings saved");
                callback();
            }, (reason) => { console.error("ERROR WHILE GETTING SETTINGS", reason); });
        else
            thisBrowser.storage.sync.set(kvObject, function () { console.log("Settings saved"); callback() });
    }
    else
        return console.log("The following type is not settable:", key);
}

/**
 * remove values by key 
 * @param keys ["key1", "key2"] 
 * @param callback that will take one arg
 */
function remove(keys, callback = () => { }) {
    if (firefox)
        thisBrowser.storage.sync.remove(keys).then(() => {
            console.log("Deleted", keys);
        });
    else
        thisBrowser.storage.sync.remove(keys, function () {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
            console.log("Deleted", keys);
        });
}

function removeAll(callback = () => { }) {
    if (firefox)
        thisBrowser.storage.sync.clear().then(() => {
            console.log("All settings have been reset!");
            callback();
        });
    else
        thisBrowser.storage.sync.clear(function () {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
            console.log("All settings have been reset!");
            callback();
        });
}

function getAll(callback = () => { }) {
    get(["tou", "theme", "lang", "mode", "instance", "type", "const", "post"], (values) => {
        // console.log(values);
        if (values["tou"] === undefined) values.tou = false;
        if (!values["theme"]) values.theme = "dark";
        if (!values["lang"]) values.lang = "en";
        if (!values["mode"]) values.mode = "easy";
        if (!values["type"]) values.type = "n";
        if (values["const"] === undefined) values.const = true;
        if (values["post"] === undefined) values.post = true;
        if (!values["instance"]) values.instance = "https://cpoi.softplus.fr/";
        localSettings = values;
        callback();
    });

}