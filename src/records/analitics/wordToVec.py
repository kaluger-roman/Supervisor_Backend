import sys
import json
import gensim
from gensim.test.utils import datapath

data = json.loads(sys.argv[1])

stream = datapath("./src/records/analitics/model-w2v.bin")
model = gensim.models.KeyedVectors.load_word2vec_format(
    "./src/records/analitics/model-w2v.bin", binary=True)

result = []
for word in data:
    # есть ли слово в модели? Может быть, и нет
    if word in model:
        # выдаем 10 ближайших соседей слова:
        buf=[]
        for i in model.most_similar(positive=[word], topn=10):
            # слово + коэффициент косинусной близости
            buf.append(i)
        result.append(buf)

print(json.dumps(result))
sys.stdout.flush()
