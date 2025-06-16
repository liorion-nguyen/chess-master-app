import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Square, Chess } from 'chess.js'
import { useChessGame } from '@/hooks/useChessGame'
import ChessBoard from '@/components/chess/components/ChessBoard'
import ChessStatus from '@/components/chess/components/ChessStatus'
import { getPieceIcon } from '@/components/chess/utils/piece-icons'
import { useToast } from '@/components/ToastNotify/ToastContext'

interface LearnChessProps {
  // Danh sách nước đi mong đợi theo notation SAN
  expectedMoves: string[]
  // Vị trí ban đầu (FEN) - nếu không có sẽ dùng starting position
  initialFen?: string
  // Callback khi hoàn thành tất cả các bước
  onComplete?: () => void
  // Callback khi có lỗi
  onError?: (error: string) => void
}

export default function LearnChess({
  expectedMoves,
  initialFen,
  onComplete,
  onError,
}: LearnChessProps) {
  const { showToast } = useToast()

  const {
    // State
    fen,
    selected,
    legalMoves,
    lastMove,
    turn,
    currentStep,

    // Actions
    selectSquare,
    applyMove,
    setupPosition,
    resetGame,
    undoLastMove,
    forceTurn,
  } = useChessGame()

  const [isComplete, setIsComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  // Setup vị trí ban đầu khi component mount
  useEffect(() => {
    if (initialFen) {
      setupPosition(initialFen)
    } else {
      resetGame()
    }
  }, [initialFen, setupPosition, resetGame])

  // Cập nhật progress
  useEffect(() => {
    const newProgress = expectedMoves.length > 0 ? (currentStep / expectedMoves.length) * 100 : 0
    setProgress(newProgress)

    // Kiểm tra xem đã hoàn thành chưa
    if (currentStep >= expectedMoves.length && !isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [currentStep, expectedMoves.length, isComplete, onComplete])

  // Tạo board từ FEN
  const createBoardFromFen = (fen: string) => {
    const chess = new Chess(fen)
    const board = chess.board()
    return board.map((row) => row.map((piece) => getPieceIcon(piece)))
  }

  // Xử lý khi người dùng click vào ô
  const handleSquarePress = (square: Square) => {
    // Trong kịch bản 1: chỉ cho phép quân trắng di chuyển
    if (turn !== 'w') {
      showToast('Chỉ quân trắng được phép di chuyển trong bài học này!', 'error')
      return
    }

    // Kiểm tra xem đã hoàn thành bài học chưa
    if (currentStep >= expectedMoves.length) {
      showToast('Bạn đã hoàn thành bài học!', 'success')
      return
    }

    // Nếu đã chọn một ô và click vào ô hợp lệ để di chuyển
    if (selected && legalMoves.includes(square)) {
      // Lấy expectedMove TRƯỚC KHI thực hiện nước đi
      const expectedMoveIndex = currentStep
      const expectedMove =
        expectedMoveIndex >= 0 && expectedMoveIndex < expectedMoves.length
          ? expectedMoves[expectedMoveIndex]
          : null

      // Thực hiện nước đi
      const move = applyMove(selected, square)

      if (move) {
        console.log(expectedMove, '----')
        console.log(currentStep, '----')

        // Kiểm tra xem nước đi có đúng với expectedMove không
        if (expectedMove && move.san === expectedMove) {
          // Nước đi đúng - tiếp tục
          console.log(`✅ Nước đi đúng: ${move.san}`)

          // Trong kịch bản 1, quân đen không di chuyển, chỉ chuyển lượt về white để tiếp tục
          // Force turn về quân trắng để người dùng có thể tiếp tục đi
          setTimeout(() => {
            forceTurn('w')
          }, 100)
        } else {
          // Nước đi sai hoặc không có expectedMove - undo và thông báo
          undoLastMove()

          const errorMessage = expectedMove
            ? `Sai bước!\nBạn vừa đi: ${move.san}\nBước đúng phải là: ${expectedMove}`
            : `Nước đi không hợp lệ!\nBạn vừa đi: ${move.san}`

          showToast(errorMessage, 'error')

          onError?.(errorMessage)
          console.warn(`❌ ${errorMessage}`)
        }
      }
    } else {
      // Chọn ô mới hoặc bỏ chọn
      selectSquare(square)
    }
  }

  // Reset bài học
  const handleReset = () => {
    if (initialFen) {
      setupPosition(initialFen)
    } else {
      resetGame()
    }
    setIsComplete(false)
    setProgress(0)
  }

  // Lấy nước đi tiếp theo
  const getNextExpectedMove = (): string | null => {
    if (currentStep < expectedMoves.length) {
      return expectedMoves[currentStep]
    }
    return null
  }

  // Hiển thị hint
  const showHint = () => {
    const nextMove = getNextExpectedMove()
    if (nextMove) {
      showToast(`Nước đi tiếp theo: ${nextMove}`, 'success')
    } else {
      showToast('Không có nước đi tiếp theo!', 'error')
    }
  }

  return (
    <View className="flex-1">
      {/* Header với thông tin progress */}
      <View className="bg-[#734DBE] p-4">
        <Text className="text-white text-xl font-bold text-center">Bài học cờ vua</Text>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-white">
            Bước: {currentStep}/{expectedMoves.length}
          </Text>
          <Text className="text-white">Tiến độ: {progress.toFixed(0)}%</Text>
        </View>

        {/* Progress bar */}
        <View className="h-2 bg-white/20 rounded-full mt-2">
          <View
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      {/* Chess Status */}
      <ChessStatus isPlayerTurn={turn === 'w'} />

      {/* Chess Board */}
      <View className="flex-1 items-center justify-center p-4">
        <ChessBoard
          board={createBoardFromFen(fen)}
          onPressSquare={handleSquarePress}
          selected={selected}
          legalMoves={legalMoves}
          lastMove={lastMove}
          disabled={false}
        />
      </View>

      {/* Hiển thị nước đi tiếp theo */}
      {!isComplete && (
        <View className="bg-gray-100 p-4">
          <Text className="text-center text-gray-600">
            Nước đi tiếp theo:{' '}
            <Text className="font-bold text-[#734DBE]">
              {getNextExpectedMove() || 'Hoàn thành!'}
            </Text>
          </Text>
        </View>
      )}

      {/* Controls */}
      <View className="bg-white p-6 border-t border-gray-200">
        <View className="flex-row justify-around">
          <TouchableOpacity
            onPress={handleReset}
            className="bg-gray-500 px-6 w-[40%] items-center py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={showHint}
            className="bg-[#734DBE] w-[40%] items-center px-6 py-3 rounded-lg"
            disabled={isComplete}
          >
            <Text className="text-white font-semibold">{isComplete ? 'Hoàn thành!' : 'Gợi ý'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
