import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

import ButtonStyles from './ButtonStyles';
import { ButtonProps } from '@Constant/PropsTypes';

const LinkButton = ({Label, OnPress}: ButtonProps) => {
  return (
    <TouchableOpacity style={ButtonStyles.LinkContainer} onPress={OnPress}>
      <Text style={ButtonStyles.LinKLabel}>{Label}</Text>
    </TouchableOpacity>
  );
};

export default LinkButton;

// const styles = StyleSheet.create({});
