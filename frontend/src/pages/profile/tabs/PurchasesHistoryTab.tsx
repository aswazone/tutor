import { Pagination } from "@/components/ui/pagination";
import axiosInstance from "@/config/axios.config";
import { env } from "@/config/env.config";
import { RootState } from "@/store"
import { IOrders } from "@/types/order.type";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom";

const PurchasesHistoryTab = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<IOrders[]>([]);
  
  const [searchParams,setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 4;


  const fetchOrdersData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/api/v1/order',{
        params: { page, limit: pageSize }
      });

      const { data, total } = response.data;

      setOrders(data);
      setTotalPages(Math.ceil(total / pageSize));
      setTotalItems(total);

    } catch (error) {
      console.log(error)
      setOrders([]);
    }
    setIsLoading(false);
  },[page]);

  const onPageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  useEffect(() => {
    if (user) {
      fetchOrdersData();
    }
  }, [user, fetchOrdersData]);


  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Purchase History</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div>No purchases found.</div>
      ) : (
        <table className="min-w-full bg-background border border-sky-900/50rs rounded-lg">
          <thead>
            <tr className="bg-sky-900/50 text-sm">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Course</th>
              <th className="py-2 px-4 border-b">Tutor</th>
              <th className="py-2 px-4 border-b">Order Date</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Payment</th>
              <th className="py-2 px-4 border-b">Amount</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {orders.map((order, idx) => (
              <tr key={order._id || idx} className="text-center">
                <td className="py-1 px-4 border-b">{idx + 1}</td>
                <td className="py-1 px-4 border-b flex items-center gap-2">
                  <img src={`${env.AMZ_BUCKET_NAME}/${order.courseImage}`} alt={order.courseTitle} className="w-10 h-10 object-cover rounded" />
                  <span>{order.courseTitle}</span>
                </td>
                <td className="py-1 px-1 border-b truncate">{order.tutorName}</td>
                <td className="py-1 px-1 border-b">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="py-1 px-1 border-b">{order.orderStatus}</td>
                <td className="py-1 px-1 border-b">{order.paymentStatus} ({order.paymentMethod})</td>
                <td className="py-1 px-1 border-b">₹{order.coursePricing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
        <Pagination 
          className="mt-4 justify-end"
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showTotal
          totalItems={totalItems}
          itemsPerPage={pageSize}
        />
    </div>
  )
}

export default PurchasesHistoryTab