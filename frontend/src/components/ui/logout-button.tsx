import { useCallback, useState } from 'react'
import { LoginEmailOTP, LogoutComponentsProps } from '@/types/general-type'
import { magic } from '@/lib/magic-provider'
import { Button } from './button'
import { logout } from '../utils/common'
import { useNavigate } from 'react-router-dom'

function LogoutComponents({
  text,
  isDisconnect,
  onClick,
  isLoading,
}: LogoutComponentsProps) {
  return (
    <>
      <Button
        onClick={onClick}
        variant="destructive"
        className={`rounded-xl px-5 py-[22px] text-base capitalize ${isDisconnect ? 'disconnect-button' : 'action-button'}`}
        disabled={isLoading}
      >
        {isLoading ? 'Disconnecting...' : text}
      </Button>
    </>
  )
}

export function LogoutButton({ token, setToken }: LoginEmailOTP) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const disconnect = useCallback(async () => {
    try {
      setIsLoading(true)
      
      if (magic) {
        await logout({ setToken, magic, navigate })
      }
      
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    } catch (error) {
      console.error('Error during logout:', error)
      setIsLoading(false)
    }
  }, [setToken, navigate])

  return (
    <LogoutComponents 
      text="Disconnect" 
      isDisconnect 
      onClick={disconnect} 
      isLoading={isLoading} 
    />
  )
}