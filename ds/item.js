module.exports = {
    schema: "../sch/item.js",
    file: {
        type: "json",
        items: [
            {
                path: "../data/test*.json",
                root: "item",
            },
            {
                path: "../data/aaaa.json",
                root: "item",
            },
        ]
    },
    uniques: [
        ["id"]
    ],
    relations: [
        {
            keys: ["packId"],
            reference: {
                ds: "./pack.js",
                keys: "id"
            }
        }
    ]
}
