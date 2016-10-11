import re
import codecs

def extract_and_print(lines, filename):
    outfile = open(filename, "w")
    for line in lines:
        temp = "title: \'"
        line = line.rstrip('\n')
        try:
            match = line[line.index(temp)+len(temp):]
            match = match.rsplit('\'', 1)[0]
            outfile.write(match + '\n')
        except:
            pass
    outfile.close()

with codecs.open('../extractData/animalList.txt', encoding='utf-8', mode='r') as infile:
    text = infile.readlines()
animals = "../extractData/animals.txt"
text = [x.strip('\n') for x in text]
extract_and_print(text, animals)

with codecs.open('../extractData/plantList.txt', encoding='utf-8', mode='r') as infile:
    text = infile.readlines()
plants = "../extractData/plants.txt"
text = [x.strip('\n') for x in text]
extract_and_print(text, plants)
