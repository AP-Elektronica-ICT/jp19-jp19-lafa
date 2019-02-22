#include <Arduino.h>

#define triggerPin 9
#define echoPin 10
int duration, distance;

void setup() {
  Serial.begin(9600);
  //Pin D9 as output
  DDRB |= (1 << PB1);
  //Pin D10 as input
  DDRB |= ~(1 << PB2);

  Serial.println("Setup completed");
}

void loop() {
  //Clear triggerPin
  PORTB |= ~( 1 << PB1);
  delayMicroseconds(2);
  
  //Toggle triggerPin for 10µs
  delayMicroseconds(10);
  PORTB ^= ( 1 << PB1);

  //Read echo pin
  duration = pulseIn(echoPin, HIGH);

  //Calculate distance
  distance = duration * 0.034 / 2; 
  delay(1500);   
  if(distance == 0)
    return;
    
    Serial.print("distance = ");
    Serial.println(distance);
}