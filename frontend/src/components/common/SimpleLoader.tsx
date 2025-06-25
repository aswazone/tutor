import Loader from '../ui/loader'

const SimpleLoader = ({height='300px'}: {height: string}) => {
  return (
    <div className={`flex h-[${height}] items-center justify-center`}><Loader className="mr-2" /> Please Wait..</div>
  )
}

export default SimpleLoader