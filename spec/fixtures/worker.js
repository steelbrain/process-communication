'use strict'

const ProcessCommunication = require('../../')

const communication = ProcessCommunication.create()
let tick = true

communication.onRequest('ping', function(data, message) {
  if (data !== 'ping') {
    message.response = 'parameter was invalid'
    return
  }
  if (tick) {
    message.response = 'pong'
  } else {
    message.response = Promise.resolve('pong')
  }
  tick = !tick
})

communication.onRequest('error', function(data, message) {
  if (data.error !== true) {
    message.response = 'impossible'
    return
  }
  throw new Error('Yes! It works too!')
})
