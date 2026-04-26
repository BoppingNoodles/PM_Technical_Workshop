const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
let inventory = [
    {id: 1,name: "Arduino Kit", category: "Hardware", quantity: 5, status: "Available"}
]

app.get('/inventory', (req,res) => {
    res.json(inventory)
});

app.post('/inventory', (req, res) => {
    const newItem = {
        id: inventory.length + 1,
        name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity,
        status: req.body.status
    };

    inventory.push(newItem);
    res.status(201).json({message: "item added successfully", item: newItem});
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});