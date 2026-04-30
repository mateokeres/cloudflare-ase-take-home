-- D1 schema for flag assets
-- Run with: wrangler d1 execute ase-flags-db --file=schema.sql
-- For remote (production): add the --remote flag

CREATE TABLE IF NOT EXISTS flags (
  country      TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  body         TEXT NOT NULL
);

-- Australia
INSERT OR REPLACE INTO flags (country, content_type, body) VALUES (
  'AU',
  'image/svg+xml',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="#00008B"/><rect width="600" height="300" fill="#012169"/><line x1="0" y1="0" x2="600" y2="300" stroke="#FFFFFF" stroke-width="60"/><line x1="600" y1="0" x2="0" y2="300" stroke="#FFFFFF" stroke-width="60"/><line x1="0" y1="0" x2="600" y2="300" stroke="#C8102E" stroke-width="40"/><line x1="600" y1="0" x2="0" y2="300" stroke="#C8102E" stroke-width="40"/><rect x="0" y="120" width="600" height="60" fill="#FFFFFF"/><rect x="270" y="0" width="60" height="300" fill="#FFFFFF"/><rect x="0" y="132" width="600" height="36" fill="#C8102E"/><rect x="282" y="0" width="36" height="300" fill="#C8102E"/><polygon points="150,390 163,432 206,432 171,457 184,500 150,475 116,500 129,457 94,432 137,432" fill="#FFFFFF"/><circle cx="1050" cy="380" r="30" fill="#FFFFFF"/><circle cx="970" cy="170" r="30" fill="#FFFFFF"/><circle cx="820" cy="380" r="30" fill="#FFFFFF"/><circle cx="1010" cy="270" r="20" fill="#FFFFFF"/><circle cx="830" cy="255" r="15" fill="#FFFFFF"/></svg>'
);

-- United States
INSERT OR REPLACE INTO flags (country, content_type, body) VALUES (
  'US',
  'image/svg+xml',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1900 1000"><rect width="1900" height="1000" fill="#B22234"/><rect y="76" width="1900" height="77" fill="#FFFFFF"/><rect y="230" width="1900" height="77" fill="#FFFFFF"/><rect y="384" width="1900" height="77" fill="#FFFFFF"/><rect y="538" width="1900" height="77" fill="#FFFFFF"/><rect y="692" width="1900" height="77" fill="#FFFFFF"/><rect y="846" width="1900" height="77" fill="#FFFFFF"/><rect width="760" height="538" fill="#3C3B6E"/><circle cx="63" cy="45" r="20" fill="#FFFFFF"/><circle cx="189" cy="45" r="20" fill="#FFFFFF"/><circle cx="315" cy="45" r="20" fill="#FFFFFF"/><circle cx="441" cy="45" r="20" fill="#FFFFFF"/><circle cx="567" cy="45" r="20" fill="#FFFFFF"/><circle cx="693" cy="45" r="20" fill="#FFFFFF"/><circle cx="126" cy="107" r="20" fill="#FFFFFF"/><circle cx="252" cy="107" r="20" fill="#FFFFFF"/><circle cx="378" cy="107" r="20" fill="#FFFFFF"/><circle cx="504" cy="107" r="20" fill="#FFFFFF"/><circle cx="630" cy="107" r="20" fill="#FFFFFF"/><circle cx="63" cy="169" r="20" fill="#FFFFFF"/><circle cx="189" cy="169" r="20" fill="#FFFFFF"/><circle cx="315" cy="169" r="20" fill="#FFFFFF"/><circle cx="441" cy="169" r="20" fill="#FFFFFF"/><circle cx="567" cy="169" r="20" fill="#FFFFFF"/><circle cx="693" cy="169" r="20" fill="#FFFFFF"/><circle cx="126" cy="231" r="20" fill="#FFFFFF"/><circle cx="252" cy="231" r="20" fill="#FFFFFF"/><circle cx="378" cy="231" r="20" fill="#FFFFFF"/><circle cx="504" cy="231" r="20" fill="#FFFFFF"/><circle cx="630" cy="231" r="20" fill="#FFFFFF"/><circle cx="63" cy="293" r="20" fill="#FFFFFF"/><circle cx="189" cy="293" r="20" fill="#FFFFFF"/><circle cx="315" cy="293" r="20" fill="#FFFFFF"/><circle cx="441" cy="293" r="20" fill="#FFFFFF"/><circle cx="567" cy="293" r="20" fill="#FFFFFF"/><circle cx="693" cy="293" r="20" fill="#FFFFFF"/></svg>'
);

-- United Kingdom
INSERT OR REPLACE INTO flags (country, content_type, body) VALUES (
  'GB',
  'image/svg+xml',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><rect width="60" height="30" fill="#012169"/><line x1="0" y1="0" x2="60" y2="30" stroke="#FFFFFF" stroke-width="6"/><line x1="60" y1="0" x2="0" y2="30" stroke="#FFFFFF" stroke-width="6"/><rect x="0" y="11" width="60" height="8" fill="#FFFFFF"/><rect x="26" y="0" width="8" height="30" fill="#FFFFFF"/><rect x="0" y="12" width="60" height="6" fill="#C8102E"/><rect x="27" y="0" width="6" height="30" fill="#C8102E"/></svg>'
);

-- Japan
INSERT OR REPLACE INTO flags (country, content_type, body) VALUES (
  'JP',
  'image/svg+xml',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#FFFFFF"/><circle cx="450" cy="300" r="180" fill="#BC002D"/></svg>'
);
