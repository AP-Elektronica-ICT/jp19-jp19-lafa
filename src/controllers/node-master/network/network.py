import paho.mqtt.client as mqtt
import time
import os
import sys
import network.helper as helper


com = ""
id = ""
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
            self.filename = os.getcwd()+ '/' + __file__.replace(os.path.basename(__file__), '') + file
        else:
            self.filename =  __file__.replace(os.path.basename(__file__), '') + file

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
    def __init__(self, filename, client):
        self.file = File(filename)
        self.client = client
        self.check()

    def check(self):
        self.id = self.file.read()
        if self.id  == '':
            print('No id provided, requesting id')
            self.request()
        else:
            print('ID from file: ' + self.id)
    
    def request(self):
        self.client.subscribe("id")

    def save(self):
        self.file.write(self.id)


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
    def __init__(self, host, port, password="", user=""):
        self.client = mqtt.Client(client_id=File('id.txt').read())
        self.client.username_pw_set(user, password)
        self.client.connect(host, port, 60)
        self.client.on_message = self.on_message
        self.id = ID('id.txt', self.client)



    def send(self, item):
        self.client.publish("node", item)

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
        if msg.topic == 'id':
            self.id.id = str(msg.payload.decode("utf-8"))
            print("Received id: " + self.id.id)
            self.id.save()
        if msg.topic == 'light':
            print("Light value")
            light(str(msg.payload.decode("utf-8")))
        if msg.topic == 'pump':
            print("Pump value")
            pump(str(msg.payload.decode("utf-8")))

def pump(value):
    try:
        if int(value) >= 0 and int(value) <= 255:
            global com, id
            val = list(value)
            val = helper.normalize(val,3)
            print("value: {}".format(val))
            com.notifyThreadById(id, "i2c", i2c(21, val))
        else:
            print("Value send from mqqt broker is invalid: {}".format(value))  
    except Exception as e:
        print(e, value)
        print("MQTT broker send a value that can't be parsed to an int or failed notifying the thread")

def light(value):
    try:
        if int(value) >= 0 and int(value) <= 255:
            global com, id
            val = list(value)
            val = helper.normalize(val,3)
            print("value: {}".format(val))
            com.notifyThreadById(id, "i2c", i2c(20, val))
        else:
            print("Value send from mqqt broker is invalid: {}".format(value))  
    except Exception as e:
        print(e, value)
        print("MQTT broker send a value that can't be parsed to an int or failed notifying the thread")

# This function should send information to the server 
def eventHandler(server):
    while True:
        server.send("Hello")
        server.subscribe("light")
        server.subscribe("pump")
        server.start()
        time.sleep(0.1)
        server.end()
    print("End of event loop")

"""
class used to send payloads to the i2c module
"""
class i2c:
    def __init__(self, addr, data):
        self.addr = addr
        self.data = data

"""
class used to receive events from other threads
"""
class event:
    def receive(self, data, sender):
        print(data)

def start(communication, identifier):
    global id, com
    identifier.thread = event()
    communication.subscribe(identifier)
    id = identifier
    com = communication
    
    server = MQTT("mqtt.farmlab.team", 1883, user="demo", password="demopass")

    eventHandler(server)

    server.disconnect()
