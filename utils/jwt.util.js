import jwt from 'jsonwebtoken'

export const createJwtToken = (payload) => {
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "1d"
    })
    return token
}

export const jwtVerify = (token) => {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    return decoded
}
