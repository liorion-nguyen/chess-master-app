import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import HeaderHome from '@/components/HeaderHome'
import IconSearch from '~/assets/icon-svg/IconSearch'
import { useEffect, useState } from 'react'
import ItemLessonHome from '@/components/ItemLessonHome'
import { ERouteTable } from '@/constants/route-table'
import { useHome } from '@/hooks/useHome'
import { useIsFocused } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import { ScrollView } from 'react-native'

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<any>(1)
  const { categoriesQuery, learningItemsQuery } = useHome(activeTab)
  const isFocused = useIsFocused()
  const queryClient = useQueryClient()

  useEffect(() => {
    setActiveTab(1)
    queryClient.invalidateQueries({
      queryKey: ['categories'],
    })
    queryClient.invalidateQueries({
      queryKey: ['learningItems', categoriesQuery.data?.[0]?.id],
    })
  }, [isFocused])

  return (
    <View className="bg-white flex-1">
      <HeaderHome />
      <View className="relative m-4">
        <TextInput
          className="w-full p-3 pl-14 h-14 bg-[#F4F6F8] rounded-xl"
          placeholder="Tìm kiếm"
          value=""
        />
        <View className="absolute top-3 left-4">
          <IconSearch />
        </View>
      </View>
      <View className="m-4 flex-1">
        <ScrollView className="max-h-12" horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-4 items-start">
            {categoriesQuery.data?.map((category, index) => (
              <TouchableOpacity
                key={category.title}
                className={
                  activeTab === category.id
                    ? 'p-3.5 rounded-xl bg-[#734DBE]'
                    : 'p-3.5 rounded-xl bg-[#64748B14]'
                }
                onPress={() => {
                  setActiveTab(category.id)
                }}
              >
                <Text
                  className={
                    activeTab === category.id
                      ? 'text-white font-semibold'
                      : 'text-[#64748B] font-semibold'
                  }
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View className="flex-row justify-between mt-4 items-center">
          <Text className="text-xl font-semibold">Tiến độ</Text>
          <Text className="font-semibold text-[#EC4899]">
            {categoriesQuery.data?.find((it) => it.id === activeTab)?.completedCourses}/
            {categoriesQuery.data?.find((it) => it.id === activeTab)?.totalCourses}
          </Text>
        </View>
        {learningItemsQuery.isLoading ? (
          <ActivityIndicator size="small" color="#734DBE" className="mt-8" />
        ) : (
          <FlatList
            className="flex-1 mt-4"
            showsVerticalScrollIndicator={false}
            data={learningItemsQuery.data}
            renderItem={({ item }) => (
              <ItemLessonHome
                data={item}
                onPress={() =>
                  router.push({
                    pathname: ERouteTable.DETAIL_LESSON,
                    params: {
                      coursesId: item.id,
                      score: item?.score?.score || 0,
                      totalScore: item?.score?.totalScore || 100,
                    },
                  })
                }
              />
            )}
          />
        )}
      </View>
    </View>
  )
}
