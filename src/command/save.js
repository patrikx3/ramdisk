const commander = require('commander');

// install
commander
    .command('save <uid>')
    .description(`
Save the p3x-ramdisk    
`)
//    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (uid, options) {
        const save = require('../index').save;
        try {
            await save({
                uid: uid
            });
        } catch(e) {
            console.error(e.message);
            process.exit(1);
        }
    })
;

