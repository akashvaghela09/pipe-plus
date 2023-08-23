import { AppNavigator } from "./src/navigation/";
import { PaperProvider, useTheme } from 'react-native-paper';
import store from "./src/redux/store";
import { Provider } from "react-redux";

function App() {
    return (
        <Provider store={store}>
            <PaperProvider>
                <AppNavigator />
            </PaperProvider>
        </Provider>
    );
}
export default App;