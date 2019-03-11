/*
Flow controller
Recieve 3 chars via wire (currently on channel 0)
These 3 chars get stored in an array and converted to a int before analogWriting it to pin 1
It has to recieve 3 chars otherwise it will be out of sync with the incomming data. (Eg: "236", "133", "053", "009")
*/

#include <TinyWire.h>
#include <twi.h>

char recievedWire[] = {0,0,0};
int recievedValue;

void setup() {
  pinMode(1, OUTPUT);
  TinyWire.begin(0);
  TinyWire.onReceive(recieveEvent);
}

void loop() {
  delay(1);
}

void recieveEvent(){
  if(TinyWire.available() >= 3){
    for(int i = 0; i < 3; i++){
      recievedWire[i] = TinyWire.read();
    }
    recievedValue = atoi(recievedWire);
    analogWrite(1, recievedValue);
  }
}

