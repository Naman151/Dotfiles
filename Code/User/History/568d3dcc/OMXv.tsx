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
          style={}>
          BTC
        </Text>
      </View>
      <Text
        style={{
          color: Colors.Black,
          fontWeight: '600',
          fontSize: moderateScale(15),
          marginHorizontal: Metrics.Horizontal.Scale10,
        }}>
        0
      </Text>
    </View>
  );
};

export default CryptoInfo;
