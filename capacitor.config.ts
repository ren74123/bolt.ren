import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.digitalhuman.app',
  appName: 'Digital Human App',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    backgroundColor: '#ffffff'
  }
};

export default config;
