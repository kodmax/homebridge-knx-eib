# Supported HomeKit Services

## Lightbulb, Outlet, Switch

### KNX Groups Addresses
|No|Characteristic|Function|Format|Notes|
|--|--------------|--------|------|-----|
|1 |On|Set|B1||
|2 |On|Get|B1|Optional. State is read from the first datapoint if this one is empty|


## Fan v2

### KNX Groups Addresses
|No|Characteristic|Function|Format|Notes|
|--|--------------|--------|------|-----|
|1 |Active|Set|B1||
|2 |Active|Get|B1|Optional. State is read from the first datapoint if this one is empty|


## CO<sub>2</sub> Sensor

### KNX Groups Addresses
|No|Characteristic|Function|Format|Notes|
|--|--------------|--------|------|-----|
|1 |CarbonDioxideDetected|Get|B1||
|2 |CarbonDioxideLevel|Get|F16|Optional|


## Humidity Sensor

### KNX Groups Addresses
|No|Characteristic|Function|Format|Notes|
|--|--------------|--------|------|-----|
|1 |CurrentRelativeHumidity|Get|F16||
|2 |CurrentRelativeHumidity|Get|F32|Use with Tasmota KNX. Reads the value from F32 format.|


## Temperature Sensor

### KNX Groups Addresses
|No|Characteristic|Function|Format|Notes|
|--|--------------|--------|------|-----|
|1 |CurrentTemperature|Get|F16||


## Thermostat

### KNX Groups Addresses
|No|Characteristic|Function|Format|Notes|
|--|--------------|--------|------|-----|
|1 |TargetTemperature|Get|F16||
|2 |TargetTemperature|Set|F16||
|3 |CurrentTemperature|Get|F16||
|4 |CurrentHeatingCoolingState|Get|B1|Optional. Heating status indication|
|5 |CurrentHeatingCoolingState|Get|B1|Optional. Cooling status indication|

# Plugin Configuration
## Gateway speed
### Timeout errors
If you see timeouts errors in the log, try lowering the telegram rate. KNX IP Gateways accept very limited number of telegrams per second.
With a large number of devices and slow telegram rate it may take a few seconds for all the devices statuses to get updated. Reading timeout may need to be increased.
### Plugin is slowing down Homebridge
Because KNX IP Gateway and the KNX Protocol have limited speed, the time it takes to read all devices may be considered slow. Use the plugin in bridge mode (wrench key icon) to avoid affecting other plugins. Read more at [https://github.com/homebridge/homebridge/wiki/Child-Bridges]
