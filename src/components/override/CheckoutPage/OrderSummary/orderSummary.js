import React from 'react';
import PriceSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from '@magento/venia-ui/lib/components/CheckoutPage/OrderSummary/orderSummary.css';

const OrderSummary = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className={classes.root}>
            <h1 className={classes.title}>{'Order Summary'}</h1>
            <PriceSummary isUpdating={props.isUpdating} is_virtual={props.is_virtual}/>
        </div>
    );
};

export default OrderSummary;
