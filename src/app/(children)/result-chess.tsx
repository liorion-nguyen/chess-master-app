import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import { images } from '@/constants'
import { router, useLocalSearchParams } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { ERouteTable } from '@/constants/route-table'
import React from 'react'
import IconStarRank from '~/assets/icon-svg/IconStarRank'

const ResultChess = () => {
  const { type } = useLocalSearchParams<{
    type: string
  }>()

  return (
    <ImageBackground
      className="h-full flex-1"
      source={type === 'win' ? images.quizSuccess : images.quizUnSuccess}
    >
      <View className="flex-1 px-4 mt-20">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-[#64748B14] h-12 w-12 mt-12 items-center justify-center rounded-full"
        >
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center justify-center mt-60">
          <Text
            className={`text-3xl font-bold ${type === 'win' ? 'text-[#008E4A]' : 'text-[#D32F2F]'}`}
          >
            {type === 'win' ? 'Bạn đã thắng!' : 'Bạn đã thua!'}
          </Text>

          <View className="flex-row my-6 justify-center items-center w-40 h-12 bg-[#D14EA8] border border-white rounded-2xl">
            <Text className="text-white text-3xl font-bold">{type === 'win' ? '+20' : '-30'}</Text>
            <IconStarRank />
          </View>

          <Text className="text-center px-20 mt-10">
            {type === 'win'
              ? `Vua di chuyển chậm, nhưng vẫn là người quan trọng nhất bàn cờ!`
              : 'Muốn làm cao thủ cờ vua? Bắt đầu bằng cách không ngủ gật giữa trận!'}
          </Text>
        </View>
      </View>
      <View className="px-4 mb-10">
        <TouchableOpacity
          className="bg-[#FF9800] py-3 px-6 rounded-2xl mb-4"
          onPress={() => {
            router.back()
          }}
        >
          <Text className="text-white text-center font-semibold text-lg">Xem lại thế cờ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#734DBE] py-3 px-6 rounded-2xl"
          onPress={() => router.push(ERouteTable.HOME)}
        >
          <Text className="text-white text-center font-semibold text-lg">Về trang chủ</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}
export default ResultChess
