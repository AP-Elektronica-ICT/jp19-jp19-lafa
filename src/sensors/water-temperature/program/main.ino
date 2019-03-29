#include <DallasTemperature.h>
#include <OneWire.h>

// Data wire is plugged into pin 2 on the Arduino
#define ONE_WIRE_BUS 8
// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);
// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);

void setup(void)
{
  Serial.begin(9600); //Begin serial communication
  sensors.begin();
  Serial.println("Setup Completed");
}

void loop(void)
{
  sensors.requestTemperatures();  
  Serial.print("Temperature is: ");
  Serial.println(sensors.getTempCByIndex(0));
  delay(1000);
}
