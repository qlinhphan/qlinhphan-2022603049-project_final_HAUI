const initialState = {
    user: {
        email: "",
        name: "",
        accessToken: "",
        refreshToken: ""
    }
}
export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'user-login': {
            // console.log("check fun: ", action.payload)
            return {
                ...state,
                user: {
                    ...state.user,
                    email: action.payload.email,
                    name: action.payload.name,
                    accessToken: action.payload.accessToken,
                    refreshToken: action.payload.refreshToken,
                }
            }
        }
        case 'logout': {
            return {
                ...state,
                user: {
                    ...state.user,
                    email: "",
                    name: "",
                    accessToken: "",
                    refreshToken: "",
                }
            }
        }
        default:
            return state
    }
}