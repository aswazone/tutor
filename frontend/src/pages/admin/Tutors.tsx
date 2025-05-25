import { Tutor, TutorsTable } from "@/components/admin/TutorsTable"
import axiosInstance from "@/config/axios.config";
import { useEffect, useState } from "react";

interface ApiTutor {
  _id: string;
  name: string;
  userName: string;
  userEmail: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
}

const Tutors = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const response = await axiosInstance.get('/api/v1/admin/tutors');
                const transformedTutors = response.data.map((tutor: ApiTutor) => ({
                    id: tutor._id,
                    name: tutor.name || tutor.userName,
                    email: tutor.userEmail,
                    isActive: tutor.isActive,
                    joinDate: new Date(tutor.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    }),
                    rating: 0,
                    coursesCount: 0
                }))
                setTutors(transformedTutors);

            } catch (error) {
                console.error('Error fetching tutors:', error);
            }
        };
        
        fetchTutors();
    }, []);


    console.log(tutors);

    return (
        <>
            <div className="text-3xl font-bold font-serif">Tutors</div>
            <div>
                <TutorsTable tutors={tutors} setTutors={setTutors}/>
            </div>
        </>
    );
}

export default Tutors;