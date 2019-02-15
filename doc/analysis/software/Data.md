# Data Analyse
[Go to General Analysis](../../analysis#data--data-storage)

## Database Interfaces
```typescript
interface FarmNode {
  _id: MongoID,
  identity: string,
  label: string,
  sensorData: SensorData[],
  imageData: ImageData[],
  plants: Plant[]
}
```
```typescript
interface SensorData {
  _id: MongoID,
  sensor: Sensor,
  value: number,
  time: Date
}
```
```typescript
interface Sensor {
  _id: MongoID,
  label: string,
  node: FarmNode
}
```
```typescript
interface ImageData {
  _id: MongoID,
  location: string,
  time: Date
}
```
```typescript
interface Plant {
  _id: MongoID,
  planted: Date,
  type: string,
  location: PlantLocation,
  state: PlantState
}
```
```typescript
interface PlantLocation {
  x: number,
  y: number
}
```
```typescript
enum PlantState {
  'seed',
  'child',
  'grown',
  'done'
}
```

## Storage Solution
> TODO: ADD