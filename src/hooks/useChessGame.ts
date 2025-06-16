import { useState, useCallback, useRef } from 'react'
import { Chess, Square, Move, PieceSymbol, Color } from 'chess.js'

export interface ChessGameState {
  fen: string
  selected: Square | null
  legalMoves: Square[]
  lastMove: { from: Square; to: Square } | null
  turn: 'w' | 'b'
  currentStep: number
  isGameOver: boolean
  gameResult: string | null
}

export interface ChessGameActions {
  selectSquare: (square: Square) => void
  applyMove: (from: Square, to: Square, promotion?: PieceSymbol) => Move | null
  setupPosition: (fen: string) => void
  loadPosition: (pieces: Array<{ square: Square; type: PieceSymbol; color: Color }>) => void
  resetGame: () => void
  getCurrentPosition: () => string
  isSquareSelected: (square: Square) => boolean
  isLegalMove: (from: Square, to: Square) => boolean
  getPieceAt: (square: Square) => { type: PieceSymbol; color: Color } | null
  getGameHistory: () => string[]
  undoLastMove: () => boolean
  forceTurn: (turn: 'w' | 'b') => void
}

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export const useChessGame = (): ChessGameState & ChessGameActions => {
  const gameRef = useRef(new Chess())

  const [state, setState] = useState<ChessGameState>({
    fen: INITIAL_FEN,
    selected: null,
    legalMoves: [],
    lastMove: null,
    turn: 'w',
    currentStep: 0,
    isGameOver: false,
    gameResult: null,
  })

  // Cập nhật state từ chess instance
  const updateStateFromGame = useCallback(() => {
    const game = gameRef.current
    setState((prevState) => ({
      ...prevState,
      fen: game.fen(),
      turn: game.turn(),
      isGameOver: game.isGameOver(),
      gameResult: game.isGameOver()
        ? game.isCheckmate()
          ? `${game.turn() === 'w' ? 'Black' : 'White'} wins by checkmate`
          : game.isDraw()
            ? 'Draw'
            : 'Game Over'
        : null,
    }))
  }, [])

  // Chọn ô trên bàn cờ
  const selectSquare = useCallback((square: Square) => {
    const game = gameRef.current
    const piece = game.get(square)

    setState((prevState) => {
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
        // Sẽ được xử lý ở component level (handleSquarePress)
        return prevState
      }

      // Chọn ô mới (chỉ cho phép chọn quân của mình)
      if (piece && piece.color === game.turn()) {
        const moves = game.moves({ square, verbose: true })
        const legalSquares = moves.map((move) => move.to)

        return {
          ...prevState,
          selected: square,
          legalMoves: legalSquares,
        }
      }

      // Chọn ô trống hoặc quân địch -> bỏ chọn
      return {
        ...prevState,
        selected: null,
        legalMoves: [],
      }
    })
  }, [])

  // Thực hiện nước đi
  const applyMove = useCallback(
    (from: Square, to: Square, promotion: PieceSymbol = 'q'): Move | null => {
      const game = gameRef.current

      try {
        const move = game.move({ from, to, promotion })

        if (move) {
          setState((prevState) => ({
            ...prevState,
            selected: null,
            legalMoves: [],
            lastMove: { from, to },
            currentStep: prevState.currentStep + 1,
          }))

          updateStateFromGame()
          return move
        }

        return null
      } catch (error) {
        console.warn('Invalid move:', error)
        return null
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
          currentStep: 0,
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
        currentStep: 0,
      }))
      updateStateFromGame()
    },
    [updateStateFromGame],
  )

  // Reset game về trạng thái ban đầu
  const resetGame = useCallback(() => {
    const game = gameRef.current
    game.reset()

    setState({
      fen: INITIAL_FEN,
      selected: null,
      legalMoves: [],
      lastMove: null,
      turn: 'w',
      currentStep: 0,
      isGameOver: false,
      gameResult: null,
    })
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
        game.undo() // Undo ngay để không thay đổi state
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

  // Undo nước đi cuối
  const undoLastMove = useCallback((): boolean => {
    const game = gameRef.current
    const undoResult = game.undo()

    if (undoResult) {
      setState((prevState) => ({
        ...prevState,
        selected: null,
        legalMoves: [],
        lastMove: null,
        currentStep: Math.max(0, prevState.currentStep - 1),
      }))
      updateStateFromGame()
      return true
    }

    return false
  }, [updateStateFromGame])

  // Force turn to a specific side
  const forceTurn = useCallback(
    (turn: 'w' | 'b') => {
      const game = gameRef.current
      const currentFen = game.fen()
      const fenParts = currentFen.split(' ')

      // Update the turn part in FEN (position 1, 0-indexed)
      fenParts[1] = turn
      const newFen = fenParts.join(' ')

      try {
        game.load(newFen)
        setState((prevState) => ({
          ...prevState,
          turn: turn,
          selected: null,
          legalMoves: [],
        }))
        updateStateFromGame()
      } catch (error) {
        console.warn('Failed to force turn:', error)
      }
    },
    [updateStateFromGame],
  )

  return {
    // State
    ...state,

    // Actions
    selectSquare,
    applyMove,
    setupPosition,
    loadPosition,
    resetGame,
    getCurrentPosition,
    isSquareSelected,
    isLegalMove,
    getPieceAt,
    getGameHistory,
    undoLastMove,
    forceTurn,
  }
}
