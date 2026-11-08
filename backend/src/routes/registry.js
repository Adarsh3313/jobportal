'use strict';
// Tiny router: route(method, '/api/x/:id', handler)
const routes = [];
const route = (method, pattern, handler) => routes.push({ method, re: new RegExp('^' + pattern.replace(/:[a-zA-Z]+/g, '([^/]+)') + '/?$'), handler });

module.exports = { routes, route };
