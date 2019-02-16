# Web Platform Analyse
[Go to General Analysis](../../analysis#web-platform)

## Functionality
#### Front-End
Angular 7 Dashboard

#### Back-End
NodeJS + Express Server

#### Database
PostgreSQL

## API (non-final)
#### Base URL
```<Cluster_Master_IP>/api/v1/```

### Get Data
#### Get a list of Nodes in a cluster
```GET /nodes```

#### Get a list of sensors in a node
```GET /<nodeID>/sensors```

#### Get a list of data from a specific sensor
```GET /<nodeID>/sensor/<sensorID>/<amount>```

#### Get a list of images in a node
```GET /<nodeID>/images/<amount>```

#### Get a list of plants in a node
```GET /<nodeID>/plants```

### Add Data
#### Add sensor data snapshot
```POST /<nodeID>/sensor/<sensorID>```

#### Add an image
```GET /<nodeID>/image```

## Mockups
> TODO: ADD