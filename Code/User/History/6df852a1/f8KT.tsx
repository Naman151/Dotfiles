/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {AppState, LogBox} from 'react-native';
import {RootSiblingParent} from 'react-native-root-siblings';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';

import AppNavigation from '@Navigation/AppNavigation';
import createStore from './Store';

// import ForegroundTracker from 'react-native-foreground-tracker';

// initialize the foreground tracker
// const tracker = new ForegroundTracker();

LogBox.ignoreAllLogs();
const store = createStore();
function App(): JSX.Element {
  let AppStatus;
  // subscribe to app state changes
  AppState.addEventListener('change', newState => {
    if (newState === 'active') {
      console.log('App Running');
      AppStatus = 'Active';
      // check if the app is currently in the foreground
      //     tracker.getForegroundState().then((state) => {
      //  if (state === 'active') {
      // the app is in the foreground and not locked
      //  } else if (state === 'inactive') {
      // the app is in the background or locked
      //  }
      //     });
    } else {
      AppStatus = 'Inactive';
    }
  });
  return (
    <Provider store={store}>
      <PersistGate persistor={persistStore(store)}>
        <RootSiblingParent>
          <AppNavigation AppStatus={AppStatus} />
        </RootSiblingParent>
      </PersistGate>
    </Provider>
  );
}

export default App;
