import { AppState } from 'react-native';
// import ForegroundTracker from 'react-native-foreground-tracker';

// initialize the foreground tracker
// const tracker = new ForegroundTracker();

// subscribe to app state changes
AppState.addEventListener('change', (newState) => {
  if (newState === 'active') {
    // check if the app is currently in the foreground
//     tracker.getForegroundState().then((state) => {
     //  if (state === 'active') {
        // the app is in the foreground and not locked
     //  } else if (state === 'inactive') {
        // the app is in the background or locked
     //  }
//     });
  }
});
