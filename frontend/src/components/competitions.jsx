import { useQuery } from '@tanstack/react-query';
import { request } from "../lib/utils"


const CompetitionCard = ({ item }) => {
  return (
    <div className="p-6">
      <p className="text-2xl font-semibold">{item.title}</p>
      <div className="flex justify-between items-center">
        <button
          className="text-secondary-blue/50 cursor-pointer"
        >
          View Teams Registered
        </button>
        <p className="text-3xl font-bold main-gradient text-transparent bg-clip-text">{item.registrations} Teams</p>
      </div>
    </div> 
  )
}

const CompetitionList = ({ items }) => {
  return (
    <div className="max-h-[700px] overflow-y-auto">
      {items.map((item, idx) => <CompetitionCard key={idx} item={item} />)}
    </div>
  )
}

export default function Competitions() {

  const competitionsFn = async () => {
    const { data } = await request({ url: '/portal/competitions/registrations', method: 'GET'});
    return data;
  };


  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ['competitions'],
    queryFn: competitionsFn,
  })

  return (
    <div className="flex flex-col h-full text-font-blue w-full bg-primary-background rounded-3xl">
      <div className="px-6 pt-4 pb-2 space-y-2 border-b border-font-gray">
        <h1 className="text-3xl font-semibold">Competitions</h1>
        <p className="text-font-gray">Competition Name</p>
      </div>
      {isLoading && <span>Loading...</span>}
      {isError && <span>{`An error occurred: ${error.message}`}</span>}
      {isSuccess && <CompetitionList items={data} />}
    </div>
  )
}