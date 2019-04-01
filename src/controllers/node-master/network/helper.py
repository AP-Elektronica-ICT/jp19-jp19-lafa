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
