const commander = require('commander');

// install
commander
    .command('stop')
    .description(`
Stop a p3x-ramdisk    
`)
    //    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (options) {
        const stop= require('../index').stop;
        try {
            await stop();
        } catch(e) {
            console.error(e.message);
            process.exit(1);
        }
    })
;

