# Context Manager for SitOpt

Server which serves as abstraction layer to unify sensor access.
The context manager receives and persists sensor data from physical and virtual data sources such as sensors or services.

All context information is persisted and can be retrieved via a RESTful API.
Sensor data which is pushed to the context manager will be forwarded via pub/sub queues so that the situation detection
 instances can immediately consume context entities that they are interested in.

The context manager serves as a replacement for [RMP](https://github.com/mormulms/SitOPT/tree/master/RMP) which only
supports polling for data.


## Installation

- install Node.js 4 or 5 (installation via NVM recommended)
- install RabbitMQ
- run npm install
- run npm start to start the api server


## Configuration

Deployment specific settings can be provided with environment variables or via json files.
See `config/appConfig.js` for available properties and defaults.