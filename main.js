//DataSource = require("./datasource");
//(new DataSource).load("ds/store.js");
//console.log(process.cwd())

//const Util = require("./utils");
//console.log(Util.getAllFiles("ds", [
//    {
//        name: "../excel/*/*.xlsm",
//        sheet: "pack"
//    }
//]));


let Validator = require('jsonschema').Validator;
let v = new Validator();

let schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",

    "definitions": {
        "address": {
            "type": "object",
            "properties": {
                "street_address": { "type": "string" },
                "city":           { "type": "string" },
                "state":          { "type": "string" }
            },
            "required": ["street_address", "city", "state"]
        }
    },

    "type": "object",

    "properties": {
        "billing_address": { "$ref": "#/definitions/address" },
        "shipping_address": { "$ref": "#/definitions/address" }
    }
}


let p =
    {
        "shipping_address": {
            "street_address": "1600 Pennsylvania Avenue NW",
            "city": "Washington",
            "state": "DC"
        },
        "billing_address": {
            "street_address": "1st Street SE",
            "city": "Washington",
            "state": "DC"
        }
    };

v.addSchema(schema, '/SimpleAddress');
let x = v.validate(p, schema);

v.getSchema('/')



