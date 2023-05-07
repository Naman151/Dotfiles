import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

import {ButtonProps} from './ButtonPropTypes';
import ButtonStyles from './ButtonStyles';

const LinkButton = ({Label, OnPress}: ButtonProps) => {
  return (
    <TouchableOpacity style={ButtonStyles.LinkContainer} onPress={OnPress}>
      <Text style={ButtonStyles.LinKLabel}>{Label}</Text>
    </TouchableOpacity>
  );
};

export default LinkButton;

// const styles = StyleSheet.create({});
