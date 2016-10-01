from flask import Flask, send_from_directory, request, jsonify, session
import uuid

import game

app = Flask(__name__)

static_path = 'public'



@app.route('/signup', methods =['POST'])
def signup_view():
    user = request.json()
    user.update({'uid': uuid.uuid4()})
    game.add_user(user)
    session['user'] = user
    print(user)
    return jsonify(user)



# Hack for static hosting
@app.route('/')
def home_view():
    return send_from_directory(static_path, 'index.html')

@app.route('/scripts/<path:path>')
@app.route('/stylesheets/<path:path>')
@app.route('/data/<path:path>')
def static_assets(path):
    return send_from_directory(static_path, request.path[1:]) # hack

if __name__ == "__main__":
    app.run(debug=True, port=8000)
