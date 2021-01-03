module.exports = {
    data: [
        { id: "item1", packId: "pack1" },
        { id: "item2", packId: "pack2" },
        { id: "item3", packId: "pack3" },
        { id: "item4", packId: "pack4" },
        { id: "item5", packId: "pack5" },
    ],
    schema: "../sch/store.js",
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
