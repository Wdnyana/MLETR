import { z } from 'zod'

export const formEmailValidation = z.object({
  email: z
    .string()
    .min(1, { message: 'This field is to be filled.' })
    .email('This email is not valid'),
})
