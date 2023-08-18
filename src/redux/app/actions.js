import { 
    SET_SIDE_PANEL_VALUE,
    SET_DEVICE_TYPE,
    SET_PAGE_LOADING,
    SET_SUBSCRIPTION_STATUS,
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

export const setSubscriptionStatus = (payload) => {
    return {
        type: SET_SUBSCRIPTION_STATUS,
        payload
    }
}