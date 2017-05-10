const commander = require('commander');

// install
commander
    .command('watch')
    .description(`
Watch the p3x-ramdisk    
`)
//    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (options) {
        const watch = require('../index').watch;
        try {
            await watch();
        } catch(e) {
            console.error(e.message);
            process.exit(1);
        }
    })
;

