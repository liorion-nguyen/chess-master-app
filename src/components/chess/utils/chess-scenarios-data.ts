import { AIDifficulty } from '@/hooks/useChessAI'

// ==================== KỊCH BẢN 1 DATA ====================
export const scenario1Examples = {
  opening_basics: {
    title: 'Khai cuộc cơ bản',
    expectedMoves: ['e4', 'Nf3', 'Bc4'],
    initialFen: undefined,
    description: 'Học các nước khai cuộc cơ bản nhất',
  },

  italian_game: {
    title: 'Italian Game',
    expectedMoves: ['e4', 'Nf3', 'Bc4', 'O-O', 'd3'],
    initialFen: undefined,
    description: 'Học khai cuộc Italian Game từng bước',
  },

  tactical_pattern: {
    title: 'Chiến thuật Pin',
    expectedMoves: ['Bg5', 'Bxf6', 'Qxd8+'],
    initialFen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
    description: 'Học pattern pin trong tactical',
  },

  endgame_basic: {
    title: 'Endgame Cơ Bản',
    expectedMoves: ['Qf7+', 'Kh8', 'Qf8#'],
    initialFen: '7k/6Q1/6K1/8/8/8/8/8 w - - 0 1',
    description: 'Học checkmate cơ bản với Queen',
  },
}

// ==================== KỊCH BẢN 2 DATA ====================
export const scenario2Examples = {
  italian_complete: {
    title: 'Italian Game Hoàn Chỉnh',
    expectedWhiteMoves: ['e4', 'Nf3', 'Bc4', 'O-O', 'd3', 'c3'],
    expectedBlackMoves: ['e5', 'Nc6', 'Be7', 'Nf6', 'd6', 'O-O'],
    initialFen: undefined,
    description: 'Chơi hoàn chỉnh Italian Game cho cả hai bên',
  },

  ruy_lopez: {
    title: 'Ruy Lopez Opening',
    expectedWhiteMoves: ['e4', 'Nf3', 'Bb5', 'Ba4', 'O-O'],
    expectedBlackMoves: ['e5', 'Nc6', 'a6', 'Nf6', 'Be7'],
    initialFen: undefined,
    description: 'Học Ruy Lopez với phòng thủ Morphy',
  },

  scholars_mate_defense: {
    title: "Phòng thủ Scholar's Mate",
    expectedWhiteMoves: ['e4', 'Bc4', 'Qh5', 'Qxf7+'],
    expectedBlackMoves: ['e5', 'Nc6', 'Nf6', 'Kd8'],
    initialFen: undefined,
    description: "Học cách phòng thủ Scholar's Mate attack",
  },

  tactical_puzzle: {
    title: 'Tactical Puzzle - Fork',
    expectedWhiteMoves: ['Nf7+', 'Nxd8', 'Nxc6'],
    expectedBlackMoves: ['Kh8', 'Qc7', 'bxc6'],
    initialFen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP1NPPP/R1BQK2R w KQ - 0 1',
    description: 'Thực hành tactical fork với knight',
  },
}

// ==================== KỊCH BẢN 3 DATA ====================
export const scenario3Examples = {
  beginner_practice: {
    title: 'Thực hành Cơ Bản',
    initialDifficulty: 'easy' as AIDifficulty,
    initialFen: undefined,
    description: 'Chơi với AI dễ để làm quen',
  },

  intermediate_game: {
    title: 'Thực hành Trung Bình',
    initialDifficulty: 'medium' as AIDifficulty,
    initialFen: undefined,
    description: 'Thử thách với AI trung bình',
  },

  tactical_training: {
    title: 'Luyện Tactical',
    initialDifficulty: 'hard' as AIDifficulty,
    initialFen: '2rq1rk1/pp3pp1/2n1bn1p/2pp4/3P4/P1P1BN2/1PQ2PPP/R3R1K1 w - - 0 1',
    description: 'Tìm mate trong 2 nước với AI khó',
  },

  endgame_challenge: {
    title: 'Thử thách Endgame',
    initialDifficulty: 'expert' as AIDifficulty,
    initialFen: '8/8/4k3/8/8/4K3/4Q3/8 w - - 0 1',
    description: 'Endgame King+Queen vs King với AI chuyên gia',
  },

  rook_endgame: {
    title: 'Endgame Rook vs Pawns',
    initialDifficulty: 'hard' as AIDifficulty,
    initialFen: '8/6k1/6p1/6P1/8/6K1/r7/8 b - - 0 1',
    description: 'Học cách chơi xe trong endgame',
  },

  opening_challenge: {
    title: 'Thách thức Khai cuộc',
    initialDifficulty: 'expert' as AIDifficulty,
    initialFen: 'rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 0 1',
    description: 'Chơi từ vị trí sau e4 e5 Bc4 với AI mạnh',
  },
}

// ==================== COMBINED DATA FOR UI ====================
export const allScenariosData = {
  1: scenario1Examples,
  2: scenario2Examples,
  3: scenario3Examples,
}

// Helper function để lấy random example
export const getRandomExample = (scenario: 1 | 2 | 3) => {
  const examples = allScenariosData[scenario]
  const keys = Object.keys(examples)
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return {
    key: randomKey,
    data: examples[randomKey as keyof typeof examples],
  }
}

// Helper function để lấy tất cả examples của một scenario
export const getScenarioExamples = (scenario: 1 | 2 | 3) => {
  return Object.entries(allScenariosData[scenario]).map(([key, data]) => ({
    key,
    data,
  }))
}

// Learning progression path
export const learningPath = [
  // Beginner path
  { scenario: 1, example: 'opening_basics' },
  { scenario: 1, example: 'italian_game' },
  { scenario: 2, example: 'italian_complete' },
  { scenario: 3, example: 'beginner_practice' },

  // Intermediate path
  { scenario: 1, example: 'tactical_pattern' },
  { scenario: 2, example: 'ruy_lopez' },
  { scenario: 3, example: 'intermediate_game' },

  // Advanced path
  { scenario: 2, example: 'tactical_puzzle' },
  { scenario: 3, example: 'tactical_training' },
  { scenario: 3, example: 'endgame_challenge' },
]
