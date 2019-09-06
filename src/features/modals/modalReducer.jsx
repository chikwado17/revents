
 
const initialState = null;

export const modalReducer = (state = initialState, action) => {
    switch(action.type){

        case "MODAL_OPEN":
        const { modalType, modalProps } = action;
            return{
               modalType,
               modalProps
            };

        case "MODAL_CLOSE":
            return null;

        default:
            return state;
    }
}