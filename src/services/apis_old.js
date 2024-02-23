import api from 'zmp-sdk'
import store from '../store'
import config from '../config'

export const requestMock = async (method, url, data) => {
    const headers = {'Content-Type': 'application/json'}
    const token = store.state.jwt
    if (token) {
        headers.Authorization = `Bearer ${token}`
        headers['X-Zalo-Mini-App-ID'] = config.MINIAPP_ID
    }

    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers
    })
}

export const request = async (method, url, data) => {
    const headers = {'Content-Type': 'application/json'}
    const token = store.state.jwt
    if (token) {
        headers.Authorization = `Bearer ${token}`
        headers['X-Zalo-Mini-App-ID'] = config.MINIAPP_ID
    }

    return fetch(config.BASE_URL + `${url}`, {
        method: method,
        body: JSON.stringify(data),
        headers
    })
}

export const getAccessToken = () => new Promise(resolve => {
    api.login({
        success: () => {
            api.getAccessToken({
                success: (token) => {
                    if (token === 'DEFAULT ACCESS TOKEN' && config.DEFAULT_ACCESS_TOKEN) {
                        // eslint-disable-next-line no-param-reassign
                        token = config.DEFAULT_ACCESS_TOKEN // For testing purpose only
                    }
                    resolve(token)
                },
                fail: (error) => {
                    console.error(error)
                }
            })
        },
        fail: (error) => {
            console.error(error)
        }
    })
})

export const getPhoneNumber = () => new Promise(resolve => {
    api.getPhoneNumber({
        success: (data) => {
            let phone_number = data.number.replace(/ /g,'');
            phone_number = phone_number.replace("(+84)", "0");
            resolve(phone_number)
        },
        fail: (error) => {
            console.error(error)
        }
    })
})


export const follow = () => {
    api.followOA({
        id: config.OA_ID,
        success: () => {
            store.dispatch('setUser', {
                ...store.state.user,
                isFollowing: true
            })
            /*
            zmp.toast.create({
                text: 'Cảm ơn bạn đã theo dõi OA thành công!',
                closeTimeout: 3000,
            }).open()
            //*/
            // UpdateFollowStatus(true) // Không cần gửi status về backend vì mình đã có webhook
        },
        fail: (err) => {
            console.log('Failed to follow OA. Details: ', err)
        }
    })
}

export const share = (type, data) => {
    api.openShareSheet({
        type: type,
        data: data,
        success: () => {
        },
        fail: (err) => {
            console.log('Failed to share. Details: ', err)
        }
    })
}

export const sharePostFeed = (type, data) => {
    api.openPostFeed({
        type: type,
        data: data,
        success: () => {
        },
        fail: (err) => {
            console.log('Failed to sharePostFeed. Details: ', err)
        }
    })
}


export const openProfile = (type, data) => {
    api.openProfile({
        type: type,
        id: data,
        success: () => {
            console.log('openProfile success')
        },
        fail: (err) => {
            console.log('openProfile fail')
        }
    });
}


export const followAndProfile = (type, data) => {
    api.followOA({
        id: config.OA_ID,
        success: (res) => {
            api.openProfile({
                type: type,
                id: data,
                success: () => {
                    console.log('openProfile success')
                },
                fail: (err) => {
                    console.log('openProfile fail')
                }
            })
        },
        fail: (err) => {
            console.log('followOA fail')
        }
    });
}


export const login = async (accessToken) => {
    try {
        const response = await (await request('POST', '/auth/v1/zalo/login-via-access-token', {
            access_token: accessToken,
            partner_code: config.PARTNER_CODE,
            mini_app_id: config.MINIAPP_ID,
        })).json()
        if (response && response.data && response.data.access_token) {
            await store.dispatch('setJwt', response.data.access_token)
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log('Error logging in. Details: ', error)
        return false
    }
}

export const getCurrentUser = async () => {
    try {
        const response = await (await request('GET', '/auth/v1/me')).json()
        return response.data
    } catch (error) {
        console.log('Error getCurrentUser. Details: ', error)
        return null
    }
}

export const getKiotVietUser = async (payload) => {
    try {
        const response = await (await request('POST', '/auth/v1/kiotviet/profile', payload)).json()
        return response.data
    } catch (error) {
        console.log('Error getKiotVietUser. Details: ', error)
        return null
    }
}

export const getShareLink = async () => {
    try {
        const response = await (await request('GET', '/mini-app/v1/user/social/sharing')).json()
        let link = response.data.follow_oa_sharing_url
        if (!link.startsWith('https://') && !link.startsWith('http://')) {
            link = 'https://' + link
        }
        return link
    } catch (error) {
        console.log('Error getShareLink. Details: ', error)
        return null
    }
}

export const getAchievementSummary = async (achievement_code) => {
    try {
        const response = await (await request('GET', '/mini-app/v1/user/achievement/summary?achievement_code=' + achievement_code)).json()
        return response.data
    } catch (error) {
        console.log('Error getAchievementSummary. Details: ', error)
        return null
    }
}

export const getAchievementActivities = async (achievement_code) => {
    try {
        const response = await (await request('GET', '/mini-app/v1/user/achievement/activity?achievement_code=' + achievement_code)).json()
        return response.data || []
    } catch (error) {
        console.log('Error getAchievementActivities. Details: ', error)
        return null
    }
}

export const loadAddresses = () => new Promise(resolve => {
    api.getStorage({
        keys: ['addresses'],
        success: ({ addresses }) => {
            if (addresses) {
                if (addresses.filter) {
                    resolve(addresses.filter(a => !!a && !!a.address))
                }
            }
            resolve([])
        },
        fail: (error) => {
            console.log('Failed to get addresses from storage. Details: ', error)
            resolve([])
        }
    })
})

export const saveAddress = async address => {
    const addresses = await loadAddresses()
    addresses.push(address)
    api.setStorage({
        data: { addresses },
        fail: (error) => console.log('Failed to save new address to storage. Details: ', error)
    })
    return addresses
}

export const checkout = async (payload) => {
    try {
        const response = await request('POST', '/mini-app/v1/orders', payload)
        const data = await response.json()
        return data
    } catch (error) {
        console.log('Error placing an order. Details: ', error)
        return false
    }
}

export const getProductsByCategory = async () => {
    try {
        const response = await (await request('GET', '/mini-app/v1/products/by-category')).json()
        return response.data
    } catch (error) {
        console.log('Error fetching products. Details: ', error)
        return []
    }
}

export const getShops = async () => {
    try {
        const response = await (await request('GET', '/mini-app/v1/branches')).json()
        return response.data
    } catch (error) {
        console.log('Error fetching getShops. Details: ', error)
        return []
    }
}

export const saveProductsToCache = async products => {
    await api.setStorage({
        data: { products },
        fail: (error) => console.log('Failed to save products to cache. Details: ', error)
    })
    return products
}

export const getPlacedOrders = async () => {
    try {
        const response = await (await request('GET', '/mini-app/v1/orders')).json()
        return response.data ?? []
    } catch (error) {
        console.log('Error fetching placed orders. Details: ', error)
        return []
    }
}

export const vouchersClaim = async () => {
    try {
        const response = await (await request('GET', '/mini-app/v1/vouchers/claim')).json()
        return response.meta.message ?? 'Hệ thống đang ghi nhận yêu cầu'
    } catch (error) {
        console.log('Error fetching placed orders. Details: ', error)
        return []
    }
}