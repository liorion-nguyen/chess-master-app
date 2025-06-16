import React from 'react'
import { TouchableOpacity } from 'react-native'

type Props = {
  icon: React.ReactNode | null
  className: string
  onPress: () => void
  disabled: boolean
  children?: React.ReactNode
}

const ChessSquare: React.FC<Props> = ({ icon, className, onPress, disabled, children }) => (
  <TouchableOpacity className={className} onPress={onPress} disabled={disabled}>
    {icon}
    {children}
  </TouchableOpacity>
)

export default React.memo(ChessSquare)
