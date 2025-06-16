import { useCallback, useRef } from 'react'
import { Chess, Move, Square } from 'chess.js'

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert'

interface ChessAIConfig {
  difficulty: AIDifficulty
  thinkingTime?: number // milliseconds
}

export const useChessAI = (gameRef: React.MutableRefObject<Chess>, config: ChessAIConfig) => {
  const { difficulty, thinkingTime = 1000 } = config

  // Đánh giá vị trí đơn giản
  const evaluatePosition = useCallback((game: Chess): number => {
    const pieceValues: Record<string, number> = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9,
      k: 0,
      P: -1,
      N: -3,
      B: -3,
      R: -5,
      Q: -9,
      K: 0,
    }

    let score = 0
    const board = game.board()

    // Đếm giá trị quân cờ
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j]
        if (piece) {
          score += pieceValues[piece.type] * (piece.color === 'b' ? 1 : -1)
        }
      }
    }

    // Bonus cho kiểm soát trung tâm (đơn giản)
    const centerSquares = ['d4', 'd5', 'e4', 'e5']
    centerSquares.forEach((square) => {
      const piece = game.get(square as Square)
      if (piece) {
        score += piece.color === 'b' ? 0.1 : -0.1
      }
    })

    // Penalty cho vua bị chiếu
    if (game.inCheck()) {
      score += game.turn() === 'b' ? -0.5 : 0.5
    }

    return score
  }, [])

  // Minimax algorithm đơn giản
  const minimax = useCallback(
    (
      game: Chess,
      depth: number,
      isMaximizing: boolean,
      alpha = -Infinity,
      beta = Infinity,
    ): number => {
      if (depth === 0 || game.isGameOver()) {
        return evaluatePosition(game)
      }

      const moves = game.moves({ verbose: true })

      if (isMaximizing) {
        let maxEval = -Infinity
        for (const move of moves) {
          game.move(move)
          const eval_ = minimax(game, depth - 1, false, alpha, beta)
          game.undo()
          maxEval = Math.max(maxEval, eval_)
          alpha = Math.max(alpha, eval_)
          if (beta <= alpha) break // Alpha-beta pruning
        }
        return maxEval
      } else {
        let minEval = Infinity
        for (const move of moves) {
          game.move(move)
          const eval_ = minimax(game, depth - 1, true, alpha, beta)
          game.undo()
          minEval = Math.min(minEval, eval_)
          beta = Math.min(beta, eval_)
          if (beta <= alpha) break // Alpha-beta pruning
        }
        return minEval
      }
    },
    [evaluatePosition],
  )

  // Tìm nước đi tốt nhất
  const findBestMove = useCallback(
    (game: Chess): Move | null => {
      const moves = game.moves({ verbose: true })
      if (moves.length === 0) return null

      // Xác định độ sâu search dựa trên difficulty
      const getSearchDepth = (): number => {
        switch (difficulty) {
          case 'easy':
            return 1
          case 'medium':
            return 2
          case 'hard':
            return 3
          case 'expert':
            return 4
          default:
            return 2
        }
      }

      const depth = getSearchDepth()
      let bestMove = moves[0]
      let bestValue = -Infinity

      // Thêm randomness cho easy mode
      if (difficulty === 'easy' && Math.random() < 0.3) {
        return moves[Math.floor(Math.random() * moves.length)]
      }

      for (const move of moves) {
        game.move(move)
        const value = minimax(game, depth - 1, false)
        game.undo()

        // Thêm một chút randomness để tránh AI quá predictable
        const randomFactor = difficulty === 'easy' ? 0.5 : difficulty === 'medium' ? 0.2 : 0.1
        const adjustedValue = value + (Math.random() - 0.5) * randomFactor

        if (adjustedValue > bestValue) {
          bestValue = adjustedValue
          bestMove = move
        }
      }

      return bestMove
    },
    [difficulty, minimax],
  )

  // Thực hiện nước đi AI với delay để simulate thinking
  const makeAIMove = useCallback(async (): Promise<Move | null> => {
    return new Promise((resolve) => {
      // Simulate thinking time
      const actualThinkingTime =
        difficulty === 'easy'
          ? 500
          : difficulty === 'medium'
            ? 1000
            : difficulty === 'hard'
              ? 1500
              : 2000

      setTimeout(
        () => {
          try {
            const game = gameRef.current
            if (game.turn() !== 'b') {
              resolve(null)
              return
            }

            const bestMove = findBestMove(game)
            resolve(bestMove)
          } catch (error) {
            console.error('AI Error:', error)
            resolve(null)
          }
        },
        Math.min(actualThinkingTime, thinkingTime),
      )
    })
  }, [difficulty, thinkingTime, findBestMove, gameRef])

  // Đánh giá vị trí hiện tại
  const evaluateCurrentPosition = useCallback((): number => {
    return evaluatePosition(gameRef.current)
  }, [evaluatePosition, gameRef])

  // Lấy suggestion move cho người chơi (hint feature)
  const getSuggestionMove = useCallback((): Move | null => {
    const game = gameRef.current
    if (game.turn() !== 'w') return null

    // Tạo temporary game để tính toán
    const tempGame = new Chess(game.fen())
    const moves = tempGame.moves({ verbose: true })
    if (moves.length === 0) return null

    let bestMove = moves[0]
    let bestValue = -Infinity

    for (const move of moves) {
      tempGame.move(move)
      const value = -minimax(tempGame, 2, true) // Depth 2 cho suggestion
      tempGame.undo()

      if (value > bestValue) {
        bestValue = value
        bestMove = move
      }
    }

    return bestMove
  }, [minimax, gameRef])

  return {
    makeAIMove,
    evaluateCurrentPosition,
    getSuggestionMove,
    difficulty,
  }
}
