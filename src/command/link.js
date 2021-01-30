const { program } = require('commander');

// install
program
    .command('link <uid>')
    .description(`
Link from the ramdisk to the home
`)
    //    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (uid, options) {
        const link = require('../index').link;
        try {
            await link({
                uid: uid
            });
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    })
;

