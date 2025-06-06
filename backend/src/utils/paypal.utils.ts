import { PAYPAL_BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_REDIRECT_URL, PAYPAL_SECRET_KEY } from '@/config/env.config';
import { redisClient } from '@/config/redis.config';
import { approvedPayment } from '@/services/implements/order.service';
import { ICourse } from '@/types/course.type';
import got from 'got';

export const getPaypalAccessToken = async () => {
        try {

        const checkExistToken = await redisClient.get('paypalAccessToken');
        if(checkExistToken){
            console.log(checkExistToken,'checkExistToken');
            return checkExistToken;
        }
            
        // Create Basic Auth token from client id and secret
        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`).toString('base64');
    
        const response = await got.post(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials'
            }).toString()
        });
    
        const data = JSON.parse(response.body);
        await redisClient.setEx('paypalAccessToken',data.expires_in, data.access_token);
        return data.access_token;

    } catch (error) {
        console.error('Error getting PayPal access token:', error);
        throw new Error('Failed to get PayPal access token');
    }
}

// Helper function to create orders
export const createPaypalOrder = async (orderData:ICourse) => {
    try {
        const accessToken = await getPaypalAccessToken();
        console.log(accessToken,'access token');
        console.log(orderData.pricing,'order data');

            return fetch (`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                "purchase_units": [
                    {
                    "amount": {
                        "currency_code": "USD",
                        "value": orderData.pricing
                    },
                    "reference_id": "d9f80740-38f0-11e8-b467-0ed5f89f718b"
                    }
                ],
                "intent": "CAPTURE",
                "payment_source": {
                    "paypal": {
                    "experience_context": {
                        "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
                        "payment_method_selected": "PAYPAL",
                        "brand_name": "Tutor E-Learning Platform",
                        "locale": "en-US",
                        "landing_page": "LOGIN",
                        "shipping_preference": "NO_SHIPPING",
                        "user_action": "PAY_NOW",
                        "return_url": `${PAYPAL_REDIRECT_URL}/complete-payment`,
                        "cancel_url": `${PAYPAL_REDIRECT_URL}/cancel-payment`
                    }
                    }
                }
                })
            })
            .then((response) => response.json());

    } catch (error) {
        console.error('Error creating PayPal order:', error);
        throw new Error('Failed to create PayPal order');
    }
}


export const capturePaypalPayment = async (orderID: string) => {
    try {
        const accessToken = await getPaypalAccessToken();
        const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        return data as approvedPayment ;
        
    } catch (error) {
        console.error('Error capturing PayPal payment:', error);
        throw new Error('Failed to capture PayPal payment');
    }
}