/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {LogBox, AppState} from 'react-native';
import {Provider} from 'react-redux';
import {RootSiblingParent} from 'react-native-root-siblings';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';

import createStore from './Store';
import AppNavigation from '@Navigation/AppNavigation';

LogBox.ignoreAllLogs();
const store = createStore();

function App(): JSX.Element {
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
// subscribe to app state changes
