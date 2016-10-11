import re
import codecs
import sys
import itertools, collections
from pymongo import MongoClient

parents = [None]*100

def insertIntoTree(text, db, coll):
    level_temp = -1
    for line in text:
        level = line.count('+')
        line = line.replace("+ ", "")
        if level_temp != -1 and level_temp < level:
            continue
        if level_temp != -1 and level_temp == level:
            level_temp = -1
        if line == parents[level-1]:
            level_temp = level
            continue
        if line[0] == '-':
            break
        parents[level] = line
        cursor = coll.find({"_id": {"$eq": line}}).limit(1)
        if cursor.count() > 0:
            continue
        else:
            if level == 0:
                result = coll.insert_one({
                    "_id": line,
                    "parent": "null"
                })
            else:
                result = coll.insert_one({
                    "_id": line,
                    "parent": parents[level-1]
                })

def main(args):
    client = MongoClient()
    db = client['bioTree']
    coll = db['nodes']
    coll.create_index("parent")
    with codecs.open('../extractData/animalsTaxonomy.txt', encoding='utf-8', mode='r') as infile:
        text = [line.rstrip('\n') for line in infile]
    insertIntoTree(text, db, coll)
    with codecs.open('../extractData/plantsTaxonomy.txt', encoding='utf-8', mode='r') as infile:
        text = [line.rstrip('\n') for line in infile]
    text.pop(0)
    insertIntoTree(text, db, coll)

if __name__ == '__main__':
    main(sys.argv[1:])
