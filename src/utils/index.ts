import { format } from 'date-fns'

export const normalizeWeb3Object = (obj: Record<string, unknown>) =>
  Object.entries(obj).reduce((acc, [key, val]) => {
    if (Number.isNaN(+key)) {
      return { [key]: val, ...acc }
    }

    return acc
  }, {})

export const formatDate = (date: Date, dateFormat: string = 'dd/MM/yyyy'): string => format(date, dateFormat)
