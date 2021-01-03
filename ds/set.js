module.exports = {
    data: [
        { id: "set1" },
        { id: "set2", setId:"set1" },
        { id: "set3", setId:"set1" },
        { id: "set4", setId:"set1" },
        { id: "set5", setId:"set1" },
    ],
    schema: "../sch/set.js",
    uniques: [
        ["id"]
    ],
    relations: [
        {
            keys: ["setId"],
            reference: {
                keys: ["id"]
            }
        }
    ]
}
