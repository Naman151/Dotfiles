import CryptoInfo from '@Components/CryptoInfo/CryptoInfo';
import EthereumIcon from '@Components/CryptoInfo/

import {Colors, Metrics} from '@Themes';
import React, {useState} from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import HomeScreenStyles from './HomeScreenStyles';

const HomeScreen = () => {
  // const [val, setval] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const Array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <View style={HomeScreenStyles.Screen}>
      {/* Top Bar */}
      <View
        style={{
          paddingVertical: moderateVerticalScale(18),
          marginTop: Metrics.Vertical.Scale2,
        }}>
        <Text>Top Nav</Text>
      </View>
      {/* Mid Component */}
      <View>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: moderateVerticalScale(25),
              color: Colors.Black,
            }}>
            $0.00
          </Text>
          <Text
            style={{
              color: Colors.midgrey,
              fontSize: moderateVerticalScale(15),
            }}>
            Main Wallet 1
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginVertical: Metrics.Vertical.Scale6,
          }}>
          <View>
            <Text
              style={{
                color: Colors.Twitter,
                fontSize: moderateVerticalScale(14),
                fontWeight: '600',
              }}>
              Send
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: Colors.Twitter,
                fontSize: moderateVerticalScale(14),
                fontWeight: '600',
              }}>
              Receive
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: Colors.Twitter,
                fontSize: moderateVerticalScale(14),
                fontWeight: '600',
              }}>
              Buy
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: Colors.Twitter,
                fontSize: moderateVerticalScale(14),
                fontWeight: '600',
              }}>
              Swap
            </Text>
          </View>
        </View>
      </View>
      {/* Bar Component */}
      <View
        style={{
          backgroundColor: Colors.lightblue,
          marginVertical: Metrics.Vertical.Scale6,
          marginHorizontal: Metrics.Horizontal.Scale12,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          paddingVertical: Metrics.Vertical.Scale10,
        }}>
        <View />
        <Text
          style={{
            color: Colors.Black,
            fontWeight: '800',
            fontSize: moderateVerticalScale(18),
          }}>
          Your portofolio insights
        </Text>
        <View>
          <Text
            style={{
              color: Colors.White,
              fontWeight: '800',
              fontSize: moderateVerticalScale(16),
            }}>
            3
          </Text>
        </View>
        <View>
          <Text>X</Text>
        </View>
      </View>
      {/* Tokens & NFT Component */}
      <View>
        <View
          style={{
            marginVertical: Metrics.Vertical.Scale6,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            borderBottomWidth: moderateScale(1),
            borderBottomColor: Colors.mediumGrey,
            paddingVertical: Metrics.Vertical.Scale6,
          }}>
          <Pressable onPress={() => setActiveTab(0)}>
            <Text
              style={{
                color: activeTab == 0 ? Colors.Twitter : Colors.Black,
                fontWeight: '600',
                fontSize: moderateVerticalScale(15),
                borderBottomWidth: moderateScale(0.8),
                borderBottomColor:
                  activeTab == 0 ? Colors.Twitter : 'transparent',
              }}>
              Tokens
            </Text>
          </Pressable>
          <Pressable onPress={() => setActiveTab(1)}>
            <Text
              style={{
                color: activeTab == 1 ? Colors.Twitter : Colors.Black,
                fontWeight: '600',
                fontSize: moderateVerticalScale(15),
                borderBottomWidth: moderateScale(0.8),
                borderBottomColor:
                  activeTab == 1 ? Colors.Twitter : 'transparent',
              }}>
              NFTs
            </Text>
          </Pressable>
        </View>
        <View>
          <FlatList
            data={Array}
            scrollEnabled
            renderItem={() => {
              return <EthereumIcon />;
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
