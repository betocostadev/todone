import { Text, View } from 'react-native'

export default function ListSubheader({
  title,
  numTasksRemaining,
}: {
  title?: string
  numTasksRemaining: number
}) {
  return (
    <View className="border-b border-line py-4 px-6">
      {title && (
        <Text className="text-xl font-title text-textMain uppercase">
          List Subheader
        </Text>
      )}
      <Text className="text-base font-handwriting text-textNote mt-1">
        {numTasksRemaining} tasks remaining
      </Text>
    </View>
  )
}
