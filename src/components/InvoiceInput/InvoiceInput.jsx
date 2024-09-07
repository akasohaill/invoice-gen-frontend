import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InvoiceInput.css';
import axios from 'axios'

const InvoiceInput = ({ onGenerateInvoice }) => {
  const [invoiceData, setInvoiceData] = useState({
    sellerDetails: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      panNo: '',
      gstRegistrationNo: ''
    },
    billingDetails: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      stateCode: ''
    },
    orderDetails:{
      orderNo:'',
      orderDate:''
    },
    invoiceDetails:{
      invoiceNo:'',
      invoiceDate:''
    },
    placeOfSupply: '',
    items: [
      {
        description: '',
        unitPrice: '',
        quantity: '',
        discount: ''
      }
    ],
    placeOfDelivery: ''
    // Add other fields as needed...
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
  
    if (keys.length === 2) {
      setInvoiceData((prevState) => ({
        ...prevState,
        [keys[0]]: {
          ...prevState[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else if (keys.length === 3) {
      const index = parseInt(keys[1], 10);
      const updatedItems = [...invoiceData.items];
      updatedItems[index][keys[2]] = value;
      setInvoiceData((prevState) => ({
        ...prevState,
        items: updatedItems,
      }));
    } else {
      setInvoiceData((prevState) => ({
        ...prevState,
        [name]: value,  // Handle fields that are not nested
      }));
    }
  };
  

  const handleAddItem = () => {
    setInvoiceData((prevState) => ({
      ...prevState,
      items: [...prevState.items, { description: '', unitPrice: '', quantity: '', discount: '' }]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // post the data to the database
    axios.post('https://invoice-gen-backend-1.onrender.com/api/invoices/create', invoiceData)
      .then(res => {
        console.log('posted', res.data);
        onGenerateInvoice(invoiceData);
        navigate('/invoice');
      }).catch(err => {
        console.log('there is an error', err);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Seller Details</h2>
      <input
        type="text"
        name="sellerDetails.name"
        value={invoiceData.sellerDetails.name}
        onChange={handleChange}
        placeholder="Seller Name"
        required
      />
      <input
        type="text"
        name="sellerDetails.address"
        value={invoiceData.sellerDetails.address}
        onChange={handleChange}
        placeholder="Seller Address"
        required
      />
      <input
        type="text"
        name="sellerDetails.city"
        value={invoiceData.sellerDetails.city}
        onChange={handleChange}
        placeholder="City"
        required
      />
      <input
        type="text"
        name="sellerDetails.state"
        value={invoiceData.sellerDetails.state}
        onChange={handleChange}
        placeholder="State"
        required
      />
      <input
        type="text"
        name="sellerDetails.pincode"
        value={invoiceData.sellerDetails.pincode}
        onChange={handleChange}
        placeholder="Pincode"
        required
      />
      <input
        type="text"
        name="sellerDetails.panNo"
        value={invoiceData.sellerDetails.panNo}
        onChange={handleChange}
        placeholder="PAN No."
        required
      />
      <input
        type="text"
        name="sellerDetails.gstRegistrationNo"
        value={invoiceData.sellerDetails.gstRegistrationNo}
        onChange={handleChange}
        placeholder="GST Registration No."
        required
      />
      <input
        type="text"
        name="placeOfSupply"
        value={invoiceData.placeOfSupply}
        onChange={handleChange}
        placeholder="Place Of Supply"
        required
      />

      <h2>Billing Details</h2>
      <input
        type="text"
        name="billingDetails.name"
        value={invoiceData.billingDetails.name}
        onChange={handleChange}
        placeholder="Billing Name"
        required
      />
      <input
        type="text"
        name="billingDetails.address"
        value={invoiceData.billingDetails.address}
        onChange={handleChange}
        placeholder="Billing Address"
        required
      />
      <input
        type="text"
        name="billingDetails.city"
        value={invoiceData.billingDetails.city}
        onChange={handleChange}
        placeholder="City"
        required
      />
      <input
        type="text"
        name="billingDetails.state"
        value={invoiceData.billingDetails.state}
        onChange={handleChange}
        placeholder="State"
        required
      />
      <input
        type="text"
        name="billingDetails.pincode"
        value={invoiceData.billingDetails.pincode}
        onChange={handleChange}
        placeholder="Pincode"
        required
      />
      <input
        type="text"
        name="billingDetails.stateCode"
        value={invoiceData.billingDetails.stateCode}
        onChange={handleChange}
        placeholder="State Code"
        required
      />
      <input
        type="text"
        name="placeOfDelivery"
        value={invoiceData.placeOfDelivery}
        onChange={handleChange}
        placeholder="Place Of Delivery"
        required
      />
      <div className="item">
        <h2>Item Details</h2>
        {invoiceData.items.map((item, index) => (
          <div key={index}>
            <div className='item-details'>
              <input
                style={{ width: '200px' }}
                type="text"
                name={`items.${index}.description`}
                value={item.description}
                onChange={handleChange}
                placeholder="Description"
                required
              />
              <input
                type="number"
                name={`items.${index}.unitPrice`}
                value={item.unitPrice}
                onChange={handleChange}
                placeholder="Unit Price"
                required
              />
              <input
                type="number"
                name={`items.${index}.quantity`}
                value={item.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                required
              />
              <input
                type="number"
                name={`items.${index}.discount`}
                value={item.discount}
                onChange={handleChange}
                placeholder="Discount"
                required
              />
            </div>
            <hr />
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>
          Add Item
        </button>
      </div>
      <h2>Order Details</h2>
      <input
        type="text"
        name="orderDetails.orderNo"
        value={invoiceData.orderDetails.orderNo}
        onChange={handleChange}
        placeholder="Enter Order Number"
        required
      />
      <input
        type="text"
        name="orderDetails.orderDate"
        value={invoiceData.orderDetails.orderDate}
        onChange={handleChange}
        placeholder="Enter Order Date in DD.MM.YYYY"
        required
      />
      <h2>Invoice Details</h2>
      <input
        type="text"
        name="invoiceDetails.invoiceNo"
        value={invoiceData.invoiceDetails.invoiceNo}
        onChange={handleChange}
        placeholder="Enter Invoice Number"
        required
      />
      <input
        type="text"
        name="invoiceDetails.invoiceDate"
        value={invoiceData.invoiceDetails.invoiceDate}
        onChange={handleChange}
        placeholder="Enter Invoice Date in DD.MM.YYYY"
        required
      />
      <button type="submit">Generate Invoice</button>
    </form>
  );
};

export default InvoiceInput;
