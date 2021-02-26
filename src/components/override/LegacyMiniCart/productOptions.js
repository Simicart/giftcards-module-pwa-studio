import React, { useMemo } from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions.css';

const ProductOptions = props => {
    const { options = [], giftCardOptions=[] } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const displayOptions = useMemo(
        () =>
            options.map(({ option_label, value_label }) => {
                const key = `${option_label}${value_label}`;

                return (
                    <div key={key} className={classes.optionLabel}>
                        <dt
                            className={classes.optionName}
                        >{`${option_label} :`}</dt>
                        <dd className={classes.optionValue}>{value_label}</dd>
                    </div>
                );
            }),
        [classes, options]
    );

    const gcOptions = giftCardOptions.slice(2, giftCardOptions.length)

    const displayGcOptions = useMemo(
        () =>
            gcOptions.map(({ code, value }, index) => {
                return (
                    <div className={classes.optionLabel}>
                        <dt
                            className={classes.optionName}
                        >{`${code} :`}</dt>
                        <dd className={classes.optionValue}>{value}</dd>
                    </div>
                );
            }),
        [classes, giftCardOptions]
    );

    if (displayOptions.length === 0 && giftCardOptions.length === 0) {
        return null;
    }

    let finalOptions
    if(options.length) finalOptions = displayOptions
    else finalOptions = displayGcOptions

    return <dl className={classes.options}>{finalOptions}</dl>;
};

ProductOptions.propTypes = {
    options: arrayOf(
        shape({
            label: string,
            value: string
        })
    )
};

export default ProductOptions;