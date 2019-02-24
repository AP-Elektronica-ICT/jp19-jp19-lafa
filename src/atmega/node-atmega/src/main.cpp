#include <Arduino.h>
#include <Wire.h>

// TODO : start I²C communication with each sensor (master)
// TODO : start I²C communication with RPi (slave)
// TODO : Control lights
// TODO : Control pumps

int x = 0;

// function that executes whenever data is requested by master
// this function is registered as an event, see setup()
void requestEvent() {
  Wire.write("X value is ");
  char cstr[16];
  itoa(x, cstr, 10);
  Wire.write(cstr); 
  x++;
}

void setup() {
  Wire.begin(10); // join i2c bus (address optional for master)
  Wire.onRequest(requestEvent); // register event
}

void loop() {
  delay(100);
}