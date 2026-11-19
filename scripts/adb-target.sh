#!/bin/sh
# Run an adb command against exactly one device.
#
# Usage:
#   sh scripts/adb-target.sh <adb args...>
#
# Target selection, in order:
#   1. $ADB_SERIAL       this repository's documented override
#   2. $ANDROID_SERIAL   adb's own standard variable
#   3. the only attached device, if exactly one is authorised
#
# Why this exists: plain `adb install` fails with "more than one
# device/emulator" as soon as an emulator and a phone are attached at once,
# which is the normal setup here (wireless adb or USB phone + emulator).
# The error adb prints does not say which serial to use, so this script
# lists the devices and names the variables instead.
#
# It never guesses between multiple devices: an unattended build-and-install
# must not land on the wrong target.
set -e

serial=${ADB_SERIAL:-${ANDROID_SERIAL:-}}

if [ -z "$serial" ]; then
  # Only fully authorised devices count; offline/unauthorised ones would just
  # make the count wrong. `adb devices` prints "serial<TAB>state".
  devices=$(adb devices | awk 'NR > 1 && $2 == "device" { print $1 }')
  count=$(printf '%s\n' "$devices" | grep -c . || true)

  if [ "$count" -eq 0 ]; then
    echo "error: no authorised Android device attached." >&2
    echo "       Attach a phone over USB or run 'npm run device:tcpip -- <ip>'." >&2
    adb devices -l >&2
    exit 1
  fi

  if [ "$count" -gt 1 ]; then
    echo "error: $count devices attached; refusing to guess which one to use." >&2
    echo "       Pick one with ADB_SERIAL or ANDROID_SERIAL, for example:" >&2
    echo "         ADB_SERIAL=<phone-ip>:5555 npm run device:install" >&2
    adb devices -l >&2
    exit 1
  fi

  serial=$devices
fi

exec adb -s "$serial" "$@"
