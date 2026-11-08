'use strict';
// Loads every route file (each one registers itself) and exports the route list
require('./health.routes');
require('./auth.routes');
require('./admin.routes');
require('./companies.routes');
require('./jobs.routes');
require('./resumes.routes');
require('./applications.routes');
require('./offers.routes');
require('./interviews.routes');

module.exports = require('./registry').routes;
