import { Colors, Metrics } from '@Themes';
import { StyleSheet } from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';

export const ButtonStyles = StyleSheet.create({
  ButtonContainer: {
    backgroundColor: Colors.Twitter,
    borderRadius: Metrics.Radius.ExtraSmall,
    margin: Metrics.Margin.Small,
    paddingHorizontal: Metrics.Horizontal.Scale18,
    width: '100%',
    alignItems: 'center',
  } as const,
  ButtonDisabledContainer: {
    backgroundColor: Colors.ButtonDisabled,
    borderRadius: Metrics.Radius.ExtraSmall,
    margin: Metrics.Margin.Small,
    paddingHorizontal: Metrics.Horizontal.Scale18,
    width: '100%',
    alignItems: 'center',
  } as const,
  Label: {
    color: Colors.White,
    fontWeight: '800',
    padding: Metrics.Horizontal.Scale12,
  } as const,
  LinkContainer: {
    alignItems: 'center',
    padding: Metrics.Horizontal.Scale8,
    margin: Metrics.Margin.Small,
    borderWidth: moderateScale(0.8),
    borderColor: Colors.Twitter,
    borderRadius: Metrics.Radius.ExtraSmall,
  } as const,
  LinKLabel: {
    color: Colors.Twitter,
    fontSize: moderateVerticalScale(15),
    fontWeight: '600',
  } as const,
});
