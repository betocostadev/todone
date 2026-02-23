import ListHeader from '@/features/lists/components/ListHeader'
import ListSubheader from '@/features/lists/components/ListSubHeader'
import { NotebookContainer } from '@/features/lists/components/NotebookContainer'
import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'

export default function ListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <View className="flex-1 p-6">
      <ListHeader />

      <View className="flex-1 items-center justify-center">
        <NotebookContainer>
          <ListSubheader title={'Test list'} numTasksRemaining={2} />
          <Text className="text-2xl font-title text-textMain">List: {id}</Text>
        </NotebookContainer>
      </View>
    </View>
  )
}
