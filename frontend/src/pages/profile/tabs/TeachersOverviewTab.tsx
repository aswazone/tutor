import { BarChart, Calendar } from 'lucide-react'

const TeachersOverviewTab = () => {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total Students</h3>
          <p className="text-2xl font-bold mt-2">245</p>
          <span className="text-xs text-green-500">+12% from last month</span>
        </div>
        <div className="bg-card p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Active Courses</h3>
          <p className="text-2xl font-bold mt-2">8</p>
          <span className="text-xs text-green-500">2 new this month</span>
        </div>
        <div className="bg-card p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Average Rating</h3>
          <p className="text-2xl font-bold mt-2">4.8</p>
          <span className="text-xs text-green-500">+0.2 from last month</span>
        </div>
      </div>

      {/* Recent Activity and Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Performance Overview
            </h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Course Completion Rate</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Student Satisfaction</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Classes
            </h3>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <h4 className="font-medium">Advanced JavaScript</h4>
                  <p className="text-sm text-muted-foreground">25 students enrolled</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Today</p>
                  <p className="text-sm text-muted-foreground">2:00 PM</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { TeachersOverviewTab }