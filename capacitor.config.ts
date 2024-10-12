import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ioniccamscannerapp',
  appName: 'ioniccamscannerapp',
  webDir: 'www',
  android: {
    allowMixedContent: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      launchShowDuration: 0
    },
   
  }, cordova: {
    preferences: {
      LottieFullScreen: "true",
      LottieHideAfterAnimationEnd: "true",
      LottieAnimationLocation: 'public/assets/splash.json'
    }
  }
};

export default config;
