# convert a list to a certain size
# eg size = 3 and the list is [1,2] it becomes [0,1,2]


def normalize(list, size):
    end = list
    if(len(list) <= size):
        for i in range(size - len(list)):
            end = ['0'] + end
        return end
    return end


if __name__ == "__main__":
    list = ["1", "2"]
    print(normalize(list, 3))
