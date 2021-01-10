module.exports = {
    file: {
        type: "excel",
        items: [
            {
                path: "../excel/set*.xlsx",
                sheet: "set"
            },
        ]
    },
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
