# BE Creative SD - API Testing Guide

## Using cURL or Postman

### 1. Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

Save the token for other requests.

---

### 2. Create Product (Admin)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Organic Coffee",
    "description": "Premium organic coffee beans",
    "price": 14.99,
    "category": "BE Natural",
    "stock": 50
  }'
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Organic Coffee",
  "description": "Premium organic coffee beans",
  "price": 14.99,
  "category": "BE Natural",
  "stock": 50,
  "featured": false,
  "createdAt": "2024-01-20T10:30:00Z",
  "updatedAt": "2024-01-20T10:30:00Z"
}
```

---

### 3. Get All Products

```bash
curl http://localhost:5000/api/products
```

**Get products by category:**
```bash
curl http://localhost:5000/api/products?category=BE%20Natural
```

---

### 4. Get Single Product

```bash
curl http://localhost:5000/api/products/507f1f77bcf86cd799439011
```

---

### 5. Update Product (Admin)

```bash
curl -X PUT http://localhost:5000/api/products/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Premium Organic Coffee",
    "price": 16.99,
    "stock": 45,
    "featured": true
  }'
```

---

### 6. Delete Product (Admin)

```bash
curl -X DELETE http://localhost:5000/api/products/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 7. Create Order

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-1234",
      "address": "123 Main St"
    },
    "items": [
      {
        "product": "507f1f77bcf86cd799439011",
        "quantity": 2,
        "price": 14.99
      }
    ],
    "totalAmount": 29.98
  }'
```

**Response:**
```json
{
  "_id": "507f191e810c19729de860ea",
  "orderNumber": "ORD-1705753800000",
  "customer": { ... },
  "items": [ ... ],
  "totalAmount": 29.98,
  "status": "pending",
  "createdAt": "2024-01-20T10:30:00Z"
}
```

---

### 8. Get Order Details

```bash
curl http://localhost:5000/api/orders/507f191e810c19729de860ea
```

---

### 9. Get All Orders (Admin)

```bash
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 10. Update Order Status (Admin)

```bash
curl -X PUT http://localhost:5000/api/orders/507f191e810c19729de860ea/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"status":"shipped"}'
```

**Valid status values:**
- `pending`
- `paid`
- `shipped`
- `delivered`

---

### 11. Create Payment Link (Admin)

```bash
curl -X POST http://localhost:5000/api/payments/create-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Deluxe Package",
    "description": "Premium package with all features",
    "amount": 99.99
  }'
```

**Response:**
```json
{
  "id": "507f191e810c19729de860eb",
  "name": "Deluxe Package",
  "description": "Premium package with all features",
  "amount": 99.99,
  "paymentLink": "https://buy.stripe.com/test_xxxxx"
}
```

---

### 12. Get Payment Links (Admin)

```bash
curl http://localhost:5000/api/payments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 13. Delete Payment Link (Admin)

```bash
curl -X DELETE http://localhost:5000/api/payments/507f191e810c19729de860eb \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 14. Verify Token

```bash
curl http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "valid": true
}
```

---

## Using Postman

### Import Collection

1. Open Postman
2. Create new Collection: "BE Creative SD"
3. Add these requests:

### Environment Variables

In Postman, create an environment with:
```
{
  "base_url": "http://localhost:5000",
  "api_url": "{{base_url}}/api",
  "admin_password": "admin123",
  "token": ""
}
```

### Request Templates

**1. Login (Get Token)**
```
POST {{api_url}}/auth/admin-login
Body (raw JSON):
{
  "password": "{{admin_password}}"
}

After running, copy token from response and set:
token = <copied_token_value>
```

**2. Create Product**
```
POST {{api_url}}/products
Headers:
- Authorization: Bearer {{token}}
Body (raw JSON):
{
  "name": "Product Name",
  "description": "Description",
  "price": 29.99,
  "category": "BE Natural",
  "stock": 10
}
```

**3. List Products**
```
GET {{api_url}}/products
```

**4. Create Order**
```
POST {{api_url}}/orders
Body (raw JSON):
{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "address": "123 Main St"
  },
  "items": [
    {
      "product": "PRODUCT_ID_HERE",
      "quantity": 1,
      "price": 29.99
    }
  ],
  "totalAmount": 29.99
}
```

**5. Create Payment Link**
```
POST {{api_url}}/payments/create-link
Headers:
- Authorization: Bearer {{token}}
Body (raw JSON):
{
  "name": "Payment Link Name",
  "description": "Description",
  "amount": 99.99
}
```

---

## Testing Workflow

### Basic Flow

1. **Login** → Get token
2. **Create Product** → Get product ID
3. **List Products** → Verify product appears
4. **Create Order** → Use product ID
5. **Update Order** → Change status to "paid"
6. **Get Order** → Verify status changed

### Admin Flow

1. **Login** → Get token
2. **Create Product** → Add items for sale
3. **Create Payment Link** → Generate payment URL
4. **Get All Orders** → View customer orders
5. **Update Order Status** → Track shipment

### Customer Flow

1. **List Products** → Browse items
2. **Get Product** → View details
3. **Create Order** → Place order
4. **Get Order** → Track status

---

## Example Test Data

### Product
```json
{
  "name": "Organic Honey",
  "description": "Raw organic honey from local bees",
  "price": 12.99,
  "category": "BE Natural",
  "stock": 25
}
```

### Custom Product
```json
{
  "name": "Custom T-Shirt",
  "description": "Design your own t-shirt",
  "price": 24.99,
  "category": "BE Custom",
  "stock": 100
}
```

### Customer Order
```json
{
  "customer": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "555-5678",
    "address": "456 Oak Ave, City, State 12345"
  },
  "items": [
    {
      "product": "PRODUCT_ID",
      "quantity": 3,
      "price": 12.99
    }
  ],
  "totalAmount": 38.97
}
```

---

## Error Responses

### 401 - Unauthorized
```json
{
  "error": "Invalid password"
}
```

### 403 - Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 - Not Found
```json
{
  "error": "Product not found"
}
```

### 400 - Bad Request
```json
{
  "error": "Failed to create product"
}
```

---

## Tips

- Always include `Authorization: Bearer <token>` header for admin endpoints
- Use `Content-Type: application/json` for POST/PUT requests
- Test unauthorized requests (without token) to verify security
- Check response status codes (201 for create, 200 for success, 4xx/5xx for errors)
- Use Postman's test scripts to automate verification
- Export/share collections with team members

---

## Stripe Test Cards

For payment link testing:

| Card | Number | Expiry | CVC |
|------|--------|--------|-----|
| Visa | 4242424242424242 | 12/25 | 123 |
| Visa Declined | 4000000000000002 | 12/25 | 123 |
| Visa 3D Secure | 4000002500003155 | 12/25 | 123 |

More test cards: https://stripe.com/docs/testing#card-numbers
