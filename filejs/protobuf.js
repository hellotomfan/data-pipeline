const protobuf = require("protobufjs");

module.exports = class {
    async load() {

    }
    async save() {

    }

}

protobuf.load("../proto/test.proto", function(err, root) {
    if (err)
        throw err;
    let Test = root.lookupType("Test");

    // Exemplary payload
    let payload = { message: { 1: { awesomeField: "AwesomeString" }, 2: {awesomeField: "ss"}} };

    // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
    let errMsg = Test.verify(payload);
    if (errMsg)
        throw Error(errMsg);

    console.log(Test.create(payload));


    var buffer = Test.encode(Test.create(payload)).finish();

    var message = Test.decode(buffer);

    console.log(message);

});

