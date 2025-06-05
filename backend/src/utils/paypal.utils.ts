import { PAYPAL_BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_REDIRECT_URL, PAYPAL_SECRET_KEY } from '@/config/env.config';
import { ICreateOrderDTO } from '@/types/order.type';
import got from 'got';

export const getPaypalAccessToken = async () => {
        try {
            console.log('getPaypalAccessToken');
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
        // console.log(data);
        return data.access_token;
    } catch (error) {
        console.error('Error getting PayPal access token:', error);
        throw new Error('Failed to get PayPal access token');
    }
}

// Helper function to create orders
export const createPaypalOrder = async (orderData: ICreateOrderDTO) => {
    try {
        const accessToken = await getPaypalAccessToken();
        
        const response = await got.post(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                payment_source: {
                    paypal: {
                        experience_context: {
                            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
                            payment_method_selected: "PAYPAL",
                            brand_name: "Tutor E-Learning Platform",
                            shipping_preference: "NO_SHIPPING",
                            locale: "en-IN",
                            user_action: "PAY_NOW",
                            return_url: `${PAYPAL_REDIRECT_URL}/complete-payment`,
                            cancel_url: `${PAYPAL_REDIRECT_URL}/cancel-payment`
                        }
                    }
                },
                purchase_units: [{
                    items: [{
                        name: orderData.courseTitle || "Course Enrollment",
                        quantity: "1",
                        unit_amount: {
                            currency_code: "INR",
                            value: orderData.coursePricing.toString()+'.00'
                        }
                    }],
                    amount: {
                        currency_code: "INR",
                        value: orderData.coursePricing.toString()+'.00',
                        breakdown: {
                            item_total: {
                                currency_code: "INR",
                                value: orderData.coursePricing.toString()+'.00'
                            }
                        }
                    }
                }]
            })
        });

        const paypalResponse = JSON.parse(response.body);
        console.log('PayPal order created:', paypalResponse);
        return paypalResponse;
    } catch (error) {
        console.error('Error creating PayPal order:', error);
        throw new Error('Failed to create PayPal order');
    }
}