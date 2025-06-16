import Swiper from 'react-native-swiper'
import { Text, ImageBackground, TouchableOpacity, View } from 'react-native'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import { router } from 'expo-router'
import IconDot from '~/assets/icon-svg/IconDot'
import IconDotActive from '~/assets/icon-svg/IconDotActive'

export default function Onboarding() {
  return (
    <Swiper
      showsButtons={false}
      autoplay
      dot={
        <View className="mx-2">
          <IconDot />
        </View>
      }
      activeDot={
        <View className="mx-2">
          <IconDotActive />
        </View>
      }
    >
      <ImageBackground source={images.onboarding1} resizeMode="cover" className="h-full">
        <Text className="text-center text-white text-3xl font-bold absolute bottom-40 left-0 right-0 m-auto">
          Học cờ vua dễ như {'\n'}
          chơi game!
        </Text>
      </ImageBackground>
      <ImageBackground source={images.onboarding1} resizeMode="cover" className="h-full">
        <Text className="text-center text-white text-3xl font-bold absolute bottom-40 left-0 right-0 m-auto">
          Rèn luyện tư duy, phản {'\n'} xạ nhanh mỗi ngày.
        </Text>
      </ImageBackground>
      <ImageBackground source={images.onboarding2} resizeMode="cover" className="h-full">
        <Text className="text-center text-white text-3xl font-bold absolute bottom-40 left-0 right-0 m-auto">
          Chinh phục huy hiệu và {'\n'} thách đấu với bạn bè!
        </Text>
        <View className="w-full absolute bottom-20 items-center">
          <TouchableOpacity
            className="bg-[#734DBE] w-11/12 rounded-xl h-14 justify-center"
            onPress={() => router.replace(ERouteTable.SIGIN_IN)}
          >
            <Text className="text-center text-white text-lg font-bold ">Bắt đầu</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Swiper>
  )
}
