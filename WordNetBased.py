from flask import Flask, render_template, request
from flask_cors import CORS
import json
from nltk.corpus import wordnet as model

app = Flask(__name__)
CORS(app) 
Meaning = {
    'selectedWord':'',
    'wordDefinition':'',
    'exampleWord':'',
}
def processSelectedword(selectedWord):
    sysn = model.synsets(selectedWord)[0]  # ['getWord Meaning']
    Meaning['selectedWord'] = sysn.name()
    possibleDefinition = sysn.definition()
    if possibleDefinition.split(';') != None:
        Meaning['wordDefinition'] = possibleDefinition.split(';')
        
    Meaning['exampleWord'] = sysn.examples()
    return Meaning
@app.route('/words', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        words = request.form.get('selectedWord')
        print(words)
        return  json.dumps(processSelectedword(words))
    return "PDF Explainer!"

if __name__ == '__main__':
    app.run(debug=True)
