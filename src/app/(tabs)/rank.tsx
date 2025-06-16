import { ImageBackground, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native'
import { images } from '@/constants'
import React, { useEffect, useState } from 'react'
import IconStarRankSmall from '~/assets/icon-svg/IconStarRankSmall'
import { useHome, UserRanking } from '@/hooks/useHome'
import { listDefaultRank, RANK_TIERS } from '@/data/rank'
import HeaderSetting from '@/components/HeaderSetting'
import ModalViewRank from '@/modal/ModalViewRank'
import ImageWithFallback from '@/components/OptimizedImage/ImageWithFallback'

export default function ProfileScreen() {
  const { rankQuery } = useHome()
  const [actionTab, setActiveTab] = useState('Học tập')
  const [dataTab, setDataTab] = useState<UserRanking[]>([])
  const [dataModal, setDataModal] = useState<UserRanking[]>([])
  const [modalVisible, setModalVisible] = useState(false)

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
    const rankTier = RANK_TIERS.find((tier) => score >= tier.minScore && score <= tier.maxScore)

    if (rankTier) {
      setCurrentRank({
        score: score,
        rank: rankTier.rank,
        nextRank: rankTier.nextRank,
        nextScore: rankTier.nextScore,
        name: rankTier.name,
        nameNext: rankTier.nameNext,
      })
    } else {
      // Fallback: nếu không tìm thấy tier phù hợp, sử dụng tier cao nhất
      const highestTier = RANK_TIERS[0]
      setCurrentRank({
        score: score,
        rank: highestTier.rank,
        nextRank: highestTier.nextRank,
        nextScore: highestTier.nextScore,
        name: highestTier.name,
        nameNext: highestTier.nameNext,
      })
    }
  }, [rankQuery.data])

  useEffect(() => {
    if (!rankQuery.data?.rankingsByType) return

    type RankTab = 'Học tập' | 'Thực hành' | 'Chơi cờ'
    type RankType = 'learning' | 'quiz' | 'practice'

    const rankTypeMap: Record<RankTab, RankType> = {
      'Học tập': 'learning',
      'Thực hành': 'quiz',
      'Chơi cờ': 'practice',
    }

    const rankType = rankTypeMap[actionTab as RankTab]
    if (rankType) {
      const rankings = rankQuery.data.rankingsByType[rankType]
      if (rankings) {
        setDataModal(rankings)
        setDataTab(rankings.length > 3 ? rankings.slice(0, 3) : rankings)
      }
    }
  }, [rankQuery.data, actionTab])

  const renderColor = (index: number) => {
    switch (index) {
      case 0:
        return '#734DBE'
      case 1:
        return '#D14EA8'
      default:
        return '#00BCD4'
    }
  }

  const tabRank = [
    {
      title: 'Học tập',
      key: 'Học tập',
    },
    {
      title: 'Thực hành',
      key: 'Thực hành',
    },
    {
      title: 'Chơi cờ',
      key: 'Chơi cờ',
    },
  ]

  return (
    <ImageBackground source={images.bgPlayChess} className="h-full flex-1">
      <HeaderSetting />
      <View className="px-4 mt-24 flex-1">
        <View className="bg-white p-3 rounded-xl relative">
          <View className="absolute -top-28 right-0 left-0 items-center">
            <Image source={currentRank.rank} className="h-[200px] w-[200px]" />
          </View>
          <View className="flex-row justify-between items-center">
            <Image source={images.vua} className="h-36 w-36" />
            <Text className="text-2xl text-[#734DBE] font-semibold mt-20">{currentRank.name}</Text>
            <Image source={images.hau} className="h-36 w-36" />
          </View>
          <View className="flex-row justify-between mt-2">
            <View className="flex-row items-center bg-[#734DBE14] rounded-xl px-2">
              <Image source={currentRank.rank} className="h-8 w-8" />
              <Text className="text-xs text-[#734DBE]">{currentRank.name}</Text>
            </View>
            <View className="flex-row items-center bg-[#734DBE14] rounded-xl px-2">
              <Image source={currentRank.nextRank} className="h-8 w-8" />
              <Text className="text-xs text-[#734DBE]">{currentRank.nameNext}</Text>
            </View>
          </View>
          <View className="h-[6px] bg-[#64748B29] rounded-full mt-4">
            <View
              style={{
                width:
                  currentRank.nextScore === Infinity
                    ? '100%'
                    : `${Math.min((currentRank.score / currentRank.nextScore) * 100, 100)}%`,
              }}
              className="h-[6px] bg-[#734DBE] rounded-full"
            />
          </View>
          <View className="flex-row mt-2 justify-between">
            <Text className="text-[#94A3B8] font-semibold">{currentRank.score}</Text>
            <Text className="text-[#94A3B8] font-semibold">
              {currentRank.nextScore === Infinity ? 'MAX' : currentRank.nextScore}
            </Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-4 mb-2">
          <View>
            {listDefaultRank.map((it) => (
              <View
                key={it.name}
                className="p-2 bg-[#FFFFFF1F] border border-[#FFFFFF52] rounded-xl flex-row items-center justify-between mb-2"
              >
                <View className="flex-row gap-3 items-center">
                  <View className="h-12 w-12 bg-[#FFFFFF3D] items-center justify-center rounded-xl">
                    <Image source={it.image} className="h-10 w-10" />
                  </View>
                  <View>
                    <Text className="font-semibold">{it.name}</Text>
                    <Text numberOfLines={2} className="mt-1 text-[#64748B] max-w-[200px] text-sm">
                      {it.description}
                    </Text>
                  </View>
                </View>
                <View className="flex-row bg-[#FFFFFF3D] py-1 w-[72px] items-center justify-center rounded-2xl gap-1">
                  <IconStarRankSmall />
                  <Text className="font-semibold">{it.star}</Text>
                </View>
              </View>
            ))}
          </View>
          <View className="flex-row justify-evenly mt-8">
            {tabRank.map((it) => (
              <TouchableOpacity
                key={it.title}
                className={
                  actionTab === it.key
                    ? 'p-3.5 rounded-xl bg-[#734DBE]'
                    : 'p-3.5 rounded-xl bg-[#64748B14]'
                }
                onPress={() => setActiveTab(it.key)}
              >
                <Text
                  className={
                    actionTab === it.key
                      ? 'text-white font-semibold'
                      : 'text-[#64748B] font-semibold'
                  }
                >
                  {it.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="border border-[#FFFFFF52] rounded-2xl mt-4">
            <View className="bg-[#FFFFFF1F] p-3 flex-row justify-between items-center">
              <Text className="text-xl font-semibold">{actionTab}</Text>
              <TouchableOpacity>
                <Text
                  className="text-[#64748B] font-semibold"
                  onPress={() => setModalVisible(true)}
                >
                  Xem tất cả
                </Text>
              </TouchableOpacity>
            </View>
            <View className="bg-[#e5d1f8] p-3 rounded-bl-2xl rounded-br-2xl">
              {dataTab &&
                dataTab.length > 0 &&
                dataTab.map((it, index) => {
                  return (
                    <View
                      key={it.id}
                      className="flex-row items-center justify-between border-b border-b-[#FFFFFF52] p-2"
                    >
                      <View className="flex-row items-center gap-4">
                        <View
                          style={{ backgroundColor: renderColor(index) }}
                          className="w-6 h-6 rounded bg-[#734DBE] items-center justify-center"
                        >
                          <Text className="text-xs font-semibold text-white">#{index + 1}</Text>
                        </View>
                        <ImageWithFallback
                          source={
                            it?.avatar
                              ? {
                                  uri: it.avatar,
                                }
                              : undefined
                          }
                          className="h-8 w-8 rounded"
                          showInitials={true}
                          initials={it.fullName?.charAt(0)}
                        />
                        <Text className="font-semibold">{it.fullName}</Text>
                      </View>
                      <Text className="font-semibold">{it.totalScore}</Text>
                    </View>
                  )
                })}
            </View>
          </View>
        </ScrollView>
      </View>
      <ModalViewRank
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
        data={dataModal}
      />
    </ImageBackground>
  )
}
