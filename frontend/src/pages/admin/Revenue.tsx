import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { useCallback, useEffect, useState } from "react"
import axiosInstance from "@/config/axios.config"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { BarChart3, CreditCard, IndianRupee, Loader,  Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import useExportReport from "@/components/hooks/useExportReport"
import { Pagination } from "@/components/ui/pagination"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Sparkles } from "@/components/common/Sparkles"

export interface Transaction {
  date: string
  course: string
  tutor: string
  student: string
  amount: string
  adminShare:string
  status: 'completed' | 'pending' | 'failed'
}

export interface RevenueData {
  id: string
  courseTitle: string
  tutorName: string
  studentName: string
  studentEmail: string
  amount: string
  paymentDate: string
  adminShare: string
  status: 'completed' | 'pending' | 'failed'
}

const Revenue = () => {
  const [dailyRevenue, setDailyRevenue] = useState<RevenueData[]>([])
  const [monthlyRevenue, setMonthlyRevenue] = useState<RevenueData[]>([])
  const [selectedTab, setSelectedTab] = useState('daily')
  const [selectedBottomTab, setSelectedBottomTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [totalRevenue, setTotalRevenue] = useState({ daily: 0, monthly: 0 })
  const [data,setData] = useState<Transaction[]>([]);
  const [exportData, setExportData] = useState<Transaction[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 4;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { exportToCSV, exportToPDF } = useExportReport(exportData);
  

  const handleTabSwitch = (tab: string, tag: string) => {
    if(tag === 'upper'){
      setSelectedTab(tab)
      localStorage.setItem('selectedTab', tab);
    }else{
      setSelectedBottomTab(tab)
      localStorage.setItem('selectedBottomTab', tab);
    }
  }

  const handleFullDataExport = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/admin/revenue/1/0`);
      const transformedData = response.data.map((item: RevenueData, index: number) => ({
          id: index.toString(),
          courseTitle: item.courseTitle,
          tutorName: item.tutorName || 'Unknown Tutor',
          studentName: item.studentName,
          studentEmail: item.studentEmail,
          amount: item.amount,
          paymentDate: new Date(item.paymentDate).toISOString(),
          adminShare: Number(item.amount) * 0.1,
          status: item.status
        }));
      const modifiedData: Transaction[] = response.data?.map((item: RevenueData) => ({
        date: new Date(item.paymentDate).toLocaleDateString(),
        course: item.courseTitle,
        tutor: item.tutorName,
        student: item.studentName,
        amount: item.amount,
        adminShare:Number(item.amount) * 0.1,
        status: item.status
      }))
      // Split into daily and monthly data
        const now = new Date()
        now.setDate(now.getDate() - 1)
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
        const daily = transformedData.filter((item: RevenueData) => 
          new Date(item.paymentDate) >= today
        )
        const monthly = transformedData.filter((item: RevenueData) => 
          new Date(item.paymentDate) >= thisMonth
        )
  
        console.log(daily,'daily')
        console.log(monthly,'monthly')
  
        // Calculate totals
        const dailyTotal = daily.reduce((acc: number, curr: RevenueData) => 
          acc + curr.adminShare, 0
        )
        const monthlyTotal = monthly.reduce((acc: number, curr: RevenueData) => 
          acc + curr.adminShare, 0
        )
  
        console.log(dailyTotal,'dailyTotal')
        console.log(monthlyTotal,'monthlyTotal')
  

        setTotalRevenue({ daily: dailyTotal, monthly: monthlyTotal })
        setExportData(modifiedData);
        setTotalPages(Math.ceil(modifiedData.length/limit));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(()=>{
    handleFullDataExport()
    const upperTab = localStorage.getItem('selectedTab') 
    const lowerTab = localStorage.getItem('selectedBottomTab')

    console.log(upperTab,lowerTab,'tabs')
    if(upperTab){
      setSelectedTab(upperTab)
    }
    if(lowerTab){
      setSelectedBottomTab(lowerTab)
    }
  },[])

  const fetchRevenueData =  useCallback(async() => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`/api/v1/admin/revenue/${page}/${limit}`);
      console.log(response.data,'revenue')
      // Transform and process the revenue data
      const transformedData = response.data.map((item: RevenueData, index: number) => ({
        id: index.toString(),
        courseTitle: item.courseTitle,
        tutorName: item.tutorName || 'Unknown Tutor',
        studentName: item.studentName,
        studentEmail: item.studentEmail,
        amount: item.amount,
        paymentDate: new Date(item.paymentDate).toISOString(),
        adminShare: Number(item.amount) * 0.1,
        status: item.status
      }))
      if(transformedData){
        const modifiedData: Transaction[] = transformedData?.map((item: RevenueData) => ({
          date: new Date(item.paymentDate).toLocaleDateString(),
          course: item.courseTitle,
          tutor: item.tutorName,
          student: item.studentName,
          amount: `${item.amount}`,
          adminShare: `${item.adminShare}`,
          status: item.status
        }))
        setData(modifiedData);
      }
      const now = new Date()
      now.setDate(now.getDate() - 1)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const daily = transformedData.filter((item: RevenueData) => 
        new Date(item.paymentDate) >= today
      )
      const monthly = transformedData.filter((item: RevenueData) => 
        new Date(item.paymentDate) >= thisMonth
      )
      console.log(transformedData,'transformedData')
      setDailyRevenue(daily)
      setMonthlyRevenue(monthly)
      
    } catch (error) {
      console.error('Error fetching revenue data:', error)
      toast.error('Failed to fetch revenue data')
    } finally {
      setIsLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchRevenueData()
  }, [fetchRevenueData])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin" />
        <span className="ml-2">Loading revenue data...</span>
      </div>
    )
  }

  console.log(dailyRevenue,'daily')

  const summaryCards = [
    {
      title: "Total Revenue",
      icon: IndianRupee,
      value: `₹${totalRevenue.monthly.toFixed(2)}`,
      description: "+20.1% from last month"
    },
    {
      title: "Total Sales",
      icon: CreditCard,
      value: exportData.length,
      description: "+15% from last month"
    },
    {
      title: "Monthly Target",
      icon: Sparkle,
      value:(exportData.reduce((acc, curr) => acc + Number(curr.amount), 0) / exportData.length).toFixed(2) || 0,
      percentage: `w-[${Math.ceil(Number((exportData.reduce((acc, curr) => acc + Number(curr.amount), 0) / exportData.length).toFixed(2))/10000*100)}%]`,
      description: "+201 new students"
    },
    {
      title: "Avg. Course Price",
      icon: BarChart3,
      value: (exportData.reduce((acc, curr) => acc + Number(curr.amount), 0) / exportData.length).toFixed(2) || 0,
      description: "₹2.50 from last month"
    }
  ]

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "date",
      header: "Date (mm/dd/yyyy)",
    },
    {
      accessorKey: "course",
      header: "Course",
    },
    {
      accessorKey: "tutor",
      header: "Tutor",
    },
    {
      accessorKey: "student",
      header: "Student",
    },
    {
      accessorKey: "amount",
      header: "Amount (₹)",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <div className={`px-2 py-1 rounded-full text-xs font-semibold inline-block 
            ${status === 'completed' ? 'bg-green-100 text-green-700' : 
            status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
            'bg-red-100 text-red-700'}`}>
            {status}
          </div>
        )
      }
    },
  ]

  const RevenueTable = ({ data }: { data: RevenueData[] }) => (
    data.length ? 
    (<div className="rounded-md border shadow-lg backdrop-blur-sm bg-white/5">
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b text-sky-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium ">Course</th>
              <th className="h-12 px-4 text-left align-middle font-medium ">Tutor</th>
              <th className="h-12 px-4 text-left align-middle font-medium ">Student</th>
              <th className="h-12 px-4 text-left align-middle font-medium ">Amount</th>
              <th className="h-12 px-4 text-left align-middle font-medium ">Admin Share</th>
              <th className="h-12 px-4 text-left align-middle font-medium ">Date</th>
              <th className="h-12 px-4 text-left align-middle font-medium ">Status</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.map((item) => (
              <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle font-medium">{item.courseTitle}</td>
                <td className="p-4 align-middle">{item.tutorName}</td>
                <td className="p-4 align-middle">
                  <div className="flex flex-col">
                    <span>{item.studentName}</span>
                    <span className="text-xs text-muted-foreground">{item.studentEmail}</span>
                  </div>
                </td>
                <td className="p-4 align-middle font-semibold">₹{item.amount}</td>
                <td className="p-4 align-middle font-semibold text-green-400">⤉ ₹{item.adminShare}</td>
                <td className="p-4 align-middle">{item.paymentDate}</td>
                <td className="p-4 align-middle">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${item.status === 'completed' ? 'bg-green-100/10 text-green-500' :
                    item.status === 'pending' ? 'bg-yellow-100/10 text-yellow-500' :
                    'bg-red-100/10 text-red-500'}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>)
    :
    (<div className="p-5 text-muted-foreground text-center border rounded-xl">No latest data found.. !</div>)
  )

  return (
    <div className="space-y-6 p-6 pb-16">
      <Tabs value={selectedTab} className="space-y-6">
        <TabsList defaultValue={selectedTab}>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <span className={`text-3xl bg-conic ${selectedTab === 'daily' ? 'from-emerald-700 via-emerald-400' : 'from-teal-500/90 via-teal-200/80'} to-white bg-clip-text text-transparent font-bold font-serif mr-1`}>
                Revenue
              </span>
              <span className={selectedTab === 'daily' ? 'text-emerald-500/80 font-bold text-xs uppercase' : 'text-teal-400/80 font-bold text-xs uppercase'}>
                ~{selectedTab}
              </span>
            </div>
            <div className="grid w-[350px] grid-cols-2 gap-2 mt-3 text-sm font-bold">
              <TabsTrigger 
                onClick={()=> handleTabSwitch('daily', 'upper')} 
                className="border rounded py-1 text-emerald-500/80 hover:border-emerald-500/40 hover:scale-103" 
                value="daily"
              >
                Daily (₹{totalRevenue.daily.toFixed(2)})
              </TabsTrigger>
              <TabsTrigger 
                onClick={()=> handleTabSwitch('monthly', 'upper')} 
                className="border rounded py-1 text-teal-300/80 hover:border-teal-500/40 hover:scale-103" 
                value="monthly"
              >
                Monthly (₹{totalRevenue.monthly.toFixed(2)})
              </TabsTrigger>
            </div>
          </div>
        </TabsList>
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border p-6 shadow-lg backdrop-blur-sm bg-white/5">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{totalRevenue.monthly.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border p-6 shadow-lg backdrop-blur-sm bg-white/5">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium">Today's Revenue</p>
                  <p className="text-2xl font-bold">₹{totalRevenue.daily.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border p-6 shadow-lg backdrop-blur-sm bg-white/5">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold">{monthlyRevenue.length}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border p-6 shadow-lg backdrop-blur-sm bg-white/5">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium">Today's Orders</p>
                  <p className="text-2xl font-bold">{dailyRevenue.length}</p>
                </div>
              </div>
            </div>
          </div>
          <TabsContent value="daily">
            <RevenueTable data={dailyRevenue} />
          </TabsContent>
          <TabsContent value="monthly">
            <RevenueTable data={monthlyRevenue} />
          </TabsContent>
        </div>
      </Tabs>

      <Tabs value={selectedBottomTab} className="space-y-6">
        <TabsList >
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <span className={`text-3xl bg-conic ${selectedBottomTab === 'overview' ? 'from-amber-700 via-amber-400' : 'from-violet-500/90 via-violet-200/80'} to-white bg-clip-text text-transparent font-bold font-serif mr-1`}>
                Revenue
              </span>
              <span className={selectedBottomTab === 'overview' ? 'text-amber-500/80 font-bold text-xs uppercase' : 'text-violet-400/80 font-bold text-xs uppercase'}>
                ~{selectedBottomTab}
              </span>
            </div>
            <div className="grid w-[350px] grid-cols-2 gap-2 mt-3 text-sm font-bold">
              <TabsTrigger 
                onClick={()=>handleTabSwitch('overview', 'lower')} 
                className="border rounded py-1 text-amber-500/80 hover:border-amber-500/40 hover:scale-103" 
                value="overview"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                onClick={()=>handleTabSwitch('transactions', 'lower')} 
                className="border rounded py-1 text-violet-400/80 hover:border-violet-500/40 hover:scale-103" 
                value="transactions"
              >
                Transactions
              </TabsTrigger>
            </div>
          </div>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card, index) => (
              <Card key={index} className="p-6 backdrop-blur-sm bg-white/5 border-none shadow-xl hover:shadow-2xl transition-all duration-200">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-gradient-to-br from-white/10 to-white/5">
                      <card.icon className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/60">{card.title}</p>
                      <h3 className="text-2xl font-bold text-white">{card.value}</h3>
                      {card.icon === Sparkle && <div className="relative w-full h-2 bg-sky-400/30 rounded-full">
                        <div className={`absolute z-10 ${card.percentage} h-2 bg-sky-400 rounded-full`} />
                        <span className="absolute top-2 right-0 text-xs font-medium text-sky-400">₹10,000</span>
                        {Number(card.value) >= 10000 && <p className="absolute -top-5 -right-10 text-xs font-medium"><Sparkles stroke="#e1ca47"/></p>}
                      </div>}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-white/60">{card.description}</p>
              </Card>
            ))}
          </div>

          <Card className="p-6 backdrop-blur-sm bg-white/5 border-none shadow-xl">
            <div className="rounded-lg">
              <DataTable columns={columns} data={data} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="p-6 backdrop-blur-sm bg-white/5 border-none shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
              <div className="space-x-2">
                <Button onClick={exportToCSV} variant="outline" className="border-emerald-500/20 text-emerald-500">
                  Export CSV
                </Button>
                <Button variant="outline" onClick={exportToPDF} className="border-red-500/20 text-red-500">
                  Export PDF
                </Button>
              </div>
            </div>
            <div className="rounded-lg">
              <DataTable columns={columns} data={data} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(page) => {
          setPage(page)
          const params = new URLSearchParams(searchParams);
          params.set('page', page.toString());
          params.set('limit', limit.toString());
          navigate(`?${params.toString()}`, { replace: true });
        }}
        className="m-6 fixed bottom-0 right-0"
      />
    </div>
  )
}

export default Revenue