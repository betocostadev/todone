import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

export function BackButton() {
  const router = useRouter()

  return (
    <Pressable
      onPress={() => router.back()}
      className="absolute top-4 left-4 z-50 p-2"
    >
      <Ionicons name="chevron-back-outline" size={24} color="#2C3E50" />
    </Pressable>
  )
}
