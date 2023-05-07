import React, {useState} from 'react';
import {Text, View} from 'react-native';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';

import {SCREEN_KEYS} from '@Constant';
import {Colors, Metrics} from '@Themes';

const CreatePinScreen = ({navigation}) => {
  const [val, setval] = useState('');
  console.log(val);
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        flex: 1,
      }}>
      <Text
        style={{
          fontSize: moderateVerticalScale(18),
          fontWeight: 'bold',
          color: Colors.Black,
          marginVertical: Metrics.Vertical.Scale16,
          letterSpacing: moderateScale(0.6),
        }}>
        Create Passcode
      </Text>
      <View
        style={{
          flexDirection: 'row',
          marginVertical: Metrics.Vertical.Scale20,
        }}>
        {[1, 2, 3, 4, 5, 6].map(it => (
          <View
            style={{
              width: Metrics.Radius.Small,
              height: Metrics.Radius.Small,
              borderRadius: Metrics.Radius.Small,
              backgroundColor:
                val?.length >= it ? Colors.lightblue : Colors.greyBlue,
              marginHorizontal: Metrics.Horizontal.Scale6,
            }}
          />
        ))}
      </View>

      <VirtualKeyboard
        value={val}
        style={{color: Colors.Black}}
        color="black"
        pressMode="string"
        onPress={val => {
          if (val?.length < 7) {
            setval(val);
          }
          if (val.length == 6) {
            navigation.navigate(SCREEN_KEYS.YOURSECRETSCREEN);
          }
        }}
      />
    </View>
  );
};

export default CreatePinScreen;

//const styles = StyleSheet.create({});
