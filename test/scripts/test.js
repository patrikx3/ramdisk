#!/usr/bin/env node
const uid = 'patrikx3'

const useridNative = require('userid')
const userid = require('../../src/userid')

const start = async () => {
    console.log('useridNative.uid(uid)', useridNative.uid(uid))
    console.log('useridNative.gid(uid)', useridNative.gid(uid))

    console.log('userid.uid(uid)', userid.uid(uid))
    console.log('userid.gid(uid)', userid.gid(uid))
}
start();