import axios from 'axios'

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    const errors = error.response?.data?.errors

    if (typeof message === 'string' && message.trim()) {
      return message
    }

    if (errors && typeof errors === 'object') {
      const first = Object.values(errors)[0]
      if (Array.isArray(first) && first[0]) {
        return String(first[0])
      }
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong while talking to the API.'
}
