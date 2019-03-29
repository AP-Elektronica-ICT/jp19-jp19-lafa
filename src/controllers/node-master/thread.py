

"""
Queue wrapper for the threadhandler class
"""
class queue:
    def __init__(self, threadhandler, queue):
        self.queue = queue
        queue.put(threadhandler)

    def subscribe(self, thread):
        handler = self.queue.get()
        handler.subscribe(thread)
        self.queue.put(handler)

    def unsubscribe(self, thread):
        handler = self.queue.get()
        handler.unsubscribe(thread)
        self.queue.put(handler)

    def notifyThreadById(self, sender, sendto, data):
        handler = self.queue.get()
        handler.notifyThreadById(sender, sendto, data)
        self.queue.put(handler)

    def notifyThreadByObject(self, sender, sendto, data):
        handler = self.queue.get()
        handler.notifyThreadByObject(sender, sendto, data)
        self.queue.put(handler)



"""
Common class used to handle inter thread communication
Every thread class passed must have a receive method
"""
class threadhandler:
    def __init__(self):
        self.observers = []

    def subscribe(self, thread):
        if(type(thread) is threadID):
            self.observers.append(thread)
            print("added observer {} total size {}".format(thread, len(self.observers)))
        else:
            print("Cannot subscribe to the thread handler observable is of type {} but expected threadID".format(type(thread)))

    def unsubscribe(self, thread):
        if(type(thread) is threadID):
            self.observers.remove(thread)
        else:
            print("Cannot unsubscribe from the thread handler observable is of type {} but expected threadID".format(type(thread)))

    def notifyThreadById(self, sender, sendto, data):
        print("in notify")
        for thread in self.observers:
            print(thread.id, sendto)
            if(thread.id == sendto):
                print("found thread")
                self.notifyThread(sender, thread, data)

    def notifyThreadByObject(self, sender, sendto, data):
        for thread in self.observers:
            if(thread.thread == sendto):
                self.notifyThread(sender, thread, data)

    def notifyThread(self, sender, sendto, data):
        sendto.thread.receive(data,sender)
    

"""
Wrapper class used to assign a specific thread to a ID usefull to communicate peer to peer between threads
"""
class threadID:
    def __init__(self, id):
        self.thread = ""
        self.id = id