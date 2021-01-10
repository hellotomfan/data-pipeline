const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');
const Utils = require('../utils');
const File = require('./file');

const parser = new xml2js.Parser();
const readFile = util.promisify(fs.readFile);
const parseString = util.promisify(parser.parseString);

module.exports = class extends File {

    constructor(baseDir, settings) {
        super(baseDir, settings);
    }

    async load() {
        let fileData = await Promise.all(this.files.map(file => readFile(file.path)));
        let results = await Promise.all(fileData.map(data => parseString(data)));
        let data = [];
        for (let i = 0; i < results.length; i++) {
            let file = this.files[i];
            let o = Utils.getValue(results[i], file.root.split('.'))
            o.forEach(x => {
                data.push({
                    o: x,
                    meta: file
                })
            })
        }
        return data;
    }

    async save() {

    }

};

/*
fs.readFile(__dirname + '/foo.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(JSON.stringify(result));
        console.log('Done');
    });
});
 */
main().then();
