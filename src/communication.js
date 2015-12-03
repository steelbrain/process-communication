'use babel'

import Communication from 'sb-communication'
import {CompositeDisposable} from 'sb-event-kit'

class ProcessCommunication {
  constructor(process, debug) {
    if (typeof process.send !== 'function') {
      throw new Error('Invalid process specified')
    }

    this.process = process
    this.communication = new Communication(debug)
    this.subscriptions = new CompositeDisposable(this.communication)

    this.communication.onShouldSend(data => {
      this.process.send(data)
    })

    const callback = message => {
      this.communication.parseMessage(message)
    }
    this.process.addEventListener('message', callback)
    this.subscriptions.add({
      dispose: function() {
        process.removeListener('message', callback)
      }
    })
  }
  request(name, data = {}) {
    return this.communication.request(name, data)
  }

  onRequest(name, callback) {
    return this.communication.onRequest(name, callback)
  }

  kill() {
    this.process.kill()
  }
  disconnect() {
    this.process.disconnect()
  }
  dispose() {
    this.communication.dispose()
    this.kill()
  }
}

export {ProcessCommunication as Communication}
