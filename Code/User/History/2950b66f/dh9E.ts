import React from "react";
import { Dimensions, StyleSheet , Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";

//==========================================================================
// import Loader from '../Loader';

const { width } = Dimensions.get("window");

const CustomButton = ({
//   image,
//   disabled,
//   LoadingText,
//   title,
//   onPress,
//   colors,
//   extrastyle,
//   extrastyle2,
//   extrastyle3,
//   imageStyle,
//   btns,
//   ButtonIcon,
//   hideLoader,
//   x = 0.2,
//   y = 0.4,
//   x2 = 1,
//   y2 = 1.2,
}) => {
   return (
    <TouchableOpacity>
    {/* <Shadow 
      distance={12} 
      radius={moderateScale(30)} 
      startColor={'#F1F1F1'} 
      sides={['left', 'right', 'bottom']}
      corners={['bottomLeft', 'bottomRight']}   
    > */}
    <LinearGradient
        start={{ x: 10, y: 10 }}
        end={{ x: 40 , y: 40 }}
     //    colors={ disabled ? ['#708090' ,"#696969" ,"#808080"] :
     //      colors && colors.length != 0
     //        ? colors
     //        : ["#04B1E7", "#34D4D3", "#67F8BE"]
     //    }
     //    style={[extrastyle3 ? extrastyle3 :styles.button, extrastyle2]}
    > 
     <Text>{disabled ? LoadingText : title}</Text>
        { disabled && <Loader color={"#fff"} size={moderateScale(20)}/> }
        {/* {_.isNumber(image) && (
          <Image source={image} resizeMode={"contain"} style={imageStyle} />
        )} */}
        { ButtonIcon && <ButtonIcon width={moderateScale(18)} height={moderateScale(18)} style={{ marginLeft : moderateScale(10)}}/>}
      </LinearGradient>
      {/* </Shadow> */}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
     justifyContent:'center',
    //  width: width,
     alignItems: "center",
  },
  button: {
    width: width*0.55,
    paddingVertical: moderateVerticalScale(14),
    paddingHorizontal: moderateScale(10),
    flexDirection: "row",
    borderRadius: moderateScale(100),
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    fontFamily: Type.poppins,
    elevation: 9,
    shadowColor : 'rgba(0,0,0,0.7)',
    shadowOffset:{
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
  },
  btntext: {
    alignSelf: "center",
    color: colors.white,
    fontWeight: '500',
    fontSize: Size.medium,
    lineHeight : moderateScale(20),
    fontFamily: Type.poppins,
  },
});
