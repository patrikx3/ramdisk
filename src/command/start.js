const commander = require('commander');

// install
commander
    .command('start <uid>')
    .description(`
Start a p3x-ramdisk    
`)
//    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (uid, options) {
        const start = require('../index').start;
        try {
            await start({
                uid: uid
            });
        } catch(e) {
            console.error(e.message);
            process.exit(1);
        }
    })
;

