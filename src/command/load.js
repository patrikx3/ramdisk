const commander = require('commander');

// install
commander
    .command('load')
    .description(`
Load a p3x-ramdisk    
`)
//    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (options) {
        const load = require('../index').load;
        try {
            await load();
        } catch(e) {
            console.error(e.message);
            process.exit(1);
        }
    })
;

