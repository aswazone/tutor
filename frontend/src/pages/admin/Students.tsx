import { Student, StudentsTable } from "@/components/admin/StudentsTable"
import axiosInstance from "@/config/axios.config";
import { ApiStudents } from "@/types/admin.type";
import { useEffect, useState } from "react";


const Students = () => {

const [students, setstudents] = useState<Student[]>([]);
  
      useEffect(() => {
          const fetchStudents = async () => {
              try {
                  const response = await axiosInstance.get('/api/v1/admin/students');
                  const transformedStudents = response.data.map((student: ApiStudents) => ({
                      id: student._id,
                      name: student.name || student.userName,
                      email: student.userEmail,
                      isActive: student.isActive,
                      enrolledCourses: 0,
                      completedCourses: 0,
                      joinDate: new Date(student.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                  }))
                  setstudents(transformedStudents);
  
              } catch (error) {
                  console.error('Error fetching students:', error);
              }
          };
          
          fetchStudents();
      }, []);
  
  
      console.log(students);


  return (
      <>
        <div className="text-3xl font-bold font-serif">Students</div>
        <div>
          <StudentsTable students={students} setStudents={setstudents}/>
        </div>
      </>
    )
}

export default Students