const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Find customer with order order_20251220_0001
    const customer = await User.findOne({
      'services.orderId': 'order_20251220_0001',
      role: 'customer'
    });
    
    if (customer) {
      console.log('Customer found:', {
        id: customer._id,
        name: customer.name,
        email: customer.email
      });
      
      // Find the specific order
      const order = customer.services.find(s => s.orderId === 'order_20251220_0001');
      console.log('Order details:', {
        orderId: order.orderId,
        employeeId: order.employeeId,
        serviceId: order.serviceId,
        status: order.status
      });
      
      // Check if this customer is in EMP007's assigned customers
      const employee = await User.findOne({ _id: 'EMP007', role: 'employee' });
      if (employee) {
        const isAssigned = employee.assignedCustomers.some(c => c._id.toString() === customer._id.toString());
        console.log('Is customer assigned to EMP007?', isAssigned);
        console.log('EMP007 assigned customers:', employee.assignedCustomers.map(c => c._id || c));
      }
    } else {
      console.log('No customer found with order order_20251220_0001');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });