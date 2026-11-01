USE InventoryDB;
GO

-- 1. Create missing tables
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Sales')
CREATE TABLE Sales (
    SaleID INT IDENTITY(1,1) PRIMARY KEY,
    StaffID INT,
    SaleDate DATE DEFAULT GETDATE(),
    TotalAmount DECIMAL(18,2)
);
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SaleDetails')
CREATE TABLE SaleDetails (
    SaleDetailID INT IDENTITY(1,1) PRIMARY KEY,
    SaleID INT FOREIGN KEY REFERENCES Sales(SaleID),
    ProductID INT FOREIGN KEY REFERENCES Products(ProductID),
    Quantity INT,
    UnitPrice DECIMAL(18,2)
);
GO

-- 2. Clear old test data and reset ID counters
DELETE FROM SaleDetails;
DELETE FROM Sales;
DELETE FROM PurchaseDetails;
DELETE FROM Purchases;
DELETE FROM Products;
DELETE FROM Suppliers;
DELETE FROM Staff;
GO

DBCC CHECKIDENT ('Products', RESEED, 0);
DBCC CHECKIDENT ('Suppliers', RESEED, 0);
DBCC CHECKIDENT ('Staff', RESEED, 0);
DBCC CHECKIDENT ('Purchases', RESEED, 0);
DBCC CHECKIDENT ('Sales', RESEED, 0);
GO

-- 3. Insert Fresh Data
INSERT INTO Staff (FirstName, LastName, Email, Role) VALUES 
('Ahmed', 'Khan', 'admin@system.local', 'Admin'),
('Sara', 'Ali', 'sara@system.local', 'Staff'),
('Bilal', 'Hassan', 'bilal@system.local', 'Staff');

INSERT INTO Suppliers (SupplierName, Phone, Address, Email) VALUES 
('TechWholesale PK', '0300-1234567', 'Saddar, Karachi', 'sales@techwholesale.pk'),
('Office Plus Ltd', '0333-9876543', 'Clifton, Karachi', 'contact@officeplus.com'),
('Global Gadgets', '0321-5556667', 'Gulshan, Karachi', 'info@globalgadgets.pk');

INSERT INTO Products (ProductName, SKU, UnitPrice, QtyInStock, ReorderLevel) VALUES 
('Pro Wireless Mouse', 'PRD-883211', 2500.00, 45, 10),
('Mechanical Keyboard RGB', 'PRD-883212', 6500.00, 20, 5),
('27-inch IPS Monitor', 'PRD-883213', 42000.00, 8, 3),
('USB-C 7-in-1 Hub', 'PRD-883214', 3200.00, 30, 10),
('Ergonomic Office Chair', 'PRD-883215', 18500.00, 12, 4),
('Noise Cancelling Headphones', 'PRD-883216', 12000.00, 5, 5);

INSERT INTO Purchases (SupplierID, StaffID, TotalAmount) VALUES 
(1, 1, 84000.00),
(2, 1, 37000.00);

INSERT INTO PurchaseDetails (PurchaseID, ProductID, Quantity, UnitCost) VALUES 
(1, 3, 2, 42000.00), 
(2, 5, 2, 18500.00); 

INSERT INTO Sales (StaffID, TotalAmount) VALUES 
(2, 8200.00),
(3, 6500.00);

INSERT INTO SaleDetails (SaleID, ProductID, Quantity, UnitPrice) VALUES 
(1, 1, 2, 2500.00), 
(1, 4, 1, 3200.00), 
(2, 2, 1, 6500.00); 
GO