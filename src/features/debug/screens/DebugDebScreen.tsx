import { listsRepository } from '@/features/lists/repository/lists.repository'
import { listsService } from '@/features/lists/services/lists.service'
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

  const tagNames = [
    'study',
    'health',
    'programming',
    'job',
    'mental',
    'minor',
    'major',
    'tax',
    'chore',
    'errand',
    'project',
    'goals',
  ]

  const listNames = [
    'Chores',
    'Work',
    'House Things',
    'Market',
    'Taxes',
    'Car',
    'Development',
    'Shopping',
    'Learning',
  ]

  const TASK_TO_MOVE_TITLE = 'Move Task'

  const getRandomName = (type: string) => {
    const max = type === 'Tag' ? tagNames.length : listNames.length
    const choice = Math.floor(Math.random() * (max + 1))
    return type === 'Tag' ? tagNames[choice] : listNames[choice]
  }

  const getNotInboxListId = (): (typeof data.lists)[number] | undefined => {
    const match = data.lists.find(
      (l: typeof data.lists) => l.title.toLowerCase() !== 'inbox',
    )

    if (!match) return undefined

    return match.id
  }

  const taskToMoveExists = () => {
    const task = data.todos.find(
      (td: typeof data.todos) => td.title === TASK_TO_MOVE_TITLE,
    )

    if (task) return true
    return false
  }

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

        <Text style={styles.title}>Database Main</Text>
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

        <Text style={styles.title}>Create items</Text>
        <View style={styles.buttons}>
          <Pressable
            style={styles.button}
            onPress={async () => {
              try {
                await listsRepository.create(
                  getRandomName('List'),
                  '📱',
                  '#6366f1',
                )
              } catch (e) {
                console.log('Create list error: ', e)
              }

              await loadData()
            }}
          >
            <Text style={styles.buttonText}>Create List</Text>
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
            disabled={!getNotInboxListId()}
            onPress={async () => {
              try {
                await todosRepository.create(
                  `Task ${Date.now()}`,
                  'Debug task inside a new list',
                  getNotInboxListId(),
                )
              } catch (e) {
                console.log('Create task error:', e)
              }

              await loadData()
            }}
          >
            <Text style={styles.buttonText}>Create Task in List</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            disabled={taskToMoveExists()}
            onPress={async () => {
              try {
                await todosRepository.create(
                  TASK_TO_MOVE_TITLE,
                  'Task to be moved between lists',
                )
              } catch (e) {
                console.log('Create task error:', e)
              }

              await loadData()
            }}
          >
            <Text style={styles.buttonText}>Create MOVE Task</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={async () => {
              try {
                await tagsRepository.create(getRandomName('Tag'))
              } catch (e) {
                console.log('Tag error:', e)
              }
              loadData()
            }}
          >
            <Text style={styles.buttonText}>Create Unique Tag</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Handle items</Text>
        <View style={styles.buttons}>
          <Pressable
            style={styles.button}
            disabled={!taskToMoveExists()}
            onPress={async () => {
              try {
                const todos = data.todos
                const lists = data.lists

                const todo = todos.find(
                  (td: typeof data.todos) => td.title === TASK_TO_MOVE_TITLE,
                )
                const targetList = lists.find(
                  (l: typeof data.lists) => !l.isSystem,
                )

                if (!todo || !targetList) {
                  console.log('Missing todo or target list')
                  return
                }

                await todosRepository.moveToList(todo.id, targetList.id)

                console.log(
                  `Task ${TASK_TO_MOVE_TITLE} moved to list ${targetList.title}`,
                )
              } catch (e) {
                console.log('Move todo error: ', e)
              }

              await loadData()
            }}
          >
            <Text style={styles.buttonText}>Move Test Task</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={async () => {
              const customList = data.lists.find(
                (l: typeof data.lists) => !l.isSystem,
              )

              if (!customList) return

              try {
                await listsService.deleteList(customList.id)
              } catch (e) {
                console.log(e)
              }

              await loadData()
            }}
          >
            <Text style={styles.buttonText}>Delete Custom List</Text>
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
  subtitle: { fontSize: 15, fontWeight: 'semibold', marginBottom: 14 },
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
