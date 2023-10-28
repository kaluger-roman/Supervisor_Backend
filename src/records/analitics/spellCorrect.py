import sys
import json
from spellchecker import SpellChecker

data = json.loads(sys.argv[1])

spell = SpellChecker(language='ru') 

result = []

for word in data:
    misspelled = spell.unknown([word])
    result.append(spell.correction(word))

print(json.dumps(result))
sys.stdout.flush()