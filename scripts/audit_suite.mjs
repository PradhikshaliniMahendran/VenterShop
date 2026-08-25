// Automated comprehensive test suite for VenterShop (Localhost & Vercel)
async function testEndpoint(name, url, options = {}) {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const duration = Date.now() - start;
    let data = null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      await res.text();
    }

    const success = res.status >= 200 && res.status < 400;
    return {
      name,
      url,
      status: res.status,
      success,
      duration: `${duration}ms`,
      data,
      headers: res.headers,
    };
  } catch (err) {
    return {
      name,
      url,
      status: 'ERR',
      success: false,
      duration: `${Date.now() - start}ms`,
      error: err.message,
    };
  }
}

async function runFullAudit(baseUrl, environmentName) {
  console.log(`\n======================================================`);
  console.log(`🔍 RUNNING FULL AUDIT ON: ${environmentName} (${baseUrl})`);
  console.log(`======================================================\n`);

  const results = [];

  // 1. Pages
  results.push(await testEndpoint('Page: Home (/)', `${baseUrl}/`));
  results.push(await testEndpoint('Page: Shop (/shop)', `${baseUrl}/shop`));
  results.push(await testEndpoint('Page: Product Detail (/product/cast-iron-pre-seasoned-skillet-10-inch)', `${baseUrl}/product/cast-iron-pre-seasoned-skillet-10-inch`));
  results.push(await testEndpoint('Page: Cart (/cart)', `${baseUrl}/cart`));
  results.push(await testEndpoint('Page: Checkout (/checkout)', `${baseUrl}/checkout`));
  results.push(await testEndpoint('Page: Login (/login)', `${baseUrl}/login`));
  results.push(await testEndpoint('Page: Dashboard (/dashboard)', `${baseUrl}/dashboard`));
  results.push(await testEndpoint('Page: Admin Dashboard (/admin)', `${baseUrl}/admin`));

  // 2. Public Catalog APIs
  results.push(await testEndpoint('API: Categories (GET /api/categories)', `${baseUrl}/api/categories`));
  results.push(await testEndpoint('API: Products (GET /api/products?limit=3)', `${baseUrl}/api/products?limit=3`));

  // 3. Free Delivery Rules: Under $75 ($12.50 fee) vs Over $75 ($0.00 FREE)
  const cartUnder75 = await testEndpoint('API: Cart Under $75 -> $12.50 delivery fee', `${baseUrl}/api/cart/calculate`, {
    method: 'POST',
    body: JSON.stringify({
      items: [{ productId: 'prod_basmati_rice_01', quantity: 1 }], // $24.99
    }),
  });
  const isUnder75Correct = cartUnder75.data?.deliveryFee === 12.5;
  results.push({
    ...cartUnder75,
    name: `API: Cart Under $75 ($24.99) -> Delivery: $${cartUnder75.data?.deliveryFee ?? 'err'} (Expected: $12.50)`,
    success: cartUnder75.success && isUnder75Correct,
  });

  const cartOver75 = await testEndpoint('API: Cart Over $75 -> $0 FREE delivery fee', `${baseUrl}/api/cart/calculate`, {
    method: 'POST',
    body: JSON.stringify({
      items: [
        { productId: 'prod_basmati_rice_01', quantity: 2 }, // $49.98
        { productId: 'prod_skillet_02', quantity: 1 },      // $39.99 = Total $89.97
      ],
    }),
  });
  const isOver75Correct = cartOver75.data?.deliveryFee === 0;
  results.push({
    ...cartOver75,
    name: `API: Cart Over $75 ($89.97) -> Delivery: ${cartOver75.data?.deliveryFee === 0 ? 'FREE ($0.00)' : `$${cartOver75.data?.deliveryFee}`} (Expected: FREE)`,
    success: cartOver75.success && isOver75Correct,
  });

  // 4. Auth: Send OTP API
  const testEmail = `test_customer_${Date.now()}@ventershop.ca`;
  const sendOtpRes = await testEndpoint('API: Auth Send OTP (POST /api/auth/send-otp)', `${baseUrl}/api/auth/send-otp`, {
    method: 'POST',
    body: JSON.stringify({ email: testEmail }),
  });
  results.push(sendOtpRes);

  // 5. Auth: Password Login API & Profile Verification
  const loginRes = await testEndpoint('API: Admin Password Login (POST /api/auth/verify-otp)', `${baseUrl}/api/auth/verify-otp`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@ventershop.ca',
      password: 'admin123',
      otp: 'PASSWORD_LOGIN',
    }),
  });
  results.push(loginRes);

  // 6. Checkout Order Placement API (Sending to Customer Email)
  const orderRes = await testEndpoint('API: Place Order (POST /api/orders)', `${baseUrl}/api/orders`, {
    method: 'POST',
    body: JSON.stringify({
      items: [
        { productId: 'prod_basmati_rice_01', quantity: 3 }, // $74.97
        { productId: 'prod_skillet_02', quantity: 1 },      // $39.99 = Total $114.96 (> $75 Free Delivery)
      ],
      deliveryAddress: {
        fullName: 'Pradhikshalini Mahendran',
        email: 'mahendranpradhikshalini@gmail.com',
        addressLine1: '123 Canadian St',
        city: 'Toronto',
        province: 'Ontario',
        postalCode: 'M5V 2T6',
        phone: '6471234567',
      },
      voucherCode: 'WELCOME10',
    }),
  });
  results.push({
    ...orderRes,
    name: `API: Place Order (${orderRes.data?.orderNumber || 'Pending'}) -> Free Delivery: ${orderRes.data?.freeDeliveryApplied ? 'YES (FREE)' : 'NO'}`,
    success: orderRes.success && orderRes.data?.success === true,
  });

  // Output table
  console.log(`Results for ${environmentName}:`);
  let passCount = 0;
  for (const r of results) {
    const icon = r.success ? '✅ PASS' : '❌ FAIL';
    if (r.success) passCount++;
    console.log(`[${icon}] ${r.name.padEnd(65)} Status: ${r.status} (${r.duration})`);
    if (!r.success && r.error) {
      console.log(`   Error: ${r.error}`);
    }
  }

  console.log(`\nScore for ${environmentName}: ${passCount}/${results.length} Passed`);
  return { environmentName, passCount, total: results.length, results };
}

async function main() {
  const localhostResult = await runFullAudit('http://localhost:3000', 'LOCAL HOST');
  const vercelResult = await runFullAudit('https://ventershop.vercel.app', 'VERCEL PRODUCTION');

  console.log('\n======================================================');
  console.log('🏁 FINAL AUDIT SUMMARY:');
  console.log(`- Localhost: ${localhostResult.passCount}/${localhostResult.total} Passed`);
  console.log(`- Vercel:    ${vercelResult.passCount}/${vercelResult.total} Passed`);
  console.log('======================================================\n');
}

main();
