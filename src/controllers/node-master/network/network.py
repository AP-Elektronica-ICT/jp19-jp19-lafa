import paho.mqtt.client as mqtt
import time
import os
import sys
from multiprocessing import Queue
import network.helper as helper
import network.data as env


com = ""
id = ""
temperature = ""

"""
    This module handles communication with the central server.
    Each node starts a connection with the server and then communicates with it over mqtt
    each client saves an ID for easy lookup in the webserver (since mqtt id's change with each connection)
    This module relays the given information between the server and the atmega
"""


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

    def handleMotor(self, name, receivedtopic, topic, pin, payload):
        if receivedtopic == self.id.id+topic:
            print(name + " value")
            PWM(pin, str(payload.decode("utf-8")))

    # The callback for when a PUBLISH message is received from the server.
    # this should parse the information and propagate it
    # TODO : send information to the atmega if nececery

    def on_message(self, client, userdata, msg):
        print("received topic: {}".format(msg.topic))

        self.handleMotor("Light", msg.topic, "/actuator/lightint",
                         env.light, msg.payload)

        self.handleMotor("Pump", msg.topic, "/actuator/flowpump",
                         env.pump, msg.payload)

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


def eventHandler(server):
    while True:
        server.subscribe(server.id.id+"/actuator/lightint")
        server.subscribe(server.id.id+"/actuator/flowpump")
        server.start()
        time.sleep(env.interval)
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
            print("Uploading {}".format(data.data))
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
