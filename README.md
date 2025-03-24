# TMD Silo Temperature Monitoring Frontend Application

## Overview
This is the TMD Silo Temperature Monitoring Frontend Application reconfigured as a work sample. It was originally created by myself and Tejas from Senseops Tech Solutions. This application was built from the ground up using Vite for enhanced performance and responsiveness. Since this is a work sample, all the functionality could not be reproduced due to NDAs.

This web app was required by Fowler Westrup to track the various grain storage silos throughout their manufacturing plants all over India.

**Link:** [https://tmd-vite.web.app](https://tmd-vite.web.app)

## Setup Instructions

### Prerequisites
- Node version 18 or higher

### To Run Locally
```
npm install
npm run dev
```

## Hardware Description
In each silo we have inserted multiple temperature probes and a singular humidity probe. Each temperature probe contains multiple temperature sensors to determine the accurate temperature at any given time. The humidity probe contains multiple sets of temperature and humidity sensors to determine the moisture content inside of the silo.

There is a weather station device which is kept outside the silo which contains a set of temperature and humidity sensors. There are 2 fans inside of each silo, a Roof Ventilation fan and an Aeration Fan. The objective of this application is to control the 2 fans manually and automatically based on the readings given from the temperature probes and humidity probes.

## Application Walkthrough

### 1. Login Screen
This is the login screen for the application. In production, Firebase credentials were used to authenticate the users but for this work sample you can just click login.

### 2. Dashboard
The Dashboard page contains 2 headers and then a card for each silo in a given plant. For this sample I have added 3 cards for 3 silos.

#### Header 1
This header contains the text "Silo Overview" in the left corner, the plant name in the middle and a person icon at the right corner. Upon clicking the icon a dropdown will open up showing 2 options: the email ID that was used to login and the logout icon which will redirect the user back to the login page.

#### Header 2
This header contains the weather station's humidity and temperature and the humidity value (anti-condensation) of the first sensor of the humidity probe at the left side and then four small clickable cards at the right side. The first card on the right side represents the USB connection i.e., if the device is connected or disconnected, next there are alarms, alerts and faults cards respectively which on clicking will open up a table with the alert description and the time when the alert was generated.

#### Cards
Each card has an outline of a silo and heatmap inside of it which upon hovering the mouse will render a tooltip with the latest temperature readings from inside the silo. Clicking the "View Details" button will direct the user to the Graphs Page.

### 3. Pages

#### a. Graphs
This page contains an image of the probes layout and a card containing the anti-condensation value, the relative humidity (WS humidity) value and the temperature value of the first sensor of the humidity probe. Below these 2 components there are 3 graphs which represent the temperature reading of the temperature probes which can be navigated with tabs:

- **Vertical Temperature Graph:** Temperature values on the y-axis and the probe names on the x-axis
- **Horizontal Temperature Graph:** Temperature values on the y-axis and the sensor names on the x-axis
- **Temperature Historian Graph:** Temperature values on the y-axis and the time on the x-axis. There is a dropdown on the top where the probe can be selected and each line on the graph represents a sensor

#### b. Probe Stats
This page is divided into 2 tabs "Temperature" and "Humidity":

- **Temperature:** This tab contains a tabular representation of the temperature values from the temperature probes
- **Humidity:** This tab contains a tabular representation of the temperature and moisture values from the singular humidity values

#### c. Parameters
This page contains 3 cards:

- **Grains:** This card has 5 editable textboxes and an "Add to Report" button at the bottom right side. Each of the textboxes must be filled before clicking the button
- **Alarms:** This card contains non-editable textboxes with values inside of them that determine when the alarms will be generated
- **Alerts:** This card contains non-editable textboxes with values inside of them that determine when the alerts will be generated

#### d. Calendar
This page contains a calendar where all the alerts and alarms can be viewed by navigating through different months.

#### e. Settings
This page contains many cards with textboxes inside of them:

##### i. Roof Ventilation Settings
- **Max Temp:** You have to enter the maximum temperature limit in Celsius
- **Max Hum:** You have to enter the maximum humidity limit in RH

##### ii. Grains Moisture Settings
- **Min Moist:** You have to enter the minimum moisture limit in RH
- **Max Moist:** You have to enter the maximum moisture limit in RH

##### iii. Aeration Fan Settings (Temperature)
- **Min Temp:** You have to enter the minimum temperature limit in Celsius
- **Max Temp:** You have to enter the maximum temperature limit in Celsius

##### iv. Aeration Fan Settings (Humidity)
- **Min Hum:** You have to enter the minimum humidity limit in RH
- **Max Hum:** You have to enter the maximum humidity limit in RH

##### v. Silo - 1 Controls
Here there is a switch that can be toggled to set it to either Auto mode or Manual. Right below that there are 2 buttons called "ON" and "OFF" which can be used to operate the fan when it is in manual mode. You can check the "FAN STATUS" if the fans are "ON" or "OFF".

### Fan Operation Description (This will not work in the work sample)

#### A. Roof Fan Operation Logic in AUTO MODE
In order to operate the roof fan from the UI you first need to add in all the value limits into the input fields in the Roof Ventilation Settings Card. Then if the "Anti Condensation" value (the 3rd value from the left in the 2nd header) or the "Top Temperature" from the "GRAPHS" Tab is above the Max Hum and Max Temp limits respectively or if both of them are above the limits set then the ROOF FAN will SWITCH ON and Remain ON.

The only time it will remain OFF is when both of them are below the limits set.

#### B. Aeration Fan Operation Logic in AUTO MODE
In order to operate the aeration fan from the UI you first need to add in the value limits into the input fields in both of the Aeration fan settings Cards.

If the weather station humidity value (the 1st value from the left in the 2nd header) is outside the range specified in the 2nd Aeration Fan Settings (humidity) card then the AERATION FAN will NOT SWITCH ON regardless of any other condition specified below.

If the weather station humidity value (the 1st value from the left in the 2nd header) is inside the range specified in the 2nd Aeration Fan Settings (humidity) card and if any one of the temperature probe sensor values that you can check in the "PROBE STATS" crosses the range set in the 1st Aeration Fan Settings (temperature) card then the AERATION FAN will SWITCH ON and Remain ON.

#### f. Report
This page contains 3 cards at the top and then 2 tables to check the temperature and humidity:

- **The first card** contains the grain details which can be entered on the "Parameters" page
- **The second card** contains the values with which alerts are created
- **The third card** contains a date selection component and a dropdown which contains all the times that the temperature and humidity were generated. When the user picks both the date and the time the tables will be populated with the respective data. There is a button at the bottom called "Download Report" which on clicking will download a PDF of the entire report page. (For the sample pick August 6, 2024 and any time in the dropdown)
- **Temperature stats:** This table contains all the temperature data from the temperature probes for that particular date and time
- **Humidity stats:** This table contains all the humidity data from the humidity probes for that particular date and time

#### g. Info
This page contains some useful information regarding the handling of the silo which was explicitly requested by the client.

#### h. Help
This page contains the contact details of the client.