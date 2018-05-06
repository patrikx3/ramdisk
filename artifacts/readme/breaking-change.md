[//]: #@corifeus-header

# 💾 RAM disk persistent with Systemd timer, service and suspend

                        
[//]: #@corifeus-header:end

# Breaking change 

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

[**P3X-RAMDISK**](https://pages.corifeus.com/ramdisk) Build v1.1.37-345 

[![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software) [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) 


## P3X Sponsors

[IntelliJ - The most intelligent Java IDE](https://www.jetbrains.com)
  
[![JetBrains](https://cdn.corifeus.com/assets/svg/jetbrains-logo.svg)](https://www.jetbrains.com/) [![NoSQLBooster](https://cdn.corifeus.com/assets/png/nosqlbooster-70x70.png)](https://www.nosqlbooster.com/)

[The Smartest IDE for MongoDB](https://www.nosqlbooster.com)
  
  
 

[//]: #@corifeus-footer:end

