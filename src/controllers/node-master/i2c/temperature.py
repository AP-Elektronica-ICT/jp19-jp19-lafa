import os
import glob
import time


# Load the One wire interface and return the one wire device
# NOTE: This currently grabs one device from the one wire interface if you need more turn the glob into an array
def setup():
    os.system('modprobe w1-gpio')
    os.system('modprobe w1-therm')

    base_dir = '/sys/bus/w1/devices/'
    device_folder = glob.glob(base_dir + '28*')[0]
    return device_folder + '/w1_slave'

# read temperature from a one wire file


def read_temp_raw(file):
    f = open(file, 'r')
    lines = f.readlines()
    f.close()
    return lines

# parse the raw temperature t a usable format


def read_temp(file):
    lines = read_temp_raw(file)
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw(file)
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        # convert temperature to C
        temp_c = float(temp_string) / 1000.0
        return temp_c


if __name__ == '__main__':
    file = setup()
    while True:
        print(read_temp(file), "C°")
        time.sleep(1)
