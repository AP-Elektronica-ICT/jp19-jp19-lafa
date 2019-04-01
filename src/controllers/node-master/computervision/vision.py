from time import sleep
from multiprocessing import Value
import ctypes
"""
class is used to receive events from other threads
"""


class event:
    def receive(self, data, sender):
        with num.get_lock():
            num.value += 1
            print("data: {}, global num: {}".format(data, num.data.value))


class data(ctypes.BigEndianStructure):
    _pack_ = 1
    _fields_ = [
        ('fx', ctypes.c_uint, 7),
        ('fy', ctypes.c_ubyte, 1)
    ]


num = Value(data(), 0.0)


def start(com, id):
    global num
    id.thread = event()
    com.subscribe(id)

    if id.id == 'cv2':
        com.notifyThreadById(id, 'cv', "Hello this is from a notification")
    else:
        while True:
            with num.get_lock():
                num.data.value += 1
                print(num.data.value)
            sleep(1)
