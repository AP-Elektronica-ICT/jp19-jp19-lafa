import smbus
import time
from i2c import temperature

bus = smbus.SMBus(1)  # RPI used i2C bus 1

# This is the address we setup in the atmega Program
water1 = 0x1F  # I2C address for water level
water2 = 0x20  # I2c address for second water level
water3 = 0x21  # I2C address for third water level
light = 0x29   # I2C address for light level detection
ph = 0x33      # I2C address for detecting the ph value of water


def readHumidity():
    bus.write_quick(0x27)
    time.sleep(0.1)

    # HIH6020 address, 0x27(39)
    # Read data back from 0x00(00), 4 bytes
    # humidity MSB, humidity LSB, temp MSB, temp LSB
    data = bus.read_i2c_block_data(0x27, 0x00, 4)

    # Convert the data to 14-bits
    humidity = ((((data[0] & 0x3F) * 256.0) + data[1]) * 100.0) / 16382.0
    temp = ((data[2] * 256) + (data[3] & 0xFC)) / 4
    cTemp = (temp / 16382.0) * 165.0 - 40.0

    # Output data to screen
    return humidity, cTemp


# Read one byte over i2c
def readLevel(addr):
    data = None
    try:
        time.sleep(0.1)
        data = bus.read_byte(addr)
    except Exception as e:
        print(e)
    time.sleep(1.5)
    if data != None:
        return "{}".format(data)
    return "None"


class event:
    """
    class used to receive events from other threads
    """

    def __init(self):
        self.init = True

    def initInThread(self):
        print("Init in network")
        self.init = False

    def receive(self, data, sender):
        bus.write_i2c_block_data(data.addr, ord(data.data[0]), [
                                 ord(data.data[1]), ord(data.data[2])])


class message:
    def __init__(self, payload, topic, bisSensor=True):
        self.data = payload
        self.topic = topic
        self.isSensor = bisSensor


def start(com, id):
    id.thread = event()
    com.subscribe(id)
    try:
        temp = temperature.setup()
        print("I2C setup")
    except Exception as e:
        print(e)
        print("Could not read the One wire interface")
    while True:
        try:

            com.notifyThreadById(id, "network",
                                 message("Temperature {}".format(
                                     temperature.read_temp(temp)), '/sensors/watertemp'))

            humidity, humidityTemp = readHumidity()

            com.notifyThreadById(
                id, "network",
                message("Humidity {}, Temp {}".format(humidity, humidityTemp), '/sensors/humidity'))

            com.notifyThreadById(
                id, "network",
                message("Water1 level {}".format(
                    readLevel(water1)), '/sensors/water1'))

            com.notifyThreadById(id, "network", message(
                "Water2 level {}".format(readLevel(water2)), '/sensors/water2'))

            com.notifyThreadById(
                id, "network",
                message("Water3 level {}".format(
                    readLevel(water3)), 'sensors/water3'))

            com.notifyThreadById(
                id, "network", message("Light level {}".format(
                    readLevel(light)), '/sensors/airlight'))

            com.notifyThreadById(
                id, "network",
                message("PH value {}".format(readLevel(ph)), '/sensors/ph'))
        except Exception as e:
            print(e)
            print("Could not read the One wire interface")
        com.notifyThreadById(id, "cv", "Hello")

        time.sleep(1)
# send datat to attiny (light)
# bus.write_i2c_block_data(0,ord('2'),[ord("5"),ord('5')])
