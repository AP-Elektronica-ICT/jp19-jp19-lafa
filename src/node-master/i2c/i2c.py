import smbus
import time

bus = smbus.SMBus(1) # RPI used i²C bus 1

# This is the address we setup in the Arduino Program
# TODO : get all I2C detected devices and populate a list
address = 0x0a

def readNumber():
    return bus.read_i2c_block_data(address, 2)

def readMessageFromArduino():
    data = bus.read_i2c_block_data(address, 0,20)
    Message = ""
    data2 = []
    for i in range(len(data)):
        if(data[i] != 255):
            data2.append(data[i])

    for i in range(len(data2)):
        if(data2[i] != b'\xc3' or data2[i] != b'\xbf' ):
            Message += chr(data2[i])

    print(Message.encode('utf-8'))

def start(name):
    print("In I2C Thread" + name)
    while True:
        readMessageFromArduino()
        time.sleep(0.01)