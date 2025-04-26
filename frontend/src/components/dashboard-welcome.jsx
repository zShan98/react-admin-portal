import DashboardIcon from '../assets/weird-thing-light.png';

export default function DashboardWelcome({className}) {
  return (
    <div className={`flex justify-center items-center main-gradient-top h-40 rounded-3xl ${className}`}>
      <div className="flex flex-col">
        <p className="text-3xl font-extrabold text-gradient">WELCOME TO THE PROCOM'25</p>
        <div className="flex items-baseline lg:space-x-4 2xl:space-x-8">
          <p className="lg:text-6xl 2xl:text-8xl font-extrabold text-gradient">DASHBOARD</p>
          <img
            className="lg:h-11 2xl:h-17"
            src={DashboardIcon}
          />
        </div>
      </div>
    </div>
  )
}