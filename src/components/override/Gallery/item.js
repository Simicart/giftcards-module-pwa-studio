import React from 'react';
import { string, number, shape } from 'prop-types';
import { Link, resourceUrl } from '@magento/venia-drivers';
import { Price } from '@magento/peregrine';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from '@magento/venia-ui/lib/components/Gallery/item.css';

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
    .set(640, IMAGE_WIDTH)
    .set(UNCONSTRAINED_SIZE_KEY, 840);

const ItemPlaceholder = ({ classes }) => (
    <div className={classes.root_pending}>
        <div className={classes.images_pending}>
            <Image
                alt="Placeholder for gallery item image"
                classes={{
                    image: classes.image_pending,
                    root: classes.imageContainer
                }}
                src={transparentPlaceholder}
            />
        </div>
        <div className={classes.name_pending} />
        <div className={classes.price_pending} />
    </div>
);

const GalleryItem = props => {
    const { item } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (!item) {
        return <ItemPlaceholder classes={classes} />;
    }

    
    const {
        price_rate,
        allow_amount_range,
        gift_card_amounts
    } = item
    let min_price = item.min_amount*price_rate/100
    let max_price = item.max_amount*price_rate/100

    let giftCardPrices = [];
    if(!allow_amount_range && gift_card_amounts) {
        JSON.parse(gift_card_amounts).map(({price}) => {
            giftCardPrices.push(price)
        })
        giftCardPrices.sort((a, b) => {return a-b})
        min_price = giftCardPrices[0]
        max_price = giftCardPrices[giftCardPrices.length - 1]
    }

    const { name, price, small_image, url_key, url_suffix, __typename } = item;
    const productLink = resourceUrl(`/${url_key}${url_suffix}`);

    const priceRange = (
        __typename === "MpGiftCardProduct" ?
            min_price != max_price ?
                <React.Fragment>
                    From: <Price
                            value={min_price}
                            currencyCode={price.regularPrice.amount.currency}
                          />
                    <br/>
                    To: <Price
                            value={max_price}
                            currencyCode={price.regularPrice.amount.currency}
                        />
                </React.Fragment>
                : <Price
                    value={min_price}
                    currencyCode={price.regularPrice.amount.currency}
                  />
            : <Price
                value={price.regularPrice.amount.value}
                currencyCode={price.regularPrice.amount.currency}
              />
    )

    return (
        <div className={classes.root}>
            <Link to={productLink} className={classes.images}>
                <Image
                    alt={name}
                    classes={{
                        image: classes.image,
                        root: classes.imageContainer
                    }}
                    height={IMAGE_HEIGHT}
                    resource={small_image}
                    widths={IMAGE_WIDTHS}
                />
            </Link>
            <Link to={productLink} className={classes.name}>
                <span>{name}</span>
            </Link>
            <div className={classes.price}>
                {priceRange}
            </div>
        </div>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageContainer: string,
        imagePlaceholder: string,
        image_pending: string,
        images: string,
        images_pending: string,
        name: string,
        name_pending: string,
        price: string,
        price_pending: string,
        root: string,
        root_pending: string
    }),
    item: shape({
        id: number.isRequired,
        name: string.isRequired,
        small_image: string.isRequired,
        url_key: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    })
};

export default GalleryItem;
