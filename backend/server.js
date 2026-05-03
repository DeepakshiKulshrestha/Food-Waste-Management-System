const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Server working");
});

app.post('/add-donation', (req, res) => {
  const { donor_id, ngo_id, food_type, quantity, expiry_time } = req.body;
  const sql = `INSERT INTO Food_Donation (donor_id, ngo_id, food_type, quantity, expiry_time) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [donor_id, ngo_id || null, food_type, quantity, expiry_time], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Donation added successfully' });
  });
});

app.post('/pickup', (req, res) => {
  const { donation_id, volunteer_id } = req.body;
  const sql = `INSERT INTO Pickup (donation_id, volunteer_id) VALUES (?, ?)`;
  db.query(sql, [donation_id, volunteer_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Pickup assigned successfully' });
  });
});

app.post('/distribution', (req, res) => {
  const { donation_id, ngo_id, people_served } = req.body;
  const sql = `INSERT INTO Distribution (donation_id, ngo_id, people_served) VALUES (?, ?, ?)`;
  db.query(sql, [donation_id, ngo_id, people_served], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Food distributed successfully' });
  });
});

app.get('/donations', (req, res) => {
  const sql = `
    SELECT 
      f.donation_id,
      d.name AS donor,
      n.ngo_name AS ngo,
      f.food_type,
      f.quantity,
      f.status,
      f.expiry_time
    FROM Food_Donation f
    JOIN Donor d ON f.donor_id = d.donor_id
    LEFT JOIN NGO n ON f.ngo_id = n.ngo_id
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get('/donors', (req, res) => {
  db.query("SELECT * FROM Donor", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get('/volunteers', (req, res) => {
  db.query("SELECT * FROM Volunteer", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get('/ngos', (req, res) => {
  db.query("SELECT * FROM NGO", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get('/pending', (req, res) => {
  db.query("CALL get_pending_donations()", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get('/total-food', (req, res) => {
  db.query("CALL total_food_quantity()", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});