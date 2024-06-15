const userController = require('../controllers/userController');

const userRoutes = (req, res, parsedUrl) => {
  const method = req.method;
  const pathname = parsedUrl.pathname;

  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      req.body = body ? JSON.parse(body) : {};
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON' }));
      return;
    }

    if (pathname === '/api/users/register' && method === 'POST') {
      await userController.registerUser(req, res);
    } else if (pathname === '/api/users/login' && method === 'POST') {
      await userController.loginUser(req, res);
    } else if (pathname === '/api/users/profile' && method === 'GET') {
      await userController.getUserProfile(req, res);
    } else if (pathname === '/api/users/profile' && method === 'PUT') {
      await userController.updateUserProfile(req, res);
    } else if (pathname === '/api/users/profile' && method === 'DELETE') {
      await userController.deleteUserProfile(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not Found' }));
    }
  });
};

module.exports = userRoutes;
