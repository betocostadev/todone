import { tagsRepository } from '@/features/tags/repository/tags.repository'
import { todosRepository } from '@/features/todos/repository/todos.repository'
import { BackButton } from '@/shared/components/BackButton'
import { ScreenArea } from '@/shared/components/ScreenArea'
import { useCallback, useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { debugRepository } from '../repository/debug.repository'

export default function DebugDbScreen() {
  const [data, setData] = useState<any>({
    todos: [],
    lists: [],
    listTodos: [],
    tags: [],
    notifications: [],
    todoTags: [],
  })

  const loadData = useCallback(async () => {
    const result = await debugRepository.getRawData()
    setData(result)
  }, [])

  const clearDatabase = useCallback(async () => {
    await debugRepository.clearAll()
    await loadData()
  }, [loadData])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <ScreenArea>
      <BackButton />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Debug Database</Text>

        <View style={styles.buttons}>
          <Pressable style={styles.button} onPress={loadData}>
            <Text style={styles.buttonText}>Refresh</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={async () => {
              try {
                await todosRepository.create(
                  `Task ${Date.now()}`,
                  'Simple debug task',
                )
              } catch (e) {
                console.log('Create task error:', e)
              }

              await loadData()
            }}
          >
            <Text style={styles.buttonText}>Create Simple Task</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={async () => {
              try {
                await tagsRepository.create('Work')
              } catch (e) {
                console.log('Tag error:', e)
              }
              loadData()
            }}
          >
            <Text style={styles.buttonText}>Add Unique Tag</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.dangerButton]}
            onPress={clearDatabase}
          >
            <Text style={styles.buttonText}>Clear DB</Text>
          </Pressable>
        </View>

        <Section title="Lists" data={data.lists} />
        <Section title="List Todos (Pivot)" data={data.listTodos} />
        <Section title="Todos" data={data.todos} />
        <Section title="Tags" data={data.tags} />
        <Section title="Notifications" data={data.notifications} />
        <Section title="Todo Tags" data={data.todoTags} />
      </ScrollView>
    </ScreenArea>
  )
}

function Section({ title, data }: { title: string; data: any[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title} ({data.length})
      </Text>
      <Text style={styles.json}>{JSON.stringify(data, null, 2)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  dangerButton: { backgroundColor: '#ef4444' },
  buttonText: { color: '#fff', fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  json: { fontFamily: 'Courier', fontSize: 12 },
})
