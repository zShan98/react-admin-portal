import { useQuery, useMutation } from '@tanstack/react-query';
import { request } from "../lib/utils"
import { RotateCcw, Search } from "lucide-react";
import { useState, useEffect } from "react";
import FilterDropdown from "./filter-dropdown";
import ApprovalBtn from '../commons/button-group';
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { jwtDecode } from "jwt-decode";


export default function Registrations() {



const dropDownOptions = ['All', 'Pending', 'Approved', 'Disapproved'];
const columns = [
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => (
      <div className="w-24">
        {row.original.department}
      </div>
    )
  },
  {
    accessorKey: 'title',
    header: 'Competition',
    cell: ({ row }) => (
      <div className="w-40">
        {row.original.title}
      </div>
    )
  },
  {
    accessorKey: 'team_name',
    header: 'Team Name',
    cell: ({ row }) => (
      <div className="w-32 truncate" title={row.original.team_name}>
        {row.original.team_name}
      </div>
    )
  },
  {
    accessorKey: 'fee',
    header: 'Competition Fee',
    cell: ({ row }) => (
      <div className="w-28 text-center">
        {row.original.fee}
      </div>
    )
  },
  {
    accessorKey: 'isApproved',
    header: 'Status',
    cell: ({ row }) => {
      const str = row.original.isApproved;
      const regID = {team_id:row.original.team_id, competition_id: row.original._id}
      let btnColor = '';

      if (str === 'approved') {
        btnColor = 'green-500';
      } else if (str === 'pending') {
        btnColor = 'yellow-500';
      } else if (str === 'disapproved') {
        btnColor = 'red-500';
      } else {
        btnColor = 'indigo-500';
      }
      


      const options = [{text: 'Approved',params: 'approved'},
                      {text: 'Disapproved',params: 'disapproved'}]

      const {role} = jwtDecode(sessionStorage.getItem('token'));

      return (
        role === 'admin' ?
        <ApprovalBtn current={str} class_Name={`bg-${btnColor}`} options={options} regID={regID} on_pressed={updateRegistration}/>
        :
        <p className={`text-${btnColor}`}>{str}</p>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      return filterValue === 'All' || row.original.isApproved === filterValue.toLowerCase();
    }
  },
  {
    accessorKey: 'Registration_time',
    header: 'Date of Reg.',
    cell: ({row}) => {
      const date = new Date(row.original.Registration_time);
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Karachi'
      };
      return (
        <div className="w-36 whitespace-nowrap">
          {date.toLocaleDateString('en-US', options)}
        </div>
      )
    }
  },
  {
    accessorKey: 'payment_URL',
    header: 'Payment Receipt',
    cell: ({row}) => {
      const {role} = jwtDecode(sessionStorage.getItem('token'));
      const str = role === 'admin' ? row.original.payment_URL: '';
      const str2 = role !== 'admin' ? '[blocked]': '';

      return (
        <div className="w-28">
          {str !== "cash payment" ? (
            <a href={str} target="_blank" className="text-blue-500 hover:text-blue-700">
              View Receipt {str2}
            </a>
          ) : (
            <p>Cash Payment</p>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: 'approvedBy',
    header: 'Approved By',
    cell: ({ row }) => (
      <div className="w-28">
        {row.original.approvedBy}
      </div>
    )
  },  
  {
    accessorKey: 'collectedBy',
    header: 'Collected By',
    cell: ({ row }) => (
      <div className="w-24">
        {row.original.collectedBy === 'online' ? 'Online' : row.original.collectedBy}
      </div>
    )
  }
];


// export default function Registrations() {
  const [reg, setReg] = useState([]);
  const [selected, setSelected] = useState('All');

  const [columnFilters, setColumnFilters] = useState([
    { id: 'team_name', value: '' },
    { id: 'isApproved', value: 'All' }
  ]);

  const registrationsFn = async () => {
    const { data } = await request({ url: 'portal/registrations', method: 'GET'});
    let registration = [];
    data.map((r)=>{
      r.registeredTeams.map((t)=>{
        const a = {_id:r._id, department:r.department, title: r.title, fee: r.fee,...t}
        registration.push(a)
      });
    })
    console.log(registration)
    setReg(registration)
    return registration;
  };

  

  const { registration, isLoading, isError, error } = useQuery({
    queryKey: ['registrations'],
    queryFn: registrationsFn,
  })

  const mutation = useMutation({
    mutationFn: ({ regID, approvalStatus }) => updateRegistration(regID, approvalStatus),
    onSuccess: () => {
      // Invalidate and refetch the registrations query to update the cache
      queryClient.invalidateQueries(['registrations']);
    },
  });


  const handleApproval = (regID, approvalStatus) => {
    mutation.mutate({ regID, approvalStatus});
  };
  
  const updateRegistration = async (regID, approvalStatus)=>{
    const UserID = jwtDecode(sessionStorage.getItem('token')).user_id
    const { data } = await request({ url: `verification/${regID.competition_id}/${regID.team_id}`, method: 'PATCH', data:{approvalStatus,UserID}})
    // console.log(data)
  }



  const table = useReactTable({
    data: reg,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="flex flex-col bg-primary-background rounded-3xl">
      <div className="flex justify-between py-4 px-6">
        <p className="text-3xl font-semibold">All Registrations</p>
        <div className="flex gap-2">
          <div className="flex gap-3 items-center bg-secondary-background rounded-3xl 2xl:px-4 2xl:py-2 lg:h-10 lg:px-2 lg:text-sm">
            <Search className="h-4 w-4" />
            <input
              onChange={e => setColumnFilters([{ id: 'team_name', value: e.target.value }, columnFilters[1]])}
              placeholder="Search"
              className="outline-none"
            />
          </div>
          <FilterDropdown
            selected={selected}
            options={dropDownOptions}
            onChange={value => {
              setColumnFilters([columnFilters[0], { id: 'isApproved', value }]);
              setSelected(value);
            }}
          />
          <button
            className="main-gradient rounded-lg lg:text-sm lg:px-2 2xl:py-2 2xl:px-4 font-semibold text-white cursor-pointer"
          >
            Download CSV
          </button>
          <button
            className="bg-secondary-background px-2 rounded-lg cursor-pointer"
          >
            <RotateCcw className="text-font-gray h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="h-[500px] overflow-y-auto">
        <table className="w-full text-sm mb-4">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-font-gray">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2 text-left text-font-gray font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length !== 0
              ?
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-secondary-background">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 font-semibold">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
              :
              <tr className="hover:bg-secondary-background">
                <td
                  className="text-center p-10 text-xl font-semibold"
                  colSpan={8}
                >
                {isLoading && `Loading...`}
                {isError && `An error occurred: ${error.message}`}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}