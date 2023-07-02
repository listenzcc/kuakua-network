"""
File: app.py
Author: Chuncheng Zhang
Date: 2023-06-30
Copyright & Email: chuncheng.zhang@ia.ac.cn

Purpose:
    Amazing things

Functions:
    1. Requirements and constants
    2. Function and class
    3. Play ground
    4. Pending
    5. Pending
"""


# %% ---- 2023-06-30 ------------------------
# Requirements and constants
import time
import random
import threading
import pandas as pd

from tqdm.auto import tqdm
from rich import print
from flask import Flask, request, render_template
from pathlib import Path


ROOT = Path(__file__).parent

# %% ---- 2023-06-30 ------------------------
# Function and class

# Dataset

default_talks = ['有爱的', '和谐的', '爱国的', '敬业的', '友善的', '富强的']


class Dataset(object):
    def __init__(self):
        self.folder = ROOT.joinpath('upload/topic')
        self.topics = self.read_topics()

        threading.Thread(target=self.auto_save_topics, daemon=True).start()

    def read_topics(self):
        topics = dict()
        for fpath in tqdm(self.folder.iterdir(), 'Read topics'):
            topics[fpath.name.replace('.json', '')] = pd.read_json(
                fpath).values.tolist()
        return topics

    def auto_save_topics(self):
        '''
        Save the dataset every 60 seconds
        '''
        while True:
            time.sleep(60)
            self.save_topics()

    def save_topics(self):
        for key, value in tqdm(self.topics.items(), 'Save topics'):
            fpath = self.folder.joinpath(key + '.json')
            pd.DataFrame(value).to_json(fpath)
            print('Saved {} for {} entries.'.format(fpath, len(value)))

    def insert(self, topic, talk=None):
        if not topic in self.topics:
            self.topics[topic] = []

        if talk is not None:
            self.topics[topic].append((time.time(),
                                       talk,
                                       topic))
            print('Insert new talk into {}'.format(topic))
        else:
            random.shuffle(default_talks)
            self.topics[topic].append((time.time(),
                                       ''.join(default_talks[:2]),
                                       topic))
            print('Insert default talk into {}'.format(topic))

    def query_topic(self, topic):
        if not topic in self.topics:
            print('{} not in the topics {}'.format(topic,
                                                   self.query_all_topic_names()))

        # Sort the result with the order of the larger time in the first
        return sorted(self.topics[topic], key=lambda x: x[0], reverse=True)

    def query_all_topic_names(self):
        return [key for key in self.topics]


dataset = Dataset()

dataset.insert('aaaa又双叒叕')
dataset.insert('bbbb工㠭')
dataset.insert('cccc土圭垚壵土㙓')

# Flask app
kwargs = dict(
    import_name='Flask app',
    static_url_path='/static',
    static_folder=ROOT.joinpath('static'),
    template_folder=ROOT.joinpath('template')
)

app = Flask(**kwargs)


# Routes
@app.route('/')
@app.route('/index.html')
def index():
    return render_template('index.html')


@app.route('/queryTopicNames')
def query_topic_names():
    return dataset.query_all_topic_names()


@app.route('/queryTopic')
def query_topic():
    args = request.args
    print(args)
    return dataset.query_topic(args.get('topic', None))


@app.route('/insertTopicTalk')
def insert_topic_talk():
    args = request.args
    print(args)
    topic = args.get('topic', None)
    talk = args.get('talk', None)

    if topic is None:
        return []

    dataset.insert(topic, talk)
    return dataset.query_topic(topic)


# %% ---- 2023-06-30 ------------------------
# Play ground
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8858)


# %% ---- 2023-06-30 ------------------------
# Pending


# %% ---- 2023-06-30 ------------------------
# Pending
