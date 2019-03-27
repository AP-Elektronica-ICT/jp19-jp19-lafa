//https://www.instructables.com/id/How-to-use-a-Water-Level-Sensor-Arduino-Tutorial/

#include <Wire.h>

#include <arduino.h>

int level;

void setup(){
  Serial.begin(9600);
  Wire.begin();
  Serial.prinln("Setup completed");
}

void loop(){
  Wire.requestFrom(6,1);
  if(Wire.available){
    level = Wire.read();
    Serial.println(level);
  }
  switch(level){
    case 480:
        Serial.println("waterlevel: 0mm");
      break;
    case 530:
        Serial.println("waterlevel: 5mm");
      break;
    case 615:
    
        Serial.println("waterlevel: 10mm");
      break;
    case 660:
        Serial.println("waterlevel: 15mm");
      break;
    case 680:
        Serial.println("waterlevel: 20mm");
      break;
    case 690:
        Serial.println("waterlevel: 25mm");
      break;
    case 700:
        Serial.println("waterlevel: 30mm");
      break;
    case 705:
        Serial.println("waterlevel: 35mm");
      break;
    case 710:
        Serial.println("waterlevel: 40mm");
      break;
  }
  delay(500);
}

