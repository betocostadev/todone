import { Routes } from '@/types/routes'
import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

export default function RootIndexScreen() {
  const router = useRouter()

  return (
    <View className="flex-1 justify-center items-center px-6">
      <Text className="text-3xl font-title text-textMain mb-8">To-Done</Text>

      <Pressable
        onPress={() => router.push(Routes.List('default'))}
        className="bg-primary px-6 py-4 rounded-xl"
      >
        <Text className="text-white font-handwriting text-lg">
          Open Default List
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/debug')}
        className="mt-6 border border-line px-6 py-4 rounded-xl"
      >
        <Text className="text-textMain font-handwriting text-lg">
          Debug Database
        </Text>
      </Pressable>
    </View>
  )
}
