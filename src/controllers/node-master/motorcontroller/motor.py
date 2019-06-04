import pigpio

pi = pigpio.pi()


class event:
    """
    class used to receive events from other threads
    """

    def __init__(self):
        self.init = True

    def initInThread(self):
        print("Initing motor")

    # Convert received value to a dutycyle on the received pin
    def receive(self, data, sender):
        print(data)
        val = int(float("".join(data.data)))
        print("Value in percent {}".format(val))
        pi.set_PWM_dutycycle(data.addr, val)


def start(com, id):
    id.thread = event()
    com.subscribe(id)
