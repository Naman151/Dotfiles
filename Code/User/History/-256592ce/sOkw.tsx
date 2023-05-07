import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

import {ButtonProps} from './ButtonPropTypes';
import ButtonStyles from './ButtonStyles';

const MainButton = ({Label, OnPress, Disabled}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={
        Disabled
          ? ButtonStyles.ButtonDisabledContainer
          : ButtonStyles.ButtonContainer
      }
      onPress={OnPress}
      disabled={Disabled}>
      <Text style={ButtonStyles.Label}>{Label}</Text>
    </TouchableOpacity>
  );
};

export default MainButton;
