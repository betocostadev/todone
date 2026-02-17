import { initDb } from '@/db/init'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const queryClient = new QueryClient()

export function AppProviders({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function init() {
      await initDb()
      setReady(true)
    }

    init()
  }, [])

  if (!ready) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
