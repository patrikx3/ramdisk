const commander = require('commander');

// install
commander
    .command('stop <uid>')
    .description(`
Stop a p3x-ramdisk    
`)
    //    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (uid, options) {
        const stop = require('../index').stop;
        try {
            await stop({
                uid: uid
            });
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    })
;

