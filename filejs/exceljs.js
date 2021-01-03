const ExcelJS = require('exceljs');
const fs = require('fs');
const glob = require("glob");

module.exports = class {
    #settings
    constructor(settings) {
        this.#settings = settings;
    }


    async load() {




        /*
        let fileName = args.file;
        let sheetName = args.sheet;





        let workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(fileName);
        let keys;
        let data = [];
        let sheet = workbook.getWorksheet(sheetName);
        sheet.getSheetValues().forEach((v, i, rv) => {
            if (!keys) {
                keys = v;
            } else {
                let object = {};
                for (let i = 1; i < keys.length; i++) {

                    const key = keys[i];
                    const value = v[i];

                    if (!Boolean(value && Array.isArray(value.richText))) {
                        object[ key ] = value;
                    } else {
                        object[ key ] = value.richText.map(({ text }) => text).join('')
                    }

                }
                data.push(object);
            }
        })
        return data;
         */
    }

    async save(fileName, sheetName, data) {
        let workbook = new ExcelJS.Workbook();
        if (fs.existsSync(fileName)) {
            await workbook.xlsx.readFile(fileName);
        }
        workbook.removeWorksheet(sheetName);
        let sheet = workbook.addWorksheet(sheetName);

        let keys = {};
        data.forEach(o => {
            for (let key in o) {
                keys[key] = true;
            }
        })

        let columns = [];

        for (let key in keys) {
            columns.push({
                header: key,
                key: key,
            })
        }

        sheet.columns = columns;
        data.forEach(o => {
            sheet.addRow(o);
        });

        await workbook.xlsx.writeFile(fileName)
    }

}

