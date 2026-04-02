import { useDefaultList } from '@/features/lists/hooks/useDefaultList'
import { useLists } from '@/features/lists/hooks/useLists'
import { Routes } from '@/types/routes'
import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

export default function RootIndexScreen() {
  const router = useRouter()
  const { data: lists, loading, error } = useLists()
  const {
    data: defaultList,
    loading: loadingDefaultList,
    error: defaultListError,
  } = useDefaultList()
  console.log('Index - main screen')
  console.log('Lists:')
  console.log(lists)

  if (loading || loadingDefaultList) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-3xl font-title text-textMain mb-8">
          Loading lists
        </Text>
      </View>
    )
  }

  if (!loading && !defaultList) {
    return null
  }

  if (error || defaultListError || !lists) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-3xl font-title text-textMain mb-8">No lists</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 justify-center items-center px-6">
      <Text className="text-3xl font-title text-textMain mb-8">To-Done</Text>

      {defaultList && (
        <Pressable
          // onPress={() => router.push(Routes.List(inboxList.id))}
          onPress={() => router.push(Routes.List(defaultList.id))}
          className="bg-primary px-6 py-4 rounded-xl"
        >
          <Text className="text-white font-handwriting text-lg">
            Open Inbox
          </Text>
        </Pressable>
      )}

      {defaultList && (
        <Pressable
          // onPress={() => router.push(Routes.List(inboxList.id))}
          onPress={() => router.push(Routes.List(defaultList.id))}
          className="bg-primary px-6 py-4 rounded-xl"
        >
          <Text className="text-white font-handwriting text-lg">
            Open List X
          </Text>
        </Pressable>
      )}

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
