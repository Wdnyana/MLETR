'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { formEmailValidation } from '@/lib/validation'

import { magic } from '@/lib/magic-provider'

import {
  LoginWithEmailOTPEventEmit,
  LoginWithEmailOTPEventOnReceived,
  PromiEvent,
  RPCError,
  RPCErrorCode,
} from 'magic-sdk'
import { useState } from 'react'
import Loading from '../ui/loading'
import { LoginEmailOTP } from '@/types/general-type'
import { saveUserInfo } from '../utils/common'
import { FormOTP } from './form-otp'

export function FormLogin({ token, setToken }: LoginEmailOTP) {
  const [loading, setLoading] = useState(false)
  const [loginOtp, setLoginOtp] = useState<PromiEvent<string | null>>()
  const [showOTP, setShowOTP] = useState(false)

  const form = useForm<z.infer<typeof formEmailValidation>>({
    resolver: zodResolver(formEmailValidation),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formEmailValidation>) {
    setLoading(true)

    try {
      const loginOtp = magic?.auth.loginWithEmailOTP({
        email: values.email,
        showUI: false,
      }) as PromiEvent<string | null>

      setLoginOtp(loginOtp)

      if (loginOtp) {
        loginOtp
          .on(LoginWithEmailOTPEventOnReceived.EmailOTPSent as any, () => {
            setShowOTP(true)
          })
          .on('done', async (result) => {
            if (result) {
              const infoUser = await magic?.user.getInfo()
              console.log('User Info ini adalah:', infoUser)

              const isToken = result ?? ''

              setToken(isToken)
              saveUserInfo(isToken, 'EMAIL', infoUser?.publicAddress ?? '')
            }
          })
          .catch((err) => {
            console.log('Error during login: ', err)
            console.error(err.message)
          })
          .on('settled', () => {
            setLoginOtp(undefined)
            setShowOTP(false)
          })
      }

      const metadata = await magic?.user.getInfo()

      if (!token || !metadata?.publicAddress)
        throw new Error('Login with magic failed!!')

      setToken(token)
      saveUserInfo(token, 'EMAIL', metadata?.publicAddress)
      form.reset()
    } catch (err) {
      console.log('Error when login in: ', err)

      if (err instanceof RPCError) {
        switch (err.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
          case RPCErrorCode.MagicLinkExpired:
          case RPCErrorCode.MagicLinkRateLimited:
          case RPCErrorCode.UserAlreadyLoggedIn:
            console.log('Specific Magic error occurred:', err.code)
            break
        }
      }
    } finally {
      setLoading(false)
    }
  }

  function cancelLoginOTP() {
    try {
      loginOtp?.emit(LoginWithEmailOTPEventEmit.Cancel as any)

      console.log('login is canceled')
    } catch (err) {
      console.log('error in: ', err)
    }
  }

  return (
    <>
      {showOTP ? (
        <FormOTP loginOtp={loginOtp} cancelOTP={cancelLoginOTP} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="ps-2 md:text-base">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-1 pt-5 pb-6 md:ps-4 md:pt-6 md:pb-7 md:text-base"
                      placeholder="Enter email.."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="cursor-pointer px-6 py-5 md:px-10 md:py-6 md:text-base"
              type="submit"
              disabled={loading}
            >
              {loading ? <Loading className="h-5 w-5" /> : 'Submit'}
            </Button>
          </form>
        </Form>
      )}
    </>
  )
}
