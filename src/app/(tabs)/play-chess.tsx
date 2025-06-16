import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'
import { images } from '@/constants'
import IconSetting from '~/assets/icon-svg/IconSetting'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import IconStarRank from '~/assets/icon-svg/IconStarRank'
import { useSettings } from '@/hooks/useSettings'
import { RANK_TIERS } from '@/data/rank'
import { useHome } from '@/hooks/useHome'

export default function LearnScreen() {
  const { userQuery, loseWinQuery } = useSettings()
  const { rankQuery } = useHome()

  const [currentRank, setCurrentRank] = useState({
    score: 0,
    rank: images.rankBronze,
    nextRank: images.rankSliver,
    nextScore: 1000,
    name: 'HẠNG ĐỒNG',
    nameNext: 'HẠNG BẠC',
  })

  useEffect(() => {
    if (!rankQuery.data?.totalScore) return

    const score = rankQuery.data.totalScore
    const rankTier = RANK_TIERS.find((tier) => score > tier.minScore && score <= tier.maxScore)

    if (rankTier) {
      setCurrentRank({
        score: score,
        rank: rankTier.rank,
        nextRank: rankTier.nextRank,
        nextScore: rankTier.nextScore,
        name: rankTier.name,
        nameNext: rankTier.nameNext,
      })
    }
  }, [rankQuery.data])

  return (
    <ImageBackground source={images.bgChoiCo} className="flex-1 bg-[#E3CBF7]">
      <View className="mt-20 mx-4 flex-1">
        <View className="flex-row justify-between w-full items-center">
          <Image
            source={{
              uri:
                userQuery?.data?.avatar ??
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoExoFiajbHD5Yxg0Bj2T9Wh2WfTRFAsdhSw&s',
            }}
            className="w-[48px] h-[48px] rounded-full"
            resizeMode="cover"
          />
          <Text className="font-semibold text-lg">Chơi cờ</Text>
          <TouchableOpacity
            onPress={() => router.push(ERouteTable.SETTING_SCREEN)}
            className="w-[48px] h-[48px] bg-[#64748B14] items-center justify-center rounded-full"
          >
            <IconSetting />
          </TouchableOpacity>
        </View>
        <View className="items-center mt-6 w-full">
          <View className="flex-row justify-between border border-[#FFFFFF52] bg-[#FFFFFF1F w-full p-3 rounded-2xl">
            <View className="flex-row items-center">
              <IconStarRank />
              <Text className="text-3xl font-bold text-[#734DBE] ml-1">
                {loseWinQuery?.data?.score > 0 ? loseWinQuery?.data?.score : 0}
                <Text className="text-sm font-normal text-[#AE86E0]"> điểm</Text>
              </Text>
            </View>
            <View className="flex-row items-center bg-[#734DBE14] rounded-xl p-2">
              <Image source={currentRank.rank} className="h-8 w-8" />
              <Text className="text-xs text-[#734DBE]">{currentRank.name}</Text>
            </View>
          </View>
          <View className="mt-2">
            <Text className="text-[#D14EA8] font-semibold">
              {loseWinQuery?.data?.winCount} Thắng <Text className="text-white">| </Text>{' '}
              {loseWinQuery?.data?.loseCount} Thua
            </Text>
          </View>
        </View>
      </View>
      <View className="px-4 mb-8">
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: ERouteTable.PRACTICE_CHESS,
              params: { type: 'black' },
            })
          }}
          className="bg-[#734DBE] w-full h-12 rounded-2xl items-center justify-center"
        >
          <Text className="font-semibold text-xl text-white">Chơi với máy</Text>
        </TouchableOpacity>
      </View>
      {/*<ModalSelectMode onClose={() => setOpenModal(false)} visible={openModal} />*/}
    </ImageBackground>
  )
}
