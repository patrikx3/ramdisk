[//]: #@corifeus-header

# 💾 Linux RAM disk persistent with Systemd timer, service and suspend

                        
[//]: #@corifeus-header:end

# Breaking change 

## v2019.2.1
* The ramdisk works with multiple different users
* Migration
  * `sudo p3x-ramdisk stop`
  * Install the latest version
  * `sudo p3x-ramdisk install $USER`
  * `sudo p3x-ramdisk start $USER`
  * What actually changed, is that every command has a parameter `<uid>` eg.
    * `sudo p3x-ramdisk install $USER`
    * `sudo p3x-ramdisk start $USER`
    * `sudo p3x-ramdisk stop $USER`
    * `sudo p3x-ramdisk link $USER`
    * `sudo p3x-ramdisk load $USER`
    * `sudo p3x-ramdisk save $USER`
    * `sudo p3x-ramdisk status $USER`
    * `sudo p3x-ramdisk watch $USER`

## v1.1
This is only important if you have an older version (1.0.x-y) and/or you use linked folders (like IntelliJ).

It will never change anymore, but sometimes I can delete accidentally my data from the ramdisk, so I refactored the name instead of:  
```text
/home/user/ramdisk/persistence
```   
now it is called  
```text
/home/user/ramdisk/.p3x-ramdisk-persistence
```  
(hidden by default)
and if you accidentally deleted, it will be auto-recreate
(this is always visible - a symlink)  
```text
/home/user/ramdisk/p3x-persistence
```
  
If you are linked to IntelliJ for example, you have to recreate the symlink in your home.  
For example, migration looks like this:
```bash
# exit intellij if you have linked
sudo p3x-ramdisk stop
rm -rf ~/ramdisk/persistence
sudo npm i -g p3x-ramdisk
sudo p3x-ramdisk install $USER
sudo p3x-ramdisk start
# so you are already linked into p3x-ramdisk, here 
# (if you are not linked, do not delete and
# do not execute below, only if the intellij
# data is linked and you are sure it is a 
# symlink )
ll ~/.IntelliJIdea2018.1
```
Shows:
```text
lrwxrwxrwx 1 patrikx3 patrikx3 94 Apr 14 19:34 /home/patrikx3/.IntelliJIdea2018.1 -> /home/patrikx3/ramdisk/.p3x-ramdisk-persistence/content/.p3x-ramdisk-link/.IntelliJIdea2018.1/
```

**MAKE SURE YOU EXIT FROM INTELLIJ.**

If you are sure it is a link, you can recreate like:
```bash
rm ~/.IntelliJIdea2018.1
ln -s ~/ramdisk/.p3x-ramdisk-persistence/content/.p3x-ramdisk-link/.IntelliJIdea2018.1/ ~
```

Now you are safe.



[//]: #@corifeus-footer

---

🙏 This is an open-source project. Star this repository, if you like it, or even donate to maintain the servers and the development. Thank you so much!

Possible, this server, rarely, is down, please, hang on for 15-30 minutes and the server will be back up.

All my domains ([patrikx3.com](https://patrikx3.com) and [corifeus.com](https://corifeus.com)) could have minor errors, since I am developing in my free time. However, it is usually stable.

**Note about versioning:** Versions are cut in Major.Minor.Patch schema. Major is always the current year. Minor is either 4 (January - June) or 10 (July - December). Patch is incremental by every build. If there is a breaking change, it should be noted in the readme.


---

[**P3X-RAMDISK**](https://corifeus.com/ramdisk) Build v2021.4.113

[![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)


## P3X Sponsor

[IntelliJ - The most intelligent Java IDE](https://www.jetbrains.com/?from=patrikx3)

[![JetBrains](https://cdn.corifeus.com/assets/svg/jetbrains-logo.svg)](https://www.jetbrains.com/?from=patrikx3)




[//]: #@corifeus-footer:end

