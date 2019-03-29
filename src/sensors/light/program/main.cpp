#include <Arduino.h>
#include <twi.h>
#define LDR 3
#include <TinyWire.h>

void sendValue(){
  TinyWire.write(analogRead(LDR)/4);
}

void setup() {
  TinyWire.begin(8);
  TinyWire.onRequest(sendValue);
}

void loop() {}