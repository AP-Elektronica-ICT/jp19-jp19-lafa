# This applications handles all the threads
# I prefer to split all the threads into different applications for easier control
# This also avoids deadlock because all inter thread communication will happen over ports
from multiprocessing import Process, Queue
from network import network as net
from motorcontroller import motor
from i2c import i2c
# from computervision import vision
import thread as tc
q = Queue()
threadHandler = tc.threadhandler()
wrapper = tc.queue(threadHandler, q)

list = []

if __name__ == '__main__':

    network = Process(target=net.start, args=(wrapper, tc.threadID("network")))
    list.append(network)

    stepper = Process(target=motor.start, args=(
        wrapper, tc.threadID("stepper1")))
    list.append(stepper)
    """
    stepper2 = Process(target=motor.start, args=(
        wrapper,tc.threadID("stepper2")))
    list.append(stepper2)
    stepper3 = Process(target=motor.start, args=(
        wrapper,tc.threadID("stepper3")))
    list.append(stepper3)
    """

    atmega = Process(target=i2c.start, args=(wrapper, tc.threadID("i2c")))
    list.append(atmega)

    """
    cv = Process(target=vision.start, args=(wrapper, tc.threadID("cv"),))
    list.append(cv)
    """

    for process in list:
        process.start()

    for process in list:
        process.join()
