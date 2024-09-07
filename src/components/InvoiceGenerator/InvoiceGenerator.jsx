import React, { useRef } from 'react';
import './InvoiceGenerator.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from './../../assets/logo.png'

// Utility function to convert numbers to words
function numberToWords(num) {
  if (typeof num !== 'number' || isNaN(num)) return '';
  if (num === 0) return 'Zero';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven',
    'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const numString = num.toString();

  if (numString.length > 9) return 'Overflow'; // Limit to Crore

  const n = ('000000000' + numString).slice(-9).match(/.{1,2}/g);

  if (!n) return '';

  let str = '';
  str += (n[0] !== '00') ? (a[Number(n[0])] || b[n[0][0]] + ' ' + a[n[0][1]]) + ' Crore ' : '';
  str += (n[1] !== '00') ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Lakh ' : '';
  str += (n[2] !== '00') ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Thousand ' : '';
  str += (n[3] !== '00') ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Hundred ' : '';
  str += (n[4] !== '00') ? ((str !== '') ? 'and ' : '') + (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' ' : '';
  str += 'Only';

  return str.trim();
}

const InvoiceGenerator = ({ invoiceData }) => {
  if (!invoiceData) return null;

  const invoiceRef = useRef();

  const handleDownloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('invoice.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };

  const totalAmount = invoiceData.items.reduce(
    (total, item) => total + (item.unitPrice * item.quantity - item.discount),
    0
  );
  const totalAmountInWords = numberToWords(Math.round(totalAmount));



  return (
    <div className='container'>
      <div className='main' ref={invoiceRef}>
        <div className='heading'>
          <div className="logo">
            <img src={logo} />
            <h1 style={{color:'black', fontSize:'large'}}>Invoice Gen.</h1>
          </div>
          <div className='side-text'>
            <h2>Tax Invoice/Bill Of Supply/Cash Memo</h2>
            <p>(Original for Recipient)</p>
          </div>
        </div>
        <div className="seller-buyer">
          <div className='sold-by'>
            <h3>Sold By:</h3>
            <p>{invoiceData.sellerDetails.name}</p>
            <p>{invoiceData.sellerDetails.address}</p>
            <p>{invoiceData.sellerDetails.city}, {invoiceData.sellerDetails.state} - {invoiceData.sellerDetails.pincode}</p>
            <div className='pan-gst'>
              <p><b>PAN No:</b>  {invoiceData.sellerDetails.panNo}</p>
              <p><b>GST No:</b> {invoiceData.sellerDetails.gstRegistrationNo}</p>
            </div>
          </div>

          <div className='billing-add'>
            <h3>Billing Address:</h3>
            <p>{invoiceData.billingDetails.name}</p>
            <p>{invoiceData.billingDetails.address}</p>
            <p>{invoiceData.billingDetails.city}, {invoiceData.billingDetails.state} - {invoiceData.billingDetails.pincode}</p>
            <p><b>State UT CODE:</b> {invoiceData.billingDetails.stateCode}</p>
          </div>
        </div>
        <div className='shipping-add'>
          <h3>Shipping Address:</h3>
          <p>{invoiceData.billingDetails.name}</p>
          <p>{invoiceData.billingDetails.address}</p>
          <p>{invoiceData.billingDetails.city}, {invoiceData.billingDetails.state} - {invoiceData.billingDetails.pincode}</p>
          <p><b>State UT CODE:</b> {invoiceData.billingDetails.stateCode}</p>
          <p><b>Place Of Supply:</b>{invoiceData.placeOfSupply}</p>
          <p><b>Place Of Delivery:</b>{invoiceData.placeOfDelivery}</p>
        </div>
        <div className="some-details">
          <div className="order-details">
            <p><b>Order No:</b>{invoiceData.orderDetails.orderNo}</p>
            <p><b>Order Date:</b>{invoiceData.orderDetails.orderDate}</p>
          </div>
          <div className="invoice-details">
            <p><b>Invoice No:</b>{invoiceData.invoiceDetails.invoiceNo}</p>
            <p><b>Invoice Date:</b>{invoiceData.invoiceDetails.invoiceDate}</p>
          </div>
        </div>
        <div>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Description</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Discount</th>
                <th>Net Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td> {/* Serial number */}
                  <td>{item.description}</td>
                  <td>Rs {item.unitPrice}</td>
                  <td>{item.quantity}</td>
                  <td>{item.discount}%</td>
                  <td>Rs {(item.unitPrice * item.quantity - item.discount).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan="5"><b>Total Amount (including all taxes & GST)</b></td>
                <td>
                  <b>Rs{totalAmount.toFixed(2)}</b>
                </td>
              </tr>
              <tr className="total-row in-words">
                <td colSpan="6">
                <p style={{left:0}}><b>Total Amount (in words):</b> <br /> {totalAmountInWords}</p>
                </td>
              </tr>
            </tbody>
          </table>
            <div className="signature">
              <p><b>For {invoiceData.sellerDetails.name}:</b></p>
              <div className="sign">
                <p>{invoiceData.sellerDetails.name}</p>
              </div>
              <p><b>Authorized Signatory</b></p>
            </div>
        </div>
      </div>
      <button className='btn' onClick={handleDownloadPDF}>Download PDF</button>
    </div>
  );
};

export default InvoiceGenerator;
