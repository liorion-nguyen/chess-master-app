import React from 'react'
import { View, Alert } from 'react-native'
import LearnChessBoth from './index'

// Ví dụ về cách sử dụng LearnChessBoth component với kịch bản 2

export default function LearnChessBothExample() {
  // Ví dụ 1: Italian Game - Opening sequence hoàn chỉnh
  const italianGameExample = {
    white: [
      'e4', // 1. e4
      'Nf3', // 2. Nf3
      'Bc4', // 3. Bc4
      'O-O', // 4. O-O
      'd3', // 5. d3
    ],
    black: [
      'e5', // 1... e5
      'Nc6', // 2... Nc6
      'Be7', // 3... Be7
      'Nf6', // 4... Nf6
      'd6', // 5... d6
    ],
  }

  // Ví dụ 2: Scholar's Mate Defense - Học cách phòng thủ
  const scholarsMateDefense = {
    white: [
      'e4', // 1. e4
      'Bc4', // 2. Bc4
      'Qh5', // 3. Qh5 (trying Scholar's Mate)
      'Qxf7+', // 4. Qxf7+ (if black plays wrong)
    ],
    black: [
      'e5', // 1... e5
      'Nc6', // 2... Nc6 (better than d6)
      'Nf6', // 3... Nf6 (defending against Qh5)
      'Kd8', // 4... Kd8 (if forced)
    ],
  }

  // Ví dụ 3: Ruy Lopez - Classical opening
  const ruyLopezExample = {
    white: [
      'e4', // 1. e4
      'Nf3', // 2. Nf3
      'Bb5', // 3. Bb5 (Ruy Lopez)
      'Ba4', // 4. Ba4
      'O-O', // 5. O-O
    ],
    black: [
      'e5', // 1... e5
      'Nc6', // 2... Nc6
      'a6', // 3... a6 (Morphy Defense)
      'Nf6', // 4... Nf6
      'Be7', // 5... Be7
    ],
  }

  // Ví dụ 4: Tactical sequence với custom position
  const tacticalExample = {
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
    white: [
      'Ng5', // Attack f7
      'Qf3', // Threaten mate
      'Qxf7#', // Checkmate!
    ],
    black: [
      'd6', // Try to defend
      'Qe7', // Block mate threat
      // No move - mated!
    ],
  }

  // Chọn lesson hiện tại
  const currentLesson = italianGameExample // Có thể đổi thành các lesson khác

  const handleComplete = () => {
    Alert.alert(
      'Chúc mừng! 🎉',
      'Bạn đã hoàn thành bài học cho cả hai bên!\n\nBạn đã học được cách điều khiển cả quân trắng và quân đen theo một kịch bản có kế hoạch.',
      [
        { text: 'Chơi lại', style: 'default' },
        { text: 'Tiếp tục', style: 'default' },
      ],
    )
  }

  const handleError = (error: string, side: 'white' | 'black') => {
    console.log(`Learn Chess Both Error (${side}):`, error)

    // Có thể thêm analytics để track lỗi phổ biến
    // Analytics.track('learn_chess_error', { side, error, lesson: 'italian_game' })
  }

  return (
    <View className="flex-1">
      <LearnChessBoth
        expectedWhiteMoves={currentLesson.white}
        expectedBlackMoves={currentLesson.black}
        // initialFen={tacticalExample.fen} // Uncomment để dùng position tùy chỉnh
        onComplete={handleComplete}
        onError={handleError}
      />
    </View>
  )
}

// Cách sử dụng trong routing hoặc screen khác:

/* 
// 1. Import trực tiếp:
import LearnChessBothExample from '@/components/LearnChessBoth/example'

// 2. Hoặc sử dụng component trực tiếp:
<LearnChessBoth
  expectedWhiteMoves={['e4', 'Nf3', 'Bc4']}
  expectedBlackMoves={['e5', 'Nc6', 'Be7']}
  onComplete={() => console.log('Lesson completed!')}
  onError={(error, side) => console.log(`${side} error:`, error)}
/>

// 3. Với custom position:
<LearnChessBoth
  expectedWhiteMoves={['Ng5', 'Qf3', 'Qxf7#']}
  expectedBlackMoves={['d6', 'Qe7']}
  initialFen="r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4"
  onComplete={() => Alert.alert('Tactical puzzle solved!')}
/>
*/

/* 
LESSON TEMPLATES:

// Beginner Opening
const beginnerOpening = {
  white: ['e4', 'Nf3', 'Bc4', 'O-O'],
  black: ['e5', 'Nc6', 'Nf6', 'Be7']
}

// Center Control
const centerControl = {
  white: ['e4', 'd4', 'Nf3', 'Bd3'],
  black: ['e5', 'd6', 'Nf6', 'Nc6']
}

// King Safety
const kingSafety = {
  white: ['e4', 'Nf3', 'Be2', 'O-O'],
  black: ['e5', 'Nc6', 'Be7', 'O-O']
}

// Tactical Pattern: Pin
const tacticalPin = {
  fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
  white: ['d3', 'Bg5'],
  black: ['f6', 'Bg4']
}
*/
