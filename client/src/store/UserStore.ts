import { makeAutoObservable } from 'mobx'

export interface User {
    id: string
    email: string
    role: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    reputation_score?: number
    completed_deals?: number
    disputed_deals?: number
    dispute_rate?: number
    is_active?: boolean
    is_verified?: boolean
    created_at?: string
    updated_at?: string
}

class UserStore {
    private _isAuth = false
    private _user: User | null = null

    constructor() {
        makeAutoObservable(this)
    }

    get isAuth(): boolean {
        return this._isAuth
    }

    get user(): User | null {
        return this._user
    }

    setIsAuth(status: boolean) {
        this._isAuth = status
    }

    setUser(data: User | null) {
        this._user = data
    }

    logout() {
        this._isAuth = false
        this._user = null
    }
}

export default new UserStore()
