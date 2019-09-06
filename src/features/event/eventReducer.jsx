


const initialState = []
  

const eventReducer = (state = initialState, action) => {
        switch(action.type){
            case "CREATE_EVENT":
                return [
                    ...state,
                    Object.assign({}, action.event)
                ]
            case "UPDATE_EVENT":
                return [
                    ...state.filter(event => event.id !== action.event.id),
                    Object.assign({}, action.event)
                ]

            case "DELETE_EVENT":
                return [
                    ...state.filter(event => event.id !== action.eventId)
                ]
 //reducer to fetch events from mock api
            case "FETCH_EVENTS":
                return action.events
                
          default:
            return state;
        }
}

export default eventReducer;