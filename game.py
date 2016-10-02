from config import token

import requests

import random
import uuid
import copy


def get_route(start, end):
    url = "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
    stops = '%f,%f;%f,%f' % (start['x'], start['y'], end['x'], end['y'])
    params = {
        'f': 'json',
        'token': token,
        'stops': stops
    }
    resp = requests.get(url, params=params)
    data = resp.json()
    if data.get('error'):
        return None
    return data['routes']['features'][0]['geometry']['paths'][0]


def gen_random_position(x_bounds, y_bounds):
    return {
        "x": random.random() * (x_bounds[1] - x_bounds[0]) + x_bounds[0],
        "y": random.random() * (y_bounds[1] - y_bounds[0]) + y_bounds[0]
    }


class Game:
    MAX_PLAYERS = 1
    MAX_LOCATIONS = 5
    NAMES = ['Max', 'Bob', 'Scott', 'Mike', 'Chris', 'Arnold']

    LOCATION_TYPES = ['CAR', 'BIKE', 'EXIT']
    X_BOUNDS = [-84.35, -83.52]
    Y_BOUNDS = [34.32, 35.78]

    def __init__(self):
        self.players = []
        self.locations = []
        self.player_choices = []
        self.player_read_state = [False for i in range(self.MAX_PLAYERS)]
        self.init_locations()

    def init_locations(self):
        for i in range(self.MAX_LOCATIONS):
            location_type = random.choice(self.LOCATION_TYPES[:-1])
            type_index = self.LOCATION_TYPES.index(location_type) + 1
            self.locations.append({
                'position': gen_random_position(self.X_BOUNDS, self.Y_BOUNDS),
                'type': location_type,
                'image': '/data/icons/location' + str(type_index) + '.png'
            })
        self.locations.append({
            'position': gen_random_position(self.X_BOUNDS, self.Y_BOUNDS),
            'type': self.LOCATION_TYPES[-1],
            'image': '/data/icons/destination.png'
        })

    def reset(self):
        self.players = []

    def add_player(self, user):
        """ /signup

        """
        if len(self.players) == self.MAX_PLAYERS:
            return None

        if user['username'] == '':
            user['username'] = random.choice(self.NAMES)

        if user['icon'] == '':
            user['icon'] = 3

        user.update({
            'uid': str(uuid.uuid4()),
            'position': gen_random_position(self.X_BOUNDS, self.Y_BOUNDS),
            'image': '/data/icons/player' + str(user['icon']) + '.png',
            'transportation': 'WALK',
            'path': None
        })

        self.players.append(copy.deepcopy(user))
        print(self.players)
        return user

    def submit_player_action(self, choice):
        # Check if player has already submitted
        if choice['uid'] in [c['uid'] for c in self.player_choices]:
            return None

        self.player_choices.append(choice)
        print(self.player_choices)

        # Do if all the players have submitted actions
        if len(self.player_choices) == self.MAX_PLAYERS:
            self.calculate_next_step()

    def get_player(self, uid):
        print('getting player')
        for player in self.players:
            if player['uid'] == uid:
                return player
        return None

    def calculate_next_step(self):
        print('calculating next steps')
        for choice in self.player_choices:
            player = self.get_player(choice['uid'])
            route = get_route(player['position'], choice['target'])
            player['route'] = route
            # TODO calculate distance traveled
            player['position'] = {'x': route[-1][0], 'y': route[-1][1]}
        # Do api calls determine what each person so do next
        # Update all player positions
        self.player_choices = []
        self.player_read_state = [True for i in range(self.MAX_PLAYERS)]

    def get_player_options(self, uid):
        return ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"]

    def get_player_events(self, uid):
        return ["You got Polio!", "You won..."]

    def next_state_ready(self, uid):
        # if not all user have submited next step is not ready
        if len(self.players) != self.MAX_PLAYERS:
            return False

        # check if user has already checked their state if not say they are ready
        return self.player_read_state[[p['uid'] for p in self.players].index(uid)]

    def get_state(self, uid):
        """ /gamenext

        """
        if len(self.players) != self.MAX_PLAYERS:
            return None

        self.player_read_state[[p['uid'] for p in self.players].index(uid)] = False

        return {
            "players": self.players,
            "locations": self.locations,
            "options": [self.get_player_options(player['uid']) for player in self.players],
            "events": [self.get_player_events(player['uid']) for player in self.players]
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

    ],
    "paths": [None, None, None, None, None]
}
