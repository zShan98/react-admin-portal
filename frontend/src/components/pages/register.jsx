import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import FilterDropdown from "../filter-dropdown";
import uniList from '../../uniList.json';
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { request } from "../../lib/utils";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {useSearchParams } from 'react-router-dom';

import uuid from 'react-uuid'


const RegistrationForm = () => {
  const [data, setData] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedComp, setSelectedComp] = useState(null);
  const [selectedUni, setSelectedUni] = useState('FAST-NUCES, Karachi');
  const [teamSize, setTeamSize] = useState(1);
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
  const [searchParams, setSearchParams] = useSearchParams(); // BA = Brand Ambassader


  const { reg, isLoading, isError, error } = useQuery({
    queryKey: ['getCompetitions'],
    queryFn: getCompetitions,
  })


  async function getCompetitions(){
    const {data} = await request({ url: `/portal/competitions`, method: 'GET'})
    const reg = data
    setData(reg)
    return reg
 }




  const departments = data.map(dept => dept.department);
  const competitions = selectedDept 
    ? data.find(d => d.department === selectedDept)?.competitions.map(c => c.title) 
    : [];

  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => {
      return request({ method: 'POST', url: '/portal/new-registration', data: formData })
    },
    onSuccess: () => {
      toast('Team registered successfully');
      setSelectedDept(null);
      setSelectedComp(null);
      setSelectedUni('FAST-NUCES, Karachi');
      setTeamSize(1);
      reset();
    },
    onError: data => {
      toast(data.message ?? 'Failed to register team');
    }

  })

  useEffect(() => {
    if (selectedComp) {
      const dept = data.find(d => d.department === selectedDept);
      const comp = dept?.competitions.find(c => c.title === selectedComp);
      if (comp) {
        setTeamSize(comp.min_team_size);
      }
    }
  }, [selectedComp]);

  const onSubmit = (formData) => {
    const submitData = {
      competition: selectedComp,
      team_id: uuid(),
      university: selectedUni,
      team_name: formData.teamName,
      brand_Ambassador: searchParams.get('ba'),
      isApproved: "pending",
      member: Object.keys(formData)
        .filter(key => key.startsWith('member'))
        .map((key, index) => ({ ...formData[key], isLeader: index === 0 })),
      Registration_time: new Date(),
      payment_URL: "cash payment",
      approvedBy: "",
      collectedBy: jwtDecode(sessionStorage.getItem('token')).user_id
    };
    mutate(submitData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Department</label>
          <FilterDropdown
            selected={selectedDept || "Select Department"}
            options={departments}
            onChange={(dept) => {
              setSelectedDept(dept);
              setSelectedComp(null);
            }}
          />
        </div>

        {selectedDept && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Competition</label>
            <FilterDropdown
              selected={selectedComp || "Select Competition"}
              options={competitions}
              onChange={setSelectedComp}
            />
          </div>
        )}

        {selectedComp && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium">University</label>
              <FilterDropdown
                selected={selectedUni}
                options={uniList}
                onChange={setSelectedUni}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Team Size</label>
              {(() => {
                const comp = data
                  .find(d => d.department === selectedDept)
                  ?.competitions.find(c => c.title === selectedComp);
                
                const teamSizeOptions = Array.from(
                  { length: comp.max_team_size - comp.min_team_size + 1 },
                  (_, i) => `${comp.min_team_size + i} Members`
                );

                return (
                  <FilterDropdown
                    selected={`${teamSize} Members`}
                    options={teamSizeOptions}
                    onChange={(option) => setTeamSize(Number(option.split(' ')[0]))}
                  />
                );
              })()}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Team Name</label>
              <input
                {...register('teamName', { required: true })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-primary-blue focus:outline-2 bg-secondary-background"
                placeholder="Enter team name"
              />
            </div>

            {[...Array(teamSize)].map((_, index) => (
              <div key={index} className="space-y-4 p-4 bg-secondary-background rounded-lg">
                <h3 className="font-medium">Member {index + 1}</h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    {...register(`member${index + 1}.name`, { required: true })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-primary-blue focus:outline-2"
                    placeholder={`Enter member ${index + 1} name`}
                  />
                  {errors[`member${index + 1}.name`] && (
                    <span className="text-red-500 text-sm">Name is required</span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">CNIC</label>
                  <input
                    {...register(`member${index + 1}.cnic`, { 
                      required: true,
                      pattern: {
                        value: /^[0-9]{5}-[0-9]{7}-[0-9]$/,
                        message: "CNIC format should be: 12345-1234567-1"
                      }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-primary-blue focus:outline-2"
                    placeholder="XXXXX-XXXXXXX-X"
                  />
                  {errors[`member${index + 1}.cnic`] && (
                    <span className="text-red-500 text-sm">
                      {errors[`member${index + 1}.cnic`].message || "CNIC is required"}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Phone Number</label>
                  <input
                    {...register(`member${index + 1}.phone`, { 
                      required: true,
                      pattern: {
                        value: /^03[0-9]{9}$/,
                        message: "Phone number should start with 03 and be 11 digits"
                      }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-primary-blue focus:outline-2"
                    placeholder="03XXXXXXXXX"
                  />
                  {errors[`member${index + 1}.phone`] && (
                    <span className="text-red-500 text-sm">
                      {errors[`member${index + 1}.phone`].message || "Phone number is required"}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    {...register(`member${index + 1}.email`, { 
                      required: true,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-primary-blue focus:outline-2"
                    placeholder="example@email.com"
                  />
                  {errors[`member${index + 1}.email`] && (
                    <span className="text-red-500 text-sm">
                      {errors[`member${index + 1}.email`].message || "Email is required"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {selectedComp && (
        <button
          disabled={isPending}
          type="submit" className="w-full bg-primary-blue text-white py-2 rounded-lg hover:bg-opacity-90">
          Submit
        </button>
      )}
    </form>
  );
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col text-font-blue w-full bg-primary-background rounded-3xl">
      <div className="px-6 pt-4 pb-2 space-y-2 border-b border-font-gray">
        <h1 className="text-3xl font-semibold">Registration</h1>
      </div>
      <RegistrationForm />
    </div>
  );
}