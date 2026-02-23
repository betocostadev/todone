import { BackButton } from '@/shared/components/BackButton'
import { Text, View } from 'react-native'

export default function ListHeader() {
  return (
    <View className="flex-row">
      <BackButton />
      <Text className="text-xl font-title text-textMain uppercase">
        List header
      </Text>
    </View>
  )
}
