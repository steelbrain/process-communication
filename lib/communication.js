'use strict';
'use babel';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Communication = undefined;

var _sbCommunication = require('sb-communication');

var _sbCommunication2 = _interopRequireDefault(_sbCommunication);

var _sbEventKit = require('sb-event-kit');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProcessCommunication {
  constructor(process, debug) {
    var _this = this;

    if (typeof process.send !== 'function') {
      throw new Error('Invalid process specified');
    }

    this.process = process;
    this.communication = new _sbCommunication2.default(debug);
    this.subscriptions = new _sbEventKit.CompositeDisposable(this.communication);

    this.communication.onShouldSend(function (data) {
      _this.process.send(data);
    });

    const callback = function (message) {
      _this.communication.parseMessage(message);
    };
    this.process.addListener('message', callback);
    this.subscriptions.add({
      dispose: function () {
        process.removeListener('message', callback);
      }
    });
  }
  request(name) {
    let data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return this.communication.request(name, data);
  }

  onRequest(name, callback) {
    return this.communication.onRequest(name, callback);
  }

  kill(sig) {
    this.process.kill(sig);
    this.dispose();
  }
  dispose() {
    this.subscriptions.dispose();
  }
}

exports.Communication = ProcessCommunication;