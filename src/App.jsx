
import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
function App() {
  return (
    <div>
      <Toaster position="top-right" richColors />
      <AppRouter />
    </div>
  );
}

export default App;
