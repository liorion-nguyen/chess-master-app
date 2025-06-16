import ModalComponent from '@/components/ModalComponent'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { UserRanking } from '@/hooks/useHome'
import ImageWithFallback from '@/components/OptimizedImage/ImageWithFallback'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'

interface IModalWarningChessProps {
  onClose: () => void
  visible: boolean
  onQuit?: () => void
}

export default function ModalWarningChess({ onClose, visible, onQuit }: IModalWarningChessProps) {
  return (
    <ModalComponent onClose={onClose} visible={visible}>
      <Text className="mt-6 text-center font-semibold text-xl text-[#FF0000]">Cảnh báo!</Text>
      <Text className="mt-6 text-center font-semibold text-xl text-[#734DBE]">
        Nếu thoát bạn sẽ bị trừ điểm
      </Text>
      <Text className="mt-2 text-center text-xl">Bạn có thực sự muốn thoát?</Text>
      <View className="flex-row gap-4 mt-10">
        <TouchableOpacity className="bg-green-500 py-3 px-6 rounded-2xl" onPress={onClose}>
          <Text className="text-white text-center font-semibold text-lg">Chơi tiếp</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#734DBE] py-3 px-6 rounded-2xl" onPress={onQuit}>
          <Text className="text-white text-center font-semibold text-lg">Thoát</Text>
        </TouchableOpacity>
      </View>
    </ModalComponent>
  )
}
