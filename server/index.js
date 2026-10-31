require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
// INCREASED LIMIT TO 50MB so images don't crash the server
app.use(express.json({ limit: '50mb' })); 

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    database: process.env.DB_NAME || 'marble_db',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
});

db.connect((err) => {
    if (err) console.log('❌ Database Connection Failed!', err);
    else console.log('✅ Connected to MySQL (marble_db)');
});

// 1. LOGIN
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, result) => {
        if (err) return res.send({ message: "Database Error" });
        if (result.length > 0) res.send(result);
        else res.send({ message: "Wrong username/password" });
    });
});

// 2. GET PRODUCTS
app.get('/products', (req, res) => {
    db.query("SELECT * FROM products", (err, result) => {
        if (err) return res.send({ error: "Error" });
        res.send(result);
    });
});

// 3. ADD PRODUCT (Fixed Error Handling)
app.post('/add-product', (req, res) => {
    const { name, category, price, stock, description, cost_price, image_url } = req.body;

    const checkSql = "SELECT * FROM products WHERE name = ?";
    db.query(checkSql, [name], (err, result) => {
        if (err) return res.send({ message: "Database check failed", success: false });

        if (result.length > 0) {
            return res.send({ message: "Error: Product already exists!", success: false }); 
        } else {
            const insertSql = "INSERT INTO products (name, category, price, stock, description, image_url) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(insertSql, [name, category, price, stock, description, image_url], (err, result) => {
                if (err) {
                    console.log(err); // Print error to terminal
                    // Send clear error message to frontend
                    return res.send({ message: "Error: Image too large or Database error", success: false });
                }

                // Expense Logic
                const totalCost = (parseFloat(cost_price) || 0) * (parseInt(stock) || 0);
                if (totalCost > 0) {
                    const insertExp = "INSERT INTO expenses (description, amount) VALUES (?, ?)";
                    db.query(insertExp, [`Stock Purchase: ${name}`, totalCost]);
                }

                res.send({ message: "Product & Expense saved!", success: true });
            });
        }
    });
});

// 4. UPDATE PRODUCT
app.put('/update-product', (req, res) => {
    const { id, name, category, price, stock } = req.body;
    db.query("UPDATE products SET name = ?, category = ?, price = ?, stock = ? WHERE id = ?", 
    [name, category, price, stock, id], (err) => res.send({message:"Updated"}));
});

// 5. DELETE PRODUCT
app.delete('/delete-product/:id', (req, res) => {
    db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => res.send({message:"Deleted"}));
});

// 6. CLIENTS ROUTES
app.get('/clients', (req, res) => { db.query("SELECT * FROM customers", (err, r) => res.send(r)); });
app.post('/add-client', (req, res) => {
    const { name, person, phone, email, address } = req.body;
    db.query("INSERT INTO customers (name, person, phone, email, address) VALUES (?, ?, ?, ?, ?)", [name, person, phone, email, address], (err) => res.send({message:"Added"}));
});
app.put('/update-client', (req, res) => {
    const { id, name, person, phone, email, address } = req.body;
    db.query("UPDATE customers SET name = ?, person = ?, phone = ?, email = ?, address = ? WHERE id = ?", [name, person, phone, email, address, id], (err) => res.send({message:"Updated"}));
});
app.delete('/delete-client/:id', (req, res) => {
    db.query("DELETE FROM customers WHERE id = ?", [req.params.id], (err) => res.send({message:"Deleted"}));
});

// 7. INVOICE & SALES
app.post('/add-invoice', (req, res) => {
    const { client_name, total_amount, items } = req.body;
    db.query("INSERT INTO invoices (client_name, total_amount) VALUES (?, ?)", [client_name, total_amount], (err) => {
        if (items && items.length > 0) {
            items.forEach(item => {
                if(item.product && item.qty > 0) {
                    db.query("UPDATE products SET stock = stock - ? WHERE name = ?", [item.qty, item.product]);
                }
            });
        }
        res.send({ message: "Invoice Saved & Stock Updated!" });
    });
});
app.get('/recent-sales', (req, res) => { db.query("SELECT * FROM invoices ORDER BY date DESC LIMIT 5", (err, r) => res.send(r)); });

// 8. DASHBOARD GRAPH (FIXED FOR LIFETIME TOTAL)
app.get('/sales-chart', (req, res) => {
    const filter = req.query.filter || 'total'; // Default to total
    let sql = "";

    switch(filter) {
        case 'today':
            sql = "SELECT DATE_FORMAT(date, '%l %p') as name, SUM(total_amount) as sales FROM invoices WHERE DATE(date) = CURDATE() GROUP BY HOUR(date) ORDER BY date ASC";
            break;
        case 'week':
            sql = "SELECT DATE_FORMAT(date, '%a') as name, SUM(total_amount) as sales FROM invoices WHERE YEARWEEK(date, 1) = YEARWEEK(CURDATE(), 1) GROUP BY DATE(date) ORDER BY date ASC";
            break;
        case 'month':
            sql = "SELECT DATE_FORMAT(date, '%d %b') as name, SUM(total_amount) as sales FROM invoices WHERE MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE()) GROUP BY DATE(date) ORDER BY date ASC";
            break;
        case 'year':
            sql = "SELECT DATE_FORMAT(date, '%b') as name, SUM(total_amount) as sales FROM invoices WHERE YEAR(date) = YEAR(CURDATE()) GROUP BY MONTH(date) ORDER BY date ASC";
            break;
        case 'total': 
            // FIXED: Lifetime view groups by Month-Year (e.g., Dec 2024, Jan 2025)
            sql = "SELECT DATE_FORMAT(date, '%b %Y') as name, SUM(total_amount) as sales FROM invoices GROUP BY YEAR(date), MONTH(date) ORDER BY date ASC LIMIT 12";
            break;
    }
    
    db.query(sql, (err, result) => res.send(result || []));
});

// 9. DASHBOARD STATS
app.get('/dashboard-stats', (req, res) => {
    const filter = req.query.filter || 'total';
    let dateCondition = "";
    
    switch(filter) {
        case 'today': dateCondition = "WHERE DATE(date) = CURDATE()"; break;
        case 'week': dateCondition = "WHERE YEARWEEK(date, 1) = YEARWEEK(CURDATE(), 1)"; break;
        case 'month': dateCondition = "WHERE MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())"; break;
        case 'year': dateCondition = "WHERE YEAR(date) = YEAR(CURDATE())"; break;
        default: dateCondition = ""; 
    }

    const q1 = `SELECT SUM(total_amount) as revenue FROM invoices ${dateCondition}`;
    
    db.query(q1, (err, r1) => {
        db.query("SELECT SUM(stock) as stock FROM products", (err, r2) => {
            db.query("SELECT COUNT(*) as clients FROM customers", (err, r3) => {
                res.send({
                    revenue: r1[0].revenue || 0,
                    stock: r2[0].stock || 0,
                    clients: r3[0].clients || 0
                });
            });
        });
    });
});

// 10. FINANCIAL REPORTS
app.get('/financial-stats', (req, res) => {
    const filter = req.query.filter || 'monthly';
    let dateFmt = "%b"; 
    let groupBy = "MONTH(date)";
    
    if (filter === 'daily') { dateFmt = "%d %b"; groupBy = "DATE(date)"; }
    if (filter === 'weekly') { dateFmt = "Week %u"; groupBy = "WEEK(date)"; }
    if (filter === 'yearly') { dateFmt = "%Y"; groupBy = "YEAR(date)"; }

    const chartSql = `SELECT DATE_FORMAT(date, '${dateFmt}') as name, SUM(total_amount) as income FROM invoices GROUP BY ${groupBy} ORDER BY date ASC`;
    const expenseSql = `SELECT DATE_FORMAT(date, '${dateFmt}') as name, SUM(amount) as expense FROM expenses GROUP BY ${groupBy}`;
    
    db.query("SELECT SUM(total_amount) as total FROM invoices", (err, incTotal) => {
        db.query("SELECT SUM(amount) as total FROM expenses", (err, expTotal) => {
            db.query(chartSql, (err, incChart) => {
                db.query(expenseSql, (err, expChart) => {
                    const merged = [];
                    incChart.forEach(i => merged.push({ name: i.name, income: i.income, expense: 0 }));
                    expChart.forEach(e => {
                        const exist = merged.find(m => m.name === e.name);
                        if(exist) exist.expense = e.expense;
                        else merged.push({ name: e.name, income: 0, expense: e.expense });
                    });
                    
                    res.send({
                        summary: {
                            income: incTotal[0].total || 0,
                            expense: expTotal[0].total || 0,
                            profit: (incTotal[0].total || 0) - (expTotal[0].total || 0)
                        },
                        chart: merged
                    });
                });
            });
        });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});