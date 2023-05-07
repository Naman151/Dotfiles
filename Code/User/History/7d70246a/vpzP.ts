import { Colors, Metrics } from "@Themes"
import { moderateScale } from "react-native-size-matters"
import { StyleSheet } from "react-native/types"

export const CryptoInfoStyles = StyleSheet.create({
   MainContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     padding: Metrics.Horizontal.Scale6,
     marginVertical: Metrics.Vertical.Scale4,
   } as const,
   IconContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     paddingHorizontal: Metrics.Horizontal.Scale20,
   } as const,
   IconLabel: {
     color: Colors.Black,
     fontWeight: '600',
     fontSize: moderateScale(15),
     marginHorizontal: Metrics.Horizontal.Scale10,
   } as const,
   Amount: {
     color: Colors.Black,
     fontWeight: '600',
     fontSize: moderateScale(15),
     marginHorizontal: Metrics.Horizontal.Scale10,
   } as const,
})