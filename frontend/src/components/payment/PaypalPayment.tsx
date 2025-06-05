
import { env } from '@/config/env.config';
import {PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions, PayPalButtonsComponentProps} from '@paypal/react-paypal-js';

const PaypalPayment = () => {

    const initialOptions: ReactPayPalScriptOptions = {
        clientId: env.PAYPAL_CLIENT_ID,
    };

    const styles: PayPalButtonsComponentProps["style"] = {
        shape: "rect",
        color: "silver",
        layout: "vertical",
    };

    return (
        <div>
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons style={styles} />
            </PayPalScriptProvider>
        </div>
    );
}

export default PaypalPayment