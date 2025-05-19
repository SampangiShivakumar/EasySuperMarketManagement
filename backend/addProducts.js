const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  description: String
});

const Product = mongoose.model('Product', ProductSchema);

mongoose.connect('mongodb://localhost:27017/supermarketDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const newProducts = [
  {
    productId: 'PRD0007',
    name: 'Gaming Laptop',
    category: 'Electronics',
    price: 89999.99,
    costPrice: 75000.00,
    stock: 8,
    description: 'High-performance Gaming Laptop with RTX 4060'
  },
  {
    productId: 'GRO001',
    name: 'Rice - Premium Basmati',
    category: 'Food & Beverages',
    price: 199.99,
    costPrice: 160.00,
    stock: 100,
    description: 'Premium quality basmati rice - 5kg'
  },
  {
    productId: 'GRO002',
    name: 'Whole Wheat Flour',
    category: 'Food & Beverages',
    price: 59.99,
    costPrice: 45.00,
    stock: 150,
    description: 'Organic whole wheat flour - 1kg'
  },
  {
    productId: 'GRO003',
    name: 'Sunflower Oil',
    category: 'Food & Beverages',
    price: 189.99,
    costPrice: 155.00,
    stock: 80,
    description: 'Pure sunflower oil - 1L'
  },
  {
    productId: 'GRO004',
    name: 'Sugar',
    category: 'Food & Beverages',
    price: 49.99,
    costPrice: 40.00,
    stock: 200,
    description: 'Refined sugar - 1kg'
  },
  {
    productId: 'GRO005',
    name: 'Toor Dal',
    category: 'Food & Beverages',
    price: 159.99,
    costPrice: 130.00,
    stock: 100,
    description: 'Premium toor dal - 1kg'
  },
  {
    productId: 'GRO006',
    name: 'Tea Leaves',
    category: 'Food & Beverages',
    price: 299.99,
    costPrice: 240.00,
    stock: 75,
    description: 'Premium tea leaves - 500g'
  },
  {
    productId: 'GRO007',
    name: 'Coffee Powder',
    category: 'Food & Beverages',
    price: 399.99,
    costPrice: 320.00,
    stock: 60,
    description: 'Instant coffee powder - 500g'
  },
  {
    productId: 'GRO008',
    name: 'Milk Powder',
    category: 'Food & Beverages',
    price: 449.99,
    costPrice: 380.00,
    stock: 50,
    description: 'Full cream milk powder - 1kg'
  },
  {
    productId: 'GRO009',
    name: 'Table Salt',
    category: 'Food & Beverages',
    price: 24.99,
    costPrice: 18.00,
    stock: 300,
    description: 'Iodized table salt - 1kg'
  },
  {
    productId: 'GRO010',
    name: 'Black Pepper',
    category: 'Food & Beverages',
    price: 199.99,
    costPrice: 160.00,
    stock: 100,
    description: 'Ground black pepper - 200g'
  },
  {
    productId: 'GRO011',
    name: 'Turmeric Powder',
    category: 'Food & Beverages',
    price: 79.99,
    costPrice: 60.00,
    stock: 150,
    description: 'Pure turmeric powder - 200g'
  },
  {
    productId: 'GRO012',
    name: 'Red Chilli Powder',
    category: 'Food & Beverages',
    price: 89.99,
    costPrice: 70.00,
    stock: 120,
    description: 'Hot red chilli powder - 200g'
  },
  {
    productId: 'GRO013',
    name: 'Mustard Seeds',
    category: 'Food & Beverages',
    price: 59.99,
    costPrice: 45.00,
    stock: 100,
    description: 'Black mustard seeds - 200g'
  },
  {
    productId: 'GRO014',
    name: 'Cumin Seeds',
    category: 'Food & Beverages',
    price: 149.99,
    costPrice: 120.00,
    stock: 90,
    description: 'Whole cumin seeds - 200g'
  },
  {
    productId: 'GRO015',
    name: 'Coriander Powder',
    category: 'Food & Beverages',
    price: 69.99,
    costPrice: 55.00,
    stock: 110,
    description: 'Ground coriander - 200g'
  },
  {
    productId: 'GRO016',
    name: 'Cooking Oil',
    category: 'Food & Beverages',
    price: 159.99,
    costPrice: 130.00,
    stock: 150,
    description: 'Vegetable cooking oil - 1L'
  },
  {
    productId: 'GRO017',
    name: 'Olive Oil',
    category: 'Food & Beverages',
    price: 599.99,
    costPrice: 480.00,
    stock: 40,
    description: 'Extra virgin olive oil - 500ml'
  },
  {
    productId: 'GRO018',
    name: 'Green Tea',
    category: 'Food & Beverages',
    price: 249.99,
    costPrice: 200.00,
    stock: 80,
    description: 'Pure green tea bags - 25 pcs'
  },
  {
    productId: 'GRO019',
    name: 'Honey',
    category: 'Food & Beverages',
    price: 349.99,
    costPrice: 280.00,
    stock: 60,
    description: 'Pure honey - 500g'
  },
  {
    productId: 'GRO020',
    name: 'Tomato Ketchup',
    category: 'Food & Beverages',
    price: 129.99,
    costPrice: 100.00,
    stock: 100,
    description: 'Tomato ketchup - 500g'
  },
  {
    productId: 'GRO021',
    name: 'Pasta',
    category: 'Food & Beverages',
    price: 89.99,
    costPrice: 70.00,
    stock: 120,
    description: 'Durum wheat pasta - 500g'
  },
  {
    productId: 'GRO022',
    name: 'Spaghetti',
    category: 'Food & Beverages',
    price: 99.99,
    costPrice: 80.00,
    stock: 100,
    description: 'Italian spaghetti - 500g'
  },
  {
    productId: 'GRO023',
    name: 'Masoor Dal',
    category: 'Food & Beverages',
    price: 129.99,
    costPrice: 100.00,
    stock: 100,
    description: 'Red lentils - 1kg'
  },
  {
    productId: 'GRO024',
    name: 'Moong Dal',
    category: 'Food & Beverages',
    price: 139.99,
    costPrice: 110.00,
    stock: 100,
    description: 'Split green gram - 1kg'
  },
  {
    productId: 'GRO025',
    name: 'Poha',
    category: 'Food & Beverages',
    price: 59.99,
    costPrice: 45.00,
    stock: 120,
    description: 'Flattened rice - 500g'
  },
  {
    productId: 'GRO026',
    name: 'Vermicelli',
    category: 'Food & Beverages',
    price: 45.99,
    costPrice: 35.00,
    stock: 150,
    description: 'Fine wheat vermicelli - 500g'
  },
  {
    productId: 'GRO027',
    name: 'Semolina',
    category: 'Food & Beverages',
    price: 55.99,
    costPrice: 42.00,
    stock: 120,
    description: 'Fine semolina - 500g'
  },
  {
    productId: 'GRO028',
    name: 'Cashew Nuts',
    category: 'Food & Beverages',
    price: 899.99,
    costPrice: 750.00,
    stock: 50,
    description: 'Premium cashew nuts - 500g'
  },
  {
    productId: 'GRO029',
    name: 'Almonds',
    category: 'Food & Beverages',
    price: 799.99,
    costPrice: 650.00,
    stock: 50,
    description: 'California almonds - 500g'
  },
  {
    productId: 'GRO030',
    name: 'Raisins',
    category: 'Food & Beverages',
    price: 199.99,
    costPrice: 160.00,
    stock: 80,
    description: 'Seedless raisins - 250g'
  },
  {
    productId: 'GRO031',
    name: 'Peanuts',
    category: 'Food & Beverages',
    price: 159.99,
    costPrice: 120.00,
    stock: 100,
    description: 'Roasted peanuts - 500g'
  },
  {
    productId: 'GRO032',
    name: 'Mixed Spice Powder',
    category: 'Food & Beverages',
    price: 129.99,
    costPrice: 100.00,
    stock: 90,
    description: 'Garam masala powder - 100g'
  },
  {
    productId: 'GRO033',
    name: 'Cardamom',
    category: 'Food & Beverages',
    price: 899.99,
    costPrice: 750.00,
    stock: 30,
    description: 'Green cardamom - 100g'
  },
  {
    productId: 'GRO034',
    name: 'Cloves',
    category: 'Food & Beverages',
    price: 299.99,
    costPrice: 240.00,
    stock: 40,
    description: 'Whole cloves - 100g'
  },
  {
    productId: 'GRO035',
    name: 'Cinnamon',
    category: 'Food & Beverages',
    price: 199.99,
    costPrice: 160.00,
    stock: 50,
    description: 'Cinnamon sticks - 100g'
  },
  {
    productId: 'GRO036',
    name: 'Brown Rice',
    category: 'Food & Beverages',
    price: 149.99,
    costPrice: 120.00,
    stock: 80,
    description: 'Organic brown rice - 1kg'
  },
  {
    productId: 'GRO037',
    name: 'Quinoa',
    category: 'Food & Beverages',
    price: 399.99,
    costPrice: 320.00,
    stock: 40,
    description: 'White quinoa - 500g'
  },
  {
    productId: 'GRO038',
    name: 'Chia Seeds',
    category: 'Food & Beverages',
    price: 299.99,
    costPrice: 240.00,
    stock: 50,
    description: 'Organic chia seeds - 250g'
  },
  {
    productId: 'GRO039',
    name: 'Flax Seeds',
    category: 'Food & Beverages',
    price: 199.99,
    costPrice: 160.00,
    stock: 60,
    description: 'Organic flax seeds - 250g'
  },
  {
    productId: 'GRO040',
    name: 'Pumpkin Seeds',
    category: 'Food & Beverages',
    price: 299.99,
    costPrice: 240.00,
    stock: 50,
    description: 'Organic pumpkin seeds - 250g'
  },
  {
    productId: 'GRO041',
    name: 'Sunflower Seeds',
    category: 'Food & Beverages',
    price: 199.99,
    costPrice: 160.00,
    stock: 60,
    description: 'Organic sunflower seeds - 250g'
  },
  {
    productId: 'GRO042',
    name: 'Sesame Seeds',
    category: 'Food & Beverages',
    price: 99.99,
    costPrice: 80.00,
    stock: 100,
    description: 'White sesame seeds - 200g'
  },
  {
    productId: 'GRO043',
    name: 'Poppy Seeds',
    category: 'Food & Beverages',
    price: 299.99,
    costPrice: 240.00,
    stock: 40,
    description: 'White poppy seeds - 100g'
  },
  {
    productId: 'GRO044',
    name: 'Basil Seeds',
    category: 'Food & Beverages',
    price: 199.99,
    costPrice: 160.00,
    stock: 50,
    description: 'Organic basil seeds - 200g'
  },
  {
    productId: 'GRO045',
    name: 'Hemp Seeds',
    category: 'Food & Beverages',
    price: 399.99,
    costPrice: 320.00,
    stock: 30,
    description: 'Organic hemp seeds - 200g'
  },
  {
    productId: 'GRO046',
    name: 'Watermelon Seeds',
    category: 'Food & Beverages',
    price: 199.99,
    costPrice: 160.00,
    stock: 60,
    description: 'Organic watermelon seeds - 200g'
  },
  {
    productId: 'GRO047',
    name: 'Pine Nuts',
    category: 'Food & Beverages',
    price: 899.99,
    costPrice: 750.00,
    stock: 20,
    description: 'Premium pine nuts - 200g'
  },
  {
    productId: 'GRO048',
    name: 'Walnuts',
    category: 'Food & Beverages',
    price: 799.99,
    costPrice: 650.00,
    stock: 30,
    description: 'Premium walnuts - 200g'
  },
  {
    productId: 'GRO049',
    name: 'Pistachios',
    category: 'Food & Beverages',
    price: 899.99,
    costPrice: 750.00,
    stock: 20,
    description: 'Premium pistachios - 200g'
  },
  {
    productId: 'GRO050',
    name: 'Hazelnuts',
    category: 'Food & Beverages',
    price: 999.99,
    costPrice: 850.00,
    stock: 20,
    description: 'Premium hazelnuts - 200g'
  },
  {
    productId: 'GRO051',
    name: 'Macadamia Nuts',
    category: 'Food & Beverages',
    price: 1199.99,
    costPrice: 1000.00,
    stock: 10,
    description: 'Premium macadamia nuts - 200g'
  },
  {
    productId: 'GRO052',
    name: 'Brazil Nuts',
    category: 'Food & Beverages',
    price: 1099.99,
    costPrice: 900.00,
    stock: 10,
    description: 'Premium Brazil nuts - 200g'
  },
  {
    productId: 'GRO053',
    name: 'Pecan Nuts',
    category: 'Food & Beverages',
    price: 999.99,
    costPrice: 850.00,
    stock: 20,
    description: 'Premium pecan nuts - 200g'
  },
  {
    productId: 'GRO054',
    name: 'Dried Apricots',
    category: 'Food & Beverages',
    price: 499.99,
    costPrice: 400.00,
    stock: 30,
    description: 'Dried apricots - 200g'
  },
  {
    productId: 'GRO055',
    name: 'Dried Figs',
    category: 'Food & Beverages',
    price: 599.99,
    costPrice: 480.00,
    stock: 30,
    description: 'Dried figs - 200g'
  },
  {
    productId: 'GRO056',
    name: 'Dried Dates',
    category: 'Food & Beverages',
    price: 399.99,
    costPrice: 320.00,
    stock: 40,
    description: 'Dried dates - 200g'
  },
  {
    productId: 'GRO057',
    name: 'Dried Prunes',
    category: 'Food & Beverages',
    price: 499.99,
    costPrice: 400.00,
    stock: 30,
    description: 'Dried prunes - 200g'
  },
  {
    productId: 'GRO058',
    name: 'Dried Cranberries',
    category: 'Food & Beverages',
    price: 599.99,
    costPrice: 480.00,
    stock: 30,
    description: 'Dried cranberries - 200g'
  },
  {
    productId: 'GRO059',
    name: 'Dried Blueberries',
    category: 'Food & Beverages',
    price: 699.99,
    costPrice: 560.00,
    stock: 20,
    description: 'Dried blueberries - 200g'
  },
  {
    productId: 'GRO060',
    name: 'Dried Cherries',
    category: 'Food & Beverages',
    price: 799.99,
    costPrice: 650.00,
    stock: 20,
    description: 'Dried cherries - 200g'
  },
  {
    productId: 'GRO061',
    name: 'Dried Mango',
    category: 'Food & Beverages',
    price: 499.99,
    costPrice: 400.00,
    stock: 30,
    description: 'Dried mango slices - 200g'
  },
  {
    productId: 'GRO062',
    name: 'Dried Pineapple',
    category: 'Food & Beverages',
    price: 599.99,
    costPrice: 480.00,
    stock: 30,
    description: 'Dried pineapple slices - 200g'
  },
  {
    productId: 'GRO063',
    name: 'Dried Papaya',
    category: 'Food & Beverages',
    price: 399.99,
    costPrice: 320.00,
    stock: 40,
    description: 'Dried papaya slices - 200g'
  },
  {
    productId: 'GRO064',
    name: 'Dried Kiwi',
    category: 'Food & Beverages',
    price: 499.99,
    costPrice: 400.00,
    stock: 30,
    description: 'Dried kiwi slices - 200g'
  },
  {
    productId: 'GRO065',
    name: 'Dried Apple',
    category: 'Food & Beverages',
    price: 599.99,
    costPrice: 480.00,
    stock: 30,
    description: 'Dried apple slices - 200g'
  },
  {
    productId: 'GRO066',
    name: 'Dried Pear',
    category: 'Food & Beverages',
    price: 699.99,
    costPrice: 560.00,
    stock: 20,
    description: 'Dried pear slices - 200g'
  },
  {
    productId: 'GRO067',
    name: 'Dried Banana',
    category: 'Food & Beverages',
    price: 399.99,
    costPrice: 320.00,
    stock: 40,
    description: 'Dried banana chips - 200g'
  },
  {
    productId: 'GRO068',
    name: 'Dried Coconut',
    category: 'Food & Beverages',
    price: 499.99,
    costPrice: 400.00,
    stock: 30,
    description: 'Dried coconut flakes - 200g'
  },
  {
    productId: 'GRO069',
    name: 'Dried Strawberry',
    category: 'Food & Beverages',
    price: 599.99,
    costPrice: 480.00,
    stock: 30,
    description: 'Dried strawberry slices - 200g'
  },
  {
    productId: 'GRO070',
    name: 'Dried Raspberry',
    category: 'Food & Beverages',
    price: 699.99,
    costPrice: 560.00,
    stock: 20,
    description: 'Dried raspberry slices - 200g'
  },
  {
    productId: 'GRO071',
    name: 'Dried Blackberry',
    category: 'Food & Beverages',
    price: 799.99,
    costPrice: 650.00,
    stock: 20,
    description: 'Dried blackberry slices - 200g'
  },
  {
    productId: 'GRO072',
    name: 'Dried Mulberry',
    category: 'Food & Beverages',
    price: 899.99,
    costPrice: 750.00,
    stock: 20,
    description: 'Dried mulberry slices - 200g'
  },
  {
    productId: 'GRO073',
    name: 'Dried Goji Berry',
    category: 'Food & Beverages',
    price: 999.99,
    costPrice: 850.00,
    stock: 20,
    description: 'Dried goji berry slices - 200g'
  },
  {
    productId: 'GRO074',
    name: 'Dried Acai Berry',
    category: 'Food & Beverages',
    price: 1099.99,
    costPrice: 900.00,
    stock: 10,
    description: 'Dried acai berry slices - 200g'
  },
  {
    productId: 'GRO075',
    name: 'Dried Golden Berry',
    category: 'Food & Beverages',
    price: 1199.99,
    costPrice: 1000.00,
    stock: 10,
    description: 'Dried golden berry slices - 200g'
  },
  {
    productId: 'GRO076',
    name: 'Dried White Mulberry',
    category: 'Food & Beverages',
    price: 1299.99,
    costPrice: 1100.00,
    stock: 10,
    description: 'Dried white mulberry slices - 200g'
  },
  {
    productId: 'GRO077',
    name: 'Dried Black Mulberry',
    category: 'Food & Beverages',
    price: 1399.99,
    costPrice: 1200.00,
    stock: 10,
    description: 'Dried black mulberry slices - 200g'
  },
  {
    productId: 'GRO078',
    name: 'Dried Elderberry',
    category: 'Food & Beverages',
    price: 1499.99,
    costPrice: 1300.00,
    stock: 10,
    description: 'Dried elderberry slices - 200g'
  },
  {
    productId: 'GRO079',
    name: 'Dried Sea Buckthorn',
    category: 'Food & Beverages',
    price: 1599.99,
    costPrice: 1400.00,
    stock: 10,
    description: 'Dried sea buckthorn slices - 200g'
  },
  {
    productId: 'GRO080',
    name: 'Dried Schisandra Berry',
    category: 'Food & Beverages',
    price: 1699.99,
    costPrice: 1500.00,
    stock: 10,
    description: 'Dried schisandra berry slices - 200g'
  },
  {
    productId: 'GRO081',
    name: 'Dried Maqui Berry',
    category: 'Food & Beverages',
    price: 1799.99,
    costPrice: 1600.00,
    stock: 10,
    description: 'Dried maqui berry slices - 200g'
  },
  {
    productId: 'GRO082',
    name: 'Dried Camu Camu Berry',
    category: 'Food & Beverages',
    price: 1899.99,
    costPrice: 1700.00,
    stock: 10,
    description: 'Dried camu camu berry slices - 200g'
  },
  {
    productId: 'GRO083',
    name: 'Dried Aronia Berry',
    category: 'Food & Beverages',
    price: 1999.99,
    costPrice: 1800.00,
    stock: 10,
    description: 'Dried aronia berry slices - 200g'
  },
  {
    productId: 'GRO084',
    name: 'Dried Inca Berry',
    category: 'Food & Beverages',
    price: 2099.99,
    costPrice: 1900.00,
    stock: 10,
    description: 'Dried inca berry slices - 200g'
  },
  {
    productId: 'GRO085',
    name: 'Dried Jujube Berry',
    category: 'Food & Beverages',
    price: 2199.99,
    costPrice: 2000.00,
    stock: 10,
    description: 'Dried jujube berry slices - 200g'
  },
  {
    productId: 'GRO086',
    name: 'Dried Barberry',
    category: 'Food & Beverages',
    price: 2299.99,
    costPrice: 2100.00,
    stock: 10,
    description: 'Dried barberry slices - 200g'
  },
  {
    productId: 'GRO087',
    name: 'Dried Bilberry',
    category: 'Food & Beverages',
    price: 2399.99,
    costPrice: 2200.00,
    stock: 10,
    description: 'Dried bilberry slices - 200g'
  },
  {
    productId: 'GRO088',
    name: 'Dried Lingonberry',
    category: 'Food & Beverages',
    price: 2499.99,
    costPrice: 2300.00,
    stock: 10,
    description: 'Dried lingonberry slices - 200g'
  },
  {
    productId: 'GRO089',
    name: 'Dried Cloudberry',
    category: 'Food & Beverages',
    price: 2599.99,
    costPrice: 2400.00,
    stock: 10,
    description: 'Dried cloudberry slices - 200g'
  },
  {
    productId: 'GRO090',
    name: 'Dried Huckleberry',
    category: 'Food & Beverages',
    price: 2699.99,
    costPrice: 2500.00,
    stock: 10,
    description: 'Dried huckleberry slices - 200g'
  },
  {
    productId: 'GRO091',
    name: 'Dried Saskatoon Berry',
    category: 'Food & Beverages',
    price: 2799.99,
    costPrice: 2600.00,
    stock: 10,
    description: 'Dried saskatoon berry slices - 200g'
  },
  {
    productId: 'GRO092',
    name: 'Dried Serviceberry',
    category: 'Food & Beverages',
    price: 2899.99,
    costPrice: 2700.00,
    stock: 10,
    description: 'Dried serviceberry slices - 200g'
  },
  {
    productId: 'GRO093',
    name: 'Dried Thimbleberry',
    category: 'Food & Beverages',
    price: 2999.99,
    costPrice: 2800.00,
    stock: 10,
    description: 'Dried thimbleberry slices - 200g'
  },
  {
    productId: 'GRO094',
    name: 'Dried Salmonberry',
    category: 'Food & Beverages',
    price: 3099.99,
    costPrice: 2900.00,
    stock: 10,
    description: 'Dried salmonberry slices - 200g'
  },
  {
    productId: 'GRO095',
    name: 'Dried Boysenberry',
    category: 'Food & Beverages',
    price: 3199.99,
    costPrice: 3000.00,
    stock: 10,
    description: 'Dried boysenberry slices - 200g'
  },
  {
    productId: 'GRO096',
    name: 'Dried Marionberry',
    category: 'Food & Beverages',
    price: 3299.99,
    costPrice: 3100.00,
    stock: 10,
    description: 'Dried marionberry slices - 200g'
  },
  {
    productId: 'GRO097',
    name: 'Dried Olallieberry',
    category: 'Food & Beverages',
    price: 3399.99,
    costPrice: 3200.00,
    stock: 10,
    description: 'Dried olallieberry slices - 200g'
  },
  {
    productId: 'GRO098',
    name: 'Dried Tayberry',
    category: 'Food & Beverages',
    price: 3499.99,
    costPrice: 3300.00,
    stock: 10,
    description: 'Dried tayberry slices - 200g'
  },
  {
    productId: 'GRO099',
    name: 'Dried Loganberry',
    category: 'Food & Beverages',
    price: 3599.99,
    costPrice: 3400.00,
    stock: 10,
    description: 'Dried loganberry slices - 200g'
  },
  {
    productId: 'GRO100',
    name: 'Dried Youngberry',
    category: 'Food & Beverages',
    price: 3699.99,
    costPrice: 3500.00,
    stock: 10,
    description: 'Dried youngberry slices - 200g'
  },
  {
    productId: 'GRO101',
    name: 'Dried Dewberry',
    category: 'Food & Beverages',
    price: 3799.99,
    costPrice: 3600.00,
    stock: 10,
    description: 'Dried dewberry slices - 200g'
  },
  {
    productId: 'GRO102',
    name: 'Dried Wineberry',
    category: 'Food & Beverages',
    price: 3899.99,
    costPrice: 3700.00,
    stock: 10,
    description: 'Dried wineberry slices - 200g'
  },
  {
    productId: 'GRO103',
    name: 'Dried Gooseberry',
    category: 'Food & Beverages',
    price: 3999.99,
    costPrice: 3800.00,
    stock: 10,
    description: 'Dried gooseberry slices - 200g'
  },
  {
    productId: 'GRO104',
    name: 'Dried Currant',
    category: 'Food & Beverages',
    price: 4099.99,
    costPrice: 3900.00,
    stock: 10,
    description: 'Dried currant slices - 200g'
  },
  {
    productId: 'GRO105',
    name: 'Dried Elderberry',
    category: 'Food & Beverages',
    price: 4199.99,
    costPrice: 4000.00,
    stock: 10,
    description: 'Dried elderberry slices - 200g'
  },
  {
    productId: 'GRO106',
    name: 'Dried Rowanberry',
    category: 'Food & Beverages',
    price: 4299.99,
    costPrice: 4100.00,
    stock: 10,
    description: 'Dried rowanberry slices - 200g'
  },
  {
    productId: 'GRO107',
    name: 'Dried Hawthorn Berry',
    category: 'Food & Beverages',
    price: 4399.99,
    costPrice: 4200.00,
    stock: 10,
    description: 'Dried hawthorn berry slices - 200g'
  },
  {
    productId: 'GRO108',
    name: 'Dried Mulberry',
    category: 'Food & Beverages',
    price: 4499.99,
    costPrice: 4300.00,
    stock: 10,
    description: 'Dried mulberry slices - 200g'
  },
  {
    productId: 'GRO109',
    name: 'Dried Serviceberry',
    category: 'Food & Beverages',
    price: 4599.99,
    costPrice: 4400.00,
    stock: 10,
    description: 'Dried serviceberry slices - 200g'
  },
  {
    productId: 'GRO110',
    name: 'Dried Thimbleberry',
    category: 'Food & Beverages',
    price: 4699.99,
    costPrice: 4500.00,
    stock: 10,
    description: 'Dried thimbleberry slices - 200g'
  },
  {
    productId: 'GRO111',
    name: 'Dried Salmonberry',
    category: 'Food & Beverages',
    price: 4799.99,
    costPrice: 4600.00,
    stock: 10,
    description: 'Dried salmonberry slices - 200g'
  },
  {
    productId: 'GRO112',
    name: 'Dried Boysenberry',
    category: 'Food & Beverages',
    price: 4899.99,
    costPrice: 4700.00,
    stock: 10,
    description: 'Dried boysenberry slices - 200g'
  },
  {
    productId: 'GRO113',
    name: 'Dried Marionberry',
    category: 'Food & Beverages',
    price: 4999.99,
    costPrice: 4800.00,
    stock: 10,
    description: 'Dried marionberry slices - 200g'
  },
  {
    productId: 'GRO114',
    name: 'Dried Olallieberry',
    category: 'Food & Beverages',
    price: 5099.99,
    costPrice: 4900.00,
    stock: 10,
    description: 'Dried olallieberry slices - 200g'
  },
  {
    productId: 'GRO115',
    name: 'Dried Tayberry',
    category: 'Food & Beverages',
    price: 5199.99,
    costPrice: 5000.00,
    stock: 10,
    description: 'Dried tayberry slices - 200g'
  },
  {
    productId: 'GRO116',
    name: 'Dried Loganberry',
    category: 'Food & Beverages',
    price: 5299.99,
    costPrice: 5100.00,
    stock: 10,
    description: 'Dried loganberry slices - 200g'
  },
  {
    productId: 'GRO117',
    name: 'Dried Youngberry',
    category: 'Food & Beverages',
    price: 5399.99,
    costPrice: 5200.00,
    stock: 10,
    description: 'Dried youngberry slices - 200g'
  },
  {
    productId: 'GRO118',
    name: 'Dried Dewberry',
    category: 'Food & Beverages',
    price: 5499.99,
    costPrice: 5300.00,
    stock: 10,
    description: 'Dried dewberry slices - 200g'
  },
  {
    productId: 'GRO119',
    name: 'Dried Wineberry',
    category: 'Food & Beverages',
    price: 5599.99,
    costPrice: 5400.00,
    stock: 10,
    description: 'Dried wineberry slices - 200g'
  },
  {
    productId: 'GRO120',
    name: 'Dried Gooseberry',
    category: 'Food & Beverages',
    price: 5699.99,
    costPrice: 5500.00,
    stock: 10,
    description: 'Dried gooseberry slices - 200g'
  },
  {
    productId: 'GRO121',
    name: 'Dried Currant',
    category: 'Food & Beverages',
    price: 5799.99,
    costPrice: 5600.00,
    stock: 10,
    description: 'Dried currant slices - 200g'
  },
  {
    productId: 'GRO122',
    name: 'Dried Elderberry',
    category: 'Food & Beverages',
    price: 5899.99,
    costPrice: 5700.00,
    stock: 10,
    description: 'Dried elderberry slices - 200g'
  },
  {
    productId: 'GRO123',
    name: 'Dried Rowanberry',
    category: 'Food & Beverages',
    price: 5999.99,
    costPrice: 5800.00,
    stock: 10,
    description: 'Dried rowanberry slices - 200g'
  },
  {
    productId: 'GRO124',
    name: 'Dried Hawthorn Berry',
    category: 'Food & Beverages',
    price: 6099.99,
    costPrice: 5900.00,
    stock: 10,
    description: 'Dried hawthorn berry slices - 200g'
  },
  {
    productId: 'GRO125',
    name: 'Dried Mulberry',
    category: 'Food & Beverages',
    price: 6199.99,
    costPrice: 6000.00,
    stock: 10,
    description: 'Dried mulberry slices - 200g'
  },
  {
    productId: 'GRO126',
    name: 'Dried Serviceberry',
    category: 'Food & Beverages',
    price: 6299.99,
    costPrice: 6100.00,
    stock: 10,
    description: 'Dried serviceberry slices - 200g'
  },
  {
    productId: 'GRO127',
    name: 'Dried Thimbleberry',
    category: 'Food & Beverages',
    price: 6399.99,
    costPrice: 6200.00,
    stock: 10,
    description: 'Dried thimbleberry slices - 200g'
  },
  {
    productId: 'GRO128',
    name: 'Dried Salmonberry',
    category: 'Food & Beverages',
    price: 6499.99,
    costPrice: 6300.00,
    stock: 10,
    description: 'Dried salmonberry slices - 200g'
  },
  {
    productId: 'GRO129',
    name: 'Dried Boysenberry',
    category: 'Food & Beverages',
    price: 6599.99,
    costPrice: 6400.00,
    stock: 10,
    description: 'Dried boysenberry slices - 200g'
  },
  {
    productId: 'GRO130',
    name: 'Dried Marionberry',
    category: 'Food & Beverages',
    price: 6699.99,
    costPrice: 6500.00,
    stock: 10,
    description: 'Dried marionberry slices - 200g'
  },
  {
    productId: 'GRO131',
    name: 'Dried Olallieberry',
    category: 'Food & Beverages',
    price: 6799.99,
    costPrice: 6600.00,
    stock: 10,
    description: 'Dried olallieberry slices - 200g'
  },
  {
    productId: 'GRO132',
    name: 'Dried Tayberry',
    category: 'Food & Beverages',
    price: 6899.99,
    costPrice: 6700.00,
    stock: 10,
    description: 'Dried tayberry slices - 200g'
  },
  {
    productId: 'GRO133',
    name: 'Dried Loganberry',
    category: 'Food & Beverages',
    price: 6999.99,
    costPrice: 6800.00,
    stock: 10,
    description: 'Dried loganberry slices - 200g'
  },
  {
    productId: 'GRO134',
    name: 'Dried Youngberry',
    category: 'Food & Beverages',
    price: 7099.99,
    costPrice: 6900.00,
    stock: 10,
    description: 'Dried youngberry slices - 200g'
  },
  {
    productId: 'GRO135',
    name: 'Dried Dewberry',
    category: 'Food & Beverages',
    price: 7199.99,
    costPrice: 7000.00,
    stock: 10,
    description: 'Dried dewberry slices - 200g'
  },
  {
    productId: 'GRO136',
    name: 'Dried Wineberry',
    category: 'Food & Beverages',
    price: 7299.99,
    costPrice: 7100.00,
    stock: 10,
    description: 'Dried wineberry slices - 200g'
  },
  {
    productId: 'GRO137',
    name: 'Dried Gooseberry',
    category: 'Food & Beverages',
    price: 7399.99,
    costPrice: 7200.00,
    stock: 10,
    description: 'Dried gooseberry slices - 200g'
  },
  {
    productId: 'GRO138',
    name: 'Dried Currant',
    category: 'Food & Beverages',
    price: 7499.99,
    costPrice: 7300.00,
    stock: 10,
    description: 'Dried currant slices - 200g'
  },
  {
    productId: 'GRO139',
    name: 'Dried Elderberry',
    category: 'Food & Beverages',
    price: 7599.99,
    costPrice: 7400.00,
    stock: 10,
    description: 'Dried elderberry slices - 200g'
  },
  {
    productId: 'GRO140',
    name: 'Dried Rowanberry',
    category: 'Food & Beverages',
    price: 7699.99,
    costPrice: 7500.00,
    stock: 10,
    description: 'Dried rowanberry slices - 200g'
  },
  {
    productId: 'GRO141',
    name: 'Dried Hawthorn Berry',
    category: 'Food & Beverages',
    price: 7799.99,
    costPrice: 7600.00,
    stock: 10,
    description: 'Dried hawthorn berry slices - 200g'
  },
  {
    productId: 'GRO142',
    name: 'Dried Mulberry',
    category: 'Food & Beverages',
    price: 7899.99,
    costPrice: 7700.00,
    stock: 10,
    description: 'Dried mulberry slices - 200g'
  },
  {
    productId: 'GRO143',
    name: 'Dried Serviceberry',
    category: 'Food & Beverages',
    price: 7999.99,
    costPrice: 7800.00,
    stock: 10,
    description: 'Dried serviceberry slices - 200g'
  },
  {
    productId: 'GRO144',
    name: 'Dried Thimbleberry',
    category: 'Food & Beverages',
    price: 8099.99,
    costPrice: 7900.00,
    stock: 10,
    description: 'Dried thimbleberry slices - 200g'
  },
  {
    productId: 'GRO145',
    name: 'Dried Salmonberry',
    category: 'Food & Beverages',
    price: 8199.99,
    costPrice: 8000.00,
    stock: 10,
    description: 'Dried salmonberry slices - 200g'
  },
  {
    productId: 'GRO146',
    name: 'Dried Boysenberry',
    category: 'Food & Beverages',
    price: 8299.99,
    costPrice: 8100.00,
    stock: 10,
    description: 'Dried boysenberry slices - 200g'
  },
  {
    productId: 'GRO147',
    name: 'Dried Marionberry',
    category: 'Food & Beverages',
    price: 8399.99,
    costPrice: 8200.00,
    stock: 10,
    description: 'Dried marionberry slices - 200g'
  },
  {
    productId: 'GRO148',
    name: 'Dried Olallieberry',
    category: 'Food & Beverages',
    price: 8499.99,
    costPrice: 8300.00,
    stock: 10,
    description: 'Dried olallieberry slices - 200g'
  },
  {
    productId: 'GRO149',
    name: 'Dried Tayberry',
    category: 'Food & Beverages',
    price: 8599.99,
    costPrice: 8400.00,
    stock: 10,
    description: 'Dried tayberry slices - 200g'
  },
  {
    productId: 'GRO150',
    name: 'Dried Loganberry',
    category: 'Food & Beverages',
    price: 8699.99,
    costPrice: 8500.00,
    stock: 10,
    description: 'Dried loganberry slices - 200g'
  },
  {
    productId: 'GRO151',
    name: 'Dried Youngberry',
    category: 'Food & Beverages',
    price: 8799.99,
    costPrice: 8600.00,
    stock: 10,
    description: 'Dried youngberry slices - 200g'
  },
  {
    productId: 'GRO152',
    name: 'Dried Dewberry',
    category: 'Food & Beverages',
    price: 8899.99,
    costPrice: 8700.00,
    stock: 10,
    description: 'Dried dewberry slices - 200g'
  },
  {
    productId: 'GRO153',
    name: 'Dried Wineberry',
    category: 'Food & Beverages',
    price: 8999.99,
    costPrice: 8800.00,
    stock: 10,
    description: 'Dried wineberry slices - 200g'
  },
  {
    productId: 'GRO154',
    name: 'Dried Gooseberry',
    category: 'Food & Beverages',
    price: 9099.99,
    costPrice: 8900.00,
    stock: 10,
    description: 'Dried gooseberry slices - 200g'
  },
  {
    productId: 'GRO155',
    name: 'Dried Currant',
    category: 'Food & Beverages',
    price: 9199.99,
    costPrice: 9000.00,
    stock: 10,
    description: 'Dried currant slices - 200g'
  },
  {
    productId: 'GRO156',
    name: 'Dried Elderberry',
    category: 'Food & Beverages',
    price: 9299.99,
    costPrice: 9100.00,
    stock: 10,
    description: 'Dried elderberry slices - 200g'
  },
  {
    productId: 'GRO157',
    name: 'Dried Rowanberry',
    category: 'Food & Beverages',
    price: 9399.99,
    costPrice: 9200.00,
    stock: 10,
    description: 'Dried rowanberry slices - 200g'
  },
  {
    productId: 'GRO158',
    name: 'Dried Hawthorn Berry',
    category: 'Food & Beverages',
    price: 9499.99,
    costPrice: 9300.00,
    stock: 10,
    description: 'Dried hawthorn berry slices - 200g'
  },
  {
    productId: 'GRO159',
    name: 'Dried Mulberry',
    category: 'Food & Beverages',
    price: 9599.99,
    costPrice: 9400.00,
    stock: 10,
    description: 'Dried mulberry slices - 200g'
  },
  {
    productId: 'GRO160',
    name: 'Dried Serviceberry',
    category: 'Food & Beverages',
    price: 9699.99,
    costPrice: 9500.00,
    stock: 10,
    description: 'Dried serviceberry slices - 200g'
  },
  {
    productId: 'GRO161',
    name: 'Dried Thimbleberry',
    category: 'Food & Beverages',
    price: 9799.99,
    costPrice: 9600.00,
    stock: 10,
    description: 'Dried thimbleberry slices - 200g'
  },
  {
    productId: 'GRO162',
    name: 'Dried Salmonberry',
    category: 'Food & Beverages',
    price: 9899.99,
    costPrice: 9700.00,
    stock: 10,
    description: 'Dried salmonberry slices - 200g'
  },
  {
    productId: 'GRO163',
    name: 'Dried Boysenberry',
    category: 'Food & Beverages',
    price: 9999.99,
    costPrice: 9800.00,
    stock: 10,
    description: 'Dried boysenberry slices - 200g'
  },
  {
    productId: 'GRO164',
    name: 'Dried Marionberry',
    category: 'Food & Beverages',
    price: 10099.99,
    costPrice: 9900.00,
    stock: 10,
    description: 'Dried marionberry slices - 200g'
  },
  {
    productId: 'GRO165',
    name: 'Dried Olallieberry',
    category: 'Food & Beverages',
    price: 10199.99,
    costPrice: 10000.00,
    stock: 10,
    description: 'Dried olallieberry slices - 200g'
  },
  {
    productId: 'GRO166',
    name: 'Dried Tayberry',
    category: 'Food & Beverages',
    price: 10299.99,
    costPrice: 10100.00,
    stock: 10,
    description: 'Dried tayberry slices - 200g'
  },
  {
    productId: 'GRO167',
    name: 'Dried Loganberry',
    category: 'Food & Beverages',
    price: 10399.99,
    costPrice: 10200.00,
    stock: 10,
    description: 'Dried loganberry slices - 200g'
  },
  {
    productId: 'GRO168',
    name: 'Dried Youngberry',
    category: 'Food & Beverages',
    price: 10499.99,
    costPrice: 10300.00,
    stock: 10,
    description: 'Dried youngberry slices - 200g'
  },
  {
    productId: 'GRO169',
    name: 'Dried Dewberry',
    category: 'Food & Beverages',
    price: 10599.99,
    costPrice: 10400.00,
    stock: 10,
    description: 'Dried dewberry slices - 200g'
  },
  {
    productId: 'GRO170',
    name: 'Dried Wineberry',
    category: 'Food & Beverages',
    price: 10699.99,
    costPrice: 10500.00,
    stock: 10,
    description: 'Dried wineberry slices - 200g'
  },
  {
    productId: 'GRO171',
    name: 'Dried Gooseberry',
    category: 'Food & Beverages',
    price: 10799.99,
    costPrice: 10600.00,
    stock: 10,
    description: 'Dried gooseberry slices - 200g'
  },
  {
    productId: 'GRO172',
    name: 'Dried Currant',
    category: 'Food & Beverages',
    price: 10899.99,
    costPrice: 10700.00,
    stock: 10,
    description: 'Dried currant slices - 200g'
  },
  {
    productId: 'GRO173',
    name: 'Dried Elderberry',
    category: 'Food & Beverages',
    price: 10999.99,
    costPrice: 10800.00,
    stock: 10,
    description: 'Dried elderberry slices - 200g'
  },
  {
    productId: 'GRO174',
    name: 'Dried Rowanberry',
    category: 'Food & Beverages',
    price: 11099.99,
    costPrice: 10900.00,
    stock: 10,
    description: 'Dried rowanberry slices - 200g'
  },
  {
    productId: 'GRO175',
    name: 'Dried Hawthorn Berry',
    category: 'Food & Beverages',
    price: 11199.99,
    costPrice: 11000.00,
    stock: 10,
    description: 'Dried hawthorn berry slices - 200g'
  },
  {
    productId: 'GRO176',
    name: 'Dried Mulberry',
    category: 'Food & Beverages',
    price: 11299.99,
    costPrice: 11100.00,
    stock: 10,
    description: 'Dried mulberry slices - 200g'
  },
  {
    productId: 'GRO177',
    name: 'Dried Serviceberry',
    category: 'Food & Beverages',
    price: 11399.99,
    costPrice: 11200.00,
    stock: 10,
    description: 'Dried serviceberry slices - 200g'
  },
  {
    productId: 'GRO178',
    name: 'Dried Thimbleberry',
    category: 'Food & Beverages',
    price: 11499.99,
    costPrice: 11300.00,
    stock: 10,
    description: 'Dried thimbleberry slices - 200g'
  },
  {
    productId: 'GRO179',
    name: 'Dried Salmonberry',
    category: 'Food & Beverages',
    price: 11599.99,
    costPrice: 11400.00,
    stock: 10,
    description: 'Dried salmonberry slices - 200g'
  },
  {
    productId: 'GRO180',
    name: 'Dried Boysenberry',
    category: 'Food & Beverages',
    price: 11699.99,
    costPrice: 11500.00,
    stock: 10,
    description: 'Dried boysenberry slices - 200g'
  },
  {
    productId: 'GRO181',
    name: 'Dried Marionberry',
    category: 'Food & Beverages',
    price: 11799.99,
    costPrice: 11600.00,
    stock: 10,
    description: 'Dried marionberry slices - 200g'
  },
  {
    productId: 'GRO182',
    name: 'Dried Olallieberry',
    category: 'Food & Beverages',
    price: 11899.99,
    costPrice: 11700.00,
    stock: 10,
    description: 'Dried olallieberry slices - 200g'
  },
  {
    productId: 'GRO183',
    name: 'Dried Tayberry',
    category: 'Food & Beverages',
    price: 11999.99,
    costPrice: 11800.00,
    stock: 10,
    description: 'Dried tayberry slices - 200g'
  },
  {
    productId: 'GRO184',
    name: 'Dried Loganberry',
    category: 'Food & Beverages',
    price: 12099.99,
    costPrice: 11900.00,
    stock: 10,
    description: 'Dried loganberry slices - 200g'
  },
  {
    productId: 'GRO185',
    name: 'Dried Youngberry',
    category: 'Food & Beverages',
    price: 12199.99,
    costPrice: 12000.00,
    stock: 10,
    description: 'Dried youngberry slices - 200g'
  },
  {
    productId: 'GRO186',
    name: 'Dried Dewberry',
    category: 'Food & Beverages',
    price: 12299.99,
    costPrice: 12100.00,
    stock: 10,
    description: 'Dried dewberry slices - 200g'
  },
  {
    productId: 'GRO187',
    name: 'Dried Wineberry',
    category: 'Food & Beverages',
    price: 12399.99,
    costPrice: 12200.00,
    stock: 10,
    description: 'Dried wineberry slices - 200g'
  },
  {
    productId: 'GRO188',
    name: 'Dried Gooseberry',
    category: 'Food & Beverages',
    price: 12499.99,
    costPrice: 12300.00,
    stock: 10,
    description: 'Dried gooseberry slices - 200g'
  },
  {
    productId: 'GRO189',
    name: 'Dried Currant',
    category: 'Food & Beverages',
    price: 12599.99,
    costPrice: 12400.00,
    stock: 10,
    description: 'Dried currant slices - 200g'
  },
  {
    productId: 'GRO190',
    name: 'Dried Elderberry',
    category: 'Food & Beverages',
    price: 12699.99,
    costPrice: 12500.00,
    stock: 10,
    description: 'Dried elderberry slices - 200g'
  },
  {
    productId: 'GRO191',
    name: 'Dried Rowanberry',
    category: 'Food & Beverages',
    price: 12799.99,
    costPrice: 12600.00,
    stock: 10,
    description: 'Dried rowanberry slices - 200g'
  },
  {
    productId: 'GRO192',
    name: 'Dried Hawthorn Berry',
    category: 'Food & Beverages',
    price: 12899.99,
    costPrice: 12700.00,
    stock: 10,
    description: 'Dried hawthorn berry slices - 200g'
  },
  {
    productId: 'GRO193',
    name: 'Dried Mulberry',
    category: 'Food & Beverages',
    price: 12999.99,
    costPrice: 12800.00,
    stock: 10,
    description: 'Dried mulberry slices - 200g'
  },
  {
    productId: 'GRO194',
    name: 'Dried Serviceberry',
    category: 'Food & Beverages',
    price: 13099.99,
    costPrice: 12900.00,
    stock: 10,
    description: 'Dried serviceberry slices - 200g'
  },
  {
    productId: 'GRO195',
    name: 'Coconut Water',
    category: 'Food & Beverages',
    price: 79.99,
    costPrice: 60.00,
    stock: 100,
    description: 'Natural coconut water - 1L'
  },
  {
    productId: 'GRO196',
    name: 'Coconut Milk',
    category: 'Food & Beverages',
    price: 89.99,
    costPrice: 70.00,
    stock: 60,
    description: 'Pure coconut milk - 400ml'
  },
  {
    productId: 'GRO197',
    name: 'Vegetable Stock',
    category: 'Food & Beverages',
    price: 149.99,
    costPrice: 120.00,
    stock: 70,
    description: 'Natural vegetable stock cubes - 12pcs'
  },
  {
    productId: 'GRO198',
    name: 'Corn Flakes',
    category: 'Food & Beverages',
    price: 199.99,
    costPrice: 160.00,
    stock: 75,
    description: 'Crunchy corn flakes - 500g'
  },
  {
    productId: 'GRO199',
    name: 'Oats',
    category: 'Food & Beverages',
    price: 179.99,
    costPrice: 140.00,
    stock: 80,
    description: 'Rolled oats - 500g'
  },
  {
    productId: 'GRO200',
    name: 'Mixed Fruit Jam',
    category: 'Food & Beverages',
    price: 159.99,
    costPrice: 120.00,
    stock: 80,
    description: 'Mixed fruit jam - 500g'
  }
];

const addProducts = async () => {
  try {
    // Insert new products without clearing existing ones
    await Product.insertMany(newProducts);
    console.log('New products added successfully');
  } catch (error) {
    console.error('Error adding products:', error);
  } finally {
    mongoose.connection.close();
  }
};

addProducts();