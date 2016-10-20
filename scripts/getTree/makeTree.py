import os
import re
import codecs
import sys
import itertools, collections
from pymongo import MongoClient

parents = [None]*100

def insertIntoTree(text, db, coll):
    for line in text:
        level = line.count('+')
        line = line.replace("+ ", "")
        if line[0] == '-':
            break
        parents[level] = line
        cursor = coll.find({"_id": {"$eq": line}}).limit(1)
        if cursor.count() > 0:
            for doc in cursor:
                print(doc)
                parentInDb = doc['parent']
                parentHere = parents[level-1]
                if parentInDb in parents[0:level-1]:
                    parentHereLevel = parents.index(parentInDb)
                    newDifference = level - parentHereLevel
                    print(level,"-",parentHereLevel,"=",newDifference)
                    if newDifference > 1:
                        coll.update(
                            {"_id": line},
                            {
                                "$set": {"parent": parentHere}
                            }
                        )
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
    with codecs.open(os.path.join(os.path.dirname(sys.argv[0]),'../extractData/animalsTaxonomy.txt'), encoding='utf-8', mode='r') as infile:
        text = [line.rstrip('\n') for line in infile]
    insertIntoTree(text, db, coll)
    with codecs.open(os.path.join(os.path.dirname(sys.argv[0]),'../extractData/plantsTaxonomy.txt'), encoding='utf-8', mode='r') as infile:
        text = [line.rstrip('\n') for line in infile]
    text.pop(0)
    insertIntoTree(text, db, coll)

if __name__ == '__main__':
    main(sys.argv[1:])
