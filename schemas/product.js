import z from 'zod'

const productSchema = z.object({
  name: z.string({
    invalid_type_error: 'Name must be a string',
    required_error: 'Name is required'
  }),
  category: z.string({
    invalid_type_error: 'Category must be a string',
    required_error: 'Category is required'
  }),
  trayQuality: z.string({
    invalid_type_error: 'trayQuality must be a string',
    required_error: 'trayQuality must is required'
  }),
  percentage: z.number().min(0).max(100, {
    invalid_type_error: 'Percentage must be a number',
    required_error: 'Percentage must is required'
  })
})

export function validateProduct (object) {
  return productSchema.safeParse(object)
}

export function validatePartialProduct (object) {
  return productSchema.partial().safeParse(object)
}
