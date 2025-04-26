import { useMutation } from "@tanstack/react-query";
import { request } from "../lib/utils"
import { useForm } from "react-hook-form"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: (credentials) => {
      return request({ url: 'auth/login', method: 'POST', data: credentials })
    },
    onSuccess: data => {
      setError(null);
      sessionStorage.setItem('token', data.token);
      navigate('/dashboard/analytics', { replace: true });
    },
    onError: data => setError(data.message)
  });

  const onSubmit = (data) => {
    const { rememberMe, ...body } = data;
    mutate(body);
  };

  return (
    <div className="flex flex-col justify-center space-y-6 text-font-blue md:w-[70%] lg:w-1/2">
      <div className="flex justify-between items-center">
        <h1 className="text-left text-4xl font-semibold">Sign In</h1>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <p>NU ID</p>
            <input
              {...register("nu_id", { required: true })}
              type="nu_id"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-primary-blue focus:outline-2"
              placeholder="e.g k214827"
            />
          </div>
          <div className="space-y-2">
            <p>Password</p>
            <input
              {...register("password", { required: true })}
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-primary-blue focus:outline-2"
              placeholder="Min 6 characters"
            />
          </div>
          {/* <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="w-4 h-4 accent-primary-blue"
              />
              <label className="text-sm">Keep me logged in</label>
            </div>
            <a href="#" className="text-sm text-primary-blue hover:text-secondary-blue">
              Forgot password?
            </a>
          </div> */}
          <button
            type="submit"
            disabled={isPending}
            className="bg-button-blue text-white text-sm font-semibold w-full py-4 rounded-lg"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}