import React from 'react'
import { View, Alert } from 'react-native'
import PracticeVS_AI from './index'
import { ChessGameAIState } from '@/hooks/useChessGameAI'

// Ví dụ về cách sử dụng PracticeVS_AI component với kịch bản 3

export default function PracticeVSAIExample() {
  // Handler khi game kết thúc
  const handleGameEnd = (result: string, status: ChessGameAIState['status']) => {
    console.log('Game ended:', result, status)

    // Có thể thêm analytics hoặc lưu kết quả
    // Analytics.track('chess_game_end', { result, status })

    // Show celebration cho victory
    if (result.includes('You win')) {
      setTimeout(() => {
        Alert.alert('🎉 Chúc mừng!', 'Bạn đã thắng AI! Hãy thử độ khó cao hơn.', [
          { text: 'OK', style: 'default' },
        ])
      }, 500)
    }
  }

  // Handler khi có lỗi
  const handleError = (error: string) => {
    console.error('Chess game error:', error)
    Alert.alert('Lỗi', error)
  }

  return (
    <View className="flex-1">
      {/* Kịch bản 1: Game bình thường từ starting position */}
      <PracticeVS_AI initialDifficulty="medium" onGameEnd={handleGameEnd} onError={handleError} />

      {/* 
      Kịch bản 2: Tactical puzzle - Mate in 2
      <PracticeVS_AI
        initialFen="2rq1rk1/pp3pp1/2n1bn1p/2pp4/3P4/P1P1BN2/1PQ2PPP/R3R1K1 w - - 0 1"
        initialDifficulty="hard"
        onGameEnd={handleGameEnd}
        onError={handleError}
      />
      */}

      {/*
      Kịch bản 3: Endgame practice - King and Queen vs King
      <PracticeVS_AI
        initialFen="8/8/8/4k3/8/8/4K3/4Q3 w - - 0 1"
        initialDifficulty="expert"
        onGameEnd={handleGameEnd}
        onError={handleError}
      />
      */}
    </View>
  )
}

// Các kịch bản practice khác nhau:

/* 
// 1. OPENING PRACTICE - Scholar's Mate Defense
const openingPractice = {
  fen: "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 0 1",
  description: "Phòng thủ Scholar's Mate - AI sẽ cố gắng Scholar's Mate, bạn phải phòng thủ"
}

// 2. TACTICAL PUZZLE - Fork
const tacticalFork = {
  fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
  description: "Tìm cách tạo fork với quân mã"
}

// 3. ENDGAME - Rook vs Pawns
const rookEndgame = {
  fen: "8/6k1/6p1/6P1/8/6K1/r7/8 b - - 0 1",
  description: "Endgame xe chống tốt - học cách dùng xe trong endgame"
}

// 4. MIDDLE GAME - King Safety
const kingSafety = {
  fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
  description: "Nhập thành an toàn cho vua trước khi tấn công"
}

// 5. ADVANCED TACTICS - Pin and Skewer
const advancedTactics = {
  fen: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP1NPPP/R1BQK2R w KQ - 0 1",
  description: "Tìm các tactics cao cấp: pin, skewer, discovered attack"
}
*/

// Cách sử dụng trong routing/navigation:

/*
// App.tsx hoặc navigation file
import PracticeVSAIExample from '@/components/PracticeVS_AI/example'

// Stack Navigation
<Stack.Screen 
  name="PracticeAI" 
  component={PracticeVSAIExample}
  options={{ title: 'Thực hành với AI' }}
/>

// Tab Navigation
<Tab.Screen
  name="Practice"
  component={PracticeVSAIExample}
  options={{
    tabBarLabel: 'Thực hành',
    tabBarIcon: ({ color }) => <ChessIcon color={color} />
  }}
/>
*/

// Tích hợp với Learning System:

/*
// LearningMenu.tsx
const practiceOptions = [
  {
    id: 'beginner',
    title: 'Người mới bắt đầu',
    difficulty: 'easy' as AIDifficulty,
    description: 'AI chơi đơn giản, tập trung vào nước đi cơ bản'
  },
  {
    id: 'intermediate', 
    title: 'Trung bình',
    difficulty: 'medium' as AIDifficulty,
    description: 'AI có chiến thuật, thử thách hơn'
  },
  {
    id: 'advanced',
    title: 'Nâng cao', 
    difficulty: 'hard' as AIDifficulty,
    description: 'AI mạnh, yêu cầu kỹ năng tốt'
  },
  {
    id: 'expert',
    title: 'Chuyên gia',
    difficulty: 'expert' as AIDifficulty, 
    description: 'AI rất mạnh, thách thức cao nhất'
  }
]

const handleSelectPractice = (option) => {
  navigation.navigate('PracticeAI', { 
    difficulty: option.difficulty,
    title: option.title 
  })
}
*/

// Analytics và Progress Tracking:

/*
// Trong onGameEnd callback
const trackGameResult = (result: string, status: string) => {
  const gameData = {
    result,
    status,
    difficulty: currentDifficulty,
    moveCount: moveHistory.length,
    duration: Date.now() - gameStartTime,
    playerColor: 'white',
    gameType: 'practice_vs_ai'
  }
  
  // Save to local storage
  AsyncStorage.setItem(
    `game_${Date.now()}`, 
    JSON.stringify(gameData)
  )
  
  // Send to analytics
  Analytics.track('chess_practice_complete', gameData)
  
  // Update player stats
  updatePlayerStats(gameData)
}
*/
