class event:
    """
    class used to receive events from other threads
    """

    def receive(self, data, sender):
        print(data)


def start(com, id):
    id.thread = event()
    com.subscribe(id)
