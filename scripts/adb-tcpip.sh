#!/bin/sh
# Enable adb over Wi-Fi on the attached phone and connect to it.
#
# Usage:
#   npm run device:tcpip -- <phone-ip> [port]      # default port 5555
#
# This automates the usual manual sequence:
#
#   adb tcpip 5555 && adb connect <phone-ip>:5555
#
# The trap it removes: `adb tcpip` must be sent over USB (or an existing
# wireless connection) to the phone, and plain `adb tcpip 5555` fails with
# "more than one device/emulator" whenever the emulator is also running.
# This script targets the phone explicitly and ignores emulators.
set -e

ip=${1:-}
port=${2:-5555}

if [ -z "$ip" ]; then
  echo "usage: npm run device:tcpip -- <phone-ip> [port]" >&2
  echo "       the phone IP is shown in Settings -> About phone -> Status" >&2
  exit 1
fi

serial=${ADB_SERIAL:-${ANDROID_SERIAL:-}}

if [ -z "$serial" ]; then
  # adb tcpip needs a transport that is already connected: USB, or a previous
  # wireless connection. Prefer a non-emulator serial.
  serial=$(adb devices | awk 'NR > 1 && $2 == "device" && $1 !~ /^emulator-/ { print $1; exit }')
fi

if [ -z "$serial" ]; then
  echo "error: no phone found over USB or wireless; adb tcpip needs a connected device." >&2
  echo "       Connect the phone with USB debugging enabled, then retry." >&2
  adb devices -l >&2
  exit 1
fi

echo "Enabling TCP mode on $serial (port $port)..."
adb -s "$serial" tcpip "$port"

echo "Connecting to $ip:$port..."
adb connect "$ip:$port"

echo
echo "Next:"
echo "  ADB_SERIAL=$ip:$port npm run device:install   # build first with: npm run apk:phone"
echo "  npm start                                     # Metro"
echo "  ADB_SERIAL=$ip:$port npm run device:reverse"
