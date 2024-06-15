const statsController = require('../controllers/statsController');

const statsRoutes = (req, res, parsedUrl) => {
  const method = req.method;
  const pathname = parsedUrl.pathname;

  if (pathname === '/api/stats' && method === 'GET') {
    statsController.getStats(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
};

module.exports = statsRoutes;
