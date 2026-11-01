require('dotenv').config();
const path = require('path');
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

sql.connect(config).then(() => {
    console.log("Connected to MS SQL Database!");
}).catch(err => console.log("Database Connection Failed!", err));

// ==========================
// PRODUCTS ENDPOINTS
// ==========================
app.get('/api/products', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Products');
        res.json(result.recordset);
    } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/products', async (req, res) => {
    try {
        const { Name, UnitPrice, QtyInStock, ReorderLevel, SupplierID } = req.body;
        const sku = 'PRD-' + Date.now().toString().slice(-6);
        const reqSql = new sql.Request();
        reqSql.input('name', sql.VarChar, Name);
        reqSql.input('sku', sql.VarChar, sku);
        reqSql.input('price', sql.Decimal, UnitPrice);
        reqSql.input('qty', sql.Int, QtyInStock);
        reqSql.input('reorder', sql.Int, ReorderLevel);
        await reqSql.query(`INSERT INTO Products (ProductName, SKU, UnitPrice, QtyInStock, ReorderLevel) VALUES (@name, @sku, @price, @qty, @reorder)`);
        res.status(201).send({ message: "Product created" });
    } catch (err) { res.status(500).send(err.message); }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { Name, UnitPrice, QtyInStock, ReorderLevel } = req.body;
        const reqSql = new sql.Request();
        reqSql.input('id', sql.Int, req.params.id);
        reqSql.input('name', sql.VarChar, Name);
        reqSql.input('price', sql.Decimal, UnitPrice);
        reqSql.input('qty', sql.Int, QtyInStock);
        reqSql.input('reorder', sql.Int, ReorderLevel);
        await reqSql.query(`UPDATE Products SET ProductName = @name, UnitPrice = @price, QtyInStock = @qty, ReorderLevel = @reorder WHERE ProductID = @id`);
        res.status(200).send({ message: "Product updated" });
    } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const reqSql = new sql.Request();
        reqSql.input('id', sql.Int, req.params.id);
        await reqSql.query('DELETE FROM Products WHERE ProductID = @id');
        res.status(200).send({ message: "Product deleted" });
    } catch (err) { res.status(500).send(err.message); }
});

// ==========================
// SUPPLIERS ENDPOINTS
// ==========================
app.get('/api/suppliers', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Suppliers');
        res.json(result.recordset);
    } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/suppliers', async (req, res) => {
    try {
        const { Name, ContactNo, Address, Email } = req.body;
        const reqSql = new sql.Request();
        reqSql.input('name', sql.VarChar, Name);
        reqSql.input('phone', sql.VarChar, ContactNo);
        reqSql.input('address', sql.VarChar, Address);
        reqSql.input('email', sql.VarChar, Email);
        await reqSql.query(`INSERT INTO Suppliers (SupplierName, Phone, Address, Email) VALUES (@name, @phone, @address, @email)`);
        res.status(201).send({ message: "Supplier created" });
    } catch (err) { res.status(500).send(err.message); }
});

app.put('/api/suppliers/:id', async (req, res) => {
    try {
        const { Name, ContactNo, Address, Email } = req.body;
        const reqSql = new sql.Request();
        reqSql.input('id', sql.Int, req.params.id);
        reqSql.input('name', sql.VarChar, Name);
        reqSql.input('phone', sql.VarChar, ContactNo);
        reqSql.input('address', sql.VarChar, Address);
        reqSql.input('email', sql.VarChar, Email);
        await reqSql.query(`UPDATE Suppliers SET SupplierName = @name, Phone = @phone, Address = @address, Email = @email WHERE SupplierID = @id`);
        res.status(200).send({ message: "Supplier updated" });
    } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/suppliers/:id', async (req, res) => {
    try {
        const reqSql = new sql.Request();
        reqSql.input('id', sql.Int, req.params.id);
        await reqSql.query('DELETE FROM Suppliers WHERE SupplierID = @id');
        res.status(200).send({ message: "Supplier deleted" });
    } catch (err) { res.status(500).send(err.message); }
});

// ==========================
// STAFF ENDPOINTS
// ==========================
app.get('/api/staff', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Staff');
        res.json(result.recordset);
    } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/staff', async (req, res) => {
    try {
        const { Name, Role, Username } = req.body;
        const [first, ...rest] = Name.split(' ');
        const last = rest.join(' ') || '-';
        const reqSql = new sql.Request();
        reqSql.input('first', sql.VarChar, first);
        reqSql.input('last', sql.VarChar, last);
        reqSql.input('email', sql.VarChar, Username + '@system.local');
        reqSql.input('role', sql.VarChar, Role);
        await reqSql.query(`INSERT INTO Staff (FirstName, LastName, Email, Role) VALUES (@first, @last, @email, @role)`);
        res.status(201).send({ message: "Staff created" });
    } catch (err) { res.status(500).send(err.message); }
});

app.put('/api/staff/:id', async (req, res) => {
    try {
        const { Name, Role } = req.body;
        const [first, ...rest] = Name.split(' ');
        const last = rest.join(' ') || '-';
        const reqSql = new sql.Request();
        reqSql.input('id', sql.Int, req.params.id);
        reqSql.input('first', sql.VarChar, first);
        reqSql.input('last', sql.VarChar, last);
        reqSql.input('role', sql.VarChar, Role);
        await reqSql.query(`UPDATE Staff SET FirstName = @first, LastName = @last, Role = @role WHERE StaffID = @id`);
        res.status(200).send({ message: "Staff updated" });
    } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/staff/:id', async (req, res) => {
    try {
        const reqSql = new sql.Request();
        reqSql.input('id', sql.Int, req.params.id);
        await reqSql.query('DELETE FROM Staff WHERE StaffID = @id');
        res.status(200).send({ message: "Staff deleted" });
    } catch (err) { res.status(500).send(err.message); }
});

// ==========================
// SALES ENDPOINTS (Transactions)
// ==========================
app.get('/api/sales', async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT s.SaleID, s.StaffID, s.SaleDate as Date, s.TotalAmount, 'Walk-in' as CustomerName,
                   d.ProductID, d.Quantity as Qty, d.UnitPrice as Price
            FROM Sales s JOIN SaleDetails d ON s.SaleID = d.SaleID
        `);
        const grouped = {};
        result.recordset.forEach(r => {
            if (!grouped[r.SaleID]) grouped[r.SaleID] = { SaleID: r.SaleID, StaffID: r.StaffID, Date: r.Date.toISOString().split('T')[0], TotalAmount: r.TotalAmount, CustomerName: r.CustomerName, details: [] };
            grouped[r.SaleID].details.push({ ProductID: r.ProductID, Qty: r.Qty, Price: r.Price });
        });
        res.json(Object.values(grouped));
    } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/sales', async (req, res) => {
    const { StaffID, TotalAmount, details } = req.body;
    const transaction = new sql.Transaction();
    try {
        await transaction.begin();
        const headerReq = new sql.Request(transaction);
        headerReq.input('staff', sql.Int, StaffID);
        headerReq.input('total', sql.Decimal, TotalAmount);
        
        const result = await headerReq.query(`INSERT INTO Sales (StaffID, TotalAmount) OUTPUT INSERTED.SaleID VALUES (@staff, @total)`);
        const saleId = result.recordset[0].SaleID;
        
        for (let item of details) {
            const detailReq = new sql.Request(transaction);
            detailReq.input('sid', sql.Int, saleId);
            detailReq.input('pid', sql.Int, item.ProductID);
            detailReq.input('qty', sql.Int, item.Qty);
            detailReq.input('price', sql.Decimal, item.Price);
            
            await detailReq.query(`INSERT INTO SaleDetails (SaleID, ProductID, Quantity, UnitPrice) VALUES (@sid, @pid, @qty, @price)`);
            // Automatically reduce stock since SQL trigger was only written for purchases
            await detailReq.query(`UPDATE Products SET QtyInStock = QtyInStock - @qty WHERE ProductID = @pid`);
        }
        await transaction.commit();
        res.status(201).send({ message: "Sale recorded" });
    } catch (err) {
        await transaction.rollback();
        res.status(500).send(err.message);
    }
});

// ==========================
// PURCHASES ENDPOINTS (Transactions)
// ==========================
app.get('/api/purchases', async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT p.PurchaseID, p.SupplierID, p.StaffID, p.PurchaseDate as Date, p.TotalAmount,
                   d.ProductID, d.Quantity as Qty, d.UnitCost as Price
            FROM Purchases p JOIN PurchaseDetails d ON p.PurchaseID = d.PurchaseID
        `);
        const grouped = {};
        result.recordset.forEach(r => {
            if (!grouped[r.PurchaseID]) grouped[r.PurchaseID] = { PurchaseID: r.PurchaseID, SupplierID: r.SupplierID, StaffID: r.StaffID, Date: r.Date.toISOString().split('T')[0], TotalAmount: r.TotalAmount, details: [] };
            grouped[r.PurchaseID].details.push({ ProductID: r.ProductID, Qty: r.Qty, Price: r.Price });
        });
        res.json(Object.values(grouped));
    } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/purchases', async (req, res) => {
    const { SupplierID, StaffID, TotalAmount, details } = req.body;
    const transaction = new sql.Transaction();
    try {
        await transaction.begin();
        const headerReq = new sql.Request(transaction);
        headerReq.input('sup', sql.Int, SupplierID);
        headerReq.input('staff', sql.Int, StaffID);
        headerReq.input('total', sql.Decimal, TotalAmount);
        
        const result = await headerReq.query(`INSERT INTO Purchases (SupplierID, StaffID, TotalAmount) OUTPUT INSERTED.PurchaseID VALUES (@sup, @staff, @total)`);
        const purchaseId = result.recordset[0].PurchaseID;
        
        for (let item of details) {
            const detailReq = new sql.Request(transaction);
            detailReq.input('pid', sql.Int, purchaseId);
            detailReq.input('prodId', sql.Int, item.ProductID);
            detailReq.input('qty', sql.Int, item.Qty);
            detailReq.input('cost', sql.Decimal, item.Price);
            
            await detailReq.query(`INSERT INTO PurchaseDetails (PurchaseID, ProductID, Quantity, UnitCost) VALUES (@pid, @prodId, @qty, @cost)`);
            // Stock is automatically increased by your SQL Server Trigger (trg_IncreaseStockOnPurchase)
        }
        await transaction.commit();
        res.status(201).send({ message: "Purchase recorded" });
    } catch (err) {
        await transaction.rollback();
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node.js server running on http://localhost:${PORT}`);
});
