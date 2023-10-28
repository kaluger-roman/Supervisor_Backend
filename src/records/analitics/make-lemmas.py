import spacy
import sys
import json


data  = json.loads(sys.argv[1])

nlp = spacy.load("ru_core_news_lg")
result = []

for text in data:
    doc = nlp(text)
    for token in doc:
        result.append(token.lemma_)
    
print(json.dumps(result))
sys.stdout.flush()
