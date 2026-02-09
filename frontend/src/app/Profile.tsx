
import { User } from 'lucide-react';
import { useAppSelector } from './hooks';
import GoBack from '@components/GoBack';


const Profile = () => {

    const profile = useAppSelector(state => state?.auth?.user?.user);

    return (
        <div >
            <div className='flex items-center gap-1 mb-6'>
                <GoBack />
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">My Profile</h1>
            </div>

            <div className="grid grid-cols-1 gap-8 ">

                {/* Personal Detials Card */}
                <div className="bg-white rounded-xl  p-4 md:px-8 md:py-8 border border-gray-300">
                    <div className="flex items-center gap-1 mb-4">
                        <User size={20} strokeWidth={2.5} className='text-blue-600' />
                        <h2 className="text-xl font-bold text-gray-800">Personal Details</h2>
                    </div>

                    <div className="flex flex-wrap gap-y-6 gap-x-8">

                        <div>
                            <p className="text-gray-500 text-xs font-medium mb-0.5">Full Name</p>
                            <p className="text-gray-800  font-semibold">{profile.name ?? "-"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-xs font-medium mb-0.5">Role</p>
                            <p className="text-gray-800  font-semibold">{profile.role ?? "-"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-xs font-medium mb-0.5">Address</p>
                            <p className="text-gray-800 font-semibold">{profile.address ?? "-"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-xs font-medium mb-0.5">Email</p>
                            <p className="text-gray-800 font-semibold break-all">{profile.email ?? "-"}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;