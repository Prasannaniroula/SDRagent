import {Link} from 'react-router-dom'

export default function Navbar(){
    return(
        <nav className="bg-indigo-600 text-white px-6 py-4">
            <div className='flex justify-between items-center max-w-xl mx-auto'>
                <h1 className='text-xl font-bold'>SDR Agent</h1>
                <div className='flex gap-6'>
                <Link to="/" className='hover:text-indigo-200 transition'>
                Dashboard
                </Link>
                <Link to="/" className='hover:text-indigo-200 transition'>
                Composer
                </Link>
                <Link to="/" className='hover:text-indigo-200 transition'>
                Leads
                </Link>
                </div>



            </div>
        </nav>
    )
}