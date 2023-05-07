import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';

import {MainButton} from '@Components/Buttons';
import Draggable from '@Components/Draggable/DraggableView';
import {SCREEN_KEYS} from '@Constant';
import {Colors, Metrics} from '@Themes';

const VerifyPrivateKeyScreen = ({navigation}) => {
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
          Verify Secret Pharse
        </Text>
        <Text
          style={{
            fontSize: moderateVerticalScale(14),
            fontWeight: '300',
            color: Colors.Black,
            marginVertical: Metrics.Vertical.Scale16,
            letterSpacing: moderateScale(0.6),
            textAlign: 'center',
          }}>
          Tap the words to put them next to each other in the correct order
        </Text>
        <View
          style={{
            borderBottomColor: '#000000',
            backgroundColor: 'lightgrey',
            borderRadius: moderateScale(5),
            overflow: 'hidden',
            borderWidth: moderateScale(0.2),
            marginVertical: Metrics.Vertical.Scale4,
          }}>
          <TextInput
            editable={false}
            multiline
            numberOfLines={4}
            maxLength={40}
            style={{padding: moderateVerticalScale(25)}}
          />
        </View>
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
              <Draggable>
                <Text style={{color: Colors.greyBlue}}>{itm}</Text>
              </Draggable>
            </View>
          ))}
        </View>
      </View>

      <View style={{width: '100%', marginBottom: Metrics.Vertical.Scale20}}>
        <MainButton
          Label={'Continue'}
          OnPress={() => navigation.navigate(SCREEN_KEYS.HOMESCREEN)}
        />
      </View>
    </View>
  );
};

export default VerifyPrivateKeyScreen;

// const styles = StyleSheet.create({});
