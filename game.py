import random

LOCATION_TYPES = ['CAR', 'BIKE', 'EXIT']
X_BOUNDS = [-100.0, 100.0]
Y_BOUNDS = [-50.0, 50.0]


def add_user(user):
    pass


def new_game(num_players=3, num_locations=5):
    players = []
    for i in range(num_players):
        players.append({
            "position": {
                "x": random.random() * (X_BOUNDS[1] - X_BOUNDS[0]) + X_BOUNDS[0],
                "y": random.random() * (Y_BOUNDS[1] - Y_BOUNDS[0]) + Y_BOUNDS[0]
            }
        })

    return {
        'players': [None for i in range(num_players)]
    }


mock_server_output = {
    "players": [
        {
            "username": "Chris Ostrouchov",
            "uid": "1234",
            "position": {"x": -110.4140625, "y": 30.2578125},
            "image": "/data/icons/player1.png",
            "transportation": "WALK",
            "path": None
        },
        {
            "username": "Tyler Whittin",
            "uid": "1432",
            "position": {"x": -120.4140625, "y": 50.2578125},
            "image": "/data/icons/player3.png",
            "transportation": "WALK",
            "path": None
        },
        {
            "username": 'Anonymous Coward',
            "uid": "asdf",
            "position": {"x": 10.00, "y": -10.2578125},
            "image": "/data/icons/player2.png",
            "transportation": "BIKE",
            "path": None
        },
        {
            "username": 'Bob',
            "uid": "zxcv",
            "position": {"x": -90.4140625, "y": -50.2578125},
            "image": "/data/icons/player5.png",
            "transportation": "CAR",
            "path": None
        },
        {
            "username": 'costrouc',
            "uid": "qwer",
            "position": {"x": 70.4140625, "y": 2.2578125},
            "image": "/data/icons/player4.png",
            "transportation": "WALK",
            "path": None
        }
    ],
    "locations": [
        {
            "position": {"x": 30.4140625, "y": 100.2578125},
            "type": "CAR",
            "image": "/data/icons/location1.png"
        },
        {
            "position": {"x": 50.4140625, "y": 0.2578125},
            "type": "CAR",
            "image": "/data/icons/location1.png"
        },
        {
            "position": {"x": -10.4140625, "y": -50.2578125},
            "type": "EXIT",
            "image": "/data/icons/destination.png"
        },
        {
            "position": {"x": 20.4140625, "y": 10.2578125},
            "type": "BIKE",
            "image": "/data/icons/location2.png"
        }
    ],
    "options": [
        "Option 1", "Option 2", "Option 3", "Option 4", "Option 5"
    ],
    "events": [
        "You got Polio!", "You won..."
    ],
    "paths": [None, None, None, None, None]
}
