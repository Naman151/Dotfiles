/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {LogBox} from 'react-native';
import {RootSiblingParent} from 'react-native-root-siblings';
import {Provider} from 'react-redux';
import AppNavigation from '@Navigation/AppNavigation';
import createStore from './Store';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
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
