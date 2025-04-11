
export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        phone?: string[]
      }
      message?: string
    }
  | undefined