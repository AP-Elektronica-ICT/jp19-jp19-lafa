/*
This is a dummy master program for the ATmega.
It recieves chars via Serial and forewards them to the slave with Wire over channel 0
*/

#include <Wire.h>

char recievedChar;

void setup() {
  Wire.begin();
  Serial.begin(9600);
}

void loop() {
  if(Serial.available() > 0){
    recievedChar = Serial.read();
    Wire.beginTransmission(0);
    Wire.write(recievedChar);
    Wire.endTransmission();
  }
}
