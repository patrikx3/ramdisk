const {execSync} = require('child_process')

module.exports.uid = (username) => {
    const output = execSync(`id -u ${username}`).toString().trim()
    return parseInt(output)
}


module.exports.gid = (username) => {
    const output = execSync(`id -g ${username}`).toString().trim()
    return parseInt(output)
}
