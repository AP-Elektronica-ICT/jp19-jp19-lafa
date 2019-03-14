#include <Arduino.h>
#include <Wire.h>

//Don't forget when wiring multiple devices using I2C do't forget to connect their grounds

// TODO : start I²C communication with each sensor (master)
// TODO : Control lights
// TODO : Control pumps

int x = 0;

// function that executes whenever data is requested by master
// this function is registered as an event, see setup()
void requestEvent() {
  Serial.println("Request");
  Wire.write("X value is ");
  char cstr[16];
  itoa(x, cstr, 10);
  Wire.write(cstr); 
  x++;
}

// send an array of bytes to the specified I2C address
void send(uint8_t attiny, uint8_t arr[], int size){
    /*Wire.beginTransmission(0);*/
    Serial.println("Receiving");
    Serial.println(attiny);
    for(int i = 0; i < size; i++)
    {
      Serial.println(arr[i]);
    }
    /*Wire.endTransmission();  */
}

// receive data from RPI usefull to relay towards attiny
// notation n-d where n is a byte indicating the attiny i2c address to send to and d is a byte array indicating the data
void receiveEvent(){
  Serial.println("Receiving");
  byte attiny = 0;
  byte arr[] = {0,0,0};
  while(Wire.available() > 0){
    attiny= Wire.read();
    arr[0]=Wire.read();
    arr[1]=Wire.read();
    arr[2]=Wire.read();
  }
  send(attiny, arr, 3);
}

void setup() {
  Wire.begin(10); // join i2c bus (address optional for master)
  Wire.onRequest(requestEvent); // register event
  Wire.onReceive(receiveEvent);
  Serial.begin(9600);
}

void requestLight(){

}

void loop() {
  delay(100);
}