import {useNavigation} from '@react-navigation/native';

//=================== COMPONENTS====================================
import {LinkButton, MainButton} from '@Components/Buttons';
import ImageCarousel from '@Components/ImageCarousel/ImageCarousel';

//=================== CONNSTANTS =================================================
import {SCREEN_KEYS} from '@Constant';

//================= STYLES ========================================
import OnBoardingScreenStyles from './OnBoardingScreenStyles';

const OnBoardingScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={OnBoardingScreenStyles.Screen}>
      <ImageCarousel />
      <View style={OnBoardingScreenStyles.ButtonView}>
        <MainButton
          Label={'CREATE A NEW WALLET'}
          OnPress={() => navigation.navigate(SCREEN_KEYS.LEGALSCREEN)}
        />
        <LinkButton
          Label={'I already have a wallet'}
          OnPress={() => navigation.navigate(SCREEN_KEYS.CREATEPINSCREEN)}
        />
      </View>
    </View>
  );
};

export default OnBoardingScreen;
