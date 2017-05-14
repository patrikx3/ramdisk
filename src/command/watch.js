const commander = require('commander');

// install
commander
    .command('watch')
    .description(`
Watch the p3x-ramdisk    
`)
    .option('-w, --watch [milliseconds]', 'The time for watching, default is 1000 milliseconds')
//    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (options) {
        const watch = require('../index').watch;
        try {
            await watch(options);
        } catch(e) {
            console.error(e.message);
            process.exit(1);
        }
    })
;

