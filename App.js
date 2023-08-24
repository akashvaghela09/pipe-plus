import { AppNavigator } from "./src/navigation/";
import { PaperProvider } from 'react-native-paper';
import store from "./src/redux/store";
import { Provider } from "react-redux";
import { theme } from "./src/theme/theme";
import { addInitialValues } from "./src/utils/";
import { useEffect } from "react";

function App() {

    useEffect(() => {
        addInitialValues();
    }, []);

    return (
        <Provider store={store}>
            <PaperProvider theme={theme}>
                <AppNavigator />
            </PaperProvider>
        </Provider>
    );
}
export default App;