#include <twi.h>
#include <TinyWire.h>
#include <arduino.h>

int level;

void setup(){
  TinyWire.begin(6);
  TinyWire.onRequest(measureWaterlevel);
  pinMode(3,INPUT);
}

void loop(){
  level = analogRead(3);
}

void measureWaterlevel(){
  TinyWire.write(level);
}
