import DashboardWelcome from "../dashboard-welcome";
import TeamCount from "../attendance/team-count";
import RegisteredTeams from "../attendance/registered-teams";
export default function OnDayAttendance() {
  return (
    <div className="w-full">
      <div className="flex flex-row w-full justify-between items-center p-6 gap-6">
        <div className="flex-1">
          <DashboardWelcome className="h-65" />
        </div>
        <TeamCount />
      </div>
      <RegisteredTeams />
    </div>
  )
}