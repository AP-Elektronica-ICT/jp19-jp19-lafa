# Web Platform Analyse

[Go to General Analysis](../../analysis#web-platform)

## Functionality

### Front-End

Angular 7 Dashboard

#### Back-End

NodeJS + Express Server

#### Database

PostgreSQL

## API (non-final)

### Base URL

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

All Mockups from AP-Elektronica-ICT/iot18-lf1. All rights reserved by Melvin Bootsgezel.

### Nodes Overview

![Mockup](https://raw.githubusercontent.com/AP-Elektronica-ICT/iot18-lf1/master/doc/img/mockups/my_labfarm_mockup.png)

### Node Sensor Data

![Mockup](https://raw.githubusercontent.com/AP-Elektronica-ICT/iot18-lf1/master/doc/img/mockups/labfarm_overview_mockup.png)

### Node Image Data

![Mockup](https://raw.githubusercontent.com/AP-Elektronica-ICT/iot18-lf1/master/doc/img/mockups/picture_overview_mockup.png)