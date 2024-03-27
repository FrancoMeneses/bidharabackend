import z from 'zod'

const traySchema = z.object({
  productId: z.number({
    invalid_type_error: 'product_id must be a number',
    required_error: 'product_id is required'
  }),
  trayComment: z.string({
    invalid_type_error: 'tray_comment must be a string'
  }),
  categoryId: z.number({
    invalid_type_error: 'category_id must be a number',
    required_error: 'category_id is required'
  }),
  trayStatus: z.number().min(0).max(1, {
    invalid_type_error: 'Percentage must be a number'
  }),
  trayQuality: z.string({
    invalid_type_error: 'tray_quality must be a string'
  }),
  trayPercentage: z.number().min(0).max(100, {
    invalid_type_error: 'tray_percentage must be a number'
  }),

  // trayQrCode: z.string({
  //   invalid_type_error: 'trayQrCode must be a string',
  //   required_error: 'trayQrCode is required'
  // }),
  createdBy: z.string({
    invalid_type_error: 'created_by must be an user indentifier',
    required_error: 'created_by is required'
  })
})

export function validateTray (object) {
  return traySchema.safeParse(object)
}

export function validatePartialTray (object) {
  return traySchema.partial().safeParse(object)
}
