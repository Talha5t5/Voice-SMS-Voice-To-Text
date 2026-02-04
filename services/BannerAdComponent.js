// components/BannerAdComponent.js
import React from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
//const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-3940256099942544/6300978111';
const adUnitId = TestIds.BANNER;

const BannerAdComponent = () => {
  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
};

export default BannerAdComponent;
