/**
 * server/plugin.ts
 *
 * Vite dev-server plugin that exposes two endpoints:
 *
 *   GET  /api/icons-json   → returns the current icons.json contents
 *   POST /api/icons-json   → overwrites icons.json with the request body
 *
 * The path to icons.json is resolved via loadConfig(), which walks up from
 * process.cwd() to find `lucide-manager.config.json` in the host package root.
 *
 * Only active during `vite dev` — not included in any build output.
 */

import fs from 'node:fs';

import type { Plugin } from 'vite';

import { loadConfig } from '../config/loadConfig';

export function iconsJsonPlugin(): Plugin {
  // Resolve the icons.json path once at server startup.
  const { iconsJsonPath } = loadConfig();

  return {
    name: 'icons-json-rw',
    configureServer(server) {
      server.middlewares.use('/api/icons-json', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.writeHead(204);
          res.end();
          return;
        }

        if (req.method === 'GET') {
          try {
            const content = fs.readFileSync(iconsJsonPath, 'utf8');
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(content);
          } catch (_err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to read icons.json' }));
          }
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              // Validate it's parseable JSON before writing
              const parsed = JSON.parse(body) as unknown[];
              const pretty = JSON.stringify(parsed, null, 2) + '\n';
              fs.writeFileSync(iconsJsonPath, pretty, 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.writeHead(200);
              res.end(JSON.stringify({ ok: true, count: parsed.length }));
            } catch (_err) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        res.writeHead(405);
        res.end();
      });
    },
  };
}
