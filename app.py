from flask import Flask, send_from_directory, request, jsonify, session
import uuid

import game

app = Flask(__name__)
app.secret_key = 'qwe3dsdoasdfin4n4jdj'

static_path = 'public'



@app.route('/signup', methods =['POST'])
def signup_view():
    user = request.json
    print(user)
    user.update({'uid': str(uuid.uuid4())})
    game.add_user(user)
    session['user'] = user
    print(user)
    return jsonify(user), 200



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
