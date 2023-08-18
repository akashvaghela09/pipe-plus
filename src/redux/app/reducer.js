import { 
    SET_SIDE_PANEL_VALUE,
    SET_DEVICE_TYPE,
    SET_PAGE_LOADING,
    SET_SUBSCRIPTION_STATUS,
} from './actionTypes';

const initialState = {
    sidepanelOpen: true,
    deviceType: "desktop",
    pageLoading: false,
    subscriptionStatus: false,
}

const reducer = (state = initialState, {type, payload}) => {

    switch (type) {
        case SET_SIDE_PANEL_VALUE:
            return {
                ...state,
                sidepanelOpen: payload
            }
        case SET_DEVICE_TYPE:
            return {
                ...state,
                deviceType: payload
            }
        case SET_PAGE_LOADING:
            return {
                ...state,
                pageLoading: payload
            }
        case SET_SUBSCRIPTION_STATUS:
            return {
                ...state,
                subscriptionStatus: payload
            }
        default:
            return state
    }
}

export {reducer}