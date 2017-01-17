import sys,nltk
import codecs
import os
import re
import math
from nltk.corpus import stopwords
from nltk.stem.wordnet import WordNetLemmatizer
import editdistance
import numpy

def filter(tokens):
	filtered=[]
	stop_words=stopwords.words('english')
	number=re.compile(r'(?:\d*\.)?\d+')
	tokens  = tokens.split(' ')
	for token in tokens:
		token=token.lower()
		if (len(token)<=3):
			continue
		while not (token[len(token)-1]>='a' and token[len(token)-1]<='z'):
			token1=token[:-1]
			if token1!=token:
				token=token1
				break 

		while not (token[0]>='a' and token[0]<='z'):
			token1=token[1:]
			if token1!=token:
				token=token1
				break 

		try:
			if len(token)<=3:
				continue
			if number.match(token):
				continue
			if token in stop_words:
				continue
			filtered.append(token)
		except UnicodeDecodeError as e:
			continue
		except UnicodeWarning as e1:
			continue
	return filtered

def getTextFiles():
	textFiles=[]
	files=os.listdir('../data')
	for file in files:
		textFiles.append(file)
	return textFiles

def getImportant(valWord):
	sizeOfMatrix=len(valWord)
	S=numpy.zeros(shape=(sizeOfMatrix,sizeOfMatrix))
	listOfWords=[]
	for word in valWord:
		listOfWords.append(word)

	for i in range(sizeOfMatrix):
		for j in range(sizeOfMatrix):
			S[i][j]=editdistance.eval(listOfWords[i],listOfWords[j])

	r=numpy.zeros(shape=(sizeOfMatrix,1))

	for i in range(sizeOfMatrix):
		r[i]=valWord[listOfWords[i]]

	q=numpy.dot(S,r)
	s=numpy.multiply(q,r)
	s=numpy.multiply(3,s)
	s=numpy.subtract(s,numpy.multiply(r,r))
	# assuming that we need just 30 words right now
	k=30
	# print s
	listWords={}
	iterations=0

	while len(listWords)<10:
		maxIndex=numpy.argmax(s)
		listWords[listOfWords[maxIndex]]=1
		print listWords
		tempVal=numpy.zeros(shape=(sizeOfMatrix,1))
		for j in range(sizeOfMatrix):
			tempVal[j]=S[j][maxIndex]
		tempVal=numpy.multiply(tempVal,r)
		tempVal=numpy.multiply(2*r[maxIndex],tempVal)
		s=s-tempVal
		iterations=iterations+1
	
	for x in listWords:
		print x

if __name__ == "__main__":
	reload(sys)
	sys.setdefaultencoding('utf8')
	textFiles=getTextFiles()
	os.chdir('../data')
	countWordDoc={}
	lmztr=WordNetLemmatizer()

	for file in textFiles:
		with codecs.open(file,encoding='utf-8',mode='r') as infile:
			content=[x.strip('\n') for x in infile.readlines()]
			filteredContent=[filter(x) for x in content]
			wordsPresent={}
			for fc in filteredContent:
				for word in fc:
					lemWord=lmztr.lemmatize(word)
					wordsPresent[lemWord]=1
			for word in wordsPresent:
				lemWord=lmztr.lemmatize(word)
				if lemWord not in countWordDoc:
					countWordDoc[lemWord]=1
				else:
					countWordDoc[lemWord]+=1

	for file in textFiles:
		if(file!='Alligator.txt'):
			continue
		print ("=======" + file + "\n")
		with codecs.open(file,encoding='utf-8',mode='r') as infile:
			content=[x.strip('\n') for x in infile.readlines()]
			filteredContent=[filter(x) for x in content]
			wordsPresent={}
			for fc in filteredContent:
				for word in fc:
					lemWord=lmztr.lemmatize(word)
					if lemWord not in wordsPresent:
						wordsPresent[lemWord]=1
					else:
						wordsPresent[lemWord]+=1

			maxValue=max(wordsPresent,key=wordsPresent.get)
			maxValue=wordsPresent[maxValue]
			valWord={}
			for word in wordsPresent:
				lemWord=lmztr.lemmatize(word)
				if lemWord in wordsPresent.keys():
					val=(0.5 + (0.5*wordsPresent[lemWord])/maxValue)
					val=val*val
					val1=math.log(len(textFiles)*1.0/countWordDoc[lemWord]*1.0,2)
					val=val*val1
					valWord[lemWord]=val

			l = sorted(sorted(wordsPresent), key=valWord.get, reverse=True)
			print l
			getImportant(valWord);