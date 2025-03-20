import { FormLogin } from '@/components/auth/form-login'
import MainLayout from '@/components/layout/pages/main-layout'
import { LoginEmailOTP } from '@/types/general-type'

export default function Login({ token, setToken }: LoginEmailOTP) {
  return (
    <MainLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="lg:1/2 -mt-28 h-auto w-full rounded-xl px-4 py-5 shadow-md md:w-[60%] lg:w-[45%] xl:w-[30%]">
          <h2 className="mb-1">Welcome Back!</h2>
          <p className="mb-8 md:text-base">
            Please enter your email to sign in
          </p>

          <FormLogin token={token} setToken={setToken} />
        </div>
      </div>
    </MainLayout>
  )
}
