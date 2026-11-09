import { connectDatabase } from '../config/database';
import { Product } from '../models';

const sampleProducts = [
  {
    externalId: 'CH3-ASUS-TUF-A15',
    name: 'ASUS TUF Gaming A15',
    description: 'AMD Ryzen 7 7735HS, 16GB DDR5 RAM, 512GB NVMe SSD, NVIDIA RTX 4050 6GB GDDR6, 15.6" 144Hz FHD Display, Windows 11',
    price: 799.00,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
    specifications: {
      processor: 'AMD Ryzen 7 7735HS (8 cores, up to 4.75 GHz)',
      ram: '16GB DDR5 4800MHz',
      storage: '512GB PCIe 4.0 NVMe SSD',
      graphics: 'NVIDIA GeForce RTX 4050 6GB GDDR6',
      display: '15.6-inch FHD (1920 x 1080) 144Hz IPS',
      battery: '90Wh high-capacity battery',
      weight: '2.20 kg',
    },
    source: 'channel3',
  },
  {
    externalId: 'CH3-LENOVO-LOQ-15',
    name: 'Lenovo LOQ 15 Gaming & ML Laptop',
    description: 'Intel Core i5-13450HX, 16GB DDR5 RAM, 512GB SSD, NVIDIA RTX 3050 6GB, 15.6" 144Hz G-SYNC Display, Military Grade Durability',
    price: 749.00,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed',
    specifications: {
      processor: 'Intel Core i5-13450HX (10 cores, up to 4.60 GHz)',
      ram: '16GB DDR5 5200MHz',
      storage: '512GB NVMe M.2 SSD',
      graphics: 'NVIDIA GeForce RTX 3050 6GB GDDR6',
      display: '15.6-inch FHD 144Hz IPS, 350 nits',
      battery: '60Wh with Rapid Charge Pro',
      weight: '2.40 kg',
    },
    source: 'channel3',
  },
  {
    externalId: 'CH3-ACER-NITRO-V',
    name: 'Acer Nitro V 15 Creator Edition',
    description: 'Intel Core i5-13420H, 16GB RAM, 512GB SSD, NVIDIA RTX 4050, 15.6" FHD 144Hz Display, Dual-fan cooling',
    price: 820.00,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
    specifications: {
      processor: 'Intel Core i5-13420H (8 cores, up to 4.60 GHz)',
      ram: '16GB DDR5 RAM',
      storage: '512GB Gen 4 SSD',
      graphics: 'NVIDIA GeForce RTX 4050 6GB GDDR6',
      display: '15.6-inch 144Hz IPS Slim Bezel',
      battery: '57Wh battery',
      weight: '2.10 kg',
    },
    source: 'channel3',
  },
  {
    externalId: 'CH3-APPLE-MBA-M3',
    name: 'Apple MacBook Air M3 15-inch',
    description: 'Apple M3 chip with 8-core CPU and 10-core GPU, 16GB Unified Memory, 512GB SSD, Liquid Retina Display, 18-hour battery life',
    price: 1299.00,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    specifications: {
      processor: 'Apple M3 8-core CPU (4 performance, 4 efficiency)',
      ram: '16GB Unified Memory (100GB/s bandwidth)',
      storage: '512GB ultra-fast SSD',
      graphics: '10-core integrated GPU with hardware-accelerated ray tracing',
      display: '15.3-inch Liquid Retina with True Tone (2880 x 1864)',
      battery: 'Up to 18 hours wireless web',
      weight: '1.51 kg',
    },
    source: 'channel3',
  },
  {
    externalId: 'CH3-DELL-XPS-14',
    name: 'Dell XPS 14 Developer Edition',
    description: 'Intel Core Ultra 7 155H with Intel AI Boost NPU, 32GB LPDDR5X RAM, 1TB SSD, NVIDIA RTX 4050, 14.5" 3.2K OLED Touchscreen',
    price: 1899.00,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef',
    specifications: {
      processor: 'Intel Core Ultra 7 155H (16 cores, up to 4.8 GHz)',
      ram: '32GB LPDDR5X 7467MHz',
      storage: '1TB PCIe 4.0 NVMe SSD',
      graphics: 'NVIDIA GeForce RTX 4050 6GB + Dedicated Intel NPU',
      display: '14.5-inch 3.2K (3200 x 2000) OLED Touch 120Hz',
      battery: '69.5Wh with ExpressCharge',
      weight: '1.68 kg',
    },
    source: 'channel3',
  },
  {
    externalId: 'CH3-LG-GRAM-17',
    name: 'LG Gram 17 Pro Lightweight Workstation',
    description: 'Intel Core Ultra 7, 32GB RAM, 1TB SSD, NVIDIA RTX 3050, 17" WQXGA IPS Display, Ultralight 1.48kg Magnesium Alloy',
    price: 1599.00,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    specifications: {
      processor: 'Intel Core Ultra 7 155H',
      ram: '32GB LPDDR5X',
      storage: '1TB NVMe Gen 4 SSD',
      graphics: 'NVIDIA GeForce RTX 3050 4GB',
      display: '17.0-inch WQXGA (2560 x 1600) Anti-glare IPS',
      battery: '90Wh (Up to 24 hours video playback)',
      weight: '1.48 kg',
    },
    source: 'channel3',
  },
];

export async function seedProducts() {
  console.log('[Seed] Connecting to MySQL...');
  await connectDatabase();

  console.log(`[Seed] Seeding ${sampleProducts.length} verified products into catalog...`);
  for (const item of sampleProducts) {
    const [prod, created] = await Product.findOrCreate({
      where: { externalId: item.externalId },
      defaults: item,
    });
    if (!created) {
      await prod.update(item);
    }
  }

  const count = await Product.count();
  console.log(`✅ Catalog populated with ${count} total products across all price tiers.`);
}

if (require.main === module) {
  seedProducts()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
