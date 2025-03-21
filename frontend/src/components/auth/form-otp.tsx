import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  LoginWithEmailOTPEventEmit,
  LoginWithEmailOTPEventOnReceived,
} from 'magic-sdk'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

import { OTPTypes } from '@/types/general-type'
import { Button } from '../ui/button'
import Loading from '../ui/loading'
import { motion } from 'framer-motion'

export function FormOTP({ loginOtp, cancelOTP }: OTPTypes) {
  const [otpCode, setOtpCode] = useState('')
  const [retries, setRetries] = useState(2)
  const [disable, setDisable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [message, setMessage] = useState<string>()

  const navigate = useNavigate()

  useEffect(() => {
    if (!loginOtp) return

    const invalidHandler = () => {
      setLoading(false)
      setDisable(false)
      setRetries((prev) => prev - 1)

      if (retries <= 1) {
        setMessage('Please try again later.')
        cancelOTP()
      } else {
        setTimeout(() => {
          setMessage(
            `Incorrect OTP, please enter OTP again. ${retries - 1} ${retries === 1 ? 'retry' : 'retries'} left.`,
          )
        }, 1700)
      }
    }

    const doneHandler = async (result: string | null) => {
      if (result) {
        setLoading(false)
        setVerified(true)
        setMessage('OTP verification successful!')

        // Trigger storage event to notify other components
        window.dispatchEvent(new Event('storageUpdate'))
        window.dispatchEvent(new Event('storage'))

        setTimeout(() => {
          setRedirecting(true)
          setMessage('Redirecting to dashboard...')
        }, 100)

        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 1500)
      }
    }

    loginOtp.on(
      LoginWithEmailOTPEventOnReceived.InvalidEmailOtp as any,
      invalidHandler,
    )
    loginOtp.on('done', doneHandler)

    return () => {
      if (loginOtp.removeListener) {
        loginOtp?.removeListener(
          LoginWithEmailOTPEventOnReceived.InvalidEmailOtp as any,
          invalidHandler,
        )
        loginOtp.removeListener('done', doneHandler)
      }
    }
  }, [loginOtp, retries, cancelOTP, navigate])

  const handleChange = (value: string) => {
    setOtpCode(value)
  }

  async function handleOTPCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!loginOtp) {
      setMessage('Login session expired. Please try again.')
      return
    }

    setLoading(true)
    setDisable(true)
    setTimeout(() => {
      setMessage('Verifying OTP code...')
    }, 1700)

    try {
      loginOtp?.emit(LoginWithEmailOTPEventEmit.VerifyEmailOtp as any, otpCode)
    } catch (err) {
      console.error('Error in OTP submission:', err)
      setMessage('An error occurred. Please try again.')
      setLoading(false)
      setDisable(false)
    }
  }

  const getButtonText = () => {
    if (redirecting) return 'Redirecting...'
    if (verified) return 'Verified!'
    if (loading) return 'Verifying...'
    return 'Submit'
  }

  return (
    <>
      <form onSubmit={handleOTPCode}>
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold mb-2">Enter the verification code</h3>
          <p className="text-gray-600">Please enter the 6-digit code sent to your email</p>
        </div>
        
        {message && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={loading ? { opacity: [1, 0, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`mb-4 flex items-center justify-center rounded-lg ${verified || redirecting ? 'bg-green-700' : loading ? 'bg-blue-700' : 'bg-red-700'}`}
          >
            <p className="px-4 py-3 text-[19px] text-white">{message}</p>
          </motion.div>
        )}

        <InputOTP
          className="mt-3"
          maxLength={6}
          value={otpCode}
          onChange={handleChange}
          disabled={loading || verified || redirecting}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <Button
          type="submit"
          className="mt-5 w-full cursor-pointer px-6 py-4 md:px-8 md:py-5 md:text-base"
          disabled={
            loading || disable || verified || redirecting || otpCode.length < 6
          }
        >
          {loading || verified || redirecting ? (
            <div className="flex items-center justify-center gap-2">
              <Loading className="h-5 w-5" />
              <span>{getButtonText()}</span>
            </div>
          ) : (
            'Submit'
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="mt-3 w-full cursor-pointer px-6 py-3"
          onClick={cancelOTP}
          disabled={loading || verified || redirecting}
        >
          Cancel
        </Button>
      </form>
    </>
  )
}