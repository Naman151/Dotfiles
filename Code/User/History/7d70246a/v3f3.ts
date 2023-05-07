import { Metrics } from "@Themes"
import { StyleSheet } from "react-native/types"

export const CryptoInfoStyles = StyleSheet.create({
   MainContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     padding: Metrics.Horizontal.Scale6,
     marginVertical: Metrics.Vertical.Scale4,
   } as const,
})