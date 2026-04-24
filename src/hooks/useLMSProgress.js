import { useCallback, useState } from 'react'

const STORAGE_KEY = 'nds_lms_progress'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useLMSProgress() {
  const [data, setData] = useState(load)

  const getProgress = useCallback((courseId, lessonId) => {
    return Boolean(data?.[courseId]?.[lessonId])
  }, [data])

  const markComplete = useCallback((courseId, lessonId) => {
    setData(prev => {
      const next = { ...prev, [courseId]: { ...prev[courseId], [lessonId]: true } }
      save(next)
      return next
    })
  }, [])

  const resetCourse = useCallback((courseId) => {
    setData(prev => {
      const next = { ...prev }
      delete next[courseId]
      save(next)
      return next
    })
  }, [])

  return { getProgress, markComplete, resetCourse }
}
