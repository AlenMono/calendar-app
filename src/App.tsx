import {
	useSession,
	useSupabaseClient,
	useSessionContext
} from "@supabase/auth-helpers-react";
import DateTimePicker from "react-datetime-picker";
import { useState } from "react";

function App() {
	const [start, setStart] = useState<Date>(new Date());
	const [end, setEnd] = useState<Date>(new Date());
	const [eventName, setEventName] = useState("");
	const [eventDescription, setEventDescription] = useState("");

	const session = useSession(); // tokens, when session exists we have a user
	const supabase = useSupabaseClient(); // talk to supabase!
	const { isLoading } = useSessionContext();

	if (isLoading) {
		return <></>;
	}

	async function googleSignIn() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				scopes: "https://www.googleapis.com/auth/calendar"
			}
		});
		if (error) {
			alert("Error logging in to Google provider with Supabase");
			console.log(error);
		}
	}

	async function signOut() {
		await supabase.auth.signOut();
	}

	async function createCalendarEvent() {
		console.log("Creating calendar event");
		const event = {
			summary: eventName,
			description: eventDescription,
			start: {
				dateTime: start.toISOString(), // Date.toISOString() ->
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
			},
			end: {
				dateTime: end.toISOString(), // Date.toISOString() ->
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
			}
		};

		await fetch(
			"https://www.googleapis.com/calendar/v3/calendars/1a355fe6cb28f7e8f3a38d5224a00147953f938b11abb1a9774bfe219cdfdf62@group.calendar.google.com/events",
			{
				method: "POST",
				headers: {
					Authorization: "Bearer " + session?.provider_token // Access token for google
				},
				body: JSON.stringify(event)
			}
		)
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				console.log(data);
				alert("Event created, check your Google Calendar!");
			});
	}

	const fetchCalendarList = async () => {
		try {
			const response = await fetch(
				"https://www.googleapis.com/calendar/v3/users/me/calendarList",
				{
					headers: {
						Authorization: "Bearer " + session?.provider_token
					}
				}
			);

			const data = await response.json();
			console.log(data);
		} catch (error) {
			console.error("Error fetching calendar list:", error);
		}
	};

	fetchCalendarList();

	return (
		<div>
			<div className="max-w-3xl m-auto">
				{session ? (
					<div className="flex flex-col gap-4">
						<div className="mb-4 text-center">
							<h2 className="font-bold">
								Hey there {session.user.email}
							</h2>
						</div>

						<div className="flex flex-col gap-4">
							<div>
								<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Start of your event
								</p>
								<DateTimePicker
									onChange={setStart}
									value={start}
								/>
							</div>
							<div>
								<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									End of your event
								</p>
								<DateTimePicker onChange={setEnd} value={end} />
							</div>

							<div>
								<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Event name
								</p>
								<input
									type="text"
									onChange={(e) =>
										setEventName(e.target.value)
									}
									className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
								/>
							</div>
							<div>
								<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Event description
								</p>
								<input
									type="text"
									onChange={(e) =>
										setEventDescription(e.target.value)
									}
									className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
								/>
							</div>
						</div>

						<button
							onClick={() => createCalendarEvent()}
							className="bg-purple-300 rounded-md py-2"
						>
							Create Calendar Event
						</button>
						<button
							onClick={() => signOut()}
							className="py-2 border border-slate-400 rounded-md"
						>
							Sign Out
						</button>
					</div>
				) : (
					<>
						<button onClick={() => googleSignIn()}>
							Sign In With Google
						</button>
					</>
				)}

				<iframe
					src="https://calendar.google.com/calendar/embed?src=1a355fe6cb28f7e8f3a38d5224a00147953f938b11abb1a9774bfe219cdfdf62%40group.calendar.google.com&ctz=Europe%2FLondon"
					style={{ border: 0 }}
					width="800"
					height="600"
				></iframe>
			</div>
		</div>
	);
}

export default App;
