module.exports = {
    data: [
        { id: "pack1", setId: "set1", name: "packname1" },
        { id: "pack2", setId: "set2", name: "packname2" },
        { id: "pack3", setId: "set3", name: "packname3" },
        { id: "pack4", setId: "set4", name: "packname4" },
        { id: "pack5", setId: "set5", name: "packname5" },
    ],
    source: {
        type: "exceljs",
        files: [
            {
                name: "../excel/*",
                sheet: "pack"
            }
        ]
    },
    schema: "../sch/pack.js",
    uniques: [
        ["id"]
    ],
    relations: [
        {
            keys: ["setId"],
            reference: {
                ds: "./set.js",
                keys: "id"
            }
        }
    ]
}
