export type Documents = {
  id: string
  name: string
  status: 'Verified' | 'Transfer' | 'Created'
  date: string
  verifyBy: string
  action: () => void
}
