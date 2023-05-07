/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useRef, useState} from 'react';
import {Animated, FlatList, View} from 'react-native';

import CarouselIndicator from './CarouselIndicator';
import CarouselItem from './CarouselItem';
import {slides} from './Slides';
import {APPSTYLES} from '@Themes';
import {CarouselStyles} from './CarouselStyles';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({viewbleItems}: any) => {
    console.log(typeof viewbleItems, viewbleItems);
    // setCurrentIndex(viewbleItems[0].index);
  }).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  return (
    <View style={APPSTYLES.Container}>
      <View style={CarouselStyles.CarouselContainer}>
        <FlatList
          // contentContainerStyle={{height: moderateVerticalScale(600)}}
          data={slides}
          renderItem={({item}) => <CarouselItem item={item} />}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          keyExtractor={item => item.id}
          scrollEventThrottle={32}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
      <CarouselIndicator data={slides} scrollX={scrollX} />
    </View>
  );
};

export default ImageCarousel;
