import { useCallback } from 'react'
import { LoginEmailOTP, LogoutComponentsProps } from '@/types/general-type'
import { magic } from '@/lib/magic-provider'
import { Button } from './button'
import { logout } from '../utils/common'
import { useNavigate } from 'react-router-dom'

function LogoutComponents({
  text,
  isDisconnect,
  onClick,
}: LogoutComponentsProps) {
  return (
    <>
      <Button
        onClick={onClick}
        variant="destructive"
        className={`rounded-xl px-5 py-[22px] text-base capitalize ${isDisconnect ? 'disconnect-button' : 'action-button'}`}
      >
        {text}
      </Button>
    </>
  )
}

export function LogoutButton({ token, setToken }: LoginEmailOTP) {
  const navigate = useNavigate()

  const disconnect = useCallback(async () => {
    if (magic) {
      await logout({ setToken, magic, navigate })
    }
  }, [setToken, navigate])

  return (
    <LogoutComponents text="Disconnect" isDisconnect onClick={disconnect} />
  )
}
