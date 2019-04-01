/*
Flow controller
Recieve 3 chars via wire (currently on channel 21)
These 3 chars get stored in an array and converted to a int before analogWriting it to pin 1
It has to recieve 3 chars otherwise it will be out of sync with the incomming data. (Eg: "236", "133", "053", "009")
If there is a 3ms second delay between expected bytes it will dropp all previous recieved bytes
*/

#include <TinyWire.h>
#include <twi.h>

char recievedWire[] = {0,0,0};
int recievedBytes = 0;
int recievedValue = 0;

long recieveTime = 0;
long currentTime = millis();

void setup() {
  pinMode(1, OUTPUT);
  TinyWire.begin(21);

}

void loop() {
  if(TinyWire.available() >= 1){
    recievedWire[recievedBytes] = TinyWire.read();
    recievedBytes++;
    recieveTime = millis();
  }
  
  currentTime = millis();
  if(currentTime >= recieveTime + 3){
    recievedBytes = 0;
  }
  
  if(recievedBytes == 3){
    recievedValue = atoi(recievedWire);
    analogWrite(1, recievedValue);
    recievedBytes = 0;
  }
}
