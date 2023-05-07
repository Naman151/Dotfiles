// import colors from "@themes/Colors";
// import React, { useEffect } from "react";
// import {
//   ActivityIndicator, StyleSheet, View
// } from "react-native";
// import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
// import { moderateScale } from 'react-native-size-matters';
 
// const Loader = ({ display, show , color , size}) => {
//   if(display){
//     return (
//       // <Modal animationType={"fade"} transparent visible={display}>
//         <View style={styles.container} >
//           <ActivityIndicator size={ size ? size : moderateScale(60) } color={color ? color : colors.appblue } animating={true} />
//         </View>
//       // </Modal>
//     );
//   }
//   else{
//     return null;
//   }
// };


// export default Loader;

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//    // backgroundColor: 'rgba(74, 74, 74, 0.2)',
//     zIndex: 1,
//     // top: height / 2.2,
//     // left: width / 2,
//     // borderRadius: 5,
//     // width: 80,
//     // height: 80,
//     // marginLeft: -40,
//     top : 0,
//     left : 0,
//     right : 0,
//     bottom : 0,
//     flex : 1,
//     display : 'flex',
//     alignItems : 'center',
//     justifyContent : 'center',
//     backgroundColor : 'transparent'
//   },
// });

// export const PulseLoader = ({ Loading , Size , Color }) => {

//   const Progress = useSharedValue(0)
//    const Scale = useSharedValue(0)
      
//   const ReStyle = useAnimatedStyle(() => {
//       return{
//           opacity : Progress.value,
//           transform : [{ scale : Scale.value }]
//        }
//     }, [])

//     useEffect(() => {
//         Progress.value = withSpring(0.8 , { duration : 2000})
//         Scale.value = withSpring(1 , { duration : 2000})
//     },[])


//   if(Loading){
//     return(
//       <Animated.View style={[styles.container , ReStyle]}>
//         <View style={{flexDirection : 'row'}}> 
//         <View style={{backgroundColor : '#34d3' , padding : moderateScale(8) , borderRadius : moderateScale(100) ,margin : moderateScale(4)}}></View>
//         <View style={{backgroundColor : '#34d3' , padding : moderateScale(8) , borderRadius : moderateScale(100) ,margin : moderateScale(4)}}></View>
//         <View style={{backgroundColor : '#34d3' , padding : moderateScale(8) , borderRadius : moderateScale(100) ,margin : moderateScale(4)}}></View>
//         </View>
//       </Animated.View>
//     )
//   }
//   else{
//     return null
//   }
// }
