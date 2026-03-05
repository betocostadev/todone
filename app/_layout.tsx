import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-get-random-values'
import 'react-native-reanimated'
import '../global.css'

import { DatabaseProvider } from '@/core/providers/DatabaseProvider'
import { AppProviders } from '@core/providers/AppProviders'
import { useAppFonts } from '@hooks/useFonts'

export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useAppFonts()

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <DatabaseProvider>
      <AppProviders>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(root)" />
          <Stack.Screen
            name="(modals)/task"
            options={{ presentation: 'modal' }}
          />
        </Stack>
      </AppProviders>
    </DatabaseProvider>
  )
}
