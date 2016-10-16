import re
import codecs
import sys
import json
import itertools, collections
from pymongo import MongoClient

def createTree(coll, tree, node):
    child = coll.find({'parent': node})
    if (child is None):
        return
    else:
        children = []
        for item in child:
            children.append({
                'name': item['_id']
            })
        tree['children'] = children
        for c in tree['children']:
            createTree(coll, c, c['name'])

def main(args):
    tree = {}
    client = MongoClient()
    db = client['bioTree']
    coll = db['nodes']
    parent = coll.find_one({'parent': 'null'})['_id'];
    tree['name'] = parent
    createTree(coll, tree, parent)
    treeFile = open("../data/tree.json", "w")
    treeFile.write(json.dumps(tree, indent = 4, sort_keys = True))
    treeFile.close()

if __name__ == '__main__':
    main(sys.argv[1:])
