import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
	return (
		<div className="flex justify-center px-4">
			<Sidebar />
			<main className="flex-1 max-w-2xl mx-4">{children}</main>
		</div>
	);
}


