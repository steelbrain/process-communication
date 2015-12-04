'use babel'

import Cluster from 'cluster'
import ChildProcess from 'child_process'
import {Communication} from './communication'

export function current() {
  return new Communication(process)
}

export function process(process) {
  return new Communication(process)
}

export function fork(env) {
  return new Communication(Cluster.fork(env || process.env))
}

export function forkFile(filePath) {
  return new Communication(ChildProcess.fork(filePath))
}

export {Communication}
