import MapUsers from '@/components/shared/MapUsers';
import SearchPage from '@/components/shared/SearchPage'
import { fetchUsers } from '@/lib/actions/User.actions'
import { IUser } from '@/lib/database/models/User.model'
import { searchParamsProps } from '@/lib/types'

export default async function Search({searchParams}:searchParamsProps) {

  const page=Number(searchParams?.page) || 1;
  const searchText=(searchParams?.query as string) || '';

  const allUsers=await fetchUsers({
    limit:4,
    query:searchText,
    page:page,
    path:'/',
  })


  return (
    <div className=' flex flex-col gap-2'>
      <div className=' md:px-3 py-2'>
        <SearchPage />
      </div>

      <div className=' md:px-3'>
        <MapUsers
          allUsers={allUsers?.data} 
          totalPages={allUsers?.totalPages}
        />
      </div>
    </div>
  )
}
