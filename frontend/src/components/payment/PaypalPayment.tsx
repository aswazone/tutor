
import axiosInstance from '@/config/axios.config';
import { env } from '@/config/env.config';
import { ICourse } from '@/types/course.type';
import {PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions, PayPalButtonsComponentProps} from '@paypal/react-paypal-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface OrderData {
    paypalId: string;
    orderId: string;
    details?: Array<{
        issue: string;
        description: string;
    }>;
    debug_id?: string;
}


export const PaypalPayment = ({courseData}: {courseData: ICourse}) => {
    
    const [orderItemId,setOrderItemId] = useState('');
    const navigate = useNavigate();

    const initialOptions: ReactPayPalScriptOptions = {
        clientId: env.PAYPAL_CLIENT_ID,
    };

    const styles: PayPalButtonsComponentProps["style"] = {
        shape: "rect",
        color: "silver",
        layout: "vertical",
    };

    const createOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
        try {
          const response = await axiosInstance.post("/api/v1/order/create", courseData);
          const orderData: OrderData = response.data;
          console.log(courseData, "courseData-test");
          console.log(orderData, "orderData-paypalId");

        //   return;

          if (!orderData.paypalId) {
              const errorDetail = orderData?.details?.[0];
              const errorMessage = errorDetail
                  ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                  : "Unexpected error occurred, please try again.";

              throw new Error(errorMessage);
          }
          setOrderItemId(orderData.orderId);
          return orderData.paypalId;

        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data) => {
        try {
            
            const response = await axiosInstance.post(`/api/v1/order/capture/${orderItemId}`, data);
            const details = response.data;
            if(details.paymentStatus === "PAID"){
                toast.success("Course Unlocked !",{position: "top-right",className: "mt-10"});
                navigate('/my-courses');
            }else if(details.paymentStatus === "PENDING"){
                toast.error("Payment is in pending !");
            }

        } catch (error) {
            console.error(error);
            toast("Payment failed");
        }

    };

    const onError: PayPalButtonsComponentProps["onError"] = (error) => {
        console.error('Paypal Error',error);
    };

    return (
        <div>
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons 
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
              style={styles}
              />
            </PayPalScriptProvider>
        </div>
    );
}
