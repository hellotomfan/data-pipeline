let path = require("path");
let assert = require("assert");
let Utils = require("./utils");
let Validator = require('jsonschema').Validator;

class Schema {
    #id
    #schema
    constructor(id, schema) {
        this.#id = id;
        this.#schema = schema;
    }

    get() {
        return this.#schema.getSchema(this.#id);
    }

    getSchema(id) {
        return this.#schema.getSchema(id);
    }

    validate(object) {
        return this.#schema.validate(this.#id, object);
    }
}

module.exports = class {
    #schemas;
    #validator;

    constructor() {
        this.#schemas = {};
        this.#validator = new Validator();
    }

    open(filename) {
        let id = this.resolve(filename);
        return new Schema(id, this);
    }

    getSchema(id) {
        return this.#validator.getSchema(id);
    }

    resolve(filename) {
        if (!path.isAbsolute(filename)) {
            filename = process.cwd() +  path.sep + filename;
        }
        filename = path.normalize(filename);
        let dirname = path.dirname(filename);
        let id = this.#getId(filename);
        let schema = this.#schemas[id];
        if (schema) {
            assert.deepStrictEqual(schema.filename, filename);
        } else {
            schema = this.#resolve(dirname, id, require(filename));
            this.#schemas[id] = {
                filename: filename,
                schema: schema,
            }
            schema.id = id;
            this.#validator.addSchema(schema, id);
        }
        return id;
    }

    validate(id, data) {
        return this.#validator.validate(data, this.#schemas[id].schema);
    }

    #getId(filename) {
        return "/" + Utils.getId(filename);
    }

    #resolve(dir, id, schema) {
        for (let k in schema) {
            if (schema.hasOwnProperty(k)) {
                let v = schema[k];
                if (k === "$ref") {
                    let ref = schema[k];
                    if (ref[0] === '#') {
                        schema[k] = id + ref;
                    } else {
                        let parts = ref.split('#');
                        let schemaId = this.resolve(dir + path.sep + parts[0]);
                        if (parts.length === 1) {
                            schema[k] = schemaId;
                        } else {
                            schema[k] = schemaId + '#' + parts[1];
                        }
                    }
                }
                if (Utils.isObject(v)) {
                    this.#resolve(dir, id, v);
                } else if (Utils.isArray(v)) {
                    v.forEach(x => {
                        if (Utils.isObject(x)) {
                            this.#resolve(dir, id, x);
                        }
                    })
                }
            }
        }
        return schema;
    }
}

