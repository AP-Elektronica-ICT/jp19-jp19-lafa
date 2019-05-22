import pigpio


class event:
    """
    class used to receive events from other threads
    """

    def __init__(self):
        self.init = True

    def initInThread(self):
        print("Initing motor")

    def receive(self, data, sender):
        pi = pigpio.pi()
        print(data)
        val = int(float("".join(data.data))/2.55)
        print("Value in percent {}".format(val))
        pi.set_PWM_dutycycle(data.addr, val)


def start(com, id):
    id.thread = event()
    com.subscribe(id)
