/**
 * Mappings for overwrites
 * example: [`@magento/venia-ui/lib/components/Main/main.js`]: './lib/components/Main/main.js'
 */
module.exports = componentOverride = {
	[`@magento/venia-ui/lib/RootComponents/Product/product.gql.js`]: '@giftcard/giftcard/src/components/override/product.gql.js',
	[`@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js`]: '@giftcard/giftcard/src/components/override/productFullDetail.js',
	[`@magento/venia-ui/lib/components/CartPage/cartPage.js`]: '@giftcard/giftcard/src/components/override/CartPage/cartPage.js',
	[`@magento/venia-ui/lib/components/CartPage/ProductListing/product.js`]: '@giftcard/giftcard/src/components/override/CartPage/ProductListing/product.js',
	[`@magento/venia-ui/lib/components/CartPage/ProductListing/productListingFragments.js`]: '@giftcard/giftcard/src/components/override/CartPage/ProductListing/productListingFragments.js',
	[`@magento/venia-ui/lib/components/LegacyMiniCart/productOptions.js`]: '@giftcard/giftcard/src/components/override/LegacyMiniCart/productOptions.js',
	[`@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct.js`]: '@giftcard/giftcard/src/components/override/CartPage/ProductListing/useProduct.js',
	[`@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.js`]: '@giftcard/giftcard/src/components/override/CartPage/PriceSummary/priceSummary.js',
	[`@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummaryFragments.js`]: '@giftcard/giftcard/src/components/override/CartPage/PriceSummary/priceSummaryFragments.js',
	[`@magento/venia-ui/lib/components/CartPage/cartPage.gql.js`]: '@giftcard/giftcard/src/components/override/CartPage/PriceSummary/priceSummaryFragments.js',
	[`@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary.js`]: '@giftcard/giftcard/src/components/override/CartPage/cartPage.gql.js',
	[`@magento/peregrine/lib/talons/CartPage/useCartPage.js`]: '@giftcard/giftcard/src/components/override/CartPage/useCartPage.js',
	[`@magento/venia-ui/lib/components/CheckoutPage/checkoutPage.js`]: '@giftcard/giftcard/src/components/override/CheckoutPage/checkoutPage.js',
	[`@magento/venia-ui/lib/components/CheckoutPage/checkoutPage.gql.js`]: '@giftcard/giftcard/src/components/override/CheckoutPage/checkoutPage.gql.js',
	[`@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage.js`]: '@giftcard/giftcard/src/components/override/CheckoutPage/useCheckoutPage.js',
	[`@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/creditCard.js`]: '@giftcard/giftcard/src/components/override/CheckoutPage/PaymentInformation/creditCard.js',
	[`@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCreditCard.js`]: '@giftcard/giftcard/src/talons/useCreditCard.js',
	[`@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentInformation.js`]: '@giftcard/giftcard/src/components/override/CheckoutPage/PaymentInformation/paymentInformation.js',
};
