// src/screens/PracticeChess.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { ImageBackground, View, Text, Button, TouchableOpacity, Dimensions } from 'react-native'
import { images } from '@/constants'
import { Square } from 'chess.js'
import { GameStateStatus, useChessGame } from '@/components/chess/hooks/UseChessGame'
import { useChessAI } from '@/components/chess/hooks/useChessAI'
import { getPieceIcon } from '@/components/chess/utils/piece-icons'
import ChessBoard from '@/components/chess/components/ChessBoard'
import ChessStatus from '@/components/chess/components/ChessStatus'
import { AntDesign } from '@expo/vector-icons'
import ModalWarningChess from '@/modal/ModalChess'
import API_CLIENT from '@/libs/api/client'
import { useToast } from '@/components/ToastNotify/ToastContext'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { Routes } from '@/libs/api/routes/routes'

export default function PracticeChess() {
  const { state, gameRef, selectSquare, playerMove, aiMove, setStatus, resetGame, setupPosition } =
    useChessGame()
  const { showToast } = useToast()

  const { makeAIMove } = useChessAI(gameRef, state.difficulty)
  const [aiThinking, setAiThinking] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const [gameSubmitted, setGameSubmitted] = useState(false)

  // Mutation for submitting practice result
  const submitResultMutation = useMutation({
    mutationFn: async (result: 'win' | 'lose') => {
      const response = await API_CLIENT.post(Routes.chess.submitPracticeResult, {
        result: result,
      })
      return response.data
    },
    onSuccess: (data, variables) => {
      showToast(
        variables === 'win'
          ? 'Chúc mừng! Kết quả thắng đã được ghi nhận.'
          : 'Kết quả thua đã được ghi nhận. Hãy thử lại!',
        'success',
      )
    },
    onError: (error) => {
      showToast('Không thể gửi kết quả. Vui lòng thử lại sau.', 'error')
    },
  })

  // Function to submit result using mutation
  const submitResult = (result: 'win' | 'lose') => {
    if (!gameSubmitted) {
      submitResultMutation.mutate(result)
      setGameSubmitted(true)
    }
  }

  // Handle reset game
  const handleResetGame = () => {
    resetGame()
    setGameSubmitted(false)
    showToast('Game đã được reset!', 'success')
  }

  // Submit result when game ends
  useEffect(() => {
    if (gameSubmitted) return // Avoid multiple submissions

    // Check if game has ended and determine result
    if (state.status === GameStateStatus.WHITE_WIN) {
      // Player (white) wins
      submitResult('win')
    } else if (state.status === GameStateStatus.BLACK_WIN) {
      // AI (black) wins, so player loses
      submitResult('lose')
    } else if (state.status === GameStateStatus.DRAW) {
      // Draw - could be considered a loss or neutral, based on requirements
      // For now, treating draw as lose since player didn't win
      submitResult('lose')
    }
  }, [state.status, gameSubmitted])

  // Reset gameSubmitted flag when game restarts
  useEffect(() => {
    if (state.status === GameStateStatus.PLAYING && gameSubmitted) {
      setGameSubmitted(false)
    }
  }, [state.status, gameSubmitted])

  // 1. Cập nhật gameStatus khi FEN thay đổi
  useEffect(() => {
    const game = gameRef.current
    // nếu checkmate
    if (game.isCheckmate()) {
      setStatus(game.turn() === 'w' ? GameStateStatus.BLACK_WIN : GameStateStatus.WHITE_WIN)
      return
    }
    // nếu draw (bao gồm stalemate)
    if (game.isDraw()) {
      setStatus(GameStateStatus.DRAW)
      return
    }

    // **nếu không có move nào** (stalemate/chết cờ)
    const moves = game.moves()
    if (moves.length === 0) {
      // bên đến lượt không còn nước → bên kia thắng
      setStatus(game.turn() === 'w' ? GameStateStatus.BLACK_WIN : GameStateStatus.WHITE_WIN)
      return
    }

    // nếu đang bị chiếu
    if (game.isCheck()) {
      setStatus(game.turn() === 'w' ? GameStateStatus.WHITE_CHECK : GameStateStatus.BLACK_CHECK)
      return
    }

    // còn lại thì vẫn PLAYING
    setStatus(GameStateStatus.PLAYING)
  }, [
    state.fen, // khi FEN thay đổi
    state.turn, // khi lượt thay đổi
  ])

  // 2. Chuyển FEN → ma trận icon
  const boardIcons = useMemo(() => {
    return gameRef.current.board().map((row) => row.map((piece) => getPieceIcon(piece)))
  }, [state.fen])

  // 3. Khi người chơi chạm ô
  const handleSquarePress = async (square: Square) => {
    if (!state.selected) {
      selectSquare(square)
    } else {
      playerMove(square) // setFen + flip turn → 'b'
      if (gameRef.current.turn() === 'b') {
        setAiThinking(true)
        const move = await makeAIMove()
        setAiThinking(false)

        if (move) {
          aiMove(move) // setFen + flip turn → 'w'
        }
      }
    }
  }

  const handleQuit = async () => {
    await submitResult('lose')
    setModalWarning(false)
    router.push('/play-chess')
  }

  return (
    <ImageBackground
      className="h-full"
      style={{ height: Dimensions.get('window').height }}
      source={images.bgPlayChess}
    >
      <View className="flex-row flex items-center pb-2 relative mt-24 mb-10">
        {state.status !== GameStateStatus.WHITE_WIN &&
          state.status !== GameStateStatus.BLACK_WIN &&
          state.status !== GameStateStatus.DRAW && (
            <TouchableOpacity
              onPress={() => setModalWarning(true)}
              className="absolute ml-4 bottom-0 bg-[#64748B14] h-12 w-12 items-center justify-center rounded-full"
            >
              <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>
          )}
      </View>
      <ChessStatus isPlayerTurn={state.isPlayerTurn && !aiThinking} />
      <View className="items-center pb-2 relative text-center">
        <Text className="text-2xl font-bold">{state.status}</Text>

        {(state.status === GameStateStatus.WHITE_WIN ||
          state.status === GameStateStatus.BLACK_WIN ||
          state.status === GameStateStatus.DRAW) && (
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleResetGame}
              className="mt-4 bg-[#FF9800] px-6 py-3 rounded-xl"
              disabled={submitResultMutation.isPending}
            >
              <Text className="text-white font-semibold text-lg">Chơi lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: ERouteTable.RESULT_CHESS,
                  params: { type: state.status === GameStateStatus.WHITE_WIN ? 'win' : 'lose' },
                })
              }}
              className="mt-4 bg-gray-500 px-6 py-3 rounded-xl"
              disabled={submitResultMutation.isPending}
            >
              <Text className="text-white font-semibold text-lg">Kết thúc</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Bàn cờ */}
      <View className="items-center">
        <ChessBoard
          board={boardIcons}
          selected={state.selected ? (state.selected as Square) : null}
          lastMove={
            state.lastMove
              ? { from: state.lastMove.from as Square, to: state.lastMove.to as Square }
              : null
          }
          onPressSquare={handleSquarePress}
          disabled={aiThinking || !state.isPlayerTurn}
          legalMoves={state.legalMoves}
        />
      </View>

      {/* Overlay khi AI đang tính */}
      {aiThinking && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 items-center justify-center">
          <Text style={{ color: 'white', fontSize: 20 }}>Máy đang suy nghĩ...</Text>
        </View>
      )}
      <ModalWarningChess
        onClose={() => setModalWarning(false)}
        visible={modalWarning}
        onQuit={handleQuit}
      />
    </ImageBackground>
  )
}
