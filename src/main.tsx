import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

const supabase = createClient(
	"https://ekldqyvcmiwiadavkevv.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbGRxeXZjbWl3aWFkYXZrZXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwNjQ3MzQsImV4cCI6MjA0MTY0MDczNH0.fa4a3ut-S-I5iWm0R3JotXJgnwJzXsdi5N5h5YHo24Q"
);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<SessionContextProvider supabaseClient={supabase}>
			<App />
		</SessionContextProvider>
	</StrictMode>
);
