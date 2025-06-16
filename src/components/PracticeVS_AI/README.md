# Chess Practice vs AI - Kịch bản 3

Hệ thống học cờ vua với AI opponent cho kịch bản 3, nơi người học điều khiển quân trắng và chơi với AI (quân đen).

## 🎯 Tính năng chính

### Core Features

- **AI Opponent**: AI với 4 mức độ khó (Easy, Medium, Hard, Expert)
- **Player vs AI**: Người học chỉ điều khiển quân trắng
- **Smart Move Validation**: Chỉ cho phép nước đi hợp lệ
- **AI Thinking Overlay**: Hiển thị trạng thái AI đang suy nghĩ
- **Game Status Tracking**: Theo dõi checkmate, draw, stalemate

### AI Features

- **Minimax Algorithm**: Với alpha-beta pruning
- **Difficulty Levels**:
  - Easy: Depth 1, có randomness
  - Medium: Depth 2, ít randomness
  - Hard: Depth 3, strategic play
  - Expert: Depth 4, near-optimal play
- **Position Evaluation**: Dựa trên giá trị quân cờ và vị trí
- **Thinking Simulation**: Delay realistic để tạo cảm giác tự nhiên

### UI/UX Features

- **Difficulty Selector**: Thay đổi độ khó AI trong lúc chơi
- **AI Thinking Indicator**: ActivityIndicator và overlay
- **Move History**: Tracking và display lịch sử nước đi
- **Hint System**: Gợi ý nước đi cho người chơi
- **Undo Functionality**: Undo cả player và AI moves
- **Game Over Modal**: Hiển thị kết quả với option chơi lại

## 📁 Cấu trúc Files

```
src/hooks/
├── useChessAI.ts          # Hook AI logic với minimax
├── useChessGameAI.ts      # Hook quản lý game state vs AI

src/components/PracticeVS_AI/
├── index.tsx              # Component chính PracticeVS_AI
├── example.tsx            # Ví dụ sử dụng với scenarios
└── README.md              # Documentation này
```

## 🚀 Cách sử dụng

### 1. Basic Usage

```tsx
import PracticeVS_AI from '@/components/PracticeVS_AI'

function ChessLearningScreen() {
  return (
    <PracticeVS_AI
      initialDifficulty="medium"
      onGameEnd={(result, status) => {
        console.log('Game ended:', result)
      }}
      onError={(error) => {
        console.error('Error:', error)
      }}
    />
  )
}
```

### 2. Custom Positions

```tsx
// Tactical puzzle - Mate in 2
<PracticeVS_AI
  initialFen="2rq1rk1/pp3pp1/2n1bn1p/2pp4/3P4/P1P1BN2/1PQ2PPP/R3R1K1 w - - 0 1"
  initialDifficulty="hard"
  onGameEnd={handleGameEnd}
/>

// Endgame practice
<PracticeVS_AI
  initialFen="8/8/8/4k3/8/8/4K3/4Q3 w - - 0 1"
  initialDifficulty="expert"
  onGameEnd={handleGameEnd}
/>
```

### 3. Integration với Navigation

```tsx
// Stack Navigator
<Stack.Screen
  name="PracticeAI"
  component={PracticeVSAIScreen}
  options={{ title: 'Thực hành với AI' }}
/>

// Tab Navigator
<Tab.Screen
  name="Practice"
  component={PracticeVSAIScreen}
  options={{
    tabBarLabel: 'Thực hành',
    tabBarIcon: ({ color }) => <ChessIcon color={color} />
  }}
/>
```

## 🎮 Game Flow

### 1. Player Turn

1. Player chọn quân trắng (highlight legal moves)
2. Player chọn ô đích (validate move)
3. Thực hiện move và check game status
4. Nếu game chưa kết thúc → AI turn

### 2. AI Turn

1. Set `aiThinking = true` (show overlay)
2. AI calculates best move (với delay)
3. Apply AI move và update state
4. Check game status → back to player turn

### 3. Game End

1. Detect checkmate/draw/stalemate
2. Show game over modal
3. Display result và options (Close/Play Again)

## 🧠 AI Implementation

### Minimax Algorithm

```typescript
const minimax = (game: Chess, depth: number, isMaximizing: boolean) => {
  if (depth === 0 || game.isGameOver()) {
    return evaluatePosition(game)
  }

  // Alpha-beta pruning implementation
  // Maximizing cho AI (black), minimizing cho player (white)
}
```

### Position Evaluation

- **Piece Values**: Pawn=1, Knight/Bishop=3, Rook=5, Queen=9
- **Center Control**: Bonus cho quân ở trung tâm
- **King Safety**: Penalty cho vua bị chiếu
- **Mobility**: (Future) Bonus cho số nước đi khả dụng

### Difficulty Scaling

- **Search Depth**: 1-4 levels dựa trên difficulty
- **Randomness**: Easy mode có 30% random moves
- **Thinking Time**: 500ms-2000ms dựa trên difficulty

## 📱 Props Interface

```typescript
interface PracticeVSAIProps {
  initialFen?: string // Vị trí FEN ban đầu
  initialDifficulty?: AIDifficulty // Độ khó AI
  onGameEnd?: (result: string, status: ChessGameAIState['status']) => void
  onError?: (error: string) => void
}

type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert'
```

## 🔧 Advanced Features

### 1. Analytics Integration

```typescript
const handleGameEnd = (result: string, status: string) => {
  // Track game completion
  Analytics.track('chess_practice_complete', {
    result,
    status,
    difficulty,
    moveCount: moveHistory.length,
    duration: gameDuration,
  })
}
```

### 2. Progress Tracking

```typescript
// Save player progress
const updatePlayerStats = (gameData: GameResult) => {
  const stats = {
    gamesPlayed: stats.gamesPlayed + 1,
    wins: result.includes('You win') ? stats.wins + 1 : stats.wins,
    difficulty: gameData.difficulty,
    averageMoves: calculateAverageMoves(gameData),
  }

  AsyncStorage.setItem('playerStats', JSON.stringify(stats))
}
```

### 3. Custom AI Strategies

```typescript
// Extend AI với custom strategies
const useChessAI = (gameRef, config) => {
  const strategies = {
    aggressive: (moves) => moves.filter((m) => m.captured),
    positional: (moves) => moves.filter((m) => evaluatePosition(m) > 0),
    defensive: (moves) => moves.filter((m) => !exposesKing(m)),
  }

  return {
    makeAIMove: async () => {
      const strategy = config.strategy || 'balanced'
      return findBestMove(gameRef.current, strategy)
    },
  }
}
```

## 🎯 Use Cases

### 1. Beginner Learning

- Easy AI để học cơ bản
- Hint system để guided learning
- Undo function để thử nghiệm

### 2. Tactical Training

- Custom FEN positions
- Medium-Hard AI cho tactical challenges
- Focus trên specific patterns

### 3. Endgame Practice

- Simplified positions
- Expert AI cho endgame precision
- Learn theoretical endings

### 4. Opening Study

- Start từ specific opening positions
- AI responses to opening moves
- Practice against common defenses

## 🔄 Integration với Other Scenarios

### Scenario 1 (Learn Chess)

```typescript
// Switch AI off cho guided learning
const useAdaptiveAI = (scenario: 'guided' | 'practice' | 'competitive') => {
  if (scenario === 'guided') {
    return { makeAIMove: () => null } // No AI
  }
  return useChessAI(gameRef, config)
}
```

### Scenario 2 (Both Sides)

```typescript
// Convert to practice mode
const convertToPractice = (learnChessBothData: LearnChessBothData) => {
  return (
    <PracticeVS_AI
      initialFen={generateFenFromMoves(learnChessBothData.moves)}
      initialDifficulty="medium"
    />
  )
}
```

## 🚧 Future Enhancements

1. **Opening Book**: AI sử dụng opening database
2. **Endgame Tablebase**: Perfect play trong endgames
3. **Adaptive Difficulty**: AI tự điều chỉnh độ khó
4. **Analysis Mode**: Post-game analysis với engine evaluation
5. **Tournament Mode**: Series games với rating system
6. **Custom Personalities**: AI với playing styles khác nhau

## 🐛 Troubleshooting

### Common Issues

1. **AI Stuck**: Check `aiThinking` state reset
2. **Invalid Moves**: Verify chess.js integration
3. **Performance**: Reduce AI search depth nếu lag
4. **State Sync**: Ensure proper game state updates

### Debug Mode

Development mode hiển thị debug info:

- Current FEN position
- Game status và turn
- AI thinking state
- Move history
- Selected squares và legal moves
