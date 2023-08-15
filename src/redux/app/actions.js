import { 
    SET_SIDE_PANEL_VALUE,
    SET_DEVICE_TYPE,
    SET_PAGE_LOADING
} from './actionTypes';

export const setSidePanelValue = (payload) => {
    return {
        type: SET_SIDE_PANEL_VALUE,
        payload
    }
}

export const setDeviceType = (payload) => {
    return {
        type: SET_DEVICE_TYPE,
        payload
    }
}

export const setPageLoading = (payload) => {
    return {
        type: SET_PAGE_LOADING,
        payload
    }
}
