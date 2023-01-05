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
