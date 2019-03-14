def normalize(list, size):
    if(len(list) < size):
        for i in range(len(list) - size):
            [0] + list
        return list
    return list