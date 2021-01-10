module.exports = {
    file: {
        type: "excel",
        items: [
            {
                path: "../excel/pack*.xlsx",
                sheet: "pack"
            },
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
