window.eventAgent = require('./originalEventAgent.js');
window.xhrAgent = require('./originalXhrAgent.js');


eventAgent.proxy();
xhrAgent.proxyXhrOpen();



