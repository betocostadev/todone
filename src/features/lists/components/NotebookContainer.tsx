import { PropsWithChildren } from 'react'
import { View } from 'react-native'

export function NotebookContainer({ children }: PropsWithChildren) {
  return (
    <View className="flex-1 relative">
      {/* Vertical red line */}
      <View className="absolute left-14 top-0 bottom-0 w-[2px] bg-margin z-10" />

      {children}
    </View>
  )
}
