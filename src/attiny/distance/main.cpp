#include <Arduino.h>
#include <TinyWire.h>

#define triggerPin 3
#define echoPin 4
int duration, distance;

void MeasureDistance(){
//Clear triggerPin
  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
  
  //Toggle triggerPin for 10µs
  delayMicroseconds(10);
  digitalWrite(triggerPin, HIGH);

  //Read echo pin
  duration = pulseIn(echoPin, HIGH);

  //Calculate distance
  distance = duration * 0.034 / 2; 
  delay(1500);
  if(distance == 0)
    return;
    TinyWire.write(distance);
}

void setup() {
   pinMode(triggerPin, OUTPUT);
  pinMode(echoPin, INPUT);
  TinyWire.begin(7);
  TinyWire.onRequest(MeasureDistance);
}

void loop(){}
