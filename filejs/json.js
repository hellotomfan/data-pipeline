const Utils = require('../utils')
const File = require('./file');
const fs = require('fs');
const fsPromises = fs.promises;



module.exports = class extends File {
    #jsonFiles = {}
    constructor(baseDir, settings) {
        super(baseDir, settings)
    }

    async getDefaultMeta() {
        if (this.files.length === 1) {
            return {isObject: false, file: this.files[0]};
        }
        return {isObject: false, file: {path: './new.json', root: 'root'}}
    }

    async #load(file) {
        let key = JSON.stringify(file);
        let jf = this.#jsonFiles[key];
        if (!jf) {
            let json = JSON.parse(await fsPromises.readFile(file.path, 'utf8'));
            let v = Utils.getValue(json, file.root.split('.'));
            if (v === undefined) {
                throw "error!!!";
            }
            jf = this.#jsonFiles[key] = {
                json: json,
                file: file,
                value: v,
                valueIsObject: Utils.isObject(v),
            }
        }
        return jf;
    }

    async load() {
        let data = [];
        await Promise.all(this.files.map(file => this.#load(file)));
        for (let k in this.#jsonFiles) {
            let jf = this.#jsonFiles[k];
            if (jf.valueIsObject) {
                data.push({
                    o: jf.value,
                    meta: {isObject: true, file: jf.file}
                });
            } else {
                jf.value.forEach(x => data.push({
                    o: x,
                    meta: {isObject: false, file: jf.file}
                }));
            }
        }
        return [];
    }

    async save(data) {
        data.forEach(d => {
        });
    }
}

