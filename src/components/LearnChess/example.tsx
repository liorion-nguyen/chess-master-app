import React from 'react'
import { View, Alert } from 'react-native'
import LearnChess from './index'

// Ví dụ về cách sử dụng LearnChess component với kịch bản 1

export default function LearnChessExample() {
  // Ví dụ: Khai cuộc Italian Game đơn giản
  const expectedMoves = [
    'e4', // 1. e4
    'Nf3', // 2. Nf3
    'Bc4', // 3. Bc4
    'O-O', // 4. O-O (Castle kingside)
    'd3', // 5. d3
  ]

  // Có thể sử dụng position tùy chỉnh:
  // const customFen = 'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4'
  // const tacticalMoves = ['Ng5', 'Qf3', 'Qxf7#']

  const handleComplete = () => {
    Alert.alert('Chúc mừng! 🎉', 'Bạn đã hoàn thành bài học Italian Game!', [
      { text: 'Tiếp tục', style: 'default' },
    ])
  }

  const handleError = (error: string) => {
    console.log('Learn Chess Error:', error)
    // Có thể gửi analytics hoặc log lỗi ở đây
  }

  return (
    <View className="flex-1">
      <LearnChess
        expectedMoves={expectedMoves}
        // initialFen={customFen} // Uncomment để sử dụng position tùy chỉnh
        onComplete={handleComplete}
        onError={handleError}
      />
    </View>
  )
}

// Cách sử dụng trong routing (expo-router):
// 1. Import trong file screen:
//    import LearnChessExample from '@/components/LearnChess/example'
//
// 2. Hoặc sử dụng trực tiếp:
//    <LearnChess
//      expectedMoves={['e4', 'Nf3', 'Bc4']}
//      onComplete={() => console.log('Done!')}
//    />

/* 
EXAMPLES CỦA CÁC LESSON KHÁC:

// Scholar's Mate (4 moves checkmate)
const scholarsMate = ['e4', 'Bc4', 'Qh5', 'Qxf7#']

// Ruy Lopez Opening  
const ruyLopez = ['e4', 'Nf3', 'Bb5', 'Ba4', 'O-O']

// Tactical Puzzle với custom position
const tacticalFen = 'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4'
const tacticalMoves = ['Ng5', 'Qf3', 'Qxf7#']

// Endgame Study
const endgameFen = '8/8/8/8/8/3K4/4R3/4k3 w - - 0 1'
const endgameMoves = ['Re1+', 'Kd2', 'Re2+', 'Kd3']
*/
