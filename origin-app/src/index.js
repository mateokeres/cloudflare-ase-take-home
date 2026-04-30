'use strict';

const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloudflare ASE Demo - Origin App</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 680px; margin: 60px auto; padding: 0 24px; line-height: 1.6; color: #1e293b; }
    h1 { color: #0f172a; }
    .badge { background: #f38020; color: #fff; border-radius: 4px; padding: 2px 10px; font-size: 0.85rem; font-weight: 600; }
    ul { padding-left: 20px; }
    code { background: #f1f5f9; border-radius: 4px; padding: 1px 6px; font-size: 0.9rem; }
  </style>
</head>
<body>
  <h1>Origin Web Application</h1>
  <p><span class="badge">Protected by Cloudflare</span></p>
  <p>
    This application runs behind Cloudflare's global network. Direct access to the
    origin server is restricted via firewall rules that only permit traffic from
    Cloudflare IP ranges.
  </p>
  <p>Endpoints available for demonstration:</p>
  <ul>
    <li><a href="/api/search?q=hello"><code>GET /api/search?q=</code></a> - Search API, used to demonstrate WAF SQL injection protection.</li>
    <li><code>POST /api/login</code> - Login endpoint, used to demonstrate rate limiting.</li>
    <li><a href="/secure"><code>GET /secure</code></a> - Protected route, used to demonstrate Cloudflare Zero Trust Access.</li>
  </ul>
</body>
</html>`);
});

app.get('/api/search', (req, res) => {
  const query = String(req.query.q || '');
  res.json({
    results: [],
    query,
    message: 'Search endpoint reached. In a real application this would query a database.',
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required.' });
  }
  res.json({ success: true, message: 'Login endpoint reached.' });
});

app.get('/secure', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Secure Area</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 680px; margin: 60px auto; padding: 0 24px; line-height: 1.6; color: #1e293b; }
  </style>
</head>
<body>
  <h1>Secure Area</h1>
  <p>
    This route is protected by Cloudflare Zero Trust Access. If you can see this page
    directly at the origin, Cloudflare Access has not yet been configured in front of it.
  </p>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Origin app listening on port ${PORT}`);
});
