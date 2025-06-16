import { Image, Pressable, Text, View } from 'react-native'
import { images } from '@/constants'
import IconCheckActive from '~/assets/icon-svg/IconCheckActive'
import IconCheck from '~/assets/icon-svg/IconCheck'
import IconBigLock from '~/assets/icon-svg/IconBigLock'
import React from 'react'
import ImageWithFallback from '@/components/OptimizedImage/ImageWithFallback'

export interface IDataItemLessonHomeProps {
  thumb: string
  description: string
  title: string
  rank: string
  isCompleted: boolean
  category: {
    id: number
    title: string
  }
  score: {
    score: number
    totalScore: number
  }
  id: number
  isLocked: boolean
  image: string
}

interface IItemLessonHomeProps {
  data: IDataItemLessonHomeProps
  onPress: () => void
}

export default function ItemLessonHome({ data, onPress }: IItemLessonHomeProps) {
  // console.log(data?.image)
  return (
    <Pressable
      onPress={onPress}
      className={`bg-[#64748B14] p-1 mb-1 rounded-2xl flex-row justify-between items-center ${data.isLocked ? 'opacity-[48%]' : ''}`}
    >
      <View className="flex-row gap-4 items-center">
        <View>
          <ImageWithFallback
            source={
              data?.image
                ? {
                    uri: data?.image,
                  }
                : undefined
            }
            className="h-[96px] w-[96px] rounded-3xl"
            showInitials={true}
            initials={data.title}
            style={{ borderRadius: 24 }}
          />
          {data.isLocked && (
            <View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center">
              <IconBigLock />
            </View>
          )}
        </View>

        <View className="max-w-[60%]">
          <Text className="text-[#E77828]" numberOfLines={2}>
            {data.title}
          </Text>
          <Text className="text-[#1E293B] font-semibold my-1" numberOfLines={1}>
            {data.description}
          </Text>
          <Text className="text-[#94A3B8] mt-1">{data?.category?.title}</Text>
        </View>
      </View>
      <View className="bg-white rounded-xl mr-2">
        {data.isCompleted ? <IconCheckActive /> : <IconCheck />}
      </View>
      <Text className="text-base absolute right-2 bottom-3 text-[#734DBE] font-semibold">
        {data?.score?.score || 0}
        <Text className="font-normal">/{data?.score?.totalScore || 100}</Text>
      </Text>
    </Pressable>
  )
}
