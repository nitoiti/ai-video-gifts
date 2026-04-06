# MIA Payment Integration Guide

## Overview
This document describes the integration with MIA (Moldova) payment system for the AI Video Gifts service.

## Payment Methods Available

### 1. MIA (Moldova) - Primary Payment System
- **Description**: MIA is the main payment gateway in Moldova
- **Currency**: MDL (Moldovan Leu)
- **Languages**: Romanian, Russian, English
- **Security**: 3D Secure, PCI DSS compliant

### 2. Bank Cards
- **Supported**: Visa, Mastercard, Maestro
- **Processing**: Local and international cards
- **Currency**: MDL

### 3. Cash on Delivery
- **Description**: Payment when video is delivered
- **Availability**: Chișinău and major cities
- **Processing**: Manual confirmation

## MIA Integration Setup

### Required Credentials
```javascript
const miaConfig = {
    merchant_id: 'YOUR_MIA_MERCHANT_ID',
    secret_key: 'YOUR_MIA_SECRET_KEY',
    api_url: 'https://api.mia.md',
    payment_url: 'https://pay.mia.md'
};
```

### Payment Flow
1. **Create Payment Request**
   ```javascript
   const paymentData = {
       merchant_id: 'YOUR_MIA_MERCHANT_ID',
       order_id: generateOrderId(),
       amount: 490, // in MDL
       currency: 'MDL',
       description: 'AI Video Gift - Начальный',
       customer_email: 'customer@example.com',
       success_url: 'https://yourdomain.com/payment-success',
       fail_url: 'https://yourdomain.com/payment-fail',
       callback_url: 'https://yourdomain.com/payment-callback',
       lang: 'ru' // or 'ro'
   };
   ```

2. **Redirect to MIA**
   ```javascript
   window.location.href = 'https://pay.mia.md/payment?' + new URLSearchParams(paymentData);
   ```

3. **Handle Callback**
   ```javascript
   // POST /payment-callback
   // MIA sends payment status
   {
       order_id: 'ORDER_1234567890_abc123',
       status: 'success', // or 'failed', 'pending'
       transaction_id: 'MIA_TXN_123456',
       amount: 490,
       currency: 'MDL',
       signature: 'generated_signature'
   }
   ```

## Security Implementation

### Signature Generation
```javascript
function generateMIASignature(data, secretKey) {
    const sortedKeys = Object.keys(data).sort();
    const signatureString = sortedKeys.map(key => `${key}=${data[key]}`).join('&') + secretKey;
    return crypto.createHash('sha256').update(signatureString).digest('hex');
}
```

### Signature Verification
```javascript
function verifyMIASignature(receivedData, signature, secretKey) {
    const calculatedSignature = generateMIASignature(receivedData, secretKey);
    return calculatedSignature === signature;
}
```

## Error Handling

### Common MIA Error Codes
- `1001`: Invalid merchant credentials
- `1002`: Invalid order amount
- `1003`: Invalid currency
- `1004`: Customer email required
- `2001`: Payment declined
- `2002`: Insufficient funds
- `2003`: Card expired

### Error Response Format
```javascript
{
    error: true,
    code: '2001',
    message: 'Payment declined',
    details: 'Card issuer declined transaction'
}
```

## Testing

### MIA Test Environment
- **Test URL**: `https://test-pay.mia.md`
- **Test Cards**: 
  - Visa: `4111111111111111`
  - Mastercard: `5555555555554444`
  - CVV: `123`
  - Expiry: `12/25`

### Test Scenarios
1. **Successful Payment**: Use valid test card
2. **Failed Payment**: Use invalid card number
3. **Insufficient Funds**: Use specific test card
4. **Network Error**: Simulate connection issues

## Production Checklist

### Before Going Live
- [ ] Obtain production MIA credentials
- [ ] Update API URLs to production endpoints
- [ ] Test all payment scenarios
- [ ] Implement proper error handling
- [ ] Set up monitoring and logging
- [ ] Configure webhook endpoints
- [ ] Test refund process
- [ ] Verify SSL certificates

### Monitoring
- Track payment success rates
- Monitor API response times
- Set up alerts for failed payments
- Log all payment attempts

## Customer Support

### Common Issues
1. **Payment Declined**: Ask customer to check card details or try different card
2. **3D Secure Failed**: Customer needs to complete verification
3. **Network Timeout**: Ask customer to retry payment
4. **Currency Issues**: Ensure MDL is selected

### Support Contacts
- **MIA Technical Support**: support@mia.md
- **Phone**: +373 22 123 456
- **Documentation**: https://docs.mia.md

## Compliance

### Requirements
- PCI DSS compliance for card handling
- GDPR compliance for customer data
- Local Moldovan financial regulations
- Anti-money laundering (AML) procedures

### Data Protection
- Encrypt all sensitive data
- Store only necessary customer information
- Implement data retention policies
- Regular security audits

## Future Enhancements

### Planned Features
- Recurring payments for subscriptions
- Multi-currency support
- Advanced fraud detection
- Mobile wallet integration (Apple Pay, Google Pay)
- Cryptocurrency payments

### Integration Roadmap
1. **Phase 1**: Basic MIA integration (current)
2. **Phase 2**: Advanced reporting and analytics
3. **Phase 3**: Mobile app payments
4. **Phase 4**: International payment methods

## Support Documentation

### For Developers
- API documentation: `https://docs.mia.md/api`
- SDK libraries: JavaScript, PHP, Python
- Code examples: GitHub repository
- Testing guide: `https://docs.mia.md/testing`

### For Merchants
- Merchant dashboard: `https://merchant.mia.md`
- Settlement reports: Daily/monthly
- Dispute management: Chargeback handling
- Customer service tools: Refund processing
