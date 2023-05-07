import React from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {moderateVerticalScale} from 'react-native-size-matters';

import LockerIcon from '@Icons/OnboardingScreenIcon/LockerIcon.svg';

const CarouselItem = ({item}: any) => {
  const {width} = useWindowDimensions();

  return (
    <View style={[styles.Container, {width: width}]}>
      <View style={{backgroundColor: 'white', justifyContent: 'flex-end'}}>
        <LockerIcon />
        <Text
          style={{
            fontWeight: '800',
            textAlign: 'center',
            fontSize: moderateVerticalScale(18),
            color: 'black',
          }}>
          {item.title}
        </Text>
        <View style={{width: '98%'}}>
          <Text
            style={{
              marginTop: moderateVerticalScale(20),
              fontWeight: '500',
              color: 'grey',
              fontSize: moderateVerticalScale(12),
            }}>
            {item.subtext}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CarouselItem;

const styles = StyleSheet.create({
  Container: {
    height: moderateVerticalScale(500),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
