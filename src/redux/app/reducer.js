import { 
    SET_SIDE_PANEL_VALUE,
    SET_DEVICE_TYPE,
    SET_PAGE_LOADING
} from './actionTypes';

const initialState = {
    sidepanelOpen: true,
    deviceType: "desktop",
    pageLoading: false
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
        default:
            return state
    }
}

export {reducer}