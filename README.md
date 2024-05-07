# Sovellusohjelmointi 3 lopputyö

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


 npx eas-cli build --profile preview