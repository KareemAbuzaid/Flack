import os
import logging

from flask import Flask, render_template, request, session, \
    make_response, jsonify, redirect
from flask_socketio import SocketIO, emit


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# This is the structure that will hold all the channels and the messages in
# each channel.
#   - A dictionary, each key represents a channel.
#   - In each channel there is a list of dictionaries, each one is a message.
#   - A message has two keys 'message' and 'dispalyname'
# Example:  {'channel_1':
#                        [
#                          {'message': "Hello there!",
#                          'display_name': "Kareem"},
#                          {'message': "Oh Hi!",
#                          'display_name': "Shreef"},
#                         ]
#           }
channels = dict()


@app.route("/", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return signin()
    else:
        return render_template('index.html')


@app.route("/load", methods=['GET'])
def load():
    logging.warning("the list of channels: " + str(channels))
    logging.warning("json " + str(jsonify([channels])))
    res = make_response(jsonify([list(channels.keys())]), 200)
    return res


@app.route("/signin", methods=['POST', 'GET'])
def signin():
    if request.method == 'POST':
        return render_template('index.html')
    else:
        return render_template('signin.html')


@app.route("/create/<string:channel_name>", methods=['GET'])
def create(channel_name):
    channels[channel_name] = []
    logging.warning("Current channels " + str(channels))
    return ''


@app.route("/chat/<string:channel_name>", methods=['GET'])
def chat(channel_name):
    res = {'channel_name': channel_name,
           'messages': channels[channel_name]}
    logging.warning("channel data: " + str(res))
    return render_template('chat.html', channel_data=res)


@socketio.on("message")
def message(message_data):
    channels[message_data['channel_name']].\
        append([{'message': message_data['message'],
                 'displayname': message_data['displayname']}])
    logging.warning("Messages to be emitted: " + str(channels[message_data['channel_name']]))
    emit('messages', {'messages': channels[message_data['channel_name']]},
         broadcast=True)
