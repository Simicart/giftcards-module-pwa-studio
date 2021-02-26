import React, { Fragment, Suspense, useState } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';

import { Price } from '@magento/peregrine';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Button from '@magento/venia-ui/lib/components/Button';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import Quantity from '@magento/venia-ui/lib/components/ProductQuantity';
import RichText from '@magento/venia-ui/lib/components/RichText';
import GiftCardPreview from '../GiftCardTemplate/GiftCardPreview/GiftCardPreview'
import SettingSelectButton from '../GiftCardTemplate/GiftCardSettingSelect/SettingSelectButton'
import TemplateChooseImage from '../GiftCardTemplate/GiftCardSettingSelect/TemplateChooseImage'

import defaultClasses from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.css';
import giftcardClasses from './GiftCard.css';
import {
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION
} from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.gql';

import { ADD_GIFT_CARD_TO_CART } from '../../talons/GiftCard.gql.js'
import { useMutation } from '@apollo/client'
import { useCartContext } from '@magento/peregrine/lib/context/cart';

const Options = React.lazy(() => import('@magento/venia-ui/lib/components//ProductOptions'));


// Correlate a GQL error message to a field. GQL could return a longer error
// string but it may contain contextual info such as product id. We can use
// parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const ProductFullDetail = props => {
    const { product } = props;

    const classes = mergeClasses(defaultClasses, giftcardClasses ,props.classes);

    const {
        __typename,
        allow_amount_range,
        min_amount,
        max_amount,
        gift_card_type,
        gift_card_amounts,
        gift_code_pattern,
        gift_product_template,
        gift_message_available,
        mpgiftcard_conditions,
        can_redeem,
        price_rate,
        template
    } = product
    const talonProps = useProductFullDetail({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        product
    });
    const [{ cartId }] = useCartContext();
    const [addGiftCardToCart, {data, loading, error}] = useMutation(ADD_GIFT_CARD_TO_CART);
    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        handleSetQuantity,
        isAddToCartDisabled,
        mediaGalleryEntries,
        productDetails,
        quantity
    } = talonProps;
    let amounts
    if(gift_card_amounts) amounts = JSON.parse(gift_card_amounts)
    let deli;
    switch(gift_card_type) {
        case 1: 
            deli = 1
            break;
        case 2:
            deli = 3
            break;
        case 3:
            deli = 4
            break;
    }

    const [gcAmount, setGcAmount] = useState(gift_card_amounts ? amounts[0].amount : 0)
    const [activeAmount, setActiveAmount] = useState(0)
    const [activeImage, setActiveImage] = useState(0)
    const [gcMessage, setGcMessage] = useState('')
    const [gcFrom, setGcFrom] = useState(null)
    const [gcTo, setGcTo] = useState(null)
    const [delivery, setDelivery] = useState(deli)
    const [activeTemplate, setActiveTemplate] = useState(0)
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState(null)
    const [uploadedImages, setUploadedImages] = useState([])
    const [uploadedImageUrls, setUploadedImageUrls] = useState([])
    const currentTemplate = template ? template[activeTemplate] : null
    const hasFromAndToField = currentTemplate ? typeof JSON.parse(currentTemplate.design).from !== "undefined" : null

    const onAmountBlur = (e) => {
        let value = e.target.value
        if(isNaN(value)) {
            e.target.value = ''
        }
        else if (value.length == 0) return;
        else {
            if (value < min_amount) {
                setGcAmount(min_amount)
                e.target.value = min_amount
            } else if (value > max_amount) {
                e.target.value = max_amount
                setGcAmount(max_amount)
            } else setGcAmount(value)
        }
    }
    const onMessageChange = (e) => {
        setGcMessage(e.target.value)
    }
    const onFromChange = (e) => {
        setGcFrom(e.target.value)
    }
    const onToChange = (e) => {
        setGcTo(e.target.value)
    }
    const onEmailChange = (e) => {
        setEmail(e.target.value)
    }
    const onPhoneChange = (e) => {
        setPhone(e.target.value)
    }

    let giftCardInformationForm;
    if(__typename === 'MpGiftCardProduct') {
        giftCardInformationForm = (
            <div style={{
                padding: '1.5rem',
                overflow: 'hidden'
            }}>
                <div className={classes['giftcard-information'] + ' ' + classes['giftcard-information-amount']}>
                    <div className={classes['giftcard-field-label']}>Amount</div>
                    <div className={classes['giftcard-field-wrapper']}>
                        <ul className={classes.["giftcard-amount"]}>
                            {  
                                amounts.map((amount, i) => {
                                    let active = '';
                                    if(activeAmount === i) {
                                        active = classes.active
                                    }
                                    return (
                                        <li 
                                            className={classes["giftcard-design-button-container"]  + ' ' + active} 
                                            onClick={(e) => {
                                                setGcAmount(e.target.innerText.substring(1))
                                                setActiveAmount(i)
                                            }}
                                            key={i}
                                        >
                                            <button type="button" className={classes["giftcard-design-button"]} >
                                                <span >${amount.amount}.00</span>
                                            </button>
                                        </li>
                                    )
                                })
                            }
                            { allow_amount_range ? 
                                <li className={classes["giftcard-design-input-container"]}>
                                    <input 
                                        onFocus={() => setActiveAmount(amounts.length)}
                                        onBlur={onAmountBlur}
                                        placeholder='Enter Amount'
                                    />
                                </li>
                                : null
                            }
                        </ul>
                    </div>
                </div>
                <div className={classes['giftcard-information'] + ' ' + classes['giftcard-information-delivery']}>
                    <div className={classes['giftcard-field-label']}>Delivery</div>
                    <div className={classes['giftcard-field-wrapper']}>
                        <ul className={classes["giftcard-delivery"]}>
                            { gift_card_type === 1 &&
                                <Fragment>
                                    <li className={`${classes["giftcard-design-button-container"]} ${delivery === 1 ? classes.active : ''}`}>
                                        <button 
                                            type="button" 
                                            className={classes["giftcard-design-button"]} 
                                            onClick={() => setDelivery(1)}
                                        >
                                            <span>Email</span>
                                        </button>
                                    </li>
                                    <li className={`${classes["giftcard-design-button-container"]} ${delivery === 2 ? classes.active : ''}`}>
                                        <button 
                                            type="button" 
                                            className={classes["giftcard-design-button"]} 
                                            onClick={() => setDelivery(2)}
                                        >
                                            <span>Text message</span>
                                        </button>
                                    </li>
                                </Fragment>
                            }
                            { gift_card_type === 2 && 
                                <li className={`${classes["giftcard-design-button-container"]} ${delivery === 3 ? classes.active : ''}`}>
                                    <button 
                                        type="button" 
                                        className={classes["giftcard-design-button"]}
                                        onClick={() => setDelivery(3)}
                                    >
                                        <span>Print at home</span>
                                    </button>
                                </li>
                            }
                            { gift_card_type === 3 && 
                                <li className={`${classes["giftcard-design-button-container"]} ${delivery === 4 ? classes.active : ''}`}>
                                    <button 
                                        type="button" 
                                        className={classes["giftcard-design-button"]}
                                        onClick={() => setDelivery(4)}
                                    >
                                        <span>Post Office</span>
                                    </button>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
                <div className={classes["giftcard-information-delivery-content"] + ' ' + classes["fieldset"]}>
                    <div className={classes["field"] + ' ' + classes["giftcard-information"] + ' ' + classes["giftcard-information-delivery-field"]}>
                        { (gift_card_type === 1 && delivery === 1) &&
                            <div className={classes["field"] + ' ' + classes["giftcard-information"] + ' ' + classes["giftcard-information-delivery-field"] + ' ' + classes["required"]}>
                                <label className={classes['giftcard-field-label'] + ' ' + classes['label']}>
                                    <span for="email">Email</span>
                                </label>
                                <div className={classes['giftcard-field-wrapper']}>
                                    <input type="email" placeholder="Recipient email" onChange={onEmailChange} required/>
                                </div>
                            </div>
                        }
                        { (gift_card_type === 1 && delivery === 2)&& 
                            <div className={classes["field"] + ' ' + classes["giftcard-information"] + ' ' + classes["giftcard-information-delivery-field"] + ' ' + classes["required"]}>
                                <label className={classes['giftcard-field-label'] + ' ' + classes['label']}>
                                    <span for="phone number">Phone num.</span>
                                </label>
                                <div className={classes['giftcard-field-wrapper']}>
                                    <input type="text" placeholder="Recipient phone number" onChange={onPhoneChange} required/>
                                </div>
                            </div>
                        }
                        { gift_card_type != 1 &&
                            <label className={classes['giftcard-field-label'] + ' ' + classes['label']}>
                                <span htmlFor="post_label"></span>
                            </label>
                        }
                        <div className={classes['giftcard-note-wrapper']}>
                            <p className={classes.note}>
                                {gift_card_type === 2 && <span >You can print gift card on the confirmation email or the Gift Card in your account.</span>}
                                {gift_card_type === 3 && <span >Please input shipping address when checking out.</span>}
                            </p>
                        </div>
                    </div>
                    { hasFromAndToField &&
                        <Fragment>
                            <div className={classes["field giftcard-information"] + ' ' + classes["giftcard-information-delivery-field"]}>
                                <label className={classes['giftcard-field-label'] + ' ' + classes['label']}>
                                    <span>Sent From</span>
                                </label>
                                <div className={classes['giftcard-note-wrapper']}>
                                    <input className={classes.from} placeholder='Sender name' onChange={onFromChange}/>
                                </div>
                            </div>
                            <div className={classes["field giftcard-information"] + ' ' + classes["giftcard-information-delivery-field"]}>
                                <label className={classes['giftcard-field-label'] + ' ' + classes['label']}>
                                    <span>Sent To</span>
                                </label>
                                <div className={classes['giftcard-note-wrapper']}>
                                    <input className={classes.to} placeholder='Recipient name' onChange={onToChange}/>
                                </div>
                            </div>
                        </Fragment>
                    }
                    <div className={classes["field giftcard-information"] + ' ' + classes["giftcard-information-delivery-field"]} id="delivery-message">
                        <label className={classes['giftcard-field-label'] + ' ' + classes['label']}>
                            <span htmlFor="message">Message</span>
                        </label>
                        <div className={classes['giftcard-note-wrapper']}>
                            <textarea name="message" maxLength="120" placeholder="" onChange={onMessageChange}></textarea>
                            <p className={classes.note}>
                                <span>{120-gcMessage.length} characters remaining</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    let GiftCardImage = currentTemplate && currentTemplate.images.length ? 
                            activeImage < currentTemplate.images.length ?
                                currentTemplate.images[activeImage].file 
                                : uploadedImageUrls[activeImage - currentTemplate.images.length] : null

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
            />
        </Suspense>
    ) : null;

    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
        />
    ) : null;

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // this would be handled elsewhere with an error code and not a string.
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    'There was a problem with your cart. Please sign in again and try adding the item once more.'
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (
            errorMessage.includes('Variable "$cartId" got invalid value null')
        ) {
            errors.set('form', [
                new Error(
                    'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    'Could not add item to cart. Please check required options and try again.'
                )
            ]);
        }
    }

    return (
        <Fragment>
            {breadcrumbs}
            <Form className={classes.root}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>
                        {productDetails.name}
                    </h1>
                    <p className={classes.productPrice}>
                        <Price
                            currencyCode={productDetails.price.currency}
                            value={productDetails.price.value ? productDetails.price.value : gcAmount*price_rate/100}
                        />
                    </p>
                </section>
                <section className={classes.imageCarousel}>
                    { __typename === 'MpGiftCardProduct' ?  
                        <div className={classes["giftcard-template-container"]} id="giftcard-template-container">
                            <GiftCardPreview 
                                template={currentTemplate}
                                amount={gcAmount}
                                gcMessage={gcMessage}
                                activeImage={activeImage}
                                gcFrom={gcFrom}
                                gcTo={gcTo}
                                uploadedImages={uploadedImages}
                            />
                            <div className={classes['template-selections-container']}>
                                <div className={classes['block-title']}>
                                    <span>Gift card design</span>
                                </div>
                                <SettingSelectButton 
                                    templates={template} 
                                    activeTemplate={activeTemplate} 
                                    setActiveTemplate={setActiveTemplate}
                                /> 
                                <TemplateChooseImage 
                                    canUpload={currentTemplate.canUpload}
                                    images={currentTemplate.images}
                                    activeImage={activeImage}
                                    setActiveImage={setActiveImage}
                                    uploadedImages={uploadedImages}
                                    setUploadedImages={setUploadedImages}
                                    uploadedImageUrls={uploadedImageUrls}
                                    setUploadedImageUrls={setUploadedImageUrls}
                                />
                            </div>
                        </div>
                        : <Carousel images={mediaGalleryEntries} /> 
                    }
                </section>
                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors.get('form') || []}
                />
                <section className={classes.options}>{options}</section>
                <section className={classes.giftcard}>{giftCardInformationForm}</section>
                <section className={classes.quantity}>
                    <h2 className={classes.quantityTitle}>Quantity</h2>
                    <Quantity
                        initialValue={quantity}
                        onValueChange={handleSetQuantity}
                        message={errors.get('quantity')}
                    />
                </section>
                <section className={classes.cartActions}>
                    { __typename !== 'MpGiftCardProduct' &&
                        <Button
                            priority="high"
                            onClick={handleAddToCart}
                            disabled={isAddToCartDisabled}
                        >
                            Add to Cart
                        </Button>
                    }
                    { __typename === 'MpGiftCardProduct' &&
                        <button 
                            title="Add to Cart" 
                            className={classes['add-to-cart-btn']}
                            onClick={() => {
                                addGiftCardToCart({
                                    variables: {
                                        cart_id: cartId,
                                        quantity: quantity,
                                        sku: productDetails.sku,
                                        amount: gcAmount,
                                        delivery: delivery,
                                        email: email,
                                        from: gcFrom,
                                        image: GiftCardImage,
                                        message: gcMessage,
                                        phone_number: phone,
                                        range_amount: Boolean(allow_amount_range),
                                        template: activeTemplate + 1,
                                        to: gcTo
                                    }
                                }).then(res => void 0)
                                  .catch(err => void 0)
                            }}
                            style={{ 
                                opacity: loading ? '0.5' : '',
                                cursor: loading ? 'default' : ''
                            }}
                            disabled={loading}
                        >
                            <span>Add To Cart</span>
                        </button>
                    }
                </section>
                <section className={classes.description}>
                    <h2 className={classes.descriptionTitle}>
                        Product Description
                    </h2>
                    <RichText content={productDetails.description} />
                </section>
                <section className={classes.details}>
                    <h2 className={classes.detailsTitle}>SKU</h2>
                    <strong>{productDetails.sku}</strong>
                </section>
            </Form>
        </Fragment>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        root: string,
        title: string
    }),
    product: shape({
        __typename: string,
        id: number,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string
    }).isRequired
};

export default ProductFullDetail;
