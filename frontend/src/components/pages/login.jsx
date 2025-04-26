import LoginForm from "../login-form";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex justify-center items-center md:w-1/2">
        <LoginForm />
      </div>
      <div className="hidden md:block w-1/2 h-full rounded-bl-[9rem] main-gradient">
      </div>
    </div>
  )
}