import { useQuery } from '@tanstack/react-query';
import { request } from "../../lib/utils";
import { RotateCcw, Search } from "lucide-react";
import { useState } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";

const columns = [
  {
    accessorKey: 'person_name',
    header: 'Person Name'
  },
  {
    accessorKey: 'date_of_buying',
    header: 'Date Of Buying',
    cell: ({ row }) => {
      const date = new Date(row.original.date_of_buying);
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
        timeZone: 'Asia/Karachi'
      };
      return (
        <p>{date.toLocaleDateString('en-US', options)}</p>
      )
    }
  },
  {
    accessorKey: 'buyer_id',
    header: 'BuyerId'
  },
  {
    accessorKey: 'ticket_id',
    header: 'TicketId'
  },
  {
    accessorKey: 'contact_number',
    header: 'Contact Number'
  },
  {
    accessorKey: 'attendance',
    header: '',
    cell: ({ row }) => {
      const [isPresent, setIsPresent] = useState(row.original.attendance || false);
      return (
        <div className="flex items-center justify-center">
          <input 
            type="checkbox" 
            checked={isPresent}
            onChange={() => setIsPresent(!isPresent)}
            className="h-4 w-4"
          />
          <span className={`ml-2 ${isPresent ? 'text-green-500' : 'text-red-500'}`}>{isPresent ? 'Present' : 'Absent'}</span>
        </div>
      )
    }
  }
];

export default function RegisteredTeams() {
  const [attendees, setAttendees] = useState([]);
  const [columnFilters, setColumnFilters] = useState([
    { id: 'person_name', value: '' }
  ]);

  const attendeesFn = async () => {
    const mockData = (await import('../../data/mock-attendees.json')).attendees;
    setAttendees(mockData);
    return mockData;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['attendees'],
    queryFn: attendeesFn,
  });

  const table = useReactTable({
    data: attendees,
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
        <p className="text-3xl font-semibold">Registered Teams</p>
        <div className="flex gap-2">
          <div className="flex gap-3 items-center bg-secondary-background rounded-3xl 2xl:px-4 2xl:py-2 lg:h-10 lg:px-2 lg:text-sm">
            <Search className="h-4 w-4" />
            <input
              onChange={e => setColumnFilters([{ id: 'person_name', value: e.target.value }])}
              placeholder="Search by name"
              className="outline-none"
            />
          </div>
          <button
            className="bg-secondary-background px-2 rounded-lg cursor-pointer"
          >
            <RotateCcw className="text-font-gray h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="h-[315px] overflow-y-auto">
        <table className="w-full text-sm mb-4">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-font-gray">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left text-font-gray font-medium w-1/6">
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
                    <td key={cell.id} className="font-semibold px-4 py-3 w-1/6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
              :
              <tr className="hover:bg-secondary-background">
                <td
                  className="text-center p-10 text-xl font-semibold"
                  colSpan={6}
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
  );
}
