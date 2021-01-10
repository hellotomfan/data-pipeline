const ExcelJS = require('exceljs');
const fs = require('fs');
const Utils = require('../utils');
const File = require('./file');


module.exports = class {
    #baseDir;
    #settings;
    #fields;
    #allFiles;

    constructor(baseDir, settings) {
        this.#baseDir = baseDir;
        this.#settings = settings;
        const schema = this.#settings.schema.get();
        this.#fields = new Map();
        for (let key in schema.properties) {
            if (schema.properties.hasOwnProperty(key)) {
                this.#fields.set(key, schema.properties[key]);
            }
        }
        this.#allFiles = Utils.getAllFiles(this.#baseDir, this.#settings.file.items);
    }

    async #load(file) {

        let workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file.path);
        let sheet = workbook.getWorksheet(file.sheet);

        let keys;
        let data = [];
        if (sheet) {
            sheet.getSheetValues().forEach((rowValues) => {
                if (!keys) {
                    keys = {};
                    for (let i = 1; i < rowValues.length; i++) {
                        keys[rowValues[i]] = i;
                    }
                } else {
                    let o = {};

                    this.#fields.forEach((value, key) => {
                        let i = keys[key];
                        if (i !== undefined) {
                            const value = rowValues[i];
                            if (value) {
                                if (!Boolean(value && Array.isArray(value.richText))) {
                                    o[key] = value;
                                } else {
                                    o[key] = value.richText.map(({text}) => text).join('')
                                }
                            }
                        }
                    })
                    data.push({
                        o: o,
                        meta: file
                    });
                }
            });
        }
        return data;

    }

    async load() {
        let results = await Promise.all(this.#allFiles.map((v, i) => this.#load(v)));
        let data = [];
        results.forEach(result => {
            data.push(...result);
        })
        return data;
    }

    async getDefaultMeta() {
        if (this.#allFiles.length === 1) {
            return this.#allFiles[0];
        }
        return {path: "./new.xlsx", sheet: "new"}
    }

    async #create(file) {
        let workbook = new ExcelJS.Workbook();
        if (fs.existsSync(file.path)) {
            await workbook.xlsx.readFile(file.path);
        }
        workbook.removeWorksheet(file.sheet);
        let sheet = workbook.addWorksheet(file.sheet);

        let columns = [];
        for (let [key] of this.#fields) {
            columns.push({
                header: key,
                key: key,
            })
        }
        sheet.columns = columns;
        return {workbook: workbook, sheet: sheet, path: file.path};
    }

    async save(data) {
        let files = {};
        for (let d of data) {
            let key = JSON.stringify(d.meta);
            let file = files[key];
            if (!file) {
                files[key] = file = await this.#create(d.meta);
            }
            file.sheet.addRow(d.o);
        }

        let results = [];
        for (let key in files) {
            let file = files[key];
            results.push(file.workbook.xlsx.writeFile(file.path));
        }
        await Promise.all(results);
    }






}

/*
async function main() {
    let excel = new module.exports();
    await excel.save("../excel/test.xlsx", "packs", [{x: 1, y: 2, z:3}, {a: 1, b: 2, c: 3}]);
}

main().then(x => {

});


 */


