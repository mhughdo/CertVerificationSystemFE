import { createContext, useContext } from 'react'
import Web3Type from 'web3/types/index'

interface AppState {
  account: string
  web3: Web3Type
}

const appCtx = createContext<AppState | undefined>(undefined)

export const AppProvider = appCtx.Provider

export function useAppState() {
  const c = useContext(appCtx)
  if (c === undefined) throw new Error('useCtx must be inside a Provider with a value')
  return c
}
