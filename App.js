import AppNavigator from "./src/navigation/AppNavigator";
import { PaperProvider } from 'react-native-paper';

function App() {
    return (
        <PaperProvider>
            <AppNavigator />
        </PaperProvider>
    );
}
export default App;