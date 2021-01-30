const { program } = require('commander');

// install
program
    .command('load <uid>')
    .description(`
Load a p3x-ramdisk
`)
    //    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (uid, options) {
        const load = require('../index').load;
        try {
            await load({
                uid: uid
            });
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    })
;

