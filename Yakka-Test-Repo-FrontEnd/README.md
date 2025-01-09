# YAKKA

Welcome to the YAKKA app.

---

## Setting up a dev environment

Once you have cloned this repository to run the code locally and see your changes live, you will have to undertake a few steps:

**Step 1 - Installing dependencies**

Type into the commandline for this project

    yarn

This will install the react native framework and all libraries associated with it. If you do not have yarn set up on your computer, follow these docs https://yarnpkg.com/getting-started/install.

To do that you will need Node.js installed, if you don't have that set up on your computer here's a link to the download page https://nodejs.org/en/download. The download wizard should be enough to get it running as required.

**Step 2 - Getting the project on a phone**

Now you have installed React Native and all our dependencies by running the `yarn` command. We need to consider how to run the app.

**Step 2a - Downloading a dev-client build to run the project**

Navigate to https://expo.dev and login. Find the app build you want on the relevant platform and download it, make sure the build says dev-client/development client somewhere. This will be displayed in a long list of actions undertaken on Expo, like updates, store submissions and build creations. You want to make sure you select a "build created" item in the list, and press download on the page it takes you to.

You can download the app straight from the site onto your phone on android. Builds go out of date in 3 months, so if there are no downloadable builds, proceed to step 2b. I can't be bothered to describe the ios process of authing someone, as I cannot remember it right now. Ask Louis Gardner, lous@carboncode.uk for details.

**Step 2b - Creating a dev-client build to run the project**

First run either of these two lines to install the commandline interface for Expo's Application Service's (EAS-CLI) so we can create a build with expo.

- `npm install -g eas-cli` - (Installs it globally on your computer)
- `npx install eas-cli@latest` - (Installs it for just this project)

Then login to expo through the newly installed EAS-CLI

- `eas login`

or

- `npx eas login` if not installed globally

Then we create a development build

<italic>This example is specifically for android as shown in eas.json. Read more about the eas.json in the Expo & Expo Application Services section in project structure below.</italic>

      eas build --platform android --profile dev-client
      npx eas build --platform android --profile dev-client

This will create a new build for you, that you will be able to see after logging into https://expo.dev.

Log into https://expo.dev on an android device and download the app as in **Step 2a**.

**Step 3 - Hosting the project**

Run the local build, from the project's terminal.

      npx expo start --dev-client

Open the newly downloaded dev-client app, and scan the qr code the terminal outputs. You can also type in the link the QR code represents that is also outputted in the terminal. The QR code often doesn't open the dev-client for whatever reason, so typing the link can be a tedious and necessary step.

Alternatively you can login to Expo on the dev-client build, by clicking the user icon in the top right. If you're logged into the same account, "sometimes" the link to the locally hosted app will show up. It's always meant to, but it does like to simply, not.

If you're in an office with shared wi-fi this may not work, as the wi-fi is horrible. First try

      npx expo start --tunnel

This will create a link not tied to the network using ngrok. If you want to share a hosted app live to someone far away, this is how you do it btw (more on ngrok - https://ngrok.com/).

If this doesn't work due to the offices restrictions or unknown reasons, instead turn a mobile hot-spot on using your laptop. Connect your phone to that hotspot `expo start` or `expo start --tunnel` should work.

**Step 4 - Dev tools when running**

Once it loads and doesn't have a network error, congratulations. You shake your phone to bring up the dev menu, for inspect element, or turning hot-refresh on or off.
Do not turn on debugging mode unless you want the app to run at 1fps. We simply don't use it as we can get logs in the terminal anyway.

**Step 5 - Running the api locally**

If hosting the api locally rather than on the testing or live urls you will need to change the app. Simply go to the config.ts file in this project, replace the value of the baseUrl with your own ipv4 address, in the following format:
http://192.168.1.000:4000/api/ (so `http://[youripv4]:4000/api/`, simply run `ipconfig` in the commandline to get your ipv4). Once again, consider using hotspots and ngrok if the office doesn't allow this.

## Code Structure

The app repository should be structured something like this:

```
YAKKA
├── assets
├── src
│   ├── components
│   ├── constants
│   ├── contexts
│   ├── hooks
│   ├── navigation
│   ├── screens
│   ├── store
│   ├── utils
│   └── GlobalErrorRef.js
├── .env
├── App.js
├── app.json
├── babel.config.js
├── eas.json
├── google-services.json
├── GoogleService-Info.plist
├── index.js
├── metro.config.js
├── package.json
└── yarn.lock
```

### Assets

You'll find all the assets that are stored locally for the Yakka app, whether they be fonts or images, in this folder-

```
/assets
```

### ./src directory

The `src` directory is where we keep the bulk of the code.
The inside of the src directory should look like the following:

```
src
│── components
    │── defaults
    │── essentials
    └── specifics
│── constants
│──  contexts
│──  hooks
│──  navigation
│──  screens
│──  store
│──  utils
└── GlobalErrorRef.js
```

**/components**
This is where the jsx components live. These components will be categorised into 3 seperate folders.

1. **/defaults**
   The smallest components in the app. These are things like Modal, Text & Button, they will be used throughout other larger components.

2. **/generics**
   This is where components that are used app-wide are stored, but are too specific to be mistaken for a default jsx component.

3. **/specifics**
   This is where components specific to a page or group of pages are stored. Inside this folder there will be sub-folders named accordingly after the screen or screens where the component is used.

**/constants**
This is where we keep simple constant variables, like colours, global styles and links.

**/models**
This is where the app's types are declared. Related types are put in the same file.

**/hooks**
This is where the react-hooks are kept.

**/navigation**
This is where the 'react-navigation' navigators are kept. In the navigation.props file in this folder you will find the types that each page needs.

**/screen**
This is where the screen components live. The screens are React components which take up the entire screen and are part of the navigation hierarchy. Like the `/components` directory, screens are collected inside sub-folders with other related screens.

**/utils**
Services that interface with the outside world live here (REST APIs, Push Notifications, etc.). As well as other miscellaneous helpers and utilities.

**GlobalErrorRef.js**
File that deals with global errors like loss of connection etc..

### Node Modules

In the directory when we typed `yarn` into the cli we generated the node modules. These include the React Native framework and and any libraries we will need. We can do this thanks these two files in the top level-

```
/package.json
[...]
/yarn.lock
```

### Expo & Expo Application Services

We use something called **Expo**. Expo is an open-source framework for apps that run natively on Android, iOS, and the web. Although we use it only for Android & iOS.
Expo takes web conveniences and brings them to mobile enabling many important features for us such as live updates, instantly sharing the app and deploying to the app/google play store.

Usually you can download the Expo Go app, and simply run `npx expo start` in the commandline for expo projects like this one. You'll be provided with a QR code which you can scan in the app, immediately getting you startedwith hot refreshes live on your phone.

Unfortunately, this is not the case for this project. Expo Go is limited in that it doesn't support native packages e.g. if I want the native android and ios calendars to show up, Expo Go won't be able to handle it.
It also requires more work when dealing with Social Sign-ins like Google who would require extra URL's to get it to work in Expo Go, and Expo Go alone offers no solution for creating builds for stores.

As we use both social sign-on and native packages, and want a convenient way to submit to stores, you will need to use something called **Expo Application Services** (EAS) to create **builds**.
EAS, is a quick way to create apps as either `.APK`s or `.ipa`s that can be submitted to the Google Play Store and App Store respectively.
As well as helping submit apps to stores, EAS also provides a `dev-client`. The dev-client is a build of the app that will include any native packages (like a native calendar) but requires to be hosted, allowing it to function the same as the Expo Go app (allowing hot refreshes hosted locally from your machine) but with native support.

Yakka makes use of Expo Application Services to create builds to test and deploy. The config file is found in-

```
/.eas.json
```

Here you will find a file that will look something similar to this:

    {
      "cli": {
         "version": ">= 0.43.0"
    },
      "build:{
         "production": {
               "android": {
                  "buildType": "apk"
               },
               "ios":{
                  "resourceClass": "m-medium"
               },
               "channel": "production"
         },
         "dev": {
            "android": {
                  "buildType": "apk"
               },
               "ios": {
                  "simulator":true,
                  "resourceClass": "m-medium"
               },
               "developmentClient": true,
               "distribution": "dev-client",
               "channel": "dev"
         },
      }
    }

The `cli` Section:

    "cli": {
      "version": ">= 0.43.0"
    },

The current version of EAS we have installed for this project.

The `build` section:

    "build:{
      "production": {
            "android": {
               "buildType": "apk"
            },
            "ios":{
               "resourceClass": "m-medium"
            },
            "channel": "production"
      },
      "dev": {
         "android": {
               "buildType": "apk"
            },
            "ios": {
               "resourceClass": "m-medium"
               "simulator":true,
            },
            "developmentClient": true,
            "distribution": "internal",
            "channel": "dev"
      },
    }

Represents each type of build that EAS can produce. The two `"production"` and `"dev"` objects dictate two different types of builds we can produce. These types are referred to as **profiles** on EAS.
The `buildType: apk` lines and `resourceClass:m-medium` are used to drastically speed up build time, builds can take anywhere from 5 minutes - 2 hours. These both shave off tens of minutes.

These lines:

            "ios": {...,"simulator":true,},
            "developmentClient": true,
            "distribution": "internal",

Have impact on the builds functionality.

- `simulator:true` for ios means you can run the build simulated on an ios device like a mac.
- `distribution:internal` ensures a build made with it can be distributed to testers on ios and also stops it from being deployed to the stores if it's a production build with --auto-submit.
- `developmentClient:true` turns the build into the dev-client build we talked about earlier, rather than a normal app that could be submitted to the stores.

The `channel` lines are only significant for deploying updates to builds.

### Google Services

I'm not sure what to put here

```
/.google-services.json
```

### Metro Config

A config file for metro bundle this is here because ...I'm not sure what to put here

```
/.metro.config.js
```

### Babel Config

There is a babel config file to allow use of 'react-native-reanimated'-

```
/.babel.config.js
```

### Environment Variables

Environment Variables are held in the below file and accessible globally

```
/.env
```

### Main App File

The entry point to the app. The main App component which renders the rest of the application-

```
/.app.js
```
