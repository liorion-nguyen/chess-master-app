// src/screens/PracticeChess.tsx
import React, { useState } from 'react'
import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native'
import { images } from '@/constants'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'

// Import các components cho 3 kịch bản
import LearnChessComponent from '@/components/LearnChess'
import LearnChessBothComponent from '@/components/LearnChessBoth'
import PracticeVSAIComponent from '@/components/PracticeVS_AI'
import {
  allScenariosData,
  getScenarioExamples,
} from '@/components/chess/utils/chess-scenarios-data'

// Import data examples

// Types cho scenarios
type ChessScenario = 1 | 2 | 3

interface ScenarioConfig {
  id: ChessScenario
  title: string
  subtitle: string
  color: string
  icon: string
}

export default function TestChess() {
  const [currentScenario, setCurrentScenario] = useState<ChessScenario>(1)
  const [showScenarioSelector, setShowScenarioSelector] = useState(true)
  const [showExampleSelector, setShowExampleSelector] = useState(false)
  const [selectedExample, setSelectedExample] = useState<string>('opening_basics')

  // Cấu hình cho các kịch bản
  const scenarios: ScenarioConfig[] = [
    {
      id: 1,
      title: 'Học Nước Đi Cơ Bản',
      subtitle: 'Kịch bản 1: Học từng nước một theo kịch bản',
      color: 'bg-blue-500',
      icon: '📚',
    },
    {
      id: 2,
      title: 'Học Kịch Bản Hoàn Chỉnh',
      subtitle: 'Kịch bản 2: Điều khiển cả hai bên theo scenario',
      color: 'bg-green-500',
      icon: '🎭',
    },
    {
      id: 3,
      title: 'Thực Hành với AI',
      subtitle: 'Kịch bản 3: Chơi tự do với máy tính',
      color: 'bg-purple-500',
      icon: '🤖',
    },
  ]

  // Lấy data cho scenario hiện tại
  const getCurrentScenarioData = () => {
    const scenarioData = allScenariosData[currentScenario]
    const currentExample = scenarioData[selectedExample as keyof typeof scenarioData]
    return currentExample || Object.values(scenarioData)[0]
  }

  // Handlers cho events
  const handleScenario1Complete = () => {
    Alert.alert('🎉 Hoàn thành!', 'Bạn đã hoàn thành bài học! Hãy thử bài học khác.', [
      { text: 'Chọn bài khác', onPress: () => setShowExampleSelector(true) },
      { text: 'Tiếp tục', style: 'cancel' },
    ])
  }

  const handleScenario1Error = (error: string) => {
    console.log('Scenario 1 error:', error)
  }

  const handleScenario2Complete = () => {
    Alert.alert(
      '🎉 Hoàn thành!',
      'Bạn đã hoàn thành kịch bản! Thử kịch bản khác hoặc chuyển sang Practice vs AI.',
      [
        { text: 'Chọn kịch bản khác', onPress: () => setShowExampleSelector(true) },
        { text: 'Practice vs AI', onPress: () => setCurrentScenario(3) },
        { text: 'Tiếp tục', style: 'cancel' },
      ],
    )
  }

  const handleScenario2Error = (error: string, side: 'white' | 'black') => {
    console.log('Scenario 2 error:', error, 'Side:', side)
  }

  const handleScenario3GameEnd = (result: string, status: any) => {
    const isWin = result.includes('You win')
    Alert.alert(isWin ? '🏆 Thắng!' : '📋 Kết thúc!', result, [
      { text: 'Chơi lại', onPress: () => {} }, // Component sẽ tự reset
      { text: 'Thử thách khác', onPress: () => setShowExampleSelector(true) },
      { text: 'OK', style: 'cancel' },
    ])
  }

  const handleScenario3Error = (error: string) => {
    console.log('Scenario 3 error:', error)
  }

  // Render scenario selector
  const renderScenarioSelector = () => (
    <View className="flex-1 justify-center">
      <View className="bg-white/90 mx-4 rounded-lg p-6">
        <Text className="text-2xl font-bold text-center mb-2">Chọn Kịch Bản Học Cờ</Text>
        <Text className="text-gray-600 text-center mb-6">
          Chọn phương pháp học phù hợp với trình độ của bạn
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {scenarios.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              onPress={() => {
                setCurrentScenario(scenario.id)
                setShowScenarioSelector(false)
                setShowExampleSelector(true)
              }}
              className={`${scenario.color} rounded-lg p-4 mb-3 shadow-lg`}
            >
              <View className="flex-row items-center">
                <Text className="text-3xl mr-3">{scenario.icon}</Text>
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold">{scenario.title}</Text>
                  <Text className="text-white/90 text-sm mt-1">{scenario.subtitle}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  )

  // Render example selector cho scenario hiện tại
  const renderExampleSelector = () => {
    const examples = getScenarioExamples(currentScenario)
    const currentScenarioInfo = scenarios.find((s) => s.id === currentScenario)

    return (
      <View className="flex-1 justify-center">
        <View className="bg-white/90 mx-4 rounded-lg p-6 max-h-[70%]">
          <Text className="text-xl font-bold text-center mb-2">
            {currentScenarioInfo?.icon} {currentScenarioInfo?.title}
          </Text>
          <Text className="text-gray-600 text-center mb-4">Chọn bài học hoặc thử thách</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {examples.map(({ key, data }) => (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  setSelectedExample(key)
                  setShowExampleSelector(false)
                }}
                className={`${currentScenarioInfo?.color} rounded-lg p-4 mb-3 shadow-lg`}
              >
                <Text className="text-white text-lg font-bold mb-1">{(data as any).title}</Text>
                <Text className="text-white/90 text-sm">{(data as any).description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={() => setShowScenarioSelector(true)}
            className="bg-gray-500 rounded-lg p-3 mt-3"
          >
            <Text className="text-white text-center font-semibold">← Chọn kịch bản khác</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Render current scenario component
  const renderCurrentScenario = () => {
    const data = getCurrentScenarioData()

    switch (currentScenario) {
      case 1:
        return (
          <LearnChessComponent
            expectedMoves={(data as any).expectedMoves}
            initialFen={(data as any).initialFen}
            onComplete={handleScenario1Complete}
            onError={handleScenario1Error}
          />
        )

      case 2:
        return (
          <LearnChessBothComponent
            expectedWhiteMoves={(data as any).expectedWhiteMoves}
            expectedBlackMoves={(data as any).expectedBlackMoves}
            initialFen={(data as any).initialFen}
            onComplete={handleScenario2Complete}
            onError={handleScenario2Error}
          />
        )

      case 3:
        return (
          <PracticeVSAIComponent
            initialDifficulty={(data as any).initialDifficulty}
            initialFen={(data as any).initialFen}
            onGameEnd={handleScenario3GameEnd}
            onError={handleScenario3Error}
          />
        )

      default:
        return renderScenarioSelector()
    }
  }

  // Get current scenario info
  const getCurrentScenarioInfo = () => {
    return scenarios.find((s) => s.id === currentScenario)
  }

  // Get current example info
  const getCurrentExampleInfo = () => {
    return getCurrentScenarioData()
  }

  return (
    <View>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <ImageBackground className="h-full" source={images.bgPlayChess}>
        {/* Header với navigation và scenario info */}
        <View className="flex-row flex items-center pb-2 relative mb-4 mt-24">
          <TouchableOpacity
            onPress={() => {
              // Back navigation logic
              if (showScenarioSelector) {
                // Đang ở Scenario Selector → Thoát về màn hình trước
                router.back()
              } else if (showExampleSelector) {
                // Đang ở Example Selector → Về Scenario Selector
                setShowScenarioSelector(true)
                setShowExampleSelector(false)
              } else {
                // Đang ở trong Game → Về Example Selector
                setShowExampleSelector(true)
              }
            }}
            className="absolute ml-4 bottom-0 bg-[#64748B14] h-12 w-12 items-center justify-center rounded-full"
          >
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>

          {/* Scenario Title */}
          {!showScenarioSelector && !showExampleSelector && (
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-center">
                {getCurrentScenarioInfo()?.icon} {(getCurrentExampleInfo() as any)?.title}
              </Text>
              <TouchableOpacity onPress={() => setShowExampleSelector(true)} className="mt-1">
                <Text className="text-sm text-blue-600 underline">Thay đổi bài học</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Main Content */}
        {showScenarioSelector ? (
          renderScenarioSelector()
        ) : showExampleSelector ? (
          renderExampleSelector()
        ) : (
          <View className="flex-1">{renderCurrentScenario()}</View>
        )}
      </ImageBackground>
    </View>
  )
}
