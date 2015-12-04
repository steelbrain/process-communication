'use babel'

import {fork} from 'child_process'
import * as Communication from '../src/main'

const WORKER_PATH = __dirname + '/fixtures/worker.js'

describe('Process-Communication', function() {

  describe('createFromProcess', function() {
    it('works as expected', function() {
      const child = fork(WORKER_PATH)
      const communication = Communication.createFromProcess(child)

      waitsForPromise(function() {
        return communication.request('ping', 'ping').then(function(response) {
          expect(response).toBe('pong')
          return communication.request('ping', 'ping')
        }).then(function(response) {
          expect(response).toBe('pong')
          communication.kill()
        })
      })
    })
  })

  describe('forkFile', function() {
    it('works as expected', function() {
      const communication = Communication.forkFile(WORKER_PATH)

      waitsForPromise(function(){
        return communication.request('error', {error: true}).then(function() {
          expect(false).toBe(true)
        }, function(error) {
          expect(error.message).toBe('Yes! It works too!')
          communication.kill()
        })
      })
    })
  })

})
