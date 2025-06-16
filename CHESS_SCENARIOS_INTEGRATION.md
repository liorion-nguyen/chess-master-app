# Chess Learning System - Tích hợp 3 Kịch bản

Hệ thống học cờ vua hoàn chỉnh với 3 kịch bản khác nhau cho các mức độ học tập khác nhau.

## 🎯 Tổng quan 3 Kịch bản

### Kịch bản 1: Learn Chess (Guided Learning)

- **Mục đích**: Học các nước đi theo kịch bản có sẵn
- **Cơ chế**: Chỉ quân trắng di chuyển, quân đen đứng yên
- **Validation**: So sánh nước đi với `expectedMoves[]`
- **Use case**: Opening study, tactical patterns, basic moves

### Kịch bản 2: Learn Chess Both (Interactive Learning)

- **Mục đích**: Điều khiển cả hai bên theo kịch bản định sẵn
- **Cơ chế**: Lần lượt điều khiển trắng và đen
- **Validation**: Separate validation cho `expectedWhiteMoves[]` và `expectedBlackMoves[]`
- **Use case**: Complete game scenarios, opening sequences

### Kịch bản 3: Practice vs AI (Free Play)

- **Mục đích**: Thực hành tự do với AI opponent
- **Cơ chế**: Player điều khiển trắng, AI điều khiển đen
- **Validation**: Chess engine rules only
- **Use case**: Skill practice, competitive play, assessment

## 📁 Cấu trúc Project

```
src/
├── hooks/
│   ├── useChessGame.ts          # Kịch bản 1 - Basic learning
│   ├── useChessGameBoth.ts      # Kịch bản 2 - Both sides
│   ├── useChessGameAI.ts        # Kịch bản 3 - vs AI
│   └── useChessAI.ts            # AI implementation
│
├── components/
│   ├── LearnChess/              # Kịch bản 1
│   │   ├── index.tsx
│   │   └── example.tsx
│   ├── LearnChessBoth/          # Kịch bản 2
│   │   ├── index.tsx
│   │   └── example.tsx
│   ├── PracticeVS_AI/           # Kịch bản 3
│   │   ├── index.tsx
│   │   ├── example.tsx
│   │   └── README.md
│   └── chess/
│       └── components/
│           ├── ChessBoard.tsx   # Shared board component
│           └── ChessStatus.tsx  # Shared status component
│
└── navigation/
    └── ChessNavigator.tsx       # Main navigation
```

## 🚀 Navigation Integration

### Stack Navigator Setup

```tsx
// navigation/ChessNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack'
import ChessMainMenu from '@/screens/ChessMainMenu'
import LearnChessScreen from '@/screens/LearnChessScreen'
import LearnChessBothScreen from '@/screens/LearnChessBothScreen'
import PracticeVSAIScreen from '@/screens/PracticeVSAIScreen'

const Stack = createStackNavigator()

export default function ChessNavigator() {
  return (
    <Stack.Navigator initialRouteName="ChessMenu">
      <Stack.Screen name="ChessMenu" component={ChessMainMenu} options={{ title: 'Học Cờ Vua' }} />
      <Stack.Screen
        name="LearnChess"
        component={LearnChessScreen}
        options={{ title: 'Học Nước Đi' }}
      />
      <Stack.Screen
        name="LearnChessBoth"
        component={LearnChessBothScreen}
        options={{ title: 'Học Kịch Bản' }}
      />
      <Stack.Screen
        name="PracticeAI"
        component={PracticeVSAIScreen}
        options={{ title: 'Thực Hành với AI' }}
      />
    </Stack.Navigator>
  )
}
```

### Main Menu Component

```tsx
// screens/ChessMainMenu.tsx
import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function ChessMainMenu() {
  const navigation = useNavigation()

  const menuItems = [
    {
      id: 'scenario1',
      title: 'Học Nước Đi Cơ Bản',
      subtitle: 'Kịch bản 1: Học từng nước một',
      color: 'bg-blue-500',
      onPress: () => navigation.navigate('LearnChess'),
    },
    {
      id: 'scenario2',
      title: 'Học Kịch Bản Hoàn Chỉnh',
      subtitle: 'Kịch bản 2: Điều khiển cả hai bên',
      color: 'bg-green-500',
      onPress: () => navigation.navigate('LearnChessBoth'),
    },
    {
      id: 'scenario3',
      title: 'Thực Hành với AI',
      subtitle: 'Kịch bản 3: Chơi tự do với máy tính',
      color: 'bg-purple-500',
      onPress: () => navigation.navigate('PracticeAI'),
    },
  ]

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <Text className="text-3xl font-bold text-center mb-2">Học Cờ Vua</Text>
        <Text className="text-gray-600 text-center mb-8">
          Chọn chế độ học phù hợp với trình độ của bạn
        </Text>

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={item.onPress}
            className={`${item.color} rounded-lg p-6 mb-4 shadow-lg`}
          >
            <Text className="text-white text-xl font-bold mb-2">{item.title}</Text>
            <Text className="text-white/90 text-sm">{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}
```

## 🎓 Learning Path Progression

### Beginner Path

```tsx
// Progression: Scenario 1 → Scenario 2 → Scenario 3

const beginnerLessons = [
  // Scenario 1: Basic moves
  { type: 'learn', moves: ['e4', 'Nf3', 'Bc4'], title: 'Opening Basics' },

  // Scenario 2: Interactive
  {
    type: 'both',
    white: ['e4', 'Nf3', 'Bc4'],
    black: ['e5', 'Nc6', 'Be7'],
    title: 'Italian Game',
  },

  // Scenario 3: Practice
  { type: 'ai', difficulty: 'easy', title: 'Practice vs Easy AI' },
]
```

### Advanced Path

```tsx
const advancedLessons = [
  // Complex scenarios
  { type: 'both', fen: 'custom_position', title: 'Advanced Tactics' },
  { type: 'ai', difficulty: 'expert', title: 'Challenge Expert AI' },
]
```

## 🔄 State Management & Data Flow

### Unified Progress Tracking

```tsx
// hooks/useChessProgress.ts
interface ChessProgress {
  scenario1: {
    completedLessons: string[]
    currentLesson: string | null
    mistakes: number
  }
  scenario2: {
    completedScenarios: string[]
    currentScenario: string | null
    accuracy: number
  }
  scenario3: {
    gamesPlayed: number
    wins: number
    currentDifficulty: AIDifficulty
    rating: number
  }
}

export const useChessProgress = () => {
  const [progress, setProgress] = useState<ChessProgress>(initialProgress)

  const updateScenario1Progress = (lessonId: string, success: boolean) => {
    // Update scenario 1 progress
  }

  const updateScenario2Progress = (scenarioId: string, accuracy: number) => {
    // Update scenario 2 progress
  }

  const updateScenario3Progress = (result: GameResult) => {
    // Update scenario 3 progress
  }

  return {
    progress,
    updateScenario1Progress,
    updateScenario2Progress,
    updateScenario3Progress,
  }
}
```

### Shared Components Integration

```tsx
// components/shared/ChessLessonWrapper.tsx
interface ChessLessonWrapperProps {
  scenario: 1 | 2 | 3
  lessonData: any
  onComplete: (result: any) => void
}

export default function ChessLessonWrapper({
  scenario,
  lessonData,
  onComplete,
}: ChessLessonWrapperProps) {
  const renderScenario = () => {
    switch (scenario) {
      case 1:
        return (
          <LearnChess
            expectedMoves={lessonData.moves}
            initialFen={lessonData.fen}
            onComplete={onComplete}
          />
        )
      case 2:
        return (
          <LearnChessBoth
            expectedWhiteMoves={lessonData.white}
            expectedBlackMoves={lessonData.black}
            initialFen={lessonData.fen}
            onComplete={onComplete}
          />
        )
      case 3:
        return (
          <PracticeVS_AI
            initialFen={lessonData.fen}
            initialDifficulty={lessonData.difficulty}
            onGameEnd={onComplete}
          />
        )
      default:
        return null
    }
  }

  return <View className="flex-1">{renderScenario()}</View>
}
```

## 📊 Analytics & Progress Tracking

### Unified Analytics

```tsx
// utils/chessAnalytics.ts
export const trackChessEvent = (scenario: 1 | 2 | 3, event: string, data: any) => {
  const eventData = {
    scenario,
    event,
    timestamp: Date.now(),
    ...data,
  }

  // Send to analytics service
  Analytics.track(`chess_scenario_${scenario}_${event}`, eventData)

  // Save to local storage for offline analysis
  saveLocalAnalytics(eventData)
}

// Usage in each scenario:
// Scenario 1
trackChessEvent(1, 'lesson_complete', {
  lessonId,
  moves: completedMoves,
  mistakes,
})

// Scenario 2
trackChessEvent(2, 'scenario_complete', {
  scenarioId,
  accuracy,
  timeToComplete,
})

// Scenario 3
trackChessEvent(3, 'game_complete', {
  result,
  difficulty,
  moveCount,
  duration,
})
```

## 🎨 UI/UX Consistency

### Shared Design System

```tsx
// theme/chessTheme.ts
export const chessTheme = {
  colors: {
    primary: '#734DBE',
    scenario1: '#3B82F6', // Blue
    scenario2: '#10B981', // Green
    scenario3: '#8B5CF6', // Purple
    success: '#059669',
    error: '#DC2626',
    warning: '#D97706',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    title: 'text-2xl font-bold',
    subtitle: 'text-lg font-semibold',
    body: 'text-base',
    caption: 'text-sm text-gray-600',
  },
}
```

### Component Library

```tsx
// components/shared/ChessButton.tsx
interface ChessButtonProps {
  variant: 'primary' | 'scenario1' | 'scenario2' | 'scenario3'
  onPress: () => void
  children: React.ReactNode
  disabled?: boolean
}

export function ChessButton({ variant, onPress, children, disabled }: ChessButtonProps) {
  const colorMap = {
    primary: 'bg-[#734DBE]',
    scenario1: 'bg-blue-500',
    scenario2: 'bg-green-500',
    scenario3: 'bg-purple-500',
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`${colorMap[variant]} px-6 py-3 rounded-lg ${disabled ? 'opacity-50' : ''}`}
    >
      <Text className="text-white font-semibold text-center">{children}</Text>
    </TouchableOpacity>
  )
}
```

## 🚀 Deployment & Testing

### Component Testing

```tsx
// __tests__/chess-scenarios.test.tsx
describe('Chess Learning Scenarios', () => {
  test('Scenario 1: Learn Chess validates moves correctly', () => {
    // Test move validation logic
  })

  test('Scenario 2: Learn Chess Both handles dual progress', () => {
    // Test dual side progress tracking
  })

  test('Scenario 3: Practice AI makes valid moves', () => {
    // Test AI move generation
  })

  test('Navigation between scenarios works', () => {
    // Test navigation flow
  })
})
```

### Integration Testing

```tsx
// __tests__/chess-integration.test.tsx
describe('Chess Integration Tests', () => {
  test('Progress carries over between scenarios', () => {
    // Test progress persistence
  })

  test('Shared components work across scenarios', () => {
    // Test component reusability
  })

  test('Analytics tracks events correctly', () => {
    // Test analytics integration
  })
})
```

## 🎯 Best Practices

### 1. Component Reusability

- Shared ChessBoard component across all scenarios
- Common UI elements (buttons, modals, indicators)
- Unified theming and styling

### 2. State Management

- Clear separation of concerns between scenarios
- Shared progress tracking
- Consistent error handling

### 3. Performance

- Lazy loading of scenarios
- Memoized chess calculations
- Optimized AI thinking delays

### 4. User Experience

- Smooth transitions between scenarios
- Consistent navigation patterns
- Clear progress indicators

### 5. Maintainability

- Modular architecture
- TypeScript interfaces
- Comprehensive documentation

## 🔮 Future Enhancements

1. **Multi-device Sync**: Progress sync across devices
2. **Social Features**: Share scenarios, compete with friends
3. **Custom Scenarios**: User-created learning scenarios
4. **Advanced AI**: Multiple AI personalities and styles
5. **Video Integration**: Tutorial videos for each scenario
6. **Assessment System**: Skill level assessment and recommendations

Hệ thống này cung cấp một platform học cờ vua hoàn chỉnh, có thể scale và mở rộng cho các use cases phức tạp hơn.
