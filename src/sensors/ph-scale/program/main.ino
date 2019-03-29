#include <TinyWire.h>
#include <twi.h>
#include<Arduino.h>

#define phPin 3

int buf[10], tmp;
long int avgValue;
float phValue;

void setup() {
  pinMode(phPin, INPUT);
  TinyWire.begin(4);
  TinyWire.onRequest(measureAveragePH);
}

void measureAveragePH(){
  TinyWire.write(phValue);
}

void loop() {
  for(int i=0;i<10;i++) 
 { 
  buf[i]=analogRead(phPin);
  delay(10);
 }
 for(int i=0;i<9;i++)
 {
  for(int j=i+1;j<10;j++)
  {
   if(buf[i]>buf[j])
   {
    tmp=buf[i];
    buf[i]=buf[j];
    buf[j]=tmp;
   }
  }
 }
 avgValue=0;
 for(int i=2;i<8;i++)
 avgValue+=buf[i];
 float pHVol=(float)avgValue*5.0/1024/6;
 phValue = -5.70 * pHVol + 21.34;
}
