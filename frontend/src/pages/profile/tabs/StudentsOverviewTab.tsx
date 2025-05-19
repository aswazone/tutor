import { BarChart, Calendar, GraduationCap } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const StudentsOverviewTab = () => {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Enrolled Courses
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              +2 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hours Studied
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42h</div>
            <p className="text-xs text-muted-foreground">
              +12h from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Score
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              +5% improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Courses Progress</h3>
        <div className="space-y-4">
          {[
            { name: 'Advanced JavaScript', progress: 75, lastAccessed: '2 hours ago' },
            { name: 'React Fundamentals', progress: 90, lastAccessed: '1 day ago' },
            { name: 'Node.js Basics', progress: 45, lastAccessed: '3 days ago' },
          ].map((course, index) => (
            <div key={index} className="bg-card p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{course.name}</h4>
                <span className="text-sm text-muted-foreground">
                  Last accessed: {course.lastAccessed}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Upcoming Classes</h3>
        <div className="grid gap-4">
          {[
            { name: 'JavaScript Workshop', time: '2:00 PM', date: 'Today', tutor: 'John Doe' },
            { name: 'React Project Review', time: '11:00 AM', date: 'Tomorrow', tutor: 'Jane Smith' },
            { name: 'Code Review Session', time: '3:30 PM', date: 'May 15', tutor: 'Mike Johnson' },
          ].map((session, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
              <div className="space-y-1">
                <p className="font-medium">{session.name}</p>
                <p className="text-sm text-muted-foreground">with {session.tutor}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{session.date}</p>
                <p className="text-sm text-muted-foreground">{session.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { StudentsOverviewTab }