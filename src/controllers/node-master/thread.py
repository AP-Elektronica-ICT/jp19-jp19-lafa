
# TODO: add try catch to queue to prevent holdup of all threads (deadlock)


class queue:
    """
    Queue wrapper for the threadhandler class
    """

    def __init__(self, threadhandler, queue):
        self.queue = queue
        queue.put(threadhandler)

    def subscribe(self, thread):
        handler = self.queue.get()
        try:
            handler.subscribe(thread)
        except Exception as e:
            print(e)
            print("Notifying of thread failed")
        self.queue.put(handler)

    def unsubscribe(self, thread):
        handler = self.queue.get()
        try:
            handler.unsubscribe(thread)
        except Exception as e:
            print(e)
            print("Notifying of thread failed")
        self.queue.put(handler)

    def notifyThreadById(self, sender, sendto, data):
        handler = self.queue.get()
        try:
            handler.notifyThreadById(sender, sendto, data)
        except Exception as e:
            print(e)
            print("Notifying of thread failed")
        self.queue.put(handler)

    def notifyThreadByObject(self, sender, sendto, data):
        handler = self.queue.get()
        try:
            handler.notifyThreadByObject(sender, sendto, data)
        except Exception as e:
            print(e)
            print("Notifying of thread failed")
        self.queue.put(handler)


class threadhandler:
    """
    Common class used to handle inter thread communication
    Every thread class passed must have a receive method
    """

    def __init__(self):
        self.observers = []

    def subscribe(self, thread):
        if(type(thread) is threadID):
            self.observers.append(thread)
            print("added observer {} total size {}".format(
                thread, len(self.observers)))
        else:
            print("Cannot subscribe to the thread handler observable is of type {} but expected threadID".format(
                type(thread)))

    def unsubscribe(self, thread):
        if(type(thread) is threadID):
            self.observers.remove(thread)
        else:
            print("Cannot unsubscribe from the thread handler observable is of type {} but expected threadID".format(
                type(thread)))

    def notifyThreadById(self, sender, sendto, data):
        for thread in self.observers:
            if(thread.id == sendto):
                self.notifyThread(sender, thread, data)

    def notifyThreadByObject(self, sender, sendto, data):
        for thread in self.observers:
            if(thread.thread == sendto):
                self.notifyThread(sender, thread, data)

    def notifyThread(self, sender, sendto, data):
        sendto.thread.receive(data, sender)


class threadID:
    """
    Wrapper class used to assign a specific thread to a ID usefull to communicate peer to peer between threads
    """

    def __init__(self, id):
        self.thread = ""
        self.id = id
