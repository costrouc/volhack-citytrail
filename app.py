from flask import Flask, send_from_directory, request, jsonify, session

from game import Game

app = Flask(__name__)
app.secret_key = 'qwe3dsdoasdfin4n4jdj'

static_path = 'public'

game = Game()

@app.route('/signup', methods =['POST'])
def signup_view():
    user = game.add_player(request.json)
    session['user'] = user
    print(user)
    return jsonify(user)


@app.route('/gamesubmit', methods=['POST'])
def gamesubmit_view():
    choice = request.json
    game.submit_player_action(choice)
    return jsonify({"recieved": True})


@app.route('/gamenext', methods=['POST'])
def gamenext_view():
    uid = request.json['uid']
    state = game.get_state(uid)
    if state:
        return jsonify(state)
    return jsonify({'status': 'not ready'})


@app.route('/gameready', methods=['POST'])
def gameupdate_view():
    # Update view with u
    uid = request.json['uid']
    return jsonify({"status": game.next_state_ready(uid)})


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
    app.run(debug=False, port=8000, hostname="0.0.0.0")
