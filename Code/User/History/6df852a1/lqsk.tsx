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

import SCREEN_KEYS from '@Constant';
import AppNavigation from '@Navigation/AppNavigation';
import {useNavigation} from '@react-navigation/native';
import createStore from './Store';

// import ForegroundTracker from 'react-native-foreground-tracker';

// initialize the foreground tracker
// const tracker = new ForegroundTracker();

LogBox.ignoreAllLogs();
const store = createStore();
const navigation = useNavigation();
function App(): JSX.Element {
  // subscribe to app state changes
  AppState.addEventListener('change', newState => {
    if (newState === 'active') {
      console.log('App Running');
      navigation.navigate(SCREEN_KEYS.CREATEPINSCREEN);
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
  return (
    <Provider store={store}>
      <PersistGate persistor={persistStore(store)}>
        <RootSiblingParent>
          <AppNavigation />
        </RootSiblingParent>
      </PersistGate>
    </Provider>
  );
}

export default App;
