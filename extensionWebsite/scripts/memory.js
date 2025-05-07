/**
 * tou : terms of use not accepted
 * theme : light|dark
 * lang : fr|en
 * mode : classic|easy|advanced
 * instance : https://cpoi.0xy.fr/
 * type : u|n|s|l
 * const : Uneditable mode
 * post : POST method (else GET)
 */
let localSettings;

/**
 * Get values for key or list of keys
 * @param key 
 * @param callback that will take one arg
 */
function get(key, callback = (values) => { }) {
    if (typeof key == "object") {
        let values = {};
        for (const k of key) {
            values[k] = localStorage.getItem(k);
        }
        callback(values);
    }
    else if (typeof key == "string") {
        let value = localStorage.getItem(key);
        callback(value);
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
    // console.log(kvObject);
    if (typeof kvObject == "object") {
        for (const key in kvObject) {
            localStorage.setItem(key, kvObject[key]);
        }
        callback();
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
    for (const k of keys) {
        localStorage.removeItem(k);
    }
    callback();
}

function removeAll(callback = () => { }) {
    localStorage.clear();
    callback();
}

function getAll(callback = () => { }) {
    get(["tou", "theme", "lang", "mode", "instance", "type", "const", "post"], (values) => {
        // console.log("before", values);
        if (values["tou"] === null)
            values.tou = false;
        else
            values.tou = values["tou"] == "true" ? true : false;
        if (!values["theme"]) values.theme = "dark";
        if (!values["lang"]) values.lang = "en";
        if (!values["mode"]) values.mode = "easy";
        if (!values["type"]) values.type = "n";
        if (values["const"] === null)
            values.const = true;
        else
            values.const = values["const"] == "true" ? true : false;
        if (values["post"] === null)
            values.post = true;
        else
            values.post = values["post"] == "true" ? true : false;
        if (!values["instance"]) values.instance = "https://cpoi.0xy.fr/";
        // console.log("after", values);
        localSettings = values;
        callback();
    });

}