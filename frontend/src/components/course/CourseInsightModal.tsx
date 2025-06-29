
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ICourseInsights } from "@/types/course.type";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CourseInsightsModal({ open, onClose , insights }:{ open: boolean, onClose: () => void, insights: ICourseInsights }) {

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {insights.courseTitle} — Course Insights
          </DialogTitle>
        </DialogHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 my-4">
          <div>
            <p className="text-sm text-gray-500">Enrolled Students</p>
            <p className="text-lg font-semibold">{insights.enrolledStudents}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-lg font-semibold">₹{insights.totalRevenue}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active This Week</p>
            <p className="text-lg font-semibold">
              {insights.activeStudentsThisWeek}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="text-lg font-semibold">
              {insights.averageRating} ⭐️
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500 mb-1">Completion Rate</p>
            <Progress value={insights.completionRate} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">
              {insights.completionRate}%
            </p>
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="my-6">
          <h3 className="text-md font-medium mb-2">Weekly Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="activeStudents" fill="#4f46e5" name="Active" />
                <Bar dataKey="newEnrollments" fill="#22c55e" name="New" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Module Progress */}
        <div className="my-6">
          <h3 className="text-md font-medium mb-2">Module Progress</h3>
          {insights.moduleProgress.map((mod) => (
            <div key={mod.module} className="mb-4">
              <p className="text-sm text-gray-700">{mod.module}</p>
              <Progress value={mod.completion} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {mod.completion}%
              </p>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="my-4">
          <h3 className="text-md font-medium mb-1">Most Active Module</h3>
          <p className="text-sm mb-2">{insights.mostActiveModule}</p>

          <h3 className="text-md font-medium mb-1">Most Rewatched Chapter</h3>
          <p className="text-sm mb-2">{insights.mostRewatchedChapter}</p>

          <h3 className="text-md font-medium mb-1">Recent Feedback</h3>
          <ul className="list-disc ml-5 text-sm text-gray-700">
            {insights.feedback.map((fb, index) => (
              <li key={index}>{fb}</li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
