import { request } from "../lib/utils"
import { useQuery } from '@tanstack/react-query';

import {
  ChartNoAxesColumn,
  CircleCheck,
  CircleX,
  CircleAlert
} from 'lucide-react';
import { useState } from "react";

const SummaryCard = ({ title, value, icon: SummaryIcon }) => {
  return (
    <div className="flex w-full items-center lg:py-4 lg:px-3 2xl:py-6 2xl:px-4 bg-primary-background rounded-3xl">
      <div className="p-1 mr-4 rounded-full bg-secondary-background">
        <SummaryIcon className="lg:w-8 lg:h-8 2xl:w-9 2xl:h-9" />
      </div>
      <div className="flex flex-col">
        <p className=" text-font-gray">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}


export default function Summary() {

  const [regStatus, setRegStatus] = useState({total_reg: 0, approved: 0, pending:0, disapproved:0})

  async function getRegStatus(){
    const {data} = await request({ url: `/portal/registrations-status`, method: 'GET'})
    const a =data.find(obj => obj._id === "approved")?.totalRegistrations || 0
    const p = data.find(obj => obj._id === "pending")?.totalRegistrations || 0
    const d = data.find(obj => obj._id === "disapproved")?.totalRegistrations || 0
    setRegStatus({total_reg:a+p+d, approved:a, pending:p, disapproved:d})
    return data
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['RegStatus'],
    queryFn: getRegStatus,
  })

  return (
    <div className="flex gap-4">
      <SummaryCard
        title='Total Applications'
        value={regStatus.total_reg}
        icon={ChartNoAxesColumn}
      />
      <SummaryCard
        title='Total Approved'
        value={regStatus.approved}
        icon={CircleCheck}
      />
      <SummaryCard
        title='Total Disapproved'
        value={regStatus.disapproved}
        icon={CircleX}
      />
      <SummaryCard
        title='Total Pending'
        value={regStatus.pending}
        icon={CircleAlert}
      />
    </div>
  )
}