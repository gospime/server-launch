const https = require('https');

const TIME_POINT = '>>> Server is launched in';

module.exports = settings => {
  console.time(TIME_POINT);

  const { hostname, port, options, handler, callback } = settings || {};

  const getCallback = clientCallback => {
    console.info(
      `pid=${process.pid}. 🚀 Server is ready at 'https://${hostname}:${port}'.`
    );

    if (typeof clientCallback === 'function') {
      clientCallback();
    }

    console.timeEnd(TIME_POINT);
  };

  const server = https
    .createServer(options, handler)
    .listen({ port, hostname }, getCallback(callback));

  const closeHandler = () => {
    console.info('Stop the server process with pid:', process.pid);

    const stopHandler = error => {
      // if error, log and exit with error (1 code)
      if (error) {
        console.error(error);
        process.exit(1);
      }
    };

    // Stop the server from accepting new connections
    server.close(stopHandler);
  };

  process.on('SIGINT', closeHandler);

  return server;
};
