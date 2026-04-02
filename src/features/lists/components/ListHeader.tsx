import { BackButton } from '@/shared/components/BackButton'
import { Text, View } from 'react-native'
import { useList } from '../hooks/useList'

export default function ListHeader({ listId }: { listId: string }) {
  const { data: list, loading, error } = useList(listId)
  console.log('ListHeader')
  console.log('list received by useList:')
  console.log('loading?', loading)
  console.log('error?', error)
  console.log(list)

  if (loading) {
    return <Text>Loading...</Text>
  }

  if (error || !list) {
    return <Text>Error loading list</Text>
  }

  // Add toast component later
  //   useEffect(() => {
  //    if (error instanceof DomainError) {
  //       showToast(error.message)
  //    }
  // }, [error])

  return (
    <View className="flex-row">
      <BackButton />
      <Text className="text-xl font-title text-textMain uppercase">
        {list.title}
      </Text>
      {/* Action button */}
      <Text className="text-xl font-title text-textMain uppercase">
        List header
      </Text>
    </View>
  )
}
