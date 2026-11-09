import { connectDatabase } from '../config/database';
import { Product } from '../models';
import { paymentService } from '../modules/payments/paymentService';

async function main() {
  console.log('\n======================================================');
  console.log('  🚀 Testing Live PayPal Sandbox Order Creation');
  console.log('======================================================\n');

  console.log('Connecting to database...');
  await connectDatabase();

  const product = await Product.findOne();
  if (!product) {
    console.error('No product found in database. Please run npm run db:init first.');
    process.exit(1);
  }

  console.log(`Found Product: "${product.name}" ($${product.price} ${product.currency})`);
  console.log('Calling PayPal Sandbox API...\n');

  const result = await paymentService.createOrder({
    productId: product.id,
    userId: '00000000-0000-0000-0000-000000000001',
    quantity: 1,
  });

  console.log('✅ SUCCESS! PayPal Sandbox Order Created:\n');
  console.log(`  💳 PayPal Order ID:    ${result.paypalOrderId}`);
  console.log(`  💰 Verified Amount:    $${result.amount} ${result.currency}`);
  console.log(`  📦 Local Order ID:     ${result.orderId}`);
  console.log(`\n👉 Click or Open this URL in your browser to inspect the checkout screen:`);
  console.log(`\n   ${result.approvalUrl}\n`);
  console.log('======================================================\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
