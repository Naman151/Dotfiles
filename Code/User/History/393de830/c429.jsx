import CheckBox from '@react-native-community/checkbox';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';

import {MainButton} from '@Components/Buttons';
import {SCREEN_KEYS} from '@Constant';
import {Colors, Metrics} from '@Themes';

const LegalScreen = ({navigation}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  return (
    <View style={{flex: 1}}>
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            fontSize: moderateVerticalScale(18),
            fontWeight: 'bold',
            color: Colors.Black,
            marginVertical: Metrics.Vertical.Scale16,
            letterSpacing: moderateScale(0.6),
          }}>
          Legal
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: Metrics.Horizontal.Scale6,
          alignItems: 'center',
          marginVertical: Metrics.Vertical.Scale10,
        }}>
        <Text
          style={{
            fontSize: moderateVerticalScale(12.5),
            fontWeight: '500',
            color: Colors.Black,
          }}>
          Please review the Crypto Payment Terms of Service and Privacy Policy
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: Metrics.Horizontal.Scale20,
          marginVertical: Metrics.Vertical.Scale8,
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: Metrics.Vertical.Scale10,
            paddingHorizontal: Metrics.Horizontal.Scale20,
            justifyContent: 'space-between',
            marginVertical: Metrics.Vertical.Scale2,
            alignItems: 'center',
            elevation: 1,
            backgroundColor: 'white',
          }}>
          <Text style={{fontSize: moderateVerticalScale(16), color: 'grey'}}>
            Privacy Policy
          </Text>
          <Text
            style={{fontSize: moderateVerticalScale(16), color: Colors.Black}}>
            {'>'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: Metrics.Vertical.Scale10,
            paddingHorizontal: Metrics.Horizontal.Scale20,
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 1,
            backgroundColor: 'white',
            marginVertical: Metrics.Vertical.Scale2,
          }}>
          <Text style={{fontSize: moderateVerticalScale(16), color: 'grey'}}>
            Terms of service
          </Text>
          <Text
            style={{fontSize: moderateVerticalScale(16), color: Colors.Black}}>
            {'>'}
          </Text>
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'flex-end',
          marginVertical: Metrics.Vertical.Scale20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: Metrics.Vertical.Scale6,
            paddingHorizontal: '8%',
            alignItems: 'center',
            width: '95%',
          }}>
          <CheckBox
            disabled={false}
            value={toggleCheckBox}
            tintColors={Colors.lightblue}
            onValueChange={newValue => setToggleCheckBox(newValue)}
          />
          <Text
            style={{
              fontSize: moderateVerticalScale(14),
              marginHorizontal: Metrics.Horizontal.Scale6,
              color: Colors.Twitter,
              fontWeight: '400',
            }}>
            I've read and accept the Term of Service and Privacy Policy
          </Text>
        </View>
        <View style={{width: '85%'}}>
          <MainButton
            Label={'Continue'}
            OnPress={() => navigation.navigate(SCREEN_KEYS.CREATEPINSCREEN)}
            Disabled={!toggleCheckBox}
          />
        </View>
      </View>
    </View>
  );
};

export default LegalScreen;

// const styles = StyleSheet.create({});
