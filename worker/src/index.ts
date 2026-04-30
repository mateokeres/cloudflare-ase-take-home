import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

export interface Env {
  FLAGS_BUCKET: R2Bucket;
  DB: D1Database;
  TEAM_DOMAIN: string;
  POLICY_AUD: string;
}

interface AccessJWTPayload extends JWTPayload {
  email: string;
}

async function validateAccessJWT(
  token: string,
  teamDomain: string,
  aud: string
): Promise<AccessJWTPayload | null> {
  try {
    const jwksUrl = new URL(
      `https://${teamDomain}.cloudflareaccess.com/cdn-cgi/access/certs`
    );
    const JWKS = createRemoteJWKSet(jwksUrl);
    const { payload } = await jwtVerify(token, JWKS, { audience: aud });
    if (typeof (payload as AccessJWTPayload).email !== 'string') {
      return null;
    }
    return payload as AccessJWTPayload;
  } catch {
    return null;
  }
}

function htmlResponse(content: string, status = 200): Response {
  return new Response(content, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function errorPage(status: number, title: string, message: string): Response {
  return htmlResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 560px; margin: 80px auto; padding: 0 24px; color: #1e293b; }
    h1 { font-size: 1.5rem; }
  </style>
</head>
<body>
  <h1>${status} ${title}</h1>
  <p>${message}</p>
</body>
</html>`,
    status
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // GET /flags/:country  - serve flag from R2
    const r2Match = pathname.match(/^\/flags\/([A-Za-z]{2})$/);
    if (r2Match) {
      const country = r2Match[1].toUpperCase();
      const object = await env.FLAGS_BUCKET.get(`${country}.svg`);
      if (!object) {
        return new Response(`Flag not found: ${country}`, { status: 404 });
      }
      return new Response(object.body, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // GET /flags-d1/:country  - serve flag from D1
    const d1Match = pathname.match(/^\/flags-d1\/([A-Za-z]{2})$/);
    if (d1Match) {
      const country = d1Match[1].toUpperCase();
      const row = await env.DB.prepare(
        'SELECT content_type, body FROM flags WHERE country = ?'
      )
        .bind(country)
        .first<{ content_type: string; body: string }>();

      if (!row) {
        return new Response(`Flag not found: ${country}`, { status: 404 });
      }
      return new Response(row.body, {
        headers: { 'Content-Type': row.content_type },
      });
    }

    // GET /  and  GET /secure  - identity page, requires Access JWT
    if (pathname === '/' || pathname === '/secure') {
      const token = request.headers.get('Cf-Access-Jwt-Assertion');
      if (!token) {
        return errorPage(
          401,
          'Unauthorised',
          'This endpoint requires a valid Cloudflare Access token. Please authenticate via the Access login page.'
        );
      }

      const identity = await validateAccessJWT(token, env.TEAM_DOMAIN, env.POLICY_AUD);
      if (!identity) {
        return errorPage(
          403,
          'Forbidden',
          'The Access token is invalid or has expired. Please re-authenticate.'
        );
      }

      const country = request.cf?.country ?? 'XX';
      const timestamp = new Date().toISOString();

      return htmlResponse(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloudflare Worker - Identity</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: system-ui, sans-serif;
      max-width: 680px;
      margin: 60px auto;
      padding: 0 24px;
      line-height: 1.6;
      color: #1e293b;
      background: #f8fafc;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 32px 36px;
    }
    h1 { margin-top: 0; font-size: 1.5rem; color: #0f172a; }
    .identity { font-size: 1.05rem; line-height: 1.7; margin: 0 0 24px; }
    .identity a { color: #f38020; font-weight: 600; }
    .actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
    .btn {
      display: inline-block;
      padding: 9px 18px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .btn-primary { background: #f38020; color: #ffffff; }
    .btn-outline { border: 1px solid #f38020; color: #f38020; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Identity Verified</h1>

    <p class="identity">
      ${identity.email} authenticated at ${timestamp} from <a href="/flags/${country}">${country}</a>
    </p>

    <div class="actions">
      <a class="btn btn-primary" href="/flags/${country}">View flag from R2 (/flags/${country})</a>
      <a class="btn btn-outline" href="/flags-d1/${country}">View flag from D1 (/flags-d1/${country})</a>
    </div>
  </div>
</body>
</html>`);
    }

    return new Response('Not Found', { status: 404 });
  },
};
