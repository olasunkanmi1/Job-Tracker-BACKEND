import {UnAuthenticatedError} from "../errors/index.js";

// only update job if its done by the user who created it
const checkPermissions = (requestUser, resourceUserId) => {
    if(requestUser.userId === resourceUserId.toString()) return

    throw new UnAuthenticatedError('Not authorized to access this route')
}

export default checkPermissions