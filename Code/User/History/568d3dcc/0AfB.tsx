// import BitcoinIcon from '@Icons/CryptoCoinIcon/BitcoinIcon.svg';
import EthereumIcon from '@Icons/CryptoCoinIcon/EthereumIcon.svg';
import {CryptoInfoStyles} from './CrytoInfoStyles';

import React from 'react';
import {Text, View} from 'react-native';

const CryptoInfo = () => {
  return (
    <View style={CryptoInfoStyles.MainContainer}>
      <View style={CryptoInfoStyles.IconContainer}>
        <EthereumIcon />
        <Text style={CryptoInfoStyles.IconLabel}>BTC</Text>
      </View>
      <Text style={CryptoInfoStyles.Amount}>0</Text>
    </View>
  );
};

export default CryptoInfo;
