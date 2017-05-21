[//]: #@corifeus-header

  [![Build Status](https://travis-ci.org/patrikx3/ramdisk.svg?branch=master)](https://travis-ci.org/patrikx3/ramdisk)  [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/patrikx3/ramdisk/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/ramdisk/?branch=master)  [![Code Coverage](https://scrutinizer-ci.com/g/patrikx3/ramdisk/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/ramdisk/?branch=master) 

  
[![NPM](https://nodei.co/npm/p3x-ramdisk.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/p3x-ramdisk/)
---

 
# RAM disk persistent with Systemd timer, service and suspend

## Issues / Support
This is an open source project. Time is a precious thing, so I have rarely time to give support and fix issues for someone else. I fix a bug, when I have an error that I need. If you got an issue, error or bug, I hope someone will have time to do it for you, otherwise, you are on your own.

Though, if I know the solution, I will tell you. Besides, core errors will be fixed by me.

***If you want to extend, fix bugs or add in new features, I promptly merge pull requests or you can become a ```patrikx3``` member.***

### Node Version Requirement 
``` 
>=7.8.0 
```  
   
### Built on Node 
``` 
v7.10.0
```   
   
The ```async``` and ```await``` keywords are required.

Install NodeJs:    
https://nodejs.org/en/download/package-manager/    
  
# Description  

                        
[//]: #@corifeus-header:end

* Requires tmpfs, bash, fstab, rsync, memory :)
  * Usually, all requirements of every Unix flavor are installed by default
  
* SystemD
  * Service
  * Timer
  * Suspend
  * RAM disk to HDD
* Linux, Unix, BSD, macOS
  * Should might need some tuning, but the functions are there, I just only tested in Linux. 

# Use case
Speed up IntelliJ and development Node. (Tons of files.)  
The result is that the development is many folds faster. No waiting at all.
Even Chrome is a thunder, including Thunderbird, Firefox, Npm and Yarn.

# Install
```text
patrikx3@workstation ~ $ p3x-ramdisk install --help

  Usage: install [options] <uid>

  
Install a p3x-ramdisk    


  Options:

    -h, --help               output usage information
    -r, --rampath [path]     The path of the ram disk, default /home/$USERNAME/ramdisk
    -p, --persistent [path]  The path of the ram persistent, default /home/$USERNAME/ramdisk-persistent
    -g, --gid [group]        The gid, it you omit it is the current user
    -t, --timer [minutes]    The timer in minutes, minimum about 10 minutes, Default is 20 minutes, the best
    -s, --size [megabytes]   Ramdisk in size of megabytes, default is 10240 megabytes
```

# IMPORTANT
Trash is disabled in GNOME with p3x-ramdisk. It will ask for confirm to delete data.
You might have it in the previous save. It is possible to enable trash bin, but for me is not important now, so I disabled, memory is not cheap.

# Setup

 **Use GitHub for info, NPM hides wide strings.**  
 
 https://github.com/patrikx3/ramdisk  

```bash
# of course your data will never be deleted,
# double persistence (current, previouse, saves every 20 minutes)
# load on boot, plus at shutdown and suspend it saves

sudo npm install -g p3x-ramdisk

# install
# if you need less/more memory, add -s 1024 or even more, 10GB is good :)
sudo p3x-ramdisk install -s 6144 $USERNAME    

# Get the output, add to /etc/fstab
echo "tmpfs   /home/patrikx3/ramdisk tmpfs   gid=10000,uid=10000,size=6144M   0 0" | sudo tee -a /etc/fstab
sudo mount -a
# you should verify the ramdisk is existing now, you might have to reboot
# on linux it can show your settings, like below:
df -h

# if there is an error, you can 
sudo p3x-ramdisk stop

# if all good
# STARTUP THE RAMDISK PERSISTENT
sudo p3x-ramdisk start

# you can work like here
# /home/$USERNAME/ramdisk/persistence/content

# SOME DEBUG
p3x-ramdisk watch 

# to trigger a savs
p3x-ramdisk save

# you don't need usually to save
# the default is 20 minutes
# the systemd service saves on suspend and shutdown


# to stop the services
# removes sync, so the ramdisk files will be unavailable,
# only be in /home/username/ramdisk-persistent/current
sudo p3x-ramdisk stop 

# your duplicate copies are
ls -all /home/$USERNAME/ramdisk-persistent/current/
ls -all /home/$USERNAME/ramdisk-persistent/previous/

# you are done
# the default use case is to speed up working with IntelliJ and my projects to ramdisk
# if you just want persistent folder and that's all
# there is a special folder, .p3x-ramdisk-link
# everything there is linked into /home/$USERNAME
# if there is nothing in .p3x-ramdisk-link
# no linking is. to test it, you might not need it.
```

## Linkin in /home

```bash
### //LINKING - NOT REQUIRED
p3x-ramdisk save
sudo p3x-ramdisk stop
mkdir -p /home/$USERNAME/ramdisk-persistent/current/.p3x-ramdisk-link

cp -avr /home/$USERNAME/.IntelliJIdea2017.1 /home/$USERNAME/ramdisk-persistent/current/.p3x-ramdisk-link
cp -avr /home/$USERNAME/Projects /home/$USERNAME/ramdisk-persistent/current/.p3x-ramdisk-link
cp -avr /home/$USERNAME/.cache /home/$USERNAME/ramdisk-persistent/current/.p3x-ramdisk-link

# backup
mkdir -p /home/$USERNAME/backup
mv /home/$USERNAME/.IntelliJIdea2017.1 /home/username/backup/ 
mv /home/$USERNAME/Projects /home/username/backup/
mv /home/$USERNAME/.cache /home/username/backup/

# need to delete the originals, since they become symlinks
rm -rf /home/$USERNAME/.IntelliJIdea2017.1
rm -rf /home/$USERNAME/Projects
rm -rf /home/$USERNAME/.cache

sudo p3x-ramdisk start
### //LINKING:END
```

# Output 
  
## Install
  
```text
patrikx3@laptop:~/ramdisk/persistence/content/.p3x-ramdisk-link/Projects/patrikx3/ramdisk$ sudo p3x-ramdisk install patrikx3 -s 6144
2017-05-08 00:30:08: terminal install

2017-05-08 00:30:08: terminal copy

2017-05-08 00:30:08: terminal suspend

2017-05-08 00:30:08: terminal reload services

2017-05-08 00:30:08: terminal install done


Settings: {
  "rampath": "ramdisk",
  "persistent": "ramdisk-persistent",
  "uid": "patrikx3",
  "uidNumber": 10000,
  "gid": "patrikx3",
  "timer": 20,
  "size": "6144",
  "home": "/home/patrikx3",
  "script": "/home/patrikx3/.p3x-ramdisk"
}    
    
Final commands:
--------------------------
1) You only have to do it once, if you haven't done it before

echo "tmpfs   /home/patrikx3/ramdisk tmpfs   gid=10000,uid=10000,size=6144M   0 0" | sudo tee -a /etc/fstab
sudo mount -a

--------------------------
2) verify that ramdisk is working, see it here

df -h

--------------------------
3) if everything is ok, start the persistent ramdisk

sudo p3x-ramdisk start

patrikx3@laptop:~/ramdisk/persistence/content/.p3x-ramdisk-link/Projects/patrikx3/ramdisk$ 
```

## Watching the RAM disk

```bash
p3x-ramdisk watch
```

```
Filesystem                                                 Size  Used Avail Use% Mounted on
tmpfs                                                      6,0G  1,8G  4,3G  29% /home/patrikx3/ramdisk

total        used        free      shared  buff/cache   available
Mem:            15G        2,6G        7,3G        2,0G        5,6G         10G
Swap:           15G          0B         15G                         
                         
Load: 2017-05-08 00:28:20  2017-05-08 00:28:41  0 minutes 21 seconds
Save: 2017-05-08 00:27:55  2017-05-08 00:27:58  0 minutes 3 seconds

2017-05-08 00:30:08: terminal install
2017-05-08 00:30:08: terminal copy
2017-05-08 00:30:08: terminal suspend
2017-05-08 00:30:08: terminal reload services
2017-05-08 00:30:08: terminal install done

5/8/2017, 12:30:41 AM | Update every 20 minutes
```

# LOGS

``` /home/username/ramdisk-persistent/ramdisk-persistent.log ```  
``` /home/username/ramdisk-persistent/update-at-load.log ```  
``` /home/username/ramdisk-persistent/update-at-save.log ```


## LOG info

```text
2017-05-06 02:57:37: boot loading
2017-05-06 02:57:37: boot load /home/patrikx3/ramdisk-persistent/current to /home/patrikx3/ramdisk/persistence/content
2017-05-06 02:57:47: boot loaded
2017-05-06 02:57:47: boot link
2017-05-06 02:57:47: boot link /home/patrikx3/ramdisk/persistence/content/.IntelliJIdea2017.1 to /home/patrikx3/.IntelliJIdea2017.1
2017-05-06 02:57:47: boot link /home/patrikx3/ramdisk/persistence/content/Projects to /home/patrikx3/Projects
2017-05-06 02:57:47: boot link done
2017-05-06 02:57:47: boot 0 minutes 10 seconds

2017-05-06 02:57:47: timer save
2017-05-06 02:57:47: timer save, current to previous
2017-05-06 02:57:47: timer save /home/patrikx3/ramdisk-persistent/current to /home/patrikx3/ramdisk-persistent/previous
2017-05-06 02:57:50: timer saved
2017-05-06 02:57:50: timer save, ramdisk to current
2017-05-06 02:57:50: timer save /home/patrikx3/ramdisk/persistence/content to /home/patrikx3/ramdisk-persistent/current
2017-05-06 02:57:53: timer saved
2017-05-06 02:57:53: timer save done
2017-05-06 02:57:53: timer 0 minutes 6 seconds
```

## LOG Update

```text
2017-05-06 03:31:51
2017-05-06 03:31:57
0 minutes 6 seconds
```  

# Thunder ramdisk persistence
```text
patrikx3@workstation ~/ramdisk-persistent/current/.p3x-ramdisk-link $ ll
total 32
drwxr-xr-x  8 patrikx3 patrikx3 4096 May  7 13:04 ./
drwxr-xr-x  3 patrikx3 patrikx3 4096 May  7 13:02 ../
drwx------ 22 patrikx3 patrikx3 4096 May  7 10:03 .cache/
drwxr-xr-x  4 patrikx3 patrikx3 4096 Apr 25 17:51 .IntelliJIdea2017.1/
drwxr-xr-x  4 patrikx3 patrikx3 4096 Apr 25 13:10 .mozilla/
drwxr-xr-x  2 patrikx3 patrikx3 4096 May  6 17:37 .npm/
drwxr-xr-x  4 patrikx3 patrikx3 4096 May  6 20:00 Projects/
drwx------  4 patrikx3 patrikx3 4096 Apr 25 13:57 .thunderbird/
patrikx3@workstation ~/ramdisk-persistent/current/.p3x-ramdisk-link $ 
```

[//]: #@corifeus-footer

---
[**P3X-RAMDISK**](https://pages.corifeus.tk/ramdisk) Build v1.0.159-36

[Corifeus](http://www.corifeus.tk) by [Patrik Laszlo](http://patrikx3.tk)


[//]: #@corifeus-footer:end