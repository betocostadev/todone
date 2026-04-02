import ListHeader from '@/features/lists/components/ListHeader'
import ListSubheader from '@/features/lists/components/ListSubHeader'
import { NotebookContainer } from '@/features/lists/components/NotebookContainer'
import { useList } from '@/features/lists/hooks/useList'
import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'

export default function ListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: list, loading, error } = useList(id)

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-3xl font-title text-textMain mb-8">
          Loading list
        </Text>
      </View>
    )
  }

  if (error || !list) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-3xl font-title text-textMain mb-8">
          Error loading list
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-1 p-6">
      <ListHeader listId={id} />

      <View className="flex-1 items-center justify-center">
        <NotebookContainer>
          <ListSubheader title={'Test list'} numTasksRemaining={2} />
          <Text className="text-2xl font-title text-textMain">
            {list?.title}
          </Text>
        </NotebookContainer>
      </View>
    </View>
  )
}
