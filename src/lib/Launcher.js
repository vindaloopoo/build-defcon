/**
 * USB Missile Launcher "Rocket Baby"
 *
 * USB ID 0a81:0701 Chesen Electronics Corp. USB Missile Launcher
 *
 * USB Manufacturer ID: 0a81
 * USB Product ID:      0701
 *
 * REFERENCES
 * https://gist.github.com/joaquimadraz/82ec5f58cee0e48d4ae503b0268615b1
 *
 * https://github.com/codedance/Retaliation/blob/master/retaliation.py
 * http://www.rkblog.rk.edu.pl/w/p/controlling-usb-missile-launchers-python/
 * http://matthias.vallentin.net/blog/2007/04/writing-a-linux-kernel-driver-for-an-unknown-usb-device/
 *
 * Node 8,9,10 tested/compat
 */
const HID = require("node-hid");

const SETUP_PACKET = {
  bmRequestType: 0x21,
  bRequest: 0x09,
  wValue: 0x02,
  wIndex: 0x0
};

const PREFIX = [0x21, 0x09, 0x02, 0x0];

const MOVES = {
  down: [0x01, 0x0],  // 1, NO VERTICAL?
  up: [0x02, 0x0],    // 2, NO VERTICAL?
  left: [0x04, 0x0],  // 4, THIS WORKS YO!!!
  right: [0x08, 0x0]  // 8, THIS WORKS YO!!!
};

const FIRE = [0x10, 0x0]; // 16
const STOP = [0x20, 0x0]; // 32

class Launcher {
  constructor() {
    // TODO use manID/prodID
    const RocketBabyDeviceInfo = HID.devices().reduce((rocketDevice, d) => {
      if (d.product === "Rocket Baby") {
        rocketDevice = d;
      }
      return rocketDevice;
    }, null);

    if (!RocketBabyDeviceInfo) {
      throw new Error("No Rocket baby!");
    }
    this.device = new HID.HID(RocketBabyDeviceInfo.path);
    this.device.on("error", function(error) {
      console.log(error);
    });
  }

  timedMove(move) {
    this.send(move);
    setTimeout(() => {
      this.stop();
    }, 500);
  }

  moveLeft() {
    this.timedMove(MOVES.left);
  }

  moveRight() {
    this.timedMove(MOVES.right);
  }

  moveUp() {
    this.timedMove(MOVES.up);
  }

  moveDown() {
    this.timedMove(MOVES.down);
  }

  stop() {
    this.send(STOP);
  }

  send(data) {
    this.device.write(PREFIX);
    this.device.write(data);
  }

  fire() {
    this.send(FIRE);
    this.stop();
  }
}

module.exports = Launcher;
