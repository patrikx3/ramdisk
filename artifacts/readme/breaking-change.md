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

## 🚀 Quick and Affordable Web Development Services

If you want to quickly and affordably develop your next digital project, visit [corifeus.eu](https://corifeus.eu) for expert solutions tailored to your needs.

---

## 🌐 Powerful Online Networking Tool  

Discover the powerful and free online networking tool at [network.corifeus.com](https://network.corifeus.com).  

**🆓 Free**  
Designed for professionals and enthusiasts, this tool provides essential features for network analysis, troubleshooting, and management.  
Additionally, it offers tools for:  
- 📡 Monitoring TCP, HTTP, and Ping to ensure optimal network performance and reliability.  
- 📊 Status page management to track uptime, performance, and incidents in real time with customizable dashboards.  

All these features are completely free to use.  

---

## ❤️ Support Our Open-Source Project  
If you appreciate our work, consider ⭐ starring this repository or 💰 making a donation to support server maintenance and ongoing development. Your support means the world to us—thank you!  

---

### 🌍 About My Domains  
All my domains, including [patrikx3.com](https://patrikx3.com), [corifeus.eu](https://corifeus.eu), and [corifeus.com](https://corifeus.com), are developed in my spare time. While you may encounter minor errors, the sites are generally stable and fully functional.  

---

### 📈 Versioning Policy  
**Version Structure:** We follow a **Major.Minor.Patch** versioning scheme:  
- **Major:** 📅 Corresponds to the current year.  
- **Minor:** 🌓 Set as 4 for releases from January to June, and 10 for July to December.  
- **Patch:** 🔧 Incremental, updated with each build.  

**🚨 Important Changes:** Any breaking changes are prominently noted in the readme to keep you informed.

---


[**P3X-RAMDISK**](https://corifeus.com/ramdisk) Build v2025.4.119

 [![NPM](https://img.shields.io/npm/v/p3x-ramdisk.svg)](https://www.npmjs.com/package/p3x-ramdisk)  [![Donate for Corifeus / P3X](https://img.shields.io/badge/Donate-Corifeus-003087.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QZVM4V6HVZJW6)  [![Contact Corifeus / P3X](https://img.shields.io/badge/Contact-P3X-ff9900.svg)](https://www.patrikx3.com/en/front/contact) [![Like Corifeus @ Facebook](https://img.shields.io/badge/LIKE-Corifeus-3b5998.svg)](https://www.facebook.com/corifeus.software)






[//]: #@corifeus-footer:end

