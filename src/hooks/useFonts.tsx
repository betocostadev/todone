import { useFonts } from 'expo-font'

export function useAppFonts() {
  return useFonts({
    IndieFlower: require('../../assets/fonts/IndieFlower-Regular.ttf'),
    ShadowsIntoLight: require('../../assets/fonts/ShadowsIntoLight-Regular.ttf'),
  })
}
