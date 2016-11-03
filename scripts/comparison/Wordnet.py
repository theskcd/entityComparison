import sys, json
from gensim import corpora, models, similarities
from pprint import pprint  # pretty-printer
from collections import defaultdict

def main(args):
	documents1 = args[0].split(',')
	documents2 = args[1].split(',')
	result = {}
	stoplist = set('for a of the and to in'.split())
	texts = [[word for word in document.lower().split() if word not in stoplist]
	         for document in documents1]
	      
	dictionary = corpora.Dictionary(texts)
	corpus = [dictionary.doc2bow(text) for text in texts]

	lsi = models.LsiModel(corpus, id2word=dictionary, num_topics=10)
	for doc in documents2:
		# print('\n' + doc)
		vec_bow = dictionary.doc2bow(doc.lower().split())
		vec_lsi = lsi[vec_bow] # convert the query to LSI space

		index = similarities.MatrixSimilarity(lsi[corpus]) # transform corpus to LSI space and index it
		sims = index[vec_lsi]
		temp = []
		for idx, val in enumerate(sims):
			if val > 0.5:
				# print(documents1[idx])
				temp.append(documents1[idx])
		if temp:
			result[doc] = temp
	print(json.dumps(result))

if __name__ == '__main__':
    main(sys.argv[1:])