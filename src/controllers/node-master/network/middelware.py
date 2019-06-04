

def pump(payload, waterlevel1, waterlevel2, waterlevel3):
    print("waterlevel {} {} {}".format(waterlevel1, waterlevel2, waterlevel3))
    # Water level is pritty high
    if waterlevel1 != None and waterlevel2 != None and waterlevel3 != None:
        if max(int(waterlevel1), int(waterlevel2), int(waterlevel3)) > 180:
            return "0"
    return payload


def max(a, b, c):
    if (a > b and a > c):
        return a
    else:
        if b > c:
            return b
    return c
