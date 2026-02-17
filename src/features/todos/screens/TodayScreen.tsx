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
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Today</Text>
    </View>
  )
}
