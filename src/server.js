const http = require('http');
const url = require('url');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.log('Failed to connect to database', err));

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

const staticPath = path.join(__dirname, 'static');

const serveStatic = (filePath, res) => {
  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'views', '404.html'), (error, notFoundContent) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(notFoundContent, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
};

const serveFile = (filePath, res) => {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
    }
  });
};

const routes = {
  '/': 'views/index.html',
  '/index': 'views/index.html',
  '/about': 'views/about.html',
  '/login': 'views/login.html',
  '/register': 'views/register.html',
  '/help': 'views/help.html',
  '/dashboard': 'views/dashboard.html',
  '/stats': 'views/stats.html',
  '/profile': 'views/profile.html',
  '/campanii': 'views/campanii.html'
};

const handleRequest = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith('/static')) {
    serveStatic(path.join(staticPath, pathname.replace('/static', '')), res);
  } else if (routes[pathname]) {
    serveFile(path.join(__dirname, routes[pathname]), res);
  } else if (pathname.startsWith('/api/users')) {
    userRoutes(req, res, parsedUrl);
  } else if (pathname.startsWith('/api/stats')) {
    statsRoutes(req, res, parsedUrl);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
};

const server = http.createServer(handleRequest);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
