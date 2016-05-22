exports['default'] = {
  general: function(api){
    return {
      apiVersion: '1',
      serverName: 'SitOpt Context Manager API',
      // A unique token to your application that servers will use to authenticate to each other
      serverToken: 'dsfh87tg4rfq394f7gqpg94',
      // The welcome message seen by TCP and webSocket clients upon connection
      welcomeMessage: '',
      // the redis prefix for actionhero's cache objects
      cachePrefix: 'actionhero:cache:',
      // the redis prefix for actionhero's cache/lock objects
      lockPrefix: 'actionhero:lock:',
      // how long will a lock last before it exipres (ms)?
      lockDuration: 1000 * 10,
      // Watch for changes in actions and tasks, and reload/restart them on the fly
      developmentMode: true,
      // How many pending actions can a single connection be working on
      simultaneousActions: 5,
      // allow connections to be created without remoteIp and remotePort (they will be set to 0)
      enforceConnectionProperties: true,
      // disables the whitelisting of client params
      disableParamScrubbing: false,
      // params you would like hidden from any logs
      filteredParams: [],
      // values that signify missing params
      missingParamChecks: [null, '', undefined],
      // The default filetype to serve when a user requests a directory
      directoryFileType : 'index.html',
      // The default priority level given to middleware of all types (action, connection, and say)
      defaultMiddlewarePriority : 100,
      // configuration for your actionhero project structure
      paths: {
        'action':      [__dirname + '/../actions'],
        'task':        [__dirname + '/../tasks'],
        'public':      [__dirname + '/../public'],
        'pid':         [__dirname + '/../pids'],
        'log':         [__dirname + '/../log'],
        'server':      [__dirname + '/../servers'],
        'initializer': [__dirname + '/../initializers'],
        'plugin':      [__dirname + '/../node_modules'],
        'locale':      [__dirname + '/../locales']
      },
      // hash containing chat rooms you wish to be created at server boot
      startingChatRooms: {   }
    };
  }
};

exports.test = {
  general: function(api){
    return {
      id: 'test-server',
      developmentMode: true,
      startingChatRooms: { },
      paths: {
        'locale': [require('os').tmpdir()  + require('path').sep + 'locale']
      }
    };
  }
};

exports.production = {
  general: function(api){
    return {
      developmentMode: false
    };
  }
};
