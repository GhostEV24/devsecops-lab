const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

// 🔴 FAILLE 1 : Secrets codés en dur dans le code (TRÈS GRAVE !)
const DB_CONNECTION = "mongodb://admin:SuperSecret123!@prod-db.company.com:27017/myapp";
const STRIPE_SECRET_KEY = "sk_live_" + "51Hqp9K2eZvKYlo2C8xO3n4y5z6a7b8c9d0e1f2g3h4i5j";
const SENDGRID_API_KEY = "SG.nExT2-QRDzJcEV39HqCxTg.KnLmOpQrStUvWxYz1234567890aBcDeF";

app.use(express.json());

// 🔴 FAILLE 2 : Route de login sans protection contre les attaques par force brute
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // 🔴 FAILLE 3 : Identifiants codés en dur + pas de hachage
  if (username === 'admin' && password === 'admin') {
    // 🔴 FAILLE 4 : JWT_SECRET n'est pas défini ! (variable inexistante)
    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// 🔴 FAILLE 5 : Endpoint de debug qui expose TOUT (secrets, variables d'environnement)
app.get('/debug', (req, res) => {
  res.json({
    dbConnection: DB_CONNECTION,
    stripeKey: STRIPE_SECRET_KEY,
    sendgridKey: SENDGRID_API_KEY,
    env: process.env
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));