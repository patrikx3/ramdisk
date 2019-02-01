const commander = require('commander');

// install
commander
    .command('status <uid>')
    .description(`
Status of p3x-ramdisk    
`)
    .action(async function (uid, options) {
        const status = require('../index').status;

        try {
            await status({ uid: uid }, options);
        } catch(e) {
            console.error(e.message);
            process.exit(1);
        }
    })
;

