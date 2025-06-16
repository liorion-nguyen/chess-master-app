import { useState, useCallback, useRef, useEffect } from 'react'
import { Chess, Square, Move, PieceSymbol, Color } from 'chess.js'
import { useChessAI, AIDifficulty } from './useChessAI'

export interface ChessGameAIState {
  fen: string
  selected: Square | null
  legalMoves: Square[]
  lastMove: { from: Square; to: Square } | null
  turn: 'w' | 'b'
  isPlayerTurn: boolean
  isGameOver: boolean
  gameResult: string | null
  status:
    | 'playing'
    | 'checkmate'
    | 'draw'
    | 'stalemate'
    | 'insufficient_material'
    | 'threefold_repetition'
  difficulty: AIDifficulty
  aiThinking: boolean
  moveHistory: string[]
}

export interface ChessGameAIActions {
  selectSquare: (square: Square) => void
  playerMove: (to: Square) => Promise<boolean>
  applyAIMove: (move: Move) => boolean
  setupPosition: (fen: string) => void
  loadPosition: (pieces: Array<{ square: Square; type: PieceSymbol; color: Color }>) => void
  resetGame: () => void
  getCurrentPosition: () => string
  isSquareSelected: (square: Square) => boolean
  isLegalMove: (from: Square, to: Square) => boolean
  getPieceAt: (square: Square) => { type: PieceSymbol; color: Color } | null
  getGameHistory: () => string[]
  undoLastMove: () => boolean
  setDifficulty: (difficulty: AIDifficulty) => void
  getSuggestion: () => Move | null
}

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export const useChessGameAI = (
  initialDifficulty: AIDifficulty = 'medium',
): ChessGameAIState & ChessGameAIActions => {
  const gameRef = useRef(new Chess())

  const [state, setState] = useState<ChessGameAIState>({
    fen: INITIAL_FEN,
    selected: null,
    legalMoves: [],
    lastMove: null,
    turn: 'w',
    isPlayerTurn: true,
    isGameOver: false,
    gameResult: null,
    status: 'playing',
    difficulty: initialDifficulty,
    aiThinking: false,
    moveHistory: [],
  })

  // Initialize AI hook
  const ai = useChessAI(gameRef, { difficulty: state.difficulty })

  // Cập nhật game status từ chess instance
  const updateGameStatus = useCallback(() => {
    const game = gameRef.current
    const isGameOver = game.isGameOver()

    let status: ChessGameAIState['status'] = 'playing'
    let gameResult: string | null = null

    if (isGameOver) {
      if (game.isCheckmate()) {
        status = 'checkmate'
        gameResult = game.turn() === 'w' ? 'AI wins by checkmate!' : 'You win by checkmate!'
      } else if (game.isStalemate()) {
        status = 'stalemate'
        gameResult = 'Draw by stalemate'
      } else if (game.isInsufficientMaterial()) {
        status = 'insufficient_material'
        gameResult = 'Draw by insufficient material'
      } else if (game.isThreefoldRepetition()) {
        status = 'threefold_repetition'
        gameResult = 'Draw by threefold repetition'
      } else {
        status = 'draw'
        gameResult = 'Draw'
      }
    }

    return { status, gameResult, isGameOver }
  }, [])

  // Cập nhật state từ chess instance
  const updateStateFromGame = useCallback(() => {
    const game = gameRef.current
    const { status, gameResult, isGameOver } = updateGameStatus()

    setState((prevState) => ({
      ...prevState,
      fen: game.fen(),
      turn: game.turn(),
      isPlayerTurn: game.turn() === 'w' && !isGameOver,
      isGameOver,
      gameResult,
      status,
      moveHistory: game.history(),
      selected: isGameOver ? null : prevState.selected,
      legalMoves: isGameOver ? [] : prevState.legalMoves,
    }))
  }, [updateGameStatus])

  // Chọn ô trên bàn cờ
  const selectSquare = useCallback((square: Square) => {
    const game = gameRef.current
    const piece = game.get(square)

    setState((prevState) => {
      // Không cho phép chọn khi không phải lượt player hoặc AI đang suy nghĩ
      if (!prevState.isPlayerTurn || prevState.aiThinking || prevState.isGameOver) {
        return prevState
      }

      // Nếu đã chọn ô này rồi thì bỏ chọn
      if (prevState.selected === square) {
        return {
          ...prevState,
          selected: null,
          legalMoves: [],
        }
      }

      // Nếu có ô được chọn và click vào ô khác để di chuyển
      if (prevState.selected && prevState.legalMoves.includes(square)) {
        // Sẽ được xử lý ở playerMove
        return prevState
      }

      // Chọn ô mới - chỉ cho phép chọn quân trắng
      if (piece && piece.color === 'w') {
        const moves = game.moves({ square, verbose: true })
        const legalSquares = moves.map((move) => move.to)

        return {
          ...prevState,
          selected: square,
          legalMoves: legalSquares,
        }
      }

      // Chọn ô trống hoặc quân đen -> bỏ chọn
      return {
        ...prevState,
        selected: null,
        legalMoves: [],
      }
    })
  }, [])

  // Thực hiện nước đi của player
  const playerMove = useCallback(
    async (to: Square): Promise<boolean> => {
      const game = gameRef.current

      return new Promise((resolve) => {
        setState((prevState) => {
          // Kiểm tra điều kiện
          if (
            !prevState.selected ||
            !prevState.isPlayerTurn ||
            prevState.aiThinking ||
            prevState.isGameOver ||
            !prevState.legalMoves.includes(to)
          ) {
            resolve(false)
            return prevState
          }

          try {
            // Thực hiện nước đi
            const move = game.move({
              from: prevState.selected,
              to: to,
              promotion: 'q', // Auto-promote to queen
            })

            if (move) {
              const newState = {
                ...prevState,
                selected: null,
                legalMoves: [],
                lastMove: { from: prevState.selected, to },
              }

              // Cập nhật state và schedule AI move nếu game chưa kết thúc
              setTimeout(() => {
                updateStateFromGame()

                // Kiểm tra nếu game chưa kết thúc thì cho AI di chuyển
                if (!game.isGameOver() && game.turn() === 'b') {
                  setState((currentState) => ({ ...currentState, aiThinking: true }))

                  ai.makeAIMove()
                    .then((aiMove) => {
                      if (aiMove) {
                        applyAIMove(aiMove)
                      } else {
                        // AI không có nước đi hợp lệ
                        setState((currentState) => ({
                          ...currentState,
                          aiThinking: false,
                          gameResult: 'You win! AI has no valid moves.',
                          isGameOver: true,
                          status: 'checkmate',
                        }))
                      }
                    })
                    .catch((error) => {
                      console.error('AI Move Error:', error)
                      setState((currentState) => ({ ...currentState, aiThinking: false }))
                    })
                }

                resolve(true)
              }, 100)

              return newState
            }

            resolve(false)
            return prevState
          } catch (error) {
            console.warn('Invalid player move:', error)
            resolve(false)
            return prevState
          }
        })
      })
    },
    [ai, updateStateFromGame],
  )

  // Áp dụng nước đi của AI
  const applyAIMove = useCallback(
    (move: Move): boolean => {
      const game = gameRef.current

      try {
        const appliedMove = game.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion || 'q',
        })

        if (appliedMove) {
          setState((prevState) => ({
            ...prevState,
            lastMove: { from: move.from, to: move.to },
            aiThinking: false,
          }))

          updateStateFromGame()
          return true
        }

        setState((prevState) => ({ ...prevState, aiThinking: false }))
        return false
      } catch (error) {
        console.warn('Invalid AI move:', error)
        setState((prevState) => ({ ...prevState, aiThinking: false }))
        return false
      }
    },
    [updateStateFromGame],
  )

  // Setup vị trí từ FEN
  const setupPosition = useCallback(
    (fen: string) => {
      const game = gameRef.current

      try {
        game.load(fen)
        setState((prevState) => ({
          ...prevState,
          selected: null,
          legalMoves: [],
          lastMove: null,
          aiThinking: false,
        }))
        updateStateFromGame()
      } catch (error) {
        console.error('Invalid FEN:', error)
      }
    },
    [updateStateFromGame],
  )

  // Load vị trí từ danh sách quân cờ
  const loadPosition = useCallback(
    (pieces: Array<{ square: Square; type: PieceSymbol; color: Color }>) => {
      const game = gameRef.current

      game.clear()
      pieces.forEach(({ square, type, color }) => {
        game.put({ type, color }, square)
      })

      setState((prevState) => ({
        ...prevState,
        selected: null,
        legalMoves: [],
        lastMove: null,
        aiThinking: false,
      }))
      updateStateFromGame()
    },
    [updateStateFromGame],
  )

  // Reset game về trạng thái ban đầu
  const resetGame = useCallback(() => {
    const game = gameRef.current
    game.reset()

    setState((prevState) => ({
      ...prevState,
      fen: INITIAL_FEN,
      selected: null,
      legalMoves: [],
      lastMove: null,
      turn: 'w',
      isPlayerTurn: true,
      isGameOver: false,
      gameResult: null,
      status: 'playing',
      aiThinking: false,
      moveHistory: [],
    }))
  }, [])

  // Lấy FEN hiện tại
  const getCurrentPosition = useCallback((): string => {
    return gameRef.current.fen()
  }, [])

  // Kiểm tra ô có được chọn không
  const isSquareSelected = useCallback(
    (square: Square): boolean => {
      return state.selected === square
    },
    [state.selected],
  )

  // Kiểm tra nước đi có hợp lệ không
  const isLegalMove = useCallback((from: Square, to: Square): boolean => {
    const game = gameRef.current
    try {
      const move = game.move({ from, to })
      if (move) {
        game.undo()
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  // Lấy quân cờ tại ô
  const getPieceAt = useCallback((square: Square): { type: PieceSymbol; color: Color } | null => {
    const piece = gameRef.current.get(square)
    return piece || null
  }, [])

  // Lấy lịch sử nước đi
  const getGameHistory = useCallback((): string[] => {
    return gameRef.current.history()
  }, [])

  // Undo nước đi cuối (undo cả player và AI move)
  const undoLastMove = useCallback((): boolean => {
    const game = gameRef.current

    // Undo AI move first
    const aiUndoResult = game.undo()
    if (!aiUndoResult) return false

    // Undo player move
    const playerUndoResult = game.undo()
    if (!playerUndoResult) {
      // Nếu không undo được player move, restore AI move
      game.move(aiUndoResult)
      return false
    }

    setState((prevState) => ({
      ...prevState,
      selected: null,
      legalMoves: [],
      lastMove: null,
      aiThinking: false,
    }))

    updateStateFromGame()
    return true
  }, [updateStateFromGame])

  // Set difficulty
  const setDifficulty = useCallback((difficulty: AIDifficulty) => {
    setState((prevState) => ({ ...prevState, difficulty }))
  }, [])

  // Lấy suggestion move cho player
  const getSuggestion = useCallback((): Move | null => {
    return ai.getSuggestionMove()
  }, [ai])

  return {
    // State
    ...state,

    // Actions
    selectSquare,
    playerMove,
    applyAIMove,
    setupPosition,
    loadPosition,
    resetGame,
    getCurrentPosition,
    isSquareSelected,
    isLegalMove,
    getPieceAt,
    getGameHistory,
    undoLastMove,
    setDifficulty,
    getSuggestion,
  }
}
