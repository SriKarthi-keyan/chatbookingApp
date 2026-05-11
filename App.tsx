import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme, Theme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { bootstrapStores } from './src/store/bootstrap';
import { hydrateJsonStorage } from './src/storage/nativeStorage';
import { colors } from './src/theme/colors';

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.accent,
  },
};

function App() {
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    hydrateJsonStorage()
      .then(() => {
        if (!cancelled) {
          bootstrapStores();
          setStorageReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStorageReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        {storageReady ? (
          <NavigationContainer theme={navigationTheme}>
            <RootNavigator />
          </NavigationContainer>
        ) : (
          <View style={styles.boot}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  root: { flex: 1 },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
