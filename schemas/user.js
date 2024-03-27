import z from 'zod'

const userSchema = z.object({
  user_name: z.string({
    invalid_type_error: 'user_name must be a string',
    required_error: ' user_name is required'
  }),
  user_lastname: z.string({
    invalid_type_error: 'user_lastname must be a string',
    required_error: 'user_lastname is required'
  }),
  user_email: z.string({
    invalid_type_error: 'user_email must be a string',
    required_error: 'user_email must be a string'
  }),
  user_pwd: z.string({
    invalid_type_error: 'user_pwd must be a string',
    required_error: 'user_pwd is required'
  }),
  role_id: z.number({
    invalid_type_error: 'role_id must be a string',
    required_error: 'role_id is required'
  })
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}

export function validatePartialUser (object) {
  return userSchema.partial().safeParse(object)
}
