# Actuator Analyse

[Go to General Analysis](../../analysis#actuators)

Er worden meerdere opties van componenten gegeven. Hieruit kan later gekozen worden.

## Parts

### 42BYGHM809 - Stepper motor

* Two phase
* Step angle: 0.9°
* Voltage: 3.06V
* Current/phase: 1.7A
* Resistance/phase: 1.8 Ohm
* Inductance/phase: 2.8mH
* Holding torque: 48Ncm min
* Detent torque: 2.2Ncm max

### Jk35hy26-0284 - NEMA14 Stepper motor

* Two phase
* Step angle: 1.8°
* Voltage: 7.28V
* Current/phase: 280mA
* Resistance/phase: 26 Ohm
* Inductance/phase: 27mH
* Holding torque: 700gcm min
* Detent torque: 60gcm max

### A3967 - Stappenmotor driver

* Werd vorig jaar gebruikt bij iot18-lf1
* Minimum operating voltage: 4.75V
* Maximum operating voltage: 30V
* Continuous current per phase: ±750mA
* Maximum current per phase: ±850mA
* Minimum logic voltage: 3.0V
* Maximum logic voltage: 5.5V
* Microstep resolutions: full, 1/2, 1/4 and 1/8

### DRV8825 - Stappenmotor driver

* DRV8825 heeft de breedste stroom en spannings mogelijkheden van de DRV88xx reeks. Goedkopere variaties met smallere variatie zijn mogelijk.
* Minimum operating voltage: 8.2V
* Maximum operating voltage: 45V
* Continuous current per phase: 1.5A
* Maximum current per phase: 2.2A
* Minimum logic voltage: 2.5V
* Maximum logic voltage: 5.25V
* Microstep resolutions: full, 1/2, 1/4, 1/8, 1/16, and 1/32

### Ledstrip verlichting

* LED style: SMD 5050
* Voltage: 12V DC
* Color: Red + Blue
* Beam angle: 180°
* IP rating: IP65

### Dimming verlichting

* Over het algemeen wordt gebruik gemaakt van een mosfet voor ledstrips te dimmen.
* https://learn.adafruit.com/rgb-led-strips/usage
* https://www.hackster.io/rafael-finkelstein/dimmable-arduino-led-strip-driver-e10bf6

### Peristaltic pump - Nutrient pump

* Flowrate: 2-100ml/min
* Voltage: 12V DC
* Current: 400mA

### Omron Solid state relay

* Controll voltage: 0-2.5V off, 3-5V on
* Controll current 160mA
* Voltage: 240V
* Current: 2A