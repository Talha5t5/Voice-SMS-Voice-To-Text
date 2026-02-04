// utils/InterstitialAdManager.js
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
//const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3373899001969249/6549827367';
const adUnitId = TestIds.INTERSTITIAL;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const showInterstitialAd = () => {
  return new Promise((resolve, reject) => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitial.show();
      unsubscribeLoaded(); // remove listener after loaded
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      unsubscribeClosed(); // remove listener after close
      resolve(); // Continue after ad is closed
    });

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      unsubscribeError(); // remove listener on error
      console.log('Interstitial Ad Error:', error);
      reject(error);
    });

    interstitial.load();
  });
};

export default showInterstitialAd;
