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
  results.push(await testEndpoint('Page: About Us (/about)', `${baseUrl}/about`));
  results.push(await testEndpoint('Page: Contact Us (/contact)', `${baseUrl}/contact`));
  results.push(await testEndpoint('Page: Cart (/cart)', `${baseUrl}/cart`));
  results.push(await testEndpoint('Page: Checkout (/checkout)', `${baseUrl}/checkout`));
  results.push(await testEndpoint('Page: Login (/login)', `${baseUrl}/login`));
  results.push(await testEndpoint('Page: Dashboard (/dashboard)', `${baseUrl}/dashboard`));
  results.push(await testEndpoint('Page: Admin Dashboard (/admin)', `${baseUrl}/admin`));

  // 2. Public Catalog APIs
  results.push(await testEndpoint('API: Categories (GET /api/categories)', `${baseUrl}/api/categories`));
  results.push(await testEndpoint('API: Products (GET /api/products?limit=3)', `${baseUrl}/api/products?limit=3`));

  // 3. Cart Calculation API
  results.push(
    await testEndpoint('API: Cart Calculate (POST /api/cart/calculate)', `${baseUrl}/api/cart/calculate`, {
      method: 'POST',
      body: JSON.stringify({
        items: [
          { productId: 'prod_basmati_rice_01', quantity: 2 },
          { productId: 'prod_skillet_02', quantity: 1 },
        ],
        voucherCode: 'WELCOME10',
      }),
    })
  );

  // 4. Auth: Send OTP API
  const testEmail = `test_audit_${Date.now()}@ventershop.ca`;
  const sendOtpRes = await testEndpoint('API: Auth Send OTP (POST /api/auth/send-otp)', `${baseUrl}/api/auth/send-otp`, {
    method: 'POST',
    body: JSON.stringify({ email: testEmail }),
  });
  results.push(sendOtpRes);

  // 5. Auth: Password Login API (Admin)
  results.push(
    await testEndpoint('API: Admin Password Login (POST /api/auth/verify-otp)', `${baseUrl}/api/auth/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@ventershop.ca',
        password: 'admin123',
        otp: 'PASSWORD_LOGIN',
      }),
    })
  );

  // Output table
  console.log(`Results for ${environmentName}:`);
  let passCount = 0;
  for (const r of results) {
    const icon = r.success ? '✅ PASS' : '❌ FAIL';
    if (r.success) passCount++;
    console.log(`[${icon}] ${r.name.padEnd(50)} Status: ${r.status} (${r.duration})`);
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
