import Cookies from "js-cookie"
import axios from "axios"

export async function getAccessToken() {
    // get the access token
    let access = Cookies.get('apd_accessToken')
    const refresh = Cookies.get('apd_refreshToken')

    // if the access token doesn't exist or is invalid, try to refresh
    if ((!access || (access && !await validateToken(access))) && refresh) access = await refreshToken(refresh)

    return access
}

async function validateToken(token) {
    if (!token) return false
    try {
        await axios.post(`http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}/auth/validate`, [], {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            withCredentials: true
        })
        return true
    } catch {
        return false
    }
}

async function refreshToken(refreshToken) {
    try {
        const response = await axios.post(`http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}/auth/refresh`, [], {
            headers: {
                "Authorization": `Bearer ${refreshToken}`
            },
            withCredentials: true
        })

        return response.data.token
    } catch {
        return undefined
    }
}