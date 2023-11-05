# Use a pipeline as a high-level helper
import json
import sys
from transformers import pipeline

pipe = pipeline("text-classification", model="apanc/russian-sensitive-topics")

res = pipe(sys.argv[1])

print(json.dumps(res))
sys.stdout.flush()
