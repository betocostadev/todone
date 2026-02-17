export function validateMaxLength(
  label: string,
  value: string | undefined,
  maxLength: number,
) {
  if (!value) return

  if (value.length > maxLength) {
    throw new Error(`${label} exceeds ${maxLength} characters limit`)
  }
}
