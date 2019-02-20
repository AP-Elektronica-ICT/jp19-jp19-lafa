# This applications handles all the threads
# I prefer to split all the threads into different applications for easier control
# This also avoids deadlock because all inter thread communication will happen over ports
from multiprocessing import Process
from network import network as net
from motorcontroller import motor
from i2c import i2c
from computervision import vision

list = []

if __name__ == '__main__':
    network = Process(target=net.printing, args=(" hello",))
    list.append(network)

    stepper = Process(target=motor.printing, args=(" hello",))
    list.append(stepper)
    stepper2 = Process(target=motor.printing, args=(" hello",))
    list.append(stepper2)
    stepper3 = Process(target=motor.printing, args=(" hello",))
    list.append(stepper3)


    atmega = Process(target=net.printing, args=(" hello",))
    list.append(atmega)

    cv = Process(target=net.printing, args=(" hello",))
    list.append(cv)

    for process in list:
        process.start()
    
    for process in list:
        process.join()
    

