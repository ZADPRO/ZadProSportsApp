import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'SportsApp',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
    Keyboard: {
      resize: "body", // Options: "native", "body", "ionic" 
      resizeOnFullScreen: true,
    }
  },
};

export default config;
