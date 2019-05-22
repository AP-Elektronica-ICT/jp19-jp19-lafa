import paho.mqtt.client as mqtt
import time
import os
import sys
from multiprocessing import Queue
import network.helper as helper


com = ""
id = ""
temperature = ""
serverIP = "mqtt.farmlab.team"
#serverIP = "172.16.0.80"

"""
    This module handles communication with the central server.
    Each node starts a connection with the server and then communicates with it over mqtt
    each client saves an ID for easy lookup in the webserver (since mqtt id's change with each connection)
    This module relays the given information between the server and the atmega
"""


class File:
    """
        The File class handles file input and output
        Never forget to call the cleanup method.
        This handles the closing of the file.
        Never use this class if multiple instances of the same file are used since whe never close it
        during its lifespan
    """
    # filename is located in the directory of the module
    # this should be launched from launch.py

    def __init__(self, file):
        if __name__ == '__main__':
            self.filename = os.getcwd() + '/' + \
                __file__.replace(os.path.basename(__file__), '') + file
        else:
            self.filename = __file__.replace(
                os.path.basename(__file__), '') + file

    def read(self):
        self.file = open(self.filename, "r+")
        value = self.file.read()
        self.cleanup()
        return value

    def write(self, value):
        self.file = open(self.filename, "w+")
        self.file.write(value)
        self.cleanup()

    def cleanup(self):
        self.file.close()


class ID:
    """
        The ID class figures out if we already have an ID otherwise we get assigned one
    """

    def __init__(self):
        from uuid import getnode as get_mac
        mac = get_mac()
        self.id = "".join(c + ":" if i % 2 else c for i,
                          c in enumerate(hex(mac)[2:].zfill(12)))[:-1]

    def sensor(self):
        return self.id+":aa"


class MQTT:
    """
        The mqtt class is the main class of this module.
        It handles the connection between the client and server.

        Important notes

        When you aren't sending information using MQTT.send()
        use MQTT.start() this will listen for incomming events
        And don't forget to call MQTT.end() before sending information
        When you don't need MQTT anymore use disconnect this will end the client connection
    """

    def __init__(self, host, port, password="", user="", useID=True):
        self.id = ID()
        if useID:
            self.client = mqtt.Client(client_id=self.id.id)
        else:
            self.client = mqtt.Client(client_id=self.id.sensor())
        self.client.username_pw_set(user, password)
        self.client.connect(host, port, 60)
        self.client.on_message = self.on_message

    def send(self, item, topic="node"):
        self.client.publish(topic, item)

    def subscribe(self, topic):
        self.client.subscribe(topic)

    def disconnect(self):
        self.client.disconnect()

    def start(self):
        self.client.loop_start()

    def end(self):
        self.client.loop_stop()

    # The callback for when a PUBLISH message is received from the server.
    # this should parse the information and propagate it
    # TODO : send information to the atmega if nececery
    def on_message(self, client, userdata, msg):
        print("received topic: {}".format(msg.topic))

        if msg.topic == self.id.id+'/actuator/lightint':
            print("Light value")
            PWM(17, str(msg.payload.decode("utf-8")))
        if msg.topic == self.id.id+'/actuator/flowpump':
            print("Pump value")
            PWM(27, str(msg.payload.decode("utf-8")))
        if msg.topic == self.id.id+'/actuator/foodpump':
            print("Food value")
            PWM(22, str(msg.payload.decode("utf-8")))


def PWM(pin, value):
    try:
        if int(value) >= 0 and int(value) <= 255:
            global com, id
            val = list(value)
            val = helper.normalize(val, 3)
            print("value: {}".format(val))
            com.notifyThreadById(id, "stepper1", i2c(pin, val))
        else:
            print("Value send from mqtt broker is invalid: {}".format(value))
    except Exception as e:
        print(e, value)
        print("MQTT broker send a value that can't be parsed to an int or failed notifying the thread")


class i2c:
    """
    class used to send payloads to the i2c module
    """

    def __init__(self, addr, data):
        self.addr = addr
        self.data = data

# This function should send information to the server


def eventHandler(server):
    while True:
        server.subscribe(server.id.id+"/actuator/lightint")
        server.subscribe(server.id.id+"/actuator/flowpump")
        server.start()
        time.sleep(20)
        server.end()
    print("End of event loop")


class event:
    """
    class used to receive events from other threads
    """

    def __init__(self):
        self.init = True

    def initInThread(self):
        print("Init in network")
        self.init = False

    def receive(self, data, sender):
        global id, com
        print("Network thread received data from {}, payload is {}".format(
            sender.id, data))
        if data.__contains__("Temperature"):
            print("Uploading temp {}".format(data))
            MQTT(serverIP, 1883, user="Farm", password="Lab", useID=False).send(
                '{}'.format(data.replace("Temperature ", "")), topic=ID().id + "/sensors/watertemp")


def start(communication, identifier):
    global id, com
    identifier.thread = event()
    communication.subscribe(identifier)
    id = identifier
    com = communication

    server = MQTT(serverIP, 1883, user="Farm", password="Lab")

    eventHandler(server)

    server.disconnect()
