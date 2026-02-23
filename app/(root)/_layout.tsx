import { ScreenArea } from '@/shared/components/ScreenArea'
import { Stack } from 'expo-router'
import { View } from 'react-native'

export default function RootStackLayout() {
  return (
    <ScreenArea>
      <View className="flex-1 bg-paper">
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </View>
    </ScreenArea>
  )
}
