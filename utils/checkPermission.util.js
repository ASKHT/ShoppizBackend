const checkPermission = (requestUser, resourceUserId) => {
    if(requestUser.role === 'admin') return true
    if(requestUser.id === resourceUserId.toString()) return true
    return false;
}

export default checkPermission