export const threads = state => state.threads

export const isLoggedIn = state => {
    return !!state.accessToken
}

export const username = state => {
    return state.username
}


export const accessToken = state => {
    return state.accessToken
}

