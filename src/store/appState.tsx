import { createContext, useContext, ReactNode, useReducer } from 'react'
import Web3Type from 'web3/types/index'
import { Contract } from 'web3-eth-contract/types/index'

export enum Role {
  RECTOR = 'rector',
  AADEPARTMENT = 'AADepartment',
  STUDENT = 'student',
  COMPANY = 'company',
}

export type Student = {
  role?: string
  id: string
  name: string
  email: string
  phone: string
  class: string
  major: string
  cpa: string
  qualifiedForGraduation: boolean
  isActive: boolean
  nonce: number
}

export type Rector = {
  role?: string
  name: string
  date: string
  phone: string
  term: string
}

export type AADUser = {
  role?: string
  name: string
  date: string
  phone: string
  isActive: boolean
}

export type Company = {
  role?: string
  name: string
  description: string
  jobInfo: string
  isActive: boolean
}

export type User = Student | Rector | AADUser | Company

type Action =
  | { type: 'ADDRESS_CHANGE'; accountAddress: string }
  | { type: 'USER_CHANGE'; user: User }
  | { type: 'WEB3_CHANGE'; web3: Web3Type }
  | { type: 'USER_CONTRACT_CHANGE'; userContract: Contract }
type Dispatch = (action: Action) => void
type AppProviderProps = { children: ReactNode }
interface AppState {
  accountAddress: string
  user: User
  web3: Web3Type
  userContract: Contract
}

function appReducer(state: AppState, action: Action) {
  switch (action.type) {
    case 'ADDRESS_CHANGE':
      return {
        ...state,
        accountAddress: action.accountAddress,
      }
    case 'USER_CHANGE': {
      return {
        ...state,
        user: action.user,
      }
    }
    case 'WEB3_CHANGE': {
      return {
        ...state,
        web3: action.web3,
      }
    }
    case 'USER_CONTRACT_CHANGE': {
      return {
        ...state,
        userContract: action.userContract,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as Action).type}`)
    }
  }
}

const appCtx = createContext<{ state: AppState; dispatch: Dispatch } | undefined>(undefined)

function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, {} as AppState)

  const value = { state, dispatch }

  return <appCtx.Provider value={value}>{children}</appCtx.Provider>
}

function useAppState() {
  const c = useContext(appCtx)
  if (c === undefined) throw new Error('useCtx must be inside a Provider with a value')
  return c
}

export { AppProvider, useAppState }
