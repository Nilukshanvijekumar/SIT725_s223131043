
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path");
const fs = require("fs/promises");

const app = express();
const PORT = process.env.PORT || 3300;
const HOST = process.env.HOST || "0.0.0.0";
const BACKEND_INTERNAL_URL =
  process.env.BACKEND_INTERNAL_URL || process.env.API_BASE_URL || "http://localhost:5000";
const PUBLIC_API_BASE_URL =
  process.env.PUBLIC_API_BASE_URL !== undefined
    ? process.env.PUBLIC_API_BASE_URL
    : "";

const PROXY_PREFIXES = ["/auth", "/events", "/applications", "/notifications", "/api", "/health"];

function injectEnvIntoHtml(html) {
  const config = JSON.stringify({ API_BASE_URL: PUBLIC_API_BASE_URL });
  return html.replace("</head>", `    <script>window.__CONFIG__ = ${config};</script>\n  </head>`);
}

function proxyToBackend(req, res) {
  const target = new URL(req.originalUrl, BACKEND_INTERNAL_URL);
  const transport = target.protocol === "https:" ? https : http;
  const headers = { ...req.headers, host: target.host };
  delete headers.connection;

  const proxyReq = transport.request(
    {
      hostname: target.hostname,
      port: target.port || (target.protocol === "https:" ? 443 : 80),
      path: target.pathname + target.search,
      method: req.method,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on("error", (err) => {
    if (!res.headersSent) {
      res.status(502).json({ message: `Backend unavailable: ${err.message}` });
    }
  });

  req.pipe(proxyReq);
}

async function sendPage(res, filename) {
  const html = await fs.readFile(path.join(__dirname, "public", filename), "utf8");
  res.type("html").send(injectEnvIntoHtml(html));
}

app.get(["/", "/index.html"], async (_req, res, next) => {
  try {
    await sendPage(res, "index.html");
  } catch (e) {
    next(e);
  }
});

app.get(["/dashboard", "/dashboard.html"], async (_req, res, next) => {
  try {
    await sendPage(res, "dashboard.html");
  } catch (e) {
    next(e);
  }
});

app.get(["/event", "/event.html"], async (_req, res, next) => {
  try {
    await sendPage(res, "event.html");
  } catch (e) {
    next(e);
  }
});

for (const prefix of PROXY_PREFIXES) {
  app.use(prefix, proxyToBackend);
}

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (_req, res) => {
  res.redirect("/");
});

app.use((err, _req, res, _next) => {
  res.status(500).type("text").send(err.message || "Server error");
});

app.listen(PORT, HOST, () => {
  console.log(
    `Frontend running on http://${HOST}:${PORT} (proxy -> ${BACKEND_INTERNAL_URL}, PUBLIC_API_BASE_URL="${PUBLIC_API_BASE_URL}")`
  );
});
