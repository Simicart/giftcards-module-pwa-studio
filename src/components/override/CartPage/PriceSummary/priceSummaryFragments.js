import { gql } from '@apollo/client';

import { DiscountSummaryFragment } from '@magento/venia-ui/lib/components/CartPage/PriceSummary/discountSummary';
import { GiftCardSummaryFragment } from '@magento/venia-ui/lib/components/CartPage/PriceSummary/queries/giftCardSummary';
import { ShippingSummaryFragment } from '@magento/venia-ui/lib/components/CartPage/PriceSummary/shippingSummary';
import { TaxSummaryFragment } from '@magento/venia-ui/lib/components/CartPage/PriceSummary/taxSummary';

export const GrandTotalFragment = gql`
    fragment GrandTotalFragment on CartPrices {
        grand_total {
            currency
            value
        }
    }
`;

export const MpGiftCardFragment = gql`
    fragment MpGiftCardFragment on CartPrices {
        gift_card {
            currency
                gift_cards {
                    code
                    value
                }
            value
        }
        gift_credit {
            currency
            value
        }
    }
`

export const PriceSummaryFragment = gql`
    fragment PriceSummaryFragment on Cart {
        id
        items {
            id
            quantity
        }
        ...ShippingSummaryFragment
        prices {
            ...TaxSummaryFragment
            ...DiscountSummaryFragment
            ...GrandTotalFragment
            ...MpGiftCardFragment
            subtotal_excluding_tax {
                currency
                value
            }
        }
        ...GiftCardSummaryFragment
    }
    ${DiscountSummaryFragment}
    ${GiftCardSummaryFragment}
    ${GrandTotalFragment}
    ${ShippingSummaryFragment}
    ${TaxSummaryFragment}
    ${MpGiftCardFragment}
`;
