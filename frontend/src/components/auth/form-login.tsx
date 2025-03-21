'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'

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
import Loading from '../ui/loading'
import { LoginEmailOTP } from '@/types/general-type'
import { saveUserInfo } from '../utils/common'
import { FormOTP } from './form-otp'

export function FormLogin({ token, setToken }: LoginEmailOTP) {
  const [loading, setLoading] = useState(false)
  const [loginOtp, setLoginOtp] = useState<PromiEvent<string | null>>()
  const [showOTP, setShowOTP] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formEmailValidation>>({
    resolver: zodResolver(formEmailValidation),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formEmailValidation>) {
    setLoading(true)
    setErrorMessage(null)

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
            setLoading(false)
          })
          .on('done', async (result) => {
            if (result) {
              try {
                const infoUser = await magic?.user.getInfo()
                console.log('User Info is:', infoUser)

                const response = await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/v1/auth/verify`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${result}`
                  },
                  body: JSON.stringify({ 
                    email: values.email 
                  })
                });

                if (!response.ok) {
                  throw new Error('Failed to verify with backend');
                }

                const data = await response.json();
                console.log('Backend verification successful:', data);

                const jwtToken = data.token;
                setToken(jwtToken);
                
                saveUserInfo(jwtToken, 'EMAIL', infoUser?.publicAddress ?? '', data.user);
              } catch (backendError) {
                console.error('Backend verification error:', backendError);
                setErrorMessage('Error verifying with server. Please try again.');
                setShowOTP(false);
                setLoading(false);
              }
            }
          })
          .catch((err) => {
            console.error('Error during login: ', err);
            setErrorMessage(err.message || 'Authentication failed. Please try again.');
            setLoading(false);
            setShowOTP(false);
          })
          .on('settled', () => {
            setLoginOtp(undefined);
          });
      }
    } catch (err) {
      console.error('Error when logging in: ', err);

      if (err instanceof RPCError) {
        switch (err.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
            setErrorMessage('Magic link verification failed. Please try again.');
            break;
          case RPCErrorCode.MagicLinkExpired:
            setErrorMessage('Magic link expired. Please request a new one.');
            break;
          case RPCErrorCode.MagicLinkRateLimited:
            setErrorMessage('Too many attempts. Please try again later.');
            break;
          case RPCErrorCode.UserAlreadyLoggedIn:
            setErrorMessage('User already logged in.');
            break;
          default:
            setErrorMessage('Authentication failed. Please try again.');
        }
      } else {
        setErrorMessage('Authentication failed. Please try again.');
      }

      setLoading(false);
    }
  }

  function cancelLoginOTP() {
    try {
      loginOtp?.emit(LoginWithEmailOTPEventEmit.Cancel as any);
      setShowOTP(false);
      console.log('Login is canceled');
    } catch (err) {
      console.error('Error in cancellation: ', err);
    }
  }

  return (
    <>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      
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
              className="cursor-pointer px-6 py-5 md:px-10 md:py-6 md:text-base w-full"
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