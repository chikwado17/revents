

const initialState = {
    currentUser: {}
}

export const authReducer = (state = initialState, action) => {
    switch(action.type){
        case "LOGIN_USER":
            return {
                ...state,
                authenticated: true,
                currentUser: action.creds.email
            }

        case "SIGN_OUT_USER":
            return {
                ...state,
                authenticated:false,
                currentUser: {}
            }

            default:
                return state;
    }
}