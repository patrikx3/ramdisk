const commander = require('commander');
const ramdisk = require('../index');

// install
commander
    .command('install <uid>')
    .option('-r, --rampath [path]', 'The path of the ram disk, default /home/$USER/ramdisk')
    .option('-p, --persistent [path]', 'The path of the ram persistent, default /home/$USER/ramdisk-persistent')
//    .option('-u, --uid <type>', 'The username, it you omit it is the current user')
    .option('-g, --gid [group]', 'The gid, it you omit it is the current user')
    .option('-t, --timer [minutes]', 'The timer in minutes, minimum about 10 minutes, Default is 20 minutes, the best')
    .option('-s, --size [megabytes]', `Ramdisk in size of megabytes, default is ${ramdisk.defaults.ramdisk.size}  megabytes`)
//    .option('-h, --home [type]', 'Home path, defaults to /home/uid')
    .description(`
Install a p3x-ramdisk    
`)
//    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (uid, options) {

        try {
            await ramdisk.install(uid, options);
        } catch(e) {
            console.error(e);
            process.exit(1);
        }
    })
;

