import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Square, Chess } from 'chess.js'
import { useChessGameBoth } from '@/hooks/useChessGameBoth'
import ChessBoard from '@/components/chess/components/ChessBoard'
import ChessStatus from '@/components/chess/components/ChessStatus'
import { getPieceIcon } from '@/components/chess/utils/piece-icons'
import { useToast } from '@/components/ToastNotify/ToastContext'

interface LearnChessBothProps {
  // Danh sách nước đi mong đợi cho quân trắng
  expectedWhiteMoves: string[]
  // Danh sách nước đi mong đợi cho quân đen
  expectedBlackMoves: string[]
  // Vị trí ban đầu (FEN) - nếu không có sẽ dùng starting position
  initialFen?: string
  // Callback khi hoàn thành tất cả các bước
  onComplete?: () => void
  // Callback khi có lỗi
  onError?: (error: string, side: 'white' | 'black') => void
}

export default function LearnChessBoth({
  expectedWhiteMoves,
  expectedBlackMoves,
  initialFen,
  onComplete,
  onError,
}: LearnChessBothProps) {
  const {
    // State
    fen,
    selected,
    legalMoves,
    lastMove,
    turn,
    currentWhiteStep,
    currentBlackStep,
    isGameOver,
    gameResult,
    status,

    // Actions
    selectSquare,
    applyMove,
    setupPosition,
    resetGame,
    undoLastMove,
    getCurrentPosition,
    getGameHistory,
    setGameStatus,
  } = useChessGameBoth()

  const { showToast } = useToast()

  const [isComplete, setIsComplete] = useState(false)
  const [progress, setProgress] = useState({ white: 0, black: 0, total: 0 })

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
    const whiteProgress =
      expectedWhiteMoves.length > 0 ? (currentWhiteStep / expectedWhiteMoves.length) * 100 : 0
    const blackProgress =
      expectedBlackMoves.length > 0 ? (currentBlackStep / expectedBlackMoves.length) * 100 : 0
    const totalMoves = expectedWhiteMoves.length + expectedBlackMoves.length
    const completedMoves = currentWhiteStep + currentBlackStep
    const totalProgress = totalMoves > 0 ? (completedMoves / totalMoves) * 100 : 0

    setProgress({
      white: whiteProgress,
      black: blackProgress,
      total: totalProgress,
    })

    // Kiểm tra xem đã hoàn thành chưa
    const isWhiteComplete = currentWhiteStep >= expectedWhiteMoves.length
    const isBlackComplete = currentBlackStep >= expectedBlackMoves.length

    if (isWhiteComplete && isBlackComplete && !isComplete) {
      setIsComplete(true)
      setGameStatus('completed')
      onComplete?.()
    }
  }, [
    currentWhiteStep,
    currentBlackStep,
    expectedWhiteMoves.length,
    expectedBlackMoves.length,
    isComplete,
    onComplete,
    setGameStatus,
  ])

  // Tạo board từ FEN
  const createBoardFromFen = (fen: string) => {
    const chess = new Chess(fen)
    const board = chess.board()
    return board.map((row) => row.map((piece) => getPieceIcon(piece)))
  }

  // Xử lý khi người dùng click vào ô
  const handleSquarePress = (square: Square) => {
    // Kiểm tra xem đã hoàn thành bài học chưa
    if (isComplete) {
      showToast('Bạn đã hoàn thành bài học!', 'success')
      return
    }

    // Kiểm tra game over
    if (isGameOver) {
      showToast(gameResult || 'Trò chơi đã kết thúc!', 'error')
      return
    }

    // Nếu đã chọn một ô và click vào ô hợp lệ để di chuyển
    if (selected && legalMoves.includes(square)) {
      // Lấy expectedMove TRƯỚC KHI thực hiện nước đi
      const expectedWhiteMove =
        currentWhiteStep >= 0 && currentWhiteStep < expectedWhiteMoves.length
          ? expectedWhiteMoves[currentWhiteStep]
          : null

      const expectedBlackMove =
        currentBlackStep >= 0 && currentBlackStep < expectedBlackMoves.length
          ? expectedBlackMoves[currentBlackStep]
          : null

      // Thực hiện nước đi
      const move = applyMove(selected, square)

      if (move) {
        // Xác định bên nào vừa di chuyển và expected move tương ứng
        if (move.color === 'w') {
          // Quân trắng vừa di chuyển
          const expectedMove = expectedWhiteMove

          if (expectedMove && move.san === expectedMove) {
            // Nước đi đúng
            console.log(`✅ White move correct: ${move.san}`)

            // Kiểm tra xem white đã hoàn thành chưa
            if (currentWhiteStep + 1 >= expectedWhiteMoves.length) {
              console.log('🎯 White completed all moves!')
            }
          } else {
            // Nước đi sai hoặc không có expectedMove - undo và thông báo
            undoLastMove()

            const errorMessage = expectedMove
              ? `Sai bước quân Trắng!\nBạn vừa đi: ${move.san}\nBước đúng phải là: ${expectedMove}`
              : `Nước đi không hợp lệ (Trắng)!\nBạn vừa đi: ${move.san}`

            showToast(errorMessage, 'error')

            onError?.(errorMessage, 'white')
          }
        } else {
          // Quân đen vừa di chuyển
          const expectedMove = expectedBlackMove

          if (expectedMove && move.san === expectedMove) {
            // Nước đi đúng
            console.log(`✅ Black move correct: ${move.san}`)

            // Kiểm tra xem black đã hoàn thành chưa
            if (currentBlackStep + 1 >= expectedBlackMoves.length) {
              console.log('🎯 Black completed all moves!')
            }
          } else {
            // Nước đi sai hoặc không có expectedMove - undo và thông báo
            undoLastMove()

            const errorMessage = expectedMove
              ? `Sai bước quân Đen!\nBạn vừa đi: ${move.san}\nBước đúng phải là: ${expectedMove}`
              : `Nước đi không hợp lệ (Đen)!\nBạn vừa đi: ${move.san}`

            showToast(errorMessage, 'error')

            onError?.(errorMessage, 'black')
          }
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
    setProgress({ white: 0, black: 0, total: 0 })
  }

  // Lấy nước đi tiếp theo cho side hiện tại
  const getNextExpectedMove = (): { move: string | null; side: 'white' | 'black' } => {
    if (turn === 'w' && currentWhiteStep < expectedWhiteMoves.length) {
      return { move: expectedWhiteMoves[currentWhiteStep], side: 'white' }
    } else if (turn === 'b' && currentBlackStep < expectedBlackMoves.length) {
      return { move: expectedBlackMoves[currentBlackStep], side: 'black' }
    }
    return { move: null, side: turn === 'w' ? 'white' : 'black' }
  }

  // Hiển thị hint
  const showHint = () => {
    const { move, side } = getNextExpectedMove()
    if (move) {
      const sideText = side === 'white' ? 'Trắng' : 'Đen'
      showToast(`Nước đi tiếp theo (${sideText}): ${move}`, 'success')
    } else {
      showToast('Không có nước đi tiếp theo!', 'error')
    }
  }

  // Lấy thông tin bước hiện tại
  const getCurrentStepInfo = () => {
    const { move, side } = getNextExpectedMove()
    const sideText = side === 'white' ? 'Trắng' : 'Đen'
    const stepNumber = side === 'white' ? currentWhiteStep + 1 : currentBlackStep + 1
    const totalSteps = side === 'white' ? expectedWhiteMoves.length : expectedBlackMoves.length

    return {
      move,
      side: sideText,
      stepNumber,
      totalSteps,
      isCurrentTurn: (side === 'white' && turn === 'w') || (side === 'black' && turn === 'b'),
    }
  }

  const stepInfo = getCurrentStepInfo()

  return (
    <View className="flex-1">
      {/* Header với thông tin progress */}
      <View className="bg-[#734DBE] p-4">
        <Text className="text-white text-xl font-bold text-center">
          Bài học cờ vua (Cả hai bên)
        </Text>

        {/* Progress cho từng bên */}
        <View className="flex-row justify-between items-center mt-2">
          <View className="flex-1">
            <Text className="text-white text-xs">
              Trắng: {currentWhiteStep}/{expectedWhiteMoves.length}
            </Text>
            <View className="h-1 bg-white/20 rounded-full mt-1">
              <View
                className="h-full bg-white rounded-full"
                style={{ width: `${progress.white}%` }}
              />
            </View>
          </View>

          <View className="mx-4">
            <Text className="text-white text-xs text-center">
              Tổng: {progress.total.toFixed(0)}%
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-white text-xs text-right">
              Đen: {currentBlackStep}/{expectedBlackMoves.length}
            </Text>
            <View className="h-1 bg-white/20 rounded-full mt-1">
              <View
                className="h-full bg-black rounded-full"
                style={{ width: `${progress.black}%` }}
              />
            </View>
          </View>
        </View>

        {/* Progress bar tổng */}
        <View className="h-2 bg-white/20 rounded-full mt-3">
          <View
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress.total}%` }}
          />
        </View>
      </View>

      {/* Chess Status */}
      <ChessStatus isPlayerTurn={true} />

      {/* Current Turn và Instructions */}
      <View className="mb-4 px-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-lg font-semibold">
              Lượt:{' '}
              <Text className={turn === 'w' ? 'text-blue-600' : 'text-red-600'}>
                {turn === 'w' ? 'Trắng' : 'Đen'}
              </Text>
            </Text>

            {stepInfo.move && (
              <Text className="text-sm text-gray-600 mt-1">
                Bước {stepInfo.stepNumber}/{stepInfo.totalSteps} ({stepInfo.side}):
                <Text className="font-bold text-[#734DBE]"> {stepInfo.move}</Text>
              </Text>
            )}
          </View>

          {/* Status indicator */}
          <View
            className={`w-4 h-4 rounded-full ${
              stepInfo.isCurrentTurn ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        </View>
      </View>

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

      {/* Controls */}
      <View className="bg-white p-6 border-t border-gray-200">
        <View className="flex-row justify-around">
          <TouchableOpacity
            onPress={handleReset}
            className="bg-gray-500 w-[40%] items-center px-6 py-3 rounded-lg"
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
