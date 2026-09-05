const mongoose = require('mongoose');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const uri = 'mongodb+srv://shalini252002sm_db_user:t8xQMt3LTgogs0c5@cluster0.rjcekup.mongodb.net/ventershop?retryWrites=true&w=majority&appName=Cluster0';

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  sku: String,
  images: [String],
  retailPrice: Number,
}, { strict: false });

async function checkProductImages() {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
  const prods = await Product.find({});
  console.log(`Found ${prods.length} products in DB:\n`);
  prods.forEach(p => {
    console.log(`- [${p.slug}] ${p.name}`);
    console.log(`  Images:`, p.images);
  });
  await mongoose.disconnect();
}

checkProductImages().catch(console.error);
