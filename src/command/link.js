const commander = require('commander');

// install
commander
    .command('link')
    .description(`
Link from the ramdisk to the home    
`)
//    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (options) {
        const link = require('../index').link;
        try {
            await link();
        } catch(e) {
            console.error(e.message);
            process.exit(1);
        }
    })
;

