import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Modal } from 'react-native'
import { Square, Chess } from 'chess.js'
import { useChessGameAI, ChessGameAIState } from '@/hooks/useChessGameAI'
import { AIDifficulty } from '@/hooks/useChessAI'
import ChessBoard from '@/components/chess/components/ChessBoard'
import ChessStatus from '@/components/chess/components/ChessStatus'
import { getPieceIcon } from '@/components/chess/utils/piece-icons'
import { useToast } from '@/components/ToastNotify/ToastContext'

interface PracticeVSAIProps {
  // Vị trí ban đầu (FEN) - nếu không có sẽ dùng starting position
  initialFen?: string
  // Độ khó AI ban đầu
  initialDifficulty?: AIDifficulty
  // Callback khi game kết thúc
  onGameEnd?: (result: string, status: ChessGameAIState['status']) => void
  // Callback khi có error
  onError?: (error: string) => void
}

const DifficultySelector = ({
  difficulty,
  onSelect,
  disabled,
}: {
  difficulty: AIDifficulty
  onSelect: (difficulty: AIDifficulty) => void
  disabled: boolean
}) => {
  const difficulties: { key: AIDifficulty; label: string; color: string }[] = [
    { key: 'easy', label: 'Dễ', color: 'bg-green-500' },
    { key: 'medium', label: 'Trung bình', color: 'bg-yellow-500' },
    { key: 'hard', label: 'Khó', color: 'bg-orange-500' },
    { key: 'expert', label: 'Chuyên gia', color: 'bg-red-500' },
  ]

  return (
    <View className="flex-row justify-center space-x-2 mb-2">
      {difficulties.map(({ key, label, color }) => (
        <TouchableOpacity
          key={key}
          onPress={() => onSelect(key)}
          disabled={disabled}
          className={`px-3 py-1 rounded-full ${
            difficulty === key ? color : 'bg-gray-300'
          } ${disabled ? 'opacity-50' : ''}`}
        >
          <Text
            className={`text-xs font-medium ${difficulty === key ? 'text-white' : 'text-gray-700'}`}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default function PracticeVS_AI({
  initialFen,
  initialDifficulty = 'medium',
  onGameEnd,
  onError,
}: PracticeVSAIProps) {
  const { showToast } = useToast()

  const {
    // State
    fen,
    selected,
    legalMoves,
    lastMove,
    turn,
    isPlayerTurn,
    isGameOver,
    gameResult,
    status,
    difficulty,
    aiThinking,
    moveHistory,

    // Actions
    selectSquare,
    playerMove,
    setupPosition,
    resetGame,
    undoLastMove,
    getCurrentPosition,
    setDifficulty,
    getSuggestion,
  } = useChessGameAI(initialDifficulty)

  const [showGameOverModal, setShowGameOverModal] = useState(false)

  // Setup vị trí ban đầu khi component mount
  useEffect(() => {
    if (initialFen) {
      setupPosition(initialFen)
    } else {
      resetGame()
    }
  }, [initialFen, setupPosition, resetGame])

  // Xử lý khi game kết thúc
  useEffect(() => {
    if (isGameOver && gameResult) {
      setShowGameOverModal(true)
      onGameEnd?.(gameResult, status)
    }
  }, [isGameOver, gameResult, status, onGameEnd])

  // Tạo board từ FEN
  const createBoardFromFen = (fen: string) => {
    const chess = new Chess(fen)
    const board = chess.board()
    return board.map((row) => row.map((piece) => getPieceIcon(piece)))
  }

  // Xử lý khi người dùng click vào ô
  const handleSquarePress = async (square: Square) => {
    // Không cho phép tương tác khi AI đang suy nghĩ hoặc game đã kết thúc
    if (aiThinking || isGameOver || !isPlayerTurn) {
      return
    }

    try {
      // Nếu đã chọn một ô và click vào ô hợp lệ để di chuyển
      if (selected && legalMoves.includes(square)) {
        const success = await playerMove(square)
        if (!success) {
          onError?.('Invalid move!')
        }
      } else {
        // Chọn ô mới hoặc bỏ chọn
        selectSquare(square)
      }
    } catch (error) {
      console.error('Square press error:', error)
      onError?.('Error processing move')
    }
  }

  // Reset game
  const handleReset = () => {
    if (initialFen) {
      setupPosition(initialFen)
    } else {
      resetGame()
    }
    setShowGameOverModal(false)
  }

  // Undo last move
  const handleUndo = () => {
    if (moveHistory.length >= 2 && !aiThinking && !isGameOver) {
      undoLastMove()
    }
  }

  // Show hint
  const showHint = () => {
    if (!isPlayerTurn || aiThinking || isGameOver) {
      showToast('Không thể hiển thị gợi ý lúc này!', 'error')
      return
    }

    const suggestion = getSuggestion()
    if (suggestion) {
      showToast(
        `Nước đi gợi ý: ${suggestion.san}\nTừ ${suggestion.from} đến ${suggestion.to}`,
        'success',
      )
    } else {
      showToast('Không có gợi ý nào khả dụng!', 'error')
    }
  }

  // Lấy status text và color
  const getStatusInfo = () => {
    if (aiThinking) {
      return { text: 'AI đang suy nghĩ...', color: 'text-blue-600' }
    } else if (isGameOver) {
      return { text: 'Game kết thúc', color: 'text-red-600' }
    } else if (isPlayerTurn) {
      return { text: 'Lượt của bạn', color: 'text-green-600' }
    } else {
      return { text: 'Lượt của AI', color: 'text-orange-600' }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <View className="flex-1">
      {/* Header với thông tin game */}
      <View className="bg-[#734DBE] p-4">
        <Text className="text-white text-xl font-bold text-center">Thực hành với AI</Text>

        {/* Difficulty Selector */}
        <View className="mt-3">
          <Text className="text-white text-sm text-center mb-2">Độ khó AI:</Text>
          <DifficultySelector
            difficulty={difficulty}
            onSelect={setDifficulty}
            disabled={!isPlayerTurn || aiThinking || isGameOver}
          />
        </View>

        {/* Game Status */}
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-white text-sm">Nước đi: {moveHistory.length}</Text>
          <Text
            className={`text-sm font-semibold ${statusInfo.color.replace('text-', 'text-white')}`}
          >
            {statusInfo.text}
          </Text>
          <Text className="text-white text-sm">{turn === 'w' ? '⚪ Trắng' : '⚫ Đen'}</Text>
        </View>
      </View>

      {/* Chess Status Component */}
      <ChessStatus isPlayerTurn={isPlayerTurn} />

      {/* Chess Board */}
      <View className="flex-1 items-center justify-center p-4">
        {/* AI Thinking Overlay */}
        {aiThinking && (
          <View className="absolute inset-0 bg-black/10 z-10 items-center justify-center">
            <View className="bg-white p-4 rounded-lg shadow-lg items-center">
              <ActivityIndicator size="large" color="#734DBE" />
              <Text className="text-lg font-semibold mt-2">AI đang suy nghĩ...</Text>
              <Text className="text-sm text-gray-600">Độ khó: {difficulty}</Text>
            </View>
          </View>
        )}

        <ChessBoard
          board={createBoardFromFen(fen)}
          onPressSquare={handleSquarePress}
          selected={selected}
          legalMoves={legalMoves}
          lastMove={lastMove}
          disabled={aiThinking || !isPlayerTurn || isGameOver}
        />
      </View>

      {/* Controls */}
      <View className="bg-white p-6 border-t border-gray-200">
        <View className="flex-row justify-around">
          <TouchableOpacity
            onPress={handleReset}
            className="bg-gray-500 px-4 py-2 w-[30%] items-center rounded-lg"
          >
            <Text className="text-white font-semibold">Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleUndo}
            className="bg-orange-500 px-4 py-2 w-[30%] items-center rounded-lg"
            disabled={moveHistory.length < 2 || aiThinking || isGameOver}
          >
            <Text
              className={`font-semibold ${
                moveHistory.length < 2 || aiThinking || isGameOver ? 'text-gray-500' : 'text-white'
              }`}
            >
              Undo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={showHint}
            className="bg-[#734DBE] px-4 py-2 w-[30%] items-center rounded-lg"
            disabled={!isPlayerTurn || aiThinking || isGameOver}
          >
            <Text
              className={`font-semibold ${
                !isPlayerTurn || aiThinking || isGameOver ? 'text-gray-400' : 'text-white'
              }`}
            >
              Gợi ý
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Game Over Modal */}
      <Modal
        visible={showGameOverModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGameOverModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-white p-6 rounded-lg mx-4 max-w-sm w-full">
            <Text className="text-xl font-bold text-center mb-2">Game kết thúc!</Text>

            <Text className="text-lg text-center mb-4">{gameResult}</Text>

            <Text className="text-sm text-gray-600 text-center mb-4">
              Tổng số nước đi: {moveHistory.length}
            </Text>

            <View className="flex-row justify-around">
              <TouchableOpacity
                onPress={() => setShowGameOverModal(false)}
                className="bg-gray-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleReset} className="bg-[#734DBE] px-4 py-2 rounded-lg">
                <Text className="text-white font-semibold">Chơi lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
