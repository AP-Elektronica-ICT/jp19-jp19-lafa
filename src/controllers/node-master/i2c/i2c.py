import smbus
import time
from i2c import temperature

bus = smbus.SMBus(1)  # RPI used i2C bus 1

# This is the address we setup in the atmega Program
address = 10


def readNumber(addr):
    return bus.read_i2c_block_data(addr, 2)

# Read a message from the atmega, this message is maximum 20 bytes long
# TODO read sensordata from an I²C sensor (or attiny) and propagate it to the webserver


def readMessageFromArduino():
    data = bus.read_i2c_block_data(address, 0, 20)
    Message = ""
    data2 = []
    for i in range(len(data)):
        if(data[i] != 255):
            data2.append(data[i])

    for i in range(len(data2)):
        if(data2[i] != b'\xc3' or data2[i] != b'\xbf'):
            Message += chr(data2[i])

    print(Message.encode('utf-8'))


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


def start(com, id):
    id.thread = event()
    com.subscribe(id)
    try:
        temp = temperature.setup()
    except Exception as e:
        print(e)
        print("Could not read the One wire interface")
    while True:
        try:
            com.notifyThreadById(id, "network", "Temperature {}".format(
                temperature.read_temp(temp)))
        except Exception as e:
            print(e)
            print("Could not read the One wire interface")
        com.notifyThreadById(id, "cv", "Hello")

        time.sleep(20)
# send datat to attiny (light)
# bus.write_i2c_block_data(0,ord('2'),[ord("5"),ord('5')])
