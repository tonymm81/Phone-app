# Phone app

## version 100
- Starting to do github some projects and issues. I organize the issues to milestones and next thing is starting to build an base of app.
- I am going to use react native framework and i am planning to do 3 different app inside of app.
- I have to figure out the navigation, how to make that.


## version 101
- navigation between components is working. I also made components where is some text to test navigation. I make the navigation with if clauses.
- Issue 1,3,4,5,6 is now complete and lets move to next step.
### Bug:
- Graphics are quite awfull but raw beta application still.
- Missing features
- Missing colors and photos

## version 102
- forecast view is not yet ready. I have to come back to this issue.
- i add some styles to menu and i notice that i have to build databases and use context first, and then i can continue developoing programs features.


## version 103
- I made the JustApp context. There all datahandling happens and there is database and apicalls also. I also plan that we cvan get the forecast based on devices location. I am not sure if the weatherapi allows that.
- Now getting forecast and saving that to database works fine, and i also made some graphics to forecast.

### bug:
- forecast view time stamp wont show correct.(fixed)
- menu item is too small.(fixed)


## version 104
- Added the dialog to the forecast app. There user can search with keyword the city. I also add some buttons in forecast view.
- forecast view delay bug fixed. Next thing to do is make a gps coondinates search function in context file.
- Now user can search forecast by phone coordinates and search word.
- If we have some time, we could make error handling to forecast.

### bug:
- Usestate delay is teasing again. Figure out how to deal it. (fixed)


## version 105
- lets start to build issue11 camera app.
- Needed camera app functions made to context. Camera gives some error but i dont know why. I delete all graphics components from camera and paste those back, it start working.
- I make a dialog what opens after taking thee photo. Then user can add photo headline and photo text. Data and photos are saved to database.

- Next plan is loop out photos from database.

## version 106
- Starting to make photoapp graphics. There is still missing some list view and photoview and buttons. 
- Now the photo view is working. Delete feature has to make to app.
- photo app is ready now. User can take a photo, and name and imagetext tophoto and also user can delete photo. App shows the location of taken photo and time also, when photo is taken.

### bug : (make issue later if time left)
- Still getting warning two children have the same id
- when taking first picture, the screen is empty but after first image app works really fine.
- this camera app have the bug, when the first time load seems to be empty.


## version 107
- I make the startpage. Just adding some images and show what kind of applications this program keeps inside.

## version 108

- start to make gps app. Lets work on issue 10.
- i made the gps component but still missing features a lot.
- app is now taking the speed from gps and lan and lot values and calculate the distance from start. It also calculate the average speed.

- I have to make a function what controls if the device is too long at the same location it stops the tracking.
- I have to also make database save function, what saves data if the user wants so.
- I try to avoid setState delay and i make the useeffect to context, what try to load database values ready when program is started.

## version 109
- starting to work with issue 25. Lets do the gps tracker app propeties.
- Gps tracker is ready now, so in the nature we have to test, if it calculate correctly


## version 110
- First build version didnt work so vell. Forecast wasnt working at all and it because the apikey didnt go to builded version
- second fault was that gps tracker didnt count anything so lets fix this first.

- report: some how trhe usecontext location didn,t update. So i move the function to Tracker app and it starts to work. - I also add secret key to expos website so the forecast should work now.

Gps is working now and it is calculating the distance between start and end of excercise. Forecast apikey doesnt work but i think that inb local machine this is fine.

 npx eas-cli build --profile preview
 ## version 111
 - I just started to update my react-native app and it wont be easy because there was update in sdk version. 
 - That caused a database error, because the database syntax was changed in expo sq-lite. And also Camera module have changed.
 - I found the workin version of how to insert into daabase some values, but it gives error from missin unique ke and i have in database id autoincrement value for id.
 - Now the photos app is working fine and it saves to database, after i change all the database handling srcipt. But in forecast app, it gives error to wrong api key. Now i have to figure out, what is broken now.

 - Finally, this is working now. Update causes a lot of work, but now its working. Lets plan wlan devices controller to this phone app. I have to handle python scripts from typescript.

 ## version 112
 - I started to do wlan devices controller but its little bit difficult to excecute the python script from typescript. React native downt have any working solution about this ,so i have to plan this littlebit.

 - Now I am testing the mqtt library.  In React typescript we need to communicate with websocket. I made tha table project also flask server, what should take the mqtt messages and send back responce.
 - There is major problem related of connect to that python flask server and it requires also websocket listener to rasbperry pi. I have opened the firewall ports and still not getting connection to raspberry pi. Perhaps the
 port is really not visible.

 - I give up with mqtt. It doesnt work. Every time when phone or desktop test app tryis to connect flask server it gives 192.168.68.126 - - [01/May/2025 17:20:08] "GET //ws:5000/mqtt HTTP/1.1" 404 356 0.002189.

 - I have to think some another communicating method. Perhaps return to https request or bluetooth, i dont know..

 ## version 113

 - Next I try to create nginx server to raspberry pi and I use the https routing with certificates. But no hope to connect rasbperry pi, what is same network. I tested that curl -k https://192.168.68.201:5000/data command works fine in computers terminal or phones termilan. Both request goes correct but react native expo blocks some how this connection, and it just wont work. When I try to connect from expo, it give network error. No matter if you build the phone applicalion or not. Not working.
 