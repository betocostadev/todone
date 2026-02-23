import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { todosRepository } from '../repository/todos.repository'

export default function TodayScreen() {
  useEffect(() => {
    async function testDb() {
      console.log('Creating todo...')
      await todosRepository.create('Primeira tarefa 🎉', 'Nothing to do here')

      const all = await todosRepository.getAll()
      console.log('Todos in DB:', all)
    }

    testDb()
  }, [])

  return (
    <View className="flex-1 items-center justify-center bg-paper">
      <Text className="text-textMain text-xl font-title">NativeWind Added</Text>
      <View className="flex-1 bg-paper">
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={i} className="h-row border-b border-line" />
        ))}
      </View>
    </View>
  )
}
