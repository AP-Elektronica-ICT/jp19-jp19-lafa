#  Web Server

To run:

``` docker-compose up --build ```

## API (v0a)
*Version 0 Alfa*

Base URL: ```http://URL:3000/api/v0a/```

### Get all nodes in a cluster
```GET /nodes/```

Params:\
``id``: Unique id of the node \

Response: 
```js
[
  {
    "id": 1,                                  // Unique ID
    "label": "Some Node Name",                // Node Name
    "creation": "2019-02-24T16:12:36.370Z"    // Time of creation
  }
]
```

### vGet all sensors in a node
```GET /nodes/<id>/sensors/```

Response: 
```js
[
  {
    "id": 1,                    // Unique ID
    "parent": 1,                // Parent Node ID
    "label": "Test Sensor",     // Sensor Name
    "type": "Temperature",      // Sensor Type
    "min": 0,                   // Minimum Value
    "max": 100                  // Maximum Value
  }
]
```

### Get all reading from a sensor (newest first)
```GET /sensors/<id>/<limit?>/```

Params:\
``id``: Unique id of the sensor \
``limit``: Limit of responses (optional)

Response: 
```js
[
  {
    "id": 1,                              // Unique ID
    "parent": 1,                          // Sensor ID
    "value": 2.3,                         // Sensor Value
    "time": "2019-02-24T16:01:16.794Z"    // Time
  }
]
```

### Add a node to a cluster
```POST /nodes/```

Body: 
```js
{
  "label": "Some Node Name",  // Node Name
}
```

### Add a sensor to a node
```POST /sensors/```

Body: 
```js
{
  "parent": 1,                // Parent Node ID
  "label": "Test Sensor",     // Sensor Name
  "type": "Temperature",      // Sensor Type
  "min": 0,                   // Minimum Value
  "max": 100                  // Maximum Value
}
```

### Add a sensor to a node
```POST /sensors/<id>/data/```

Params:\
``id``: Unique id of the sensor

Body: 
```js
{
  "parent": 1,    // Sensor ID
  "value": 2.3,   // Sensor Value
}
```