import DashboardWelcome from "../dashboard-welcome";
import Registrations from "../registrations";
import Summary from "../summary";

export default function DashboardPage() {
  return (
    <div className="w-full flex flex-col gap-6">
      <DashboardWelcome />
      <Summary />
      <Registrations />
    </div>
  )
}