import http from 'http';
import createDebug from 'debug';
import { app } from './app.js';
import { dbConnection } from './db/db.connection.js';

const debug = createDebug('SERVER:index');
const PORT = process.env.PORT || 3232;

const server = http.createServer(app);

dbConnection()
  .then((mongoose) => {
    server.listen(PORT);
    debug('DB: ', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    server.emit('error' + error);
  });

server.on('listening', () => {
  debug('Server listening on PORT ' + PORT);
});

server.on('error', (error) => {
  debug('server Error ' + error);
});
