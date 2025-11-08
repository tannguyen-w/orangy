/**
 * Product Variant Inventory Update Handler
 * 
 * Giải pháp:
 * - Lấy danh sách tất cả options từ product data
 * - Duyệt từng option, tìm selector tương ứng, lấy value được chọn
 * - So sánh chính xác với variant.options
 * - Cải thiện performance (không dùng MutationObserver)
 * - Thêm fallback nếu không tìm thấy variant
 */

(function() {
    'use strict';
    
    // Kiểm tra xem có product data không
    const productDataElement = document.getElementById('product-data');
    if (!productDataElement) {
        console.log('[Variant] No product data found');
        return;
    }
    
    let productData;
    try {
        productData = JSON.parse(productDataElement.textContent);
        console.log('[Variant] Product data loaded:', productData);
    } catch (error) {
        console.error('[Variant] Error parsing product data:', error);
        return;
    }
    
    // Cache DOM elements
    const inventoryCount = document.getElementById('inventory-count');
    const productPrice = document.getElementById('product-price');
    const productImage = document.getElementById('product-image');
    const addToCartBtn = document.getElementById('add-to-cart');
    const variantInfo = document.getElementById('variant-info');
    
    /**
     * Lấy các giá trị option được chọn hiện tại
     * FIX: Lấy tên option thay vì index
     * FIX: Đối với radio button, check tất cả radio có cùng name
     */
    function getSelectedOptions() {
        const selectedOptions = [];
        
        // Duyệt qua từng option trong product data
        productData.options.forEach(optionName => {
            console.log(`[Variant] Processing option: ${optionName}`);
            
            // Tìm radio buttons hoặc select với option name này
            // FIX: Tìm tất cả radio buttons có cùng name (không chỉ checked)
            const radioButtons = document.querySelectorAll(`input[type="radio"][name="${optionName}"]`);
            
            if (radioButtons.length > 0) {
                // Tìm radio button được chọn
                let selectedValue = null;
                radioButtons.forEach(radio => {
                    if (radio.checked) {
                        selectedValue = radio.value;
                    }
                });
                
                if (selectedValue) {
                    console.log(`[Variant] Radio selected for ${optionName}: ${selectedValue}`);
                    selectedOptions.push(selectedValue);
                } else {
                    console.warn(`[Variant] No radio selected for ${optionName}`);
                    selectedOptions.push(null);
                }
            } else {
                // Thử tìm select element
                const selectElement = document.querySelector(`select[name="${optionName}"]`);
                if (selectElement && selectElement.value) {
                    console.log(`[Variant] Select value for ${optionName}: ${selectElement.value}`);
                    selectedOptions.push(selectElement.value);
                } else {
                    console.warn(`[Variant] No selector found for option: ${optionName}`);
                    selectedOptions.push(null);
                }
            }
        });
        
        console.log('[Variant] Selected options:', selectedOptions);
        return selectedOptions;
    }
    
    /**
     * Tìm variant phù hợp với các options đã chọn
     * So sánh chính xác với variant.options
     */
    function findMatchingVariant(selectedOptions) {
        console.log('[Variant] Finding variant for:', selectedOptions);
        
        // FIX: Lọc các options có giá trị thực sự
        const hasAllOptions = selectedOptions.every(option => option !== null);
        if (!hasAllOptions) {
            console.warn('[Variant] Not all options selected');
            return null;
        }
        
        // Tìm variant có options khớp chính xác
        const matchedVariant = productData.variants.find(variant => {
            // So sánh từng option
            const isMatch = variant.options.every((variantOption, index) => {
                return variantOption === selectedOptions[index];
            });
            
            if (isMatch) {
                console.log('[Variant] Found matching variant:', variant);
            }
            
            return isMatch;
        });
        
        if (!matchedVariant) {
            console.warn('[Variant] No matching variant found');
        }
        
        return matchedVariant;
    }
    
    /**
     * Cập nhật UI với thông tin variant
     */
    function updateProductDisplay(variant) {
        if (!variant) {
            // Fallback: Hiển thị thông báo không có sẵn
            if (inventoryCount) {
                inventoryCount.textContent = '0';
                inventoryCount.parentElement.style.color = '#dc3545';
            }
            if (addToCartBtn) {
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = 'Out of Stock';
            }
            if (variantInfo) {
                variantInfo.innerHTML = '<p style="color: #dc3545;">This variant is not available</p>';
            }
            console.log('[Variant] Updated display: variant not available');
            return;
        }
        
        // Cập nhật số lượng tồn kho
        if (inventoryCount) {
            inventoryCount.textContent = variant.inventory;
            
            // Đổi màu nếu hết hàng hoặc sắp hết
            if (variant.inventory === 0) {
                inventoryCount.parentElement.style.color = '#dc3545';
            } else if (variant.inventory < 5) {
                inventoryCount.parentElement.style.color = '#ffc107';
            } else {
                inventoryCount.parentElement.style.color = '#28a745';
            }
        }
        
        // Cập nhật giá
        if (productPrice) {
            productPrice.textContent = variant.price;
        }
        
        // Cập nhật hình ảnh
        if (productImage && variant.image) {
            productImage.src = variant.image;
        }
        
        // Cập nhật nút Add to Cart
        if (addToCartBtn) {
            if (variant.inventory > 0) {
                addToCartBtn.disabled = false;
                addToCartBtn.textContent = 'Add to Cart';
            } else {
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = 'Out of Stock';
            }
        }
        
        // Hiển thị thông tin variant (debug)
        if (variantInfo) {
            // Use textContent to prevent XSS
            const p = document.createElement('p');
            p.style.fontSize = '12px';
            p.style.color = '#666';
            p.style.marginTop = '10px';
            p.textContent = `Variant ID: ${variant.id} | Options: ${variant.options.join(', ')}`;
            variantInfo.innerHTML = '';
            variantInfo.appendChild(p);
        }
        
        console.log('[Variant] Updated display for variant:', variant.id);
    }
    
    /**
     * Handler chính khi option thay đổi
     * FIX: Không dùng MutationObserver để tránh lag
     */
    function handleOptionChange() {
        console.log('[Variant] Option changed');
        
        // Lấy các options đã chọn
        const selectedOptions = getSelectedOptions();
        
        // Tìm variant phù hợp
        const matchedVariant = findMatchingVariant(selectedOptions);
        
        // Cập nhật UI
        updateProductDisplay(matchedVariant);
    }
    
    let isInitialized = false;
    
    /**
     * Khởi tạo event listeners
     * FIX: Dùng event delegation thay vì MutationObserver
     */
    function initializeVariantSelection() {
        if (isInitialized) {
            console.log('[Variant] Already initialized, skipping');
            return;
        }
        
        console.log('[Variant] Initializing variant selection');
        
        // Đảm bảo các elements đã được load
        if (!inventoryCount || !productPrice || !addToCartBtn) {
            console.warn('[Variant] Product elements not ready yet, retrying...');
            setTimeout(initializeVariantSelection, 100);
            return;
        }
        
        // Lắng nghe sự kiện change trên tất cả radio buttons
        const allRadios = document.querySelectorAll('input[type="radio"]');
        allRadios.forEach(radio => {
            radio.addEventListener('change', handleOptionChange);
        });
        
        // Lắng nghe sự kiện change trên tất cả select elements
        const allSelects = document.querySelectorAll('select');
        allSelects.forEach(select => {
            select.addEventListener('change', handleOptionChange);
        });
        
        // Cập nhật lần đầu với giá trị mặc định
        handleOptionChange();
        
        isInitialized = true;
        console.log('[Variant] Variant selection initialized');
    }
    
    // Khởi tạo khi template đã được load
    // Lắng nghe event 'template-loaded' từ hàm load() trong main.js
    window.addEventListener('template-loaded', initializeVariantSelection);
    
    // Fallback: cũng thử khởi tạo khi DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initializeVariantSelection, 200);
        });
    } else {
        setTimeout(initializeVariantSelection, 200);
    }
    
})();
