const glob = require('glob');
const path = require('path');

module.exports = class File {

    baseDir;
    settings;
    fields = new Map();
    files = [];

    constructor(baseDir, settings) {
        this.baseDir = baseDir;
        this.settings = settings;
        const schema = settings.schema.get();
        for (let key in schema.properties) {
            if (schema.properties.hasOwnProperty(key)) {
                this.fields.set(key, schema.properties[key]);
            }
        }
        this.settings.file.items.forEach(file => {
            let files = glob.sync(baseDir + path.sep + file.path, {});
            for (let path of files) {
                let newFile = {...file}
                newFile.path = path;
                this.files.push(newFile)
            }
        })
    }

    get baseDir() {
        return this.baseDir;
    }

    get settings() {
        return this.settings;
    }

    get fields() {
        return this.fields;
    }

    get files() {
        return this.files;
    }

    async load() {
        throw "not be Implemented"
    }

    async save(data) {
        throw "not be Implemented"
    }

}