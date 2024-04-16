const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message

    res.status(Number (err.statusCode)).send({
        success: false,
        message: err.message
    })
}

export default errorMiddleware