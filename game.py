import random

LOCATION_TYPES = ['CAR', 'BIKE', 'EXIT']
X_BOUNDS = [-100.0, 100.0]
Y_BOUNDS = [-50.0, 50.0]

def add_user(user):
    pass

def new_game(players_signin, num_locations=5):
    players = []
    for i in range(num_players):
        player.append({
            "position": {
                "x": random.random() * (X_BOUNDS[1] - X_BOUNDS[0]) + X_BOUNDS[0],
                "y": random.random() * (Y_BOUNDS[1] - Y_BOUNDS[0]) + Y_BOUNDS[0]
            }
        })


    return {
        'players': [None for i in range(num_players)]
    }
