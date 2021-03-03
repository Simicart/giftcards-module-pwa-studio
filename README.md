# GiftCards module for Magento PWA Studio

This module acts as an add-on for [Mageplaza's Gift Card extension](https://www.mageplaza.com/magento-2-gift-card-extension/) to make it work with Magento PWA Studio.

End result: https://giftcards.pwa-commerce.com/

## Requirements

- Magento version 2.4.* or >= 2.3.5
- Got [Mageplaza Gift Card extension](https://www.mageplaza.com/magento-2-gift-card-extension/) and [Product Label GraphQL](https://github.com/mageplaza/magento-2-gift-card-graphql) installed

## Installation

### 1. Init project
```
https://github.com/Simicart/simi-studio
cd simi-studio
```

### 2. Start the project

From the root directory of the project you created above, clone the repository:

```
  git clone https://github.com/Simicart/giftcards-module-pwa-studio ./@simicart/giftcards
```

### 3. Modify .env

Change the .env MAGENTO_BACKEND_URL with your Magento site URL, or use our demo URL:

```
  MAGENTO_BACKEND_URL=https://mpmed.pwa-commerce.com/
```
### 4. Modify package.json

Modify the dependencies of your project to add Shop By Brand extension.

```
  "dependencies": {
    "@magento/pwa-buildpack": "~7.0.0",
    "@giftcard/giftcard": "link:./@simicart/giftcards"
  },
```

### 5. Install lib and Start Project

```
  yarn add react-resize-detector
  yarn install && yarn watch
```
