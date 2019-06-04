import paho.mqtt.client as mqtt
import time
import os
import sys
from multiprocessing import Queue
import network.helper as helper
import network.data as env
import network.middelware as middelware


com = ""
id = ""
temperature = ""

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
        self.check()
        self.file = open(self.filename, "r+")
        value = self.file.read()
        self.cleanup()
        return value

    def updateField(self, attribute, value):
        arr = self.read().splitlines()
        result = []
        Found = False
        for line in arr:
            if line.__contains__(attribute):
                result.append("{} {} \n".format(attribute, value))
                Found = True
            else:
                result.append(line+"\n")
        if not Found:
            result.append("{} {} \n".format(attribute, value))
        self.write(result)

    def readField(self, attribute):
        arr = self.read().splitlines()
        for line in arr:
            if line.__contains__(attribute):
                return line.split()[1]
        return None

    def check(self):
        dirname = os.path.dirname(self.filename)
        if not os.path.exists(dirname):
            os.makedirs(dirname)

        try:
            data = open(self.filename, 'r')
            data.close()
        except FileNotFoundError as e:
            self.write("")

    def write(self, value):
        self.file = open(self.filename, "w+")
        self.file.writelines(value)
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
        self.client.connect(host, port, 10)
        self.client.on_message = self.on_message
        self.file = File(env.sensorfile)

    def send(self, item, topic="node"):
        self.file.updateField(topic, item)
        self.client.publish(topic, item)

    def subscribe(self, topic):
        self.client.subscribe(topic)

    def disconnect(self):
        print("Disconnected")
        self.client.disconnect()

    def start(self):
        self.client.loop_start()

    def end(self):
        self.client.loop_stop()

    def handleMotor(self, name, receivedtopic, topic, pin, payload, mw=None):
        if receivedtopic == self.id.id+topic:
            print(name + " value")
            value = str(payload.decode("utf-8"))
            waterlevel1 = self.file.readField(self.id.id+'/sensors/waterlvl/0')
            waterlevel2 = self.file.readField(self.id.id+'/sensors/waterlvl/1')
            waterlevel3 = self.file.readField(self.id.id+'/sensors/waterlvl/2')
            if mw != None:
                value = mw(value, waterlevel1, waterlevel2, waterlevel3)
            self.file.updateField(receivedtopic, value)
            PWM(pin, value)

    # The callback for when a PUBLISH message is received from the server.
    # this should parse the information and propagate it
    # TODO : send information to the atmega if nececery

    def on_message(self, client, userdata, msg):
        print("received topic: {}".format(msg.topic))

        self.handleMotor("Light", msg.topic, "/actuator/lightint",
                         env.light, msg.payload)

        self.handleMotor("Pump", msg.topic, "/actuator/flowpump",
                         env.pump, msg.payload, middelware.pump)

        self.handleMotor("Food", msg.topic, "/actuator/foodpump",
                         env.food, msg.payload)


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


def checkPump(server):
    value = server.file.readField(server.id.id+'/actuator/flowpump')
    water1 = server.file.readField(server.id.id+'/sensors/waterlvl/0')
    water2 = server.file.readField(server.id.id+'/sensors/waterlvl/1')
    water3 = server.file.readField(server.id.id+'/sensors/waterlvl/2')
    PWM(env.pump, middelware.pump(value, water1, water2, water3))


def eventHandler(server):
    while True:
        server.subscribe(server.id.id+"/actuator/lightint")
        server.subscribe(server.id.id+"/actuator/flowpump")
        server.subscribe(server.id.id+'/actuator/foodpump')
        server.start()
        time.sleep(env.interval)
        checkPump(server)
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
        mqtt = MQTT(env.server, env.port, user=env.user,
                    password=env.passwd, useID=False)

        if data.isSensor:
            print("Uploading {} {}".format(data.data, data.topic))
            mqtt.send(data.data, topic=ID().id + data.topic)
            time.sleep(0.5)


def start(communication, identifier):
    global id, com
    identifier.thread = event()
    communication.subscribe(identifier)
    id = identifier
    com = communication

    server = MQTT(env.server, env.port, user=env.user, password=env.passwd)
    print("Should be connected")

    eventHandler(server)

    server.disconnect()
