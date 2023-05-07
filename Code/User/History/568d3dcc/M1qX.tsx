// import BitcoinIcon from '@Icons/CryptoCoinIcon/BitcoinIcon.svg';
import { CryptoInfoStyles } from "./CrytoInfoStyles";
import EthereumIcon from "@Icons/CryptoCoinIcon/EtheriumIcon.svg"

import {Colors, Metrics} from '@Themes';
import React from 'react';
import {Text, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const CryptoInfo = () => {
  return (
    <View
      style={CryptoInfoStyles.MainContainer}>
      <View
        style={CryptoInfoStyles.IconContainer}>
        <EthereumIcon />
        <Text
          style={CryptoInfoStyles.IconLabel}>
          BTC
        </Text>
      </View>
      <Text
        style={CryptoInfoStyles.Amount}>
        0
      </Text>
    </View>
  );
};

export default CryptoInfo;
