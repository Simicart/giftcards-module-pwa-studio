import { gql } from '@apollo/client';

export const GET_PRODUCT_DETAIL_QUERY = gql`
    query getProductDetailForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                # Once graphql-ce/1027 is resolved, use a ProductDetails fragment
                # here instead.
                __typename
                categories {
                    id
                    breadcrumbs {
                        category_id
                    }
                }
                description {
                    html
                }
                id
                media_gallery_entries {
                    id
                    label
                    position
                    disabled
                    file
                }
                meta_description
                ... on MpGiftCardProduct {
                    allow_amount_range
                    gift_card_type
                    gift_card_amounts
                    gift_code_pattern
                    gift_product_template
                    gift_message_available
                    mpgiftcard_conditions
                    can_redeem
                    price_rate
                    min_amount
                    max_amount
                    template {
                        id
                        name
                        font
                        images {
                            alt
                            src
                            file
                        }
                        title
                        design
                        card
                        canUpload
                    }
                }
                name
                price {
                    regularPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                sku
                small_image {
                    url
                }
                url_key
                ... on ConfigurableProduct {
                    configurable_options {
                        attribute_code
                        attribute_id
                        id
                        label
                        values {
                            default_label
                            label
                            store_label
                            use_default_value
                            value_index
                            swatch_data {
                                ... on ImageSwatchData {
                                    thumbnail
                                }
                                value
                            }
                        }
                    }
                    variants {
                        attributes {
                            code
                            value_index
                        }
                        product {
                            id
                            media_gallery_entries {
                                id
                                disabled
                                file
                                label
                                position
                            }
                            sku
                            stock_status
                            price {
                                regularPrice {
                                    amount {
                                        currency
                                        value
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
