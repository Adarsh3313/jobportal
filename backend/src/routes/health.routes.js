'use strict';
// Health check (used by hosting platforms)
const { route } = require('./registry');
const { sendJson } = require('../utils/http');

// health
route('GET', '/api/health', (c) => sendJson(c.res, 200, { status: 'ok', time: new Date().toISOString() }));

