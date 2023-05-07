// import BitcoinIcon from '@Icons/CryptoCoinIcon/BitcoinIcon.svg';
import EthereumIcon from "@Icons/CryptoCoinIcon/EtheriumIcon.svg"

import {Colors, Metrics} from '@Themes';
import React from 'react';
import {Text, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const CryptoInfo = () => {
  return (
    <View
      style={}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Metrics.Horizontal.Scale20,
        }}>
        <EthereumIcon />
        <Text
          style={{
            color: Colors.Black,
            fontWeight: '600',
            fontSize: moderateScale(15),
            marginHorizontal: Metrics.Horizontal.Scale10,
          }}>
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
