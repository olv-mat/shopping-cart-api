export const dtoProperties = {
  email: {
    example: 'john.doe@test.com',
    description: 'User email address',
  },
  password: {
    example: '@JohnDoe123',
    description: 'User password',
  },
  name: {
    example: 'John Doe',
    description: 'User full name',
  },
  productId: {
    example: '7a8df8f3-aaf8-4c30-b175-d64cc6b530c8',
    description: 'Product uuid',
  },
  quantity: {
    example: 1,
    description: 'Product quantity',
  },
  categoryName: {
    example: 'eletronics',
    description: 'Category name',
  },
  cartId: {
    example: '5d5263d5-8e18-4845-8da0-3f550c18a99e',
    description: 'Cart uuid',
  },
  productName: {
    example: 'Play Station 5',
    description: 'Product name',
  },
  categoryId: {
    example: 'c3a1155a-ac2b-411b-9fd7-2f477b4b2769',
    description: 'Category uuid',
  },
  price: {
    example: '4499.99',
    description: 'Product price',
  },
};

export const endpointProperties = {
  auth: {
    login: { summary: 'Authenticate user' },
    register: { summary: 'Register a new user' },
    registerAdmin: { summary: 'Register a new admin user' },
  },
  cart: {
    findAll: { summary: 'Retrieve all carts' },
    findOne: { summary: 'Retrieve a specific cart' },
  },
  cartItem: {
    decrease: { summary: 'Decrease quantity of a cart item' },
    increase: { summary: 'Increase quantity of a cart item' },
  },
  category: {
    findAll: { summary: 'Retrieve all categories' },
    create: { summary: 'Create a new category' },
    findOne: { summary: 'Retrieve a specific category' },
    update: { summary: 'Update a specific category' },
    delete: { summary: 'Delete a specific category' },
  },
  monitoring: {
    getMetrics: { summary: 'Retrieve application monitoring metrics' },
  },
  oder: {
    findAll: { summary: 'Retrieve all orders' },
    create: { summary: 'Create a new order' },
    findOne: { summary: 'Retrieve a specific order' },
    delete: { summary: 'Delete a specific order' },
    pay: { summary: 'Mark a specific order as paid' },
  },
  product: {
    findAll: { summary: 'Retrieve all products with optional filters' },
    create: { summary: 'Create a new product' },
    findOne: { summary: 'Retrieve a specific product' },
    update: { summary: 'Update a specific product' },
    delete: { summary: 'Delete a specific product' },
  },
  user: {
    findAll: { summary: 'Retrieve all users' },
    findOne: { summary: 'Retrieve a specific user' },
    update: { summary: 'Update a specific user' },
    delete: { summary: 'Delete a specific user' },
  },
};

export const endpointResponses = {
  internalServerError: {
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Internal Server Error',
        statusCode: 500,
      },
    },
  },
};
