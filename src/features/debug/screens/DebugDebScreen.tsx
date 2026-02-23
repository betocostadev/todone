import { db } from '@/db/client'
import { notifications } from '@/db/schema/notifications.schema'
import { tags } from '@/db/schema/tags.schema'
import { todoTags } from '@/db/schema/todoTags.schema'
import { todos } from '@/db/schema/todos.schema'
import { BackButton } from '@/shared/components/BackButton'
import { ScreenArea } from '@/shared/components/ScreenArea'
import { useCallback, useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

export default function DebugDbScreen() {
  const [data, setData] = useState<any>({
    todos: [],
    tags: [],
    notifications: [],
    todoTags: [],
  })

  const loadData = useCallback(async () => {
    const allTodos = await db.select().from(todos)
    const allTags = await db.select().from(tags)
    const allNotifications = await db.select().from(notifications)
    const allTodoTags = await db.select().from(todoTags)

    setData({
      todos: allTodos,
      tags: allTags,
      notifications: allNotifications,
      todoTags: allTodoTags,
    })
  }, [])

  const clearDatabase = useCallback(async () => {
    await db.delete(todoTags)
    await db.delete(notifications)
    await db.delete(tags)
    await db.delete(todos)

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
            style={[styles.button, styles.dangerButton]}
            onPress={clearDatabase}
          >
            <Text style={styles.buttonText}>Clear DB</Text>
          </Pressable>
        </View>

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
  buttons: { flexDirection: 'row', gap: 12, marginBottom: 20 },
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
