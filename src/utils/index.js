// Supabase Auth utils
export { 
    getUser, 
    getSession, 
    signInUser, 
    signOutUser,
    updateOnboardingStatus 
} from './auth';

// Fullscreen utils
export { 
    requestFullScreenEnter, 
    requestFullScreenExit 
} from './fullscreen';

// Number formatting utils
export { 
    formatNumbers, 
    formatTime,
    formatDate,
    formatIndianNumbering,
    formatReadableDate 
} from './numbers';

// Localstorage utils
export { 
    loadData, 
    saveData, 
    clearData 
} from './localstorage';

// Helper utils
export { 
    waitFor, 
    isValid,
    shuffleArray 
} from './helper';