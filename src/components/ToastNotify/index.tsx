import React, { useEffect, useState, useLayoutEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

type ToastType = 'success' | 'error'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

const ToastNotify: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  const [fadeAnim] = useState(new Animated.Value(0))
  const animationRef = useRef<Animated.CompositeAnimation | null>(null)

  useLayoutEffect(() => {
    // Start animation immediately
    animationRef.current = Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ])

    animationRef.current.start()
  }, [fadeAnim, duration])

  useEffect(() => {
    // Set up cleanup timer
    const timer = setTimeout(() => {
      onClose()
    }, duration + 600) // Total animation time + fade out

    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        animationRef.current.stop()
      }
    }
  }, [onClose, duration])

  const handleClose = () => {
    if (animationRef.current) {
      animationRef.current.stop()
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose()
    })
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4CAF50'
      case 'error':
        return '#F44336'
      default:
        return '#4CAF50'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'checkcircle'
      case 'error':
        return 'closecircle'
      default:
        return 'checkcircle'
    }
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.content}>
        <AntDesign name={getIcon()} size={24} color="white" />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <AntDesign name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    borderRadius: 8,
    padding: 16,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    color: 'white',
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
  },
  closeButton: {
    padding: 4,
  },
})

export default ToastNotify
