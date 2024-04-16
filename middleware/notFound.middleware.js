const notFound = ( req, res) => {
    res.status(404).json("404 not found")
}

export default notFound