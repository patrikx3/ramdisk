const mz = require('mz');
const path = require('path');
const utils = require('corifeus-utils');
const fsx = require('fs-extra');
const _ = require('lodash');
const clear = require('clear');
const ms = require('ms');

const settingsFileFun = (opts) => {
    const { uid } = opts
    return `/etc/p3x-ramdisk-${uid}.json`;
}

const defaults = {
    ramdisk: {
        size: 2048,
    },
    timer: {
        save: 20,
    }
};

const requireRoot = () => {
    if (process.getuid && process.getuid() === 0) {
        return true;
    }
    throw new Error('you are not root! please sudo!')
}

const getGeneratedDir = (homedir = process.env.HOME) => {
    //return path.resolve(`${__dirname}/../generated`);
    return path.resolve(`${homedir}/.p3x-ramdisk`)
}

const getSettings = (opts) => {
    const settings = require(settingsFileFun(opts));
    settings.generatedDir = getGeneratedDir(settings.home);
    settings.program =  `${path.resolve(settings.generatedDir
    )}/p3x-ramdisk.sh`;
    return settings;
}

const defaultTerminal= async (opts, command, doesRequireRoot = false)  => {
    if (doesRequireRoot ) {
        requireRoot();
    }
    const settings = getSettings(opts);
    let commandExec = `${settings.program} ${command}`;
    await utils.childProcess.exec(commandExec, true)
}

const load = async(opts) => {
    await defaultTerminal(opts, 'load')
}

const link = async(opts) => {
    await defaultTerminal(opts, 'link')
}

const save = async(opts) => {
    await defaultTerminal(opts, 'save')
}

const status = async(opts) => {
    requireRoot();
    let commandExec = `
sudo service p3x-ramdisk-${opts.uid} status
sudo systemctl status p3x-ramdisk-timer-${opts.uid}.timer
`;
    await utils.childProcess.exec(commandExec, true)
}

const watch = async(mainOpts, options) => {
    const settings = getSettings(mainOpts);
    options.watch = Number(options.watch) || 1000;
    const watch = ms(options.watch, { long: true });
    const timer = ms(settings.timer * 1000 * 60, { long: true });
    return new Promise(async () => {
        const show = async () => {

            const df = await utils.childProcess.exec(`df -h | grep -e ${settings.home}/${settings.rampath} -e Size`);
            const free = await utils.childProcess.exec(`free -h`);

            const loadLogFile = `${settings.home}/${settings.persistent}/update-at-load.log`;
            let loadLog;
            if (await mz.fs.exists(loadLogFile)) {
                loadLog = await mz.fs.readFile(loadLogFile);
            } else {
                loadLog = 'Load is not done.'
            }

            const saveLogFile = `${settings.home}/${settings.persistent}/update-at-save.log`;
            let saveLog;
            if (await mz.fs.exists(saveLogFile)) {
                saveLog = await mz.fs.readFile(saveLogFile);
            } else {
                saveLog = 'Save is not done.'
            }

            const logFile = `${settings.home}/${settings.persistent}/ramdisk-persistent.log`;
            let log;
            if (await mz.fs.exists(logFile)) {
                log = await utils.childProcess.exec(`tail -n 5 ${logFile}`);
            } else {
                log = 'Log is not done.'
            }
            clear()
            console.log(`${df.stdout.trim()}

${free.stdout}                         
                         
Load: ${loadLog.toString().trim().split('\n').join('  ')}
Save: ${saveLog.toString().trim().split('\n').join('  ')}

${log.stdout.trim()}

${new Date().toLocaleString()} | Persistence ${timer} | Watch ${watch}`);
        };
        show();
        setInterval(show, options.watch)
    })
}

const start = async(opts) => {
    await defaultTerminal(opts, 'start', true)
}

const stop = async(opts) => {
    await defaultTerminal(opts,'stop', true)
}


const install = async (uid, options) => {

    requireRoot();
//    .option('-r, --rampath [type]', 'The path of the ram disk')
//        .option('-p, --persistent [type]', 'The path of the ram persistent')
//        .option('-u, --uid [type]', 'The username, it you omit it is the current user')
//        .option('-g, --gid [type]', 'The gid, it you omit it is the current user')
//        .option('-t, --timer [type]', 'The timer in minutes, minimum about 10 minutes, 20 is the best')
//        .option('-s, --size [type]', 'Ramdisk in size of MegaBYTEs, default is 8192')
//        .option('-h, --home [type]', 'Home path, defaults to /home/uid')

    // uid - current user default
    // gid - default uid
    // timer -- 20 min
    // rampath - default /home/uid/ramdisk
    // persistent - default /home/uid/ramdisk-persistent
    // home - default /home/uid/

    // sciripts - is given
    const userid = require('userid');

    const homedir = (await utils.childProcess.exec(`sudo -H -u ${uid} -i eval 'echo $HOME'`)).stdout.trim();

    options = options || {};

    const generateOptions = {
        rampath: options.rampath || 'ramdisk',
        persistent : options.persistent || 'ramdisk-persistent',
        uid : uid,
        uidNumber: userid.uid(uid),
        gidNumber: userid.gid(uid),
        gid : options.gid || uid,
        timer : options.timer || defaults.timer.save,
        size : options.size || defaults.ramdisk.size,
        home : homedir,
    }

    const generatedDir = getGeneratedDir(homedir)
    await fsx.emptyDir(generatedDir);
    generateOptions.script = generatedDir;


    const origin = `${__dirname}/../templates`;
    const files = await mz.fs.readdir(origin);

    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    await utils.fs.ensureFile(settingsFileFun(generateOptions), JSON.stringify(generateOptions, null, 4), true )

    await files.forEachAsync(async (file) => {
        const generatedFile = path.basename(file, '.hbs');
        const buffer = await mz.fs.readFile(`${origin}/${file}`);
        const string = buffer.toString();
        const generatedString = _.template(string)(generateOptions);

        let useredFile =  generatedFile
        for(let type of ['.service', '.timer']) {
            if (useredFile.endsWith(type)) {
                useredFile = useredFile.substring(0, useredFile.length - type.length)
                useredFile += '-' + generateOptions.uid + type
            }
        }

        await utils.fs.ensureFile(`${generatedDir}/${useredFile}`, generatedString, true);
    })


    const program = `${path.resolve(generateOptions.script)}/p3x-ramdisk.sh`;

    let command = `chown -R ${generateOptions.uidNumber}:${generateOptions.gidNumber} ${generatedDir}  
chmod u+x ${program}    
${program} install    
`;

    //console.log(command)
    await utils.childProcess.exec(command, true)

    console.log(`
Settings: ${JSON.stringify(generateOptions, null, 4)}    
    
Final commands:
--------------------------
1) You only have to do it once, if you haven't done it before

echo "tmpfs   ${generateOptions.home}/${generateOptions.rampath} tmpfs   gid=${userid.gid(generateOptions.gid)},uid=${userid.uid(generateOptions.uid)},size=${generateOptions.size}M   0 0" | sudo tee -a /etc/fstab
sudo mount -a

--------------------------
2) verify that ramdisk is working, see it here

df -h

--------------------------
3) if everything is ok, start the persistent ramdisk

sudo p3x-ramdisk start
`)

}

module.exports.install = install;
module.exports.load = load;
module.exports.save = save;
module.exports.start = start;
module.exports.stop = stop;
module.exports.watch = watch;
module.exports.link = link;
module.exports.status = status;

module.exports.requireRoot  = requireRoot;
module.exports.defaults = defaults;