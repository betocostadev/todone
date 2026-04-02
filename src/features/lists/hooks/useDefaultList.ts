import { ListSelect } from '@/db'
import { useEffect, useState } from 'react'
import { listsService } from '../services/lists.service'

type State = {
  data: ListSelect | null
  loading: boolean
  error: Error | null
}

export function useDefaultList() {
  const [listState, setListState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let mounted = true

    async function loadDefaultList() {
      try {
        setListState((s) => ({ ...s, loading: true }))

        const defaultList = await listsService.getInboxList()

        if (!mounted) return

        setListState({
          data: defaultList,
          loading: false,
          error: null,
        })
      } catch (error) {
        if (!mounted) return
        console.log(error)

        setListState({ data: null, loading: false, error: error as Error })
      }
    }

    loadDefaultList()

    return () => {
      mounted = false
    }
  }, [])

  return listState
}
