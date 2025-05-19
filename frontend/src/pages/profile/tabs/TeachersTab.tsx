const TeachersTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Teachers</h2>
        <div className="relative">
          <input
            type="search"
            placeholder="Search teachers..."
            className="pl-3 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Teacher cards will be mapped here */}
        {[1, 2, 3].map((teacher) => (
          <div key={teacher} className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10" />
              <div>
                <h3 className="font-semibold">Teacher Name</h3>
                <p className="text-sm text-muted-foreground">Subject Expert</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Rating: 4.8</span>
                <span className="text-sm">•</span>
                <span className="text-sm">5 Courses</span>
              </div>
              <button className="mt-3 w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { TeachersTab }