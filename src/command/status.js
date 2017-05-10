const commander = require('commander');

// install
commander
    .command('status')
    .description(`
Status of p3x-ramdisk    
`)
    .action(async function (options) {
        const status = require('../index').status;

        try {
            await status(options);
        } catch(e) {
            console.error(e.message);
            process.exit(1);
        }
    })
;

