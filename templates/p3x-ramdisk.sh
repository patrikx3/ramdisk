#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ME="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"

P3X_UID={{ uid }}
P3X_UID_NUMBER={{ uidNumber }}
P3X_GID={{ gid }}
P3X_GID_NUMBER={{ gidNumber }}
ROOT={{ home }}
PERSISTENCE=$ROOT/{{ persistent }}
RAMDISK=$ROOT/{{ rampath }}

TYPE=$1
COMMAND=$2

if [ -z "$COMMAND" ]; then
    COMMAND=$TYPE
    TYPE=terminal
fi

TRASH_NAME=.Trash-$P3X_UID_NUMBER

PERSISTENCE_LOG=$PERSISTENCE/ramdisk-persistent.log
#PERSISTENCE_LOG_LOAD=$PERSISTENCE/ramdisk-persistent-load.log
#PERSISTENCE_LOG_SAVE=$PERSISTENCE/ramdisk-persistent-save.log
PERSISTENCE_CURRENT=$PERSISTENCE/current
PERSISTENCE_PREVIOUS=$PERSISTENCE/previous
PERSISTENCE_LOCK=$PERSISTENCE/persistent.lock

PERSISTENCE_TRASH=$PERSISTENCE/$TRASH_NAME

RAMDISK_TRASH=$RAMDISK/$TRASH_NAME
RAMDISK_PERSISTENCE=$RAMDISK/persistence
RAMDISK_CONTENT=$RAMDISK_PERSISTENCE/content
RAMDISK_CONTENT_LINK=$RAMDISK_CONTENT/.p3x-ramdisk-link
RAMDISK_LOCK=$RAMDISK_PERSISTENCE/ramdisk.lock


SUSPEND_ROOT=/lib/systemd/system-sleep
SUSPEND_SCRIPT=$SUSPEND_ROOT/p3x-ramdisk.sh

SYSTEMD=/etc/systemd/system


function require_sudo() {

    if [[ $EUID -ne 0 ]]; then
        printf "You are not root!\n\n"
        exit 1
    fi

}

function notify() {
    if hash notify-send 2>/dev/null; then
        notify-send P3X-RAMDISK $1
    #    else
    #        date "$@"
    fi
}


function install() {

    require_sudo

    mkdir -p $PERSISTENCE_CURRENT
    mkdir -p $PERSISTENCE_PREVIOUS
    mkdir -p $PERSISTENCE_TRASH
    #mkdir -p $RAMDISK_CONTENT
    mkdir -p $RAMDISK_CONTENT_LINK

    printf "\n" >> $PERSISTENCE_LOG

    log "install"

    log "copy"
    cp $DIR/p3x-ramdisk-timer.service $SYSTEMD
    cp $DIR/p3x-ramdisk-timer.timer $SYSTEMD
    cp $DIR/p3x-ramdisk.service $SYSTEMD

    log suspend
    mkdir -p $SUSPEND_ROOT
    touch $SUSPEND_SCRIPT
    chmod u+x $SUSPEND_SCRIPT
    cat <<EOT > $SUSPEND_SCRIPT
#!/usr/bin/env bash
ACTION=\$1
TYPE=\$2
LOG_DATA="\`date '+%Y-%m-%d %H:%M:%S'\`: SUSPEND \$TYPE \$ACTION"
if [ "\$ACTION" == "pre" ]; then
  # Do the thing you want before suspend here, e.g.:
  sudo -u $P3X_UID printf "\n\$LOG_DATA Suspending" >> $PERSISTENCE_LOG
  $DIR/$ME suspend save
elif [ "\$1" == "post" ]; then
  # Do the thing you want after resume here, e.g.:
    sudo -u $P3X_UID printf "\n\$LOG_DATA On again" >> $PERSISTENCE_LOG
fi
chown $P3X_UID_NUMBER:$P3X_GID_NUMBER $PERSISTENCE_LOG
EOT

    log "reload services"
    systemctl daemon-reload

    log "install done"

    touch $PERSISTENCE_LOG
#    touch $PERSISTENCE_LOG_LOAD
#    touch $PERSISTENCE_LOG_SAVE

    fix_permissions
}


function start() {
    require_sudo

    install

    log "start"
    systemctl enable p3x-ramdisk
    systemctl enable p3x-ramdisk-timer.timer
    systemctl start p3x-ramdisk
    systemctl start p3x-ramdisk-timer.timer
}

function stop() {
    require_sudo

    printf "\n" >> $PERSISTENCE_LOG
    log "stop"

    systemctl stop p3x-ramdisk-timer.timer
    systemctl stop p3x-ramdisk
    systemctl disable p3x-ramdisk
    systemctl disable p3x-ramdisk-timer.timer

    if [ -d $SUSPEND_SCRIPT ];
    then
        rm -rf $SUSPEND_SCRIPT
    fi

    if [ -f $SYSTEMD/p3x-ramdisk.service ];
    then
        rm $SYSTEMD/p3x-ramdisk.service
    fi

    if [ -f $SYSTEMD/p3x-ramdisk-timer.timer ];
    then
        rm $SYSTEMD/p3x-ramdisk-timer.timer
    fi

    if [ -f $SYSTEMD/p3x-ramdisk-timer.service ];
    then
        rm $SYSTEMD/p3x-ramdisk-timer.service
    fi

    if [ -f $RAMDISK_LOCK ];
    then
        rm $RAMDISK_LOCK
    fi

}


function fix_permissions() {
    chown $P3X_UID_NUMBER:$P3X_GID_NUMBER -R $RAMDISK
    chown $P3X_UID_NUMBER:$P3X_GID_NUMBER -R $PERSISTENCE
#    chown $P3X_UID_NUMBER:$P3X_GID_NUMBER $PERSISTENCE_LOG_LOAD
#    chown $P3X_UID_NUMBER:$P3X_GID_NUMBER $PERSISTENCE_LOG_SAVE
}

function log() {

    if [ -z ${2+x} ];
    then false;
    else
        notify $1
    fi

    LOG_DATA="`date '+%Y-%m-%d %H:%M:%S'`: $TYPE $1"
    echo $LOG_DATA
    echo $LOG_DATA >> $PERSISTENCE_LOG
}

function timer_start() {
    SECONDS=0
    STARTED=`date '+%Y-%m-%d %H:%M:%S'`
}

function timer_end() {
    DURATION=$SECONDS
    PERSISTENCE_UPDATED_AT=$PERSISTENCE/$1
    echo $STARTED > $PERSISTENCE_UPDATED_AT
    echo `date '+%Y-%m-%d %H:%M:%S'` >> $PERSISTENCE_UPDATED_AT
    DURATION_STRING="$(($DURATION / 60)) minutes $(($DURATION % 60)) seconds"
    echo $DURATION_STRING >> $PERSISTENCE_UPDATED_AT
    chown $P3X_UID_NUMBER:$P3X_GID_NUMBER $PERSISTENCE_UPDATED_AT
    log "$DURATION_STRING"
}

function load() {
    timer_start

    printf "\n" >> $PERSISTENCE_LOG

    log "loading"
    if [ -f $PERSISTENCE_LOCK ]; then
        log "has a lock at $PERSISTENCE_LOCK ! not loading! quitting..." true
        return
    fi

    if [ -f $RAMDISK_LOCK ]; then
        log "already loaded! quitting, existing ramdisk lock: $RAMDISK_LOCK" true
        return
    fi

    cd $PERSISTENCE_CURRENT
    #tar xvf $PERSISTENCE_COMPRESSED_CURRENT >$PERSISTENCE_LOG_LOAD
    log "load $PERSISTENCE_CURRENT to $RAMDISK_CONTENT"
    mkdir -p $RAMDISK_CONTENT
    cp -avr . $RAMDISK_CONTENT > /dev/null #$PERSISTENCE_LOG_LOAD
    #rsync -atvq --delete . $RAMDISK_CONTENT  >  /dev/null #$PERSISTENCE_LOG_LOAD

    log "loaded" true

    if ! [ -d $RAMDISK_TRASH ]; then
        ln -s $PERSISTENCE_TRASH $RAMDISK
    fi


 #   truncate $PERSISTENCE_LOG_LOAD

 #   chown $P3X_UID_NUMBER:$P3X_GID_NUMBER $PERSISTENCE_LOG_LOAD

    fix_permissions
    timer_end "update-at-load.log"
    echo `date '+%Y-%m-%d %H:%M:%S'` > $RAMDISK_LOCK

}

function truncate() {
    tail -n 10240 $1 > $1.1
    mv $1.1 $1
}

function internal_save() {
    FROM=$1
    TO=$2
    log "save $FROM to $TO"
    cd $FROM
    rsync --rsync-path="nice -n19 ionice -c3 rsync" -aq --delete . $TO   >  /dev/null  #$PERSISTENCE_LOG_SAVE
    log "saved"
  #  truncate $PERSISTENCE_LOG_SAVE
}


function save() {
    printf "\n" >> $PERSISTENCE_LOG

    timer_start

    log "save"
    if [ -f $RAMDISK_LOCK ]; then
        if [ -f $PERSISTENCE_LOCK ]; then
            log "has a lock at $PERSISTENCE_LOCK ! quitting..." true
            return
        fi
        touch $PERSISTENCE_LOCK
        log "save, current to previous"
        internal_save $PERSISTENCE_CURRENT $PERSISTENCE_PREVIOUS
        log "save, ramdisk to current"
        internal_save $RAMDISK_CONTENT $PERSISTENCE_CURRENT
        rm $PERSISTENCE_LOCK
        log "save done" true

        # cannot use it at save, it will change modification
        #fix_permissions
        truncate $PERSISTENCE_LOG

        timer_end "update-at-save.log"


    else
        log "not saving, not loaded" true
    fi

}

function link() {
    log "link"
    if [ -d "$RAMDISK_CONTENT_LINK" ]; then
        cd $RAMDISK_CONTENT_LINK
        shopt -s dotglob
        for d in */ ; do
            if [ "$d" = "*/" ]; then
                continue
            fi
            GENERATED_LINK="${ROOT}/${d}"
            DIR=${d%/*}
            log "link $RAMDISK_CONTENT_LINK/$DIR to $ROOT/$DIR"
            # delete actual directory, no slash! otherwise it shows not empty
            if [ -d "${ROOT}/${DIR}" ]; then
                unlink "${ROOT}/${DIR}" || true
            fi
            ln -s "${RAMDISK_CONTENT_LINK}/${DIR}" $ROOT
        done
    fi
    log "link done"
}

if [ "$COMMAND" == "load" ]
then
    load
    exit
fi

if [ "$COMMAND" == "save" ]
then
    save
    exit
fi

if [ "$COMMAND" == "link" ]
then
    link
    exit
fi

if [ "$COMMAND" == "start" ]
then
    start
    exit
fi

if [ "$COMMAND" == "stop" ]
then
    stop
    exit
fi


if [ "$COMMAND" == "install" ]
then
    install
    exit
fi

if [ "$COMMAND" == "watch" ]
then
    WATCH1="df -h | grep -e "
    WATCH2=$RAMDISK
    WATCH3=" -e Size"
    watch $WATCH1$WATCH2$WATCH3
    exit
fi

cat <<EOT >&1

Eg:
    sudo $ME install
    sudo $ME start
    $ME watch
    $ME save
    $ME load

Unknown type: {$TYPE} command: {$COMMAND}
    Requires 2 parameters:
        type: anything (like boot, timer, terminal), default is "terminal"
        command: install, start, stop, load, save, watch

EOT

