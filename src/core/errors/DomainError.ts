import { DOMAIN_ERROR_CODE } from '@/shared/constants'

export class DomainError extends Error {
  code: string

  constructor(message: string, code = DOMAIN_ERROR_CODE) {
    super(message)

    this.name = 'DomainError'
    this.code = code
  }
}
