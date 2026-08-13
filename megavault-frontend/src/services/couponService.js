// MegaVault Backend Coupon Service

const BACKEND_COUPON_API = 'http://localhost:8080/api/coupons';

export const AVAILABLE_BACKEND_COUPONS = [
  {
    code: 'MEGA20',
    discountType: 'PERCENT',
    value: 20,
    title: '20% Mega Savings',
    description: 'Get 20% Instant Discount on all electronics & orders',
    badge: '🔥 20% OFF',
    minOrder: 0
  },
  {
    code: 'FLAT500',
    discountType: 'FLAT',
    value: 500,
    title: 'Flat ₹500 Cash Discount',
    description: 'Flat ₹500 instant cash discount applied directly on total',
    badge: '💰 FLAT ₹500 OFF',
    minOrder: 1000
  }
];

/**
 * Validate and apply coupon from Spring Boot Backend REST API /api/coupons/apply
 */
export const applyBackendCoupon = async (code, subtotalAmount = 0) => {
  const upperCode = code ? code.trim().toUpperCase() : '';

  // 1. Try Spring Boot Backend REST API Endpoint
  try {
    const res = await fetch(`${BACKEND_COUPON_API}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: upperCode,
        subtotal: subtotalAmount
      })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        code: data.code || upperCode,
        discountType: data.discountType || 'PERCENT',
        value: data.value || 20,
        discountAmount: data.discountAmount || (subtotalAmount * 0.2),
        message: data.message || `Coupon ${upperCode} Applied Successfully!`
      };
    }
  } catch (err) {
    console.warn('Backend coupon API offline, validating via backend coupon registry...');
  }

  // 2. Validate against Backend Coupon Registry
  const found = AVAILABLE_BACKEND_COUPONS.find(c => c.code === upperCode);

  if (!found) {
    // Legacy fallback code support
    if (upperCode === 'MEGAVAULT10' || upperCode === 'AI10') {
      return {
        success: true,
        code: upperCode,
        discountType: 'PERCENT',
        value: 10,
        discountAmount: (subtotalAmount * 0.1),
        message: '10% Promo Code Applied!'
      };
    }

    return {
      success: false,
      message: `Invalid Coupon Code '${upperCode}'. Try 'MEGA20' or 'FLAT500'.`
    };
  }

  if (found.minOrder && subtotalAmount < found.minOrder) {
    return {
      success: false,
      message: `Coupon '${found.code}' requires a minimum order subtotal of ₹${found.minOrder.toLocaleString('en-IN')}.`
    };
  }

  let calculatedDiscount = 0;
  if (found.discountType === 'PERCENT') {
    calculatedDiscount = (subtotalAmount * found.value) / 100;
  } else {
    calculatedDiscount = Math.min(found.value, subtotalAmount);
  }

  return {
    success: true,
    code: found.code,
    discountType: found.discountType,
    value: found.value,
    discountAmount: calculatedDiscount,
    badge: found.badge,
    title: found.title,
    message: `🎉 Coupon '${found.code}' Applied! Saved ₹${calculatedDiscount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
  };
};
