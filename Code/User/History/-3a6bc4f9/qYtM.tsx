import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import Clipboard from '@react-native-clipboard/clipboard';

import {LinkButton, MainButton} from '@Components/Buttons';
import {SCREEN_KEYS} from '@Constant';
import {Colors, Metrics} from '@Themes';
import {showToast} from '@Utils/DialogUtils';

const ShowPrivateScreen = ({navigation}) => {
  const [val, setval] = useState('');
  let list = [
    'today',
    'solve',
    'actress',
    'stable',
    'laptop',
    'region',
    'prison',
    'myself',
    'lion',
    'polar',
    'fade',
    'creek',
  ];
  return (
    <View
      style={{
        alignItems: 'center',
        alignContent: 'center',
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: '8%',
        paddingTop: Metrics.Vertical.Scale20,
      }}>
      <View>
        <Text
          style={{
            fontSize: moderateVerticalScale(18),
            fontWeight: '600',
            color: Colors.Black,
            textAlign: 'center',
            marginVertical: Metrics.Vertical.Scale16,
            letterSpacing: moderateScale(0.6),
          }}>
          Your Secret Pharse
        </Text>
        <Text
          style={{
            fontSize: moderateVerticalScale(14),
            fontWeight: '500',
            color: Colors.Black,
            marginVertical: Metrics.Vertical.Scale16,
            letterSpacing: moderateScale(0.6),
            textAlign: 'center',
          }}>
          Write down or copy these words in the right order and save them
          somewhere safe.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {list.map((itm, index) => (
            <View
              style={{
                borderWidth: 1,
                borderColor: Colors.greyBlue,
                borderRadius: Metrics.Radius.ExtraSmall,
                marginVertical: Metrics.Vertical.Scale6,
                marginHorizontal: Metrics.Horizontal.Scale2,
                padding: Metrics.Horizontal.Scale8,
              }}>
              <Text style={{color: Colors.greyBlue}}>
                {index + 1} {itm}
              </Text>
            </View>
          ))}
        </View>
        <LinkButton
          Label={'Copy'}
          OnPress={() => {
            let str = '';
            list.map(t => (str += t + ' '));
            Clipboard.setString(str);
            showToast('Copied');
          }}
        />
      </View>
      <View style={{width: '100%', marginBottom: Metrics.Vertical.Scale20}}>
        <View
          style={{
            width: '100%',
            backgroundColor: 'rgba(255,0,0,0.2)',
            borderRadius: Metrics.Radius.Small,
            padding: Metrics.Horizontal.Scale18,
            marginBottom: Metrics.Vertical.Scale10,
            marginTop: Metrics.Vertical.Scale60,
          }}>
          <Text
            style={{
              fontSize: moderateVerticalScale(15),
              fontWeight: '700',
              color: Colors.red,
              textAlign: 'center',
            }}>
            DO NOT share your pharse to anyone as this gives full access to your
            wallet!
          </Text>

          <Text
            style={{
              fontSize: moderateVerticalScale(14),
              fontWeight: '600',
              color: Colors.red,
              marginTop: Metrics.Vertical.Scale10,
            }}>
            Wallet will NEVER react out to ask for it
          </Text>
        </View>
        <MainButton
          Label={'Continue'}
          OnPress={() => navigation.navigate(SCREEN_KEYS.VERIFYSECRETKEYSCREEN)}
        />
      </View>
    </View>
  );
};

export default ShowPrivateScreen;

const styles = StyleSheet.create({});
