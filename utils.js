let path = require("path");
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid');
const glob = require('glob');

module.exports.getId = (filename) => {
    return path.parse(filename).name;
}
module.exports.isObject = (a) => {
    return (!!a) && (a.constructor === Object);
};

module.exports.isArray = (a) => {
    return (!!a) && (a.constructor === Array);
}

module.exports.generateId = (data) => {
    if( typeof module.exports.generateId.counter == 'undefined' ) {
        module.exports.generateId.counter = 0;
    }
    module.exports.generateId.counter++;
    return module.exports.generateId.counter;
    //return crypto.createHash('md5').update(JSON.stringify(data)).digest("hex")
    //return uuidv4();
}

module.exports.getValues = (data, keys) => {

    let key = keys.shift();
    let value = data[key];

    if (keys.length === 0) {
        return [value];
    }
    if (!module.exports.isArray(value)) {
        return this.getValues(value, keys);
    } else {
        let result = [];
        value.forEach(v => {
            let newKeys = keys.slice();
            let rs = this.getValues(v, newKeys);
            if (!module.exports.isArray(rs)) {
                result.push(rs);
            } else {
                result = result.concat(rs);
            }
        });
        return result;
    }
}

module.exports.getAllFiles = (baseDir, files) => {
    let allFiles = [];
    files.forEach(file => {
        let files = glob.sync(baseDir + path.sep + file.name, {});
        for (let fileName of files) {
            let newFile = {...file}
            newFile.name = fileName;
            allFiles.push(newFile)
        }
    })
    return allFiles;
}
