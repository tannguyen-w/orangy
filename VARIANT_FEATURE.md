# Product Variant Inventory Update Feature

This feature implements real-time inventory updates when customers select different product variants (Upholstery and Material options).

## Files

- **product-detail.html** - Product detail page with variant selectors
- **templates/product-detail.html** - Product detail template (loaded via AJAX)
- **assets/js/product-variant.js** - JavaScript logic for variant selection and inventory updates

## Features

### 1. Correct Option Selection
- Gets option names (not indexes) from the product data
- Iterates through each option to find the corresponding selector
- Retrieves the selected value

### 2. Proper Radio Button Handling
- Checks all radio buttons with the same `name` attribute
- Finds the checked radio button
- Not limited to only pre-checked radios

### 3. Value Filtering
- Ensures all options have actual values before matching
- Provides fallback if no variant is found

### 4. Performance Optimization
- Uses direct event listeners instead of MutationObserver
- Listens to 'change' events on radio buttons and select elements
- No lag or performance issues

### 5. Debug Logging
- Logs when product data is loaded
- Logs when processing each option
- Logs when finding variants
- Logs when updating the UI

### 6. Security
- Uses `textContent` instead of `innerHTML` to prevent XSS vulnerabilities
- All user-facing data is properly escaped

## How It Works

1. Product data (variants with different options and inventory) is loaded from a JSON script tag
2. When a customer selects an option (Upholstery or Material), the change event fires
3. The script collects all selected options by name
4. It finds the matching variant from the product data
5. Updates the UI:
   - Inventory count
   - Price
   - Product image
   - Add to Cart button state (disabled if out of stock)
   - Variant debug info

## Variant Data Structure

```json
{
  "title": "Luxury Armchair",
  "options": ["Upholstery", "Material"],
  "variants": [
    {
      "id": 1,
      "options": ["Fabric", "Wood"],
      "price": "$999.00",
      "inventory": 10,
      "image": "./assets/images/product/product-01.png"
    }
  ]
}
```

## Usage

To add this feature to a product page:

1. Include the product data as a JSON script tag with id `product-data`
2. Add the product detail template with variant selectors
3. Include the `product-variant.js` script
4. The script will automatically initialize when the template loads

## Example

Visit `product-detail.html` to see the feature in action.

## Browser Console Logs

The feature includes extensive logging for debugging:

```
[Variant] Product data loaded: {...}
[Variant] Initializing variant selection
[Variant] Option changed
[Variant] Processing option: Upholstery
[Variant] Radio selected for Upholstery: Fabric
[Variant] Processing option: Material
[Variant] Radio selected for Material: Wood
[Variant] Selected options: [Fabric, Wood]
[Variant] Finding variant for: [Fabric, Wood]
[Variant] Found matching variant: {...}
[Variant] Updated display for variant: 1
[Variant] Variant selection initialized
```
