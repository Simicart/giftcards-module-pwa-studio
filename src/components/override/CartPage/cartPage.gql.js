import { gql } from '@apollo/client';
import { CartPageFragment } from '@magento/venia-ui/lib/components/CartPage/cartPageFragments.gql';

export const MpGiftCardConfigFragment = gql`
	fragment GiftCardConfigFragment on Cart {
		id
		mp_giftcard_config {
	      	giftCardUsed {
		        code
		        amount
	      	}
	      	listGiftCard {
	      		balance
	      		code
	      		hidden
	      	}
	      	creditUsed
	      	maxUsed
    	}
	}
`

export const GET_CART_DETAILS = gql`
    query getCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CartPageFragment
            ...GiftCardConfigFragment
        }
    }
    ${CartPageFragment}
    ${MpGiftCardConfigFragment}
`;
