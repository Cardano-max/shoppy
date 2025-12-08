import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthContext } from '@/lib/auth-middleware'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(async (req: Request, context: AuthContext) => {
    try {
      const invoice = await prisma.invoice.findFirst({
        where: {
          id: params.id,
          storeId: context.storeId,
        },
        include: {
          customer: true,
          store: true,
          order: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      })

      if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
      }

      // Generate HTML for PDF
      const html = generateInvoiceHTML(invoice)

      // For now, return HTML that can be printed as PDF
      // In production, you would use a library like puppeteer or jsPDF
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    } catch (error: any) {
      console.error('Error generating invoice PDF:', error)
      return NextResponse.json(
        { error: 'Failed to generate invoice PDF', details: error?.message },
        { status: 500 }
      )
    }
  })(request)
}

function generateInvoiceHTML(invoice: any): string {
  const items = invoice.order?.items || []
  const subtotal = invoice.amount
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + tax

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice #${invoice.invoiceNumber}</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; }
    }
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #333;
    }
    .company-info h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-info h2 {
      margin: 0 0 10px 0;
      font-size: 24px;
      color: #666;
    }
    .details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .details div {
      flex: 1;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #f5f5f5;
      padding: 12px;
      text-align: left;
      border-bottom: 2px solid #ddd;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .totals table {
      margin-bottom: 0;
    }
    .totals td {
      border: none;
      padding: 8px 0;
    }
    .totals tr:last-child {
      font-size: 18px;
      font-weight: bold;
      border-top: 2px solid #333;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <h1>${invoice.store?.name || 'Store Name'}</h1>
      <p>${invoice.store?.email || 'store@example.com'}<br>
         ${invoice.store?.phone || '+91 1234567890'}</p>
    </div>
    <div class="invoice-info">
      <h2>INVOICE</h2>
      <p><strong>#${invoice.invoiceNumber}</strong><br>
         Date: ${new Date(invoice.createdAt).toLocaleDateString()}<br>
         ${invoice.dueDate ? `Due: ${new Date(invoice.dueDate).toLocaleDateString()}` : ''}</p>
    </div>
  </div>

  <div class="details">
    <div>
      <h3>Bill To:</h3>
      <p><strong>${invoice.customer?.name || 'Customer'}</strong><br>
         ${invoice.customer?.email || ''}<br>
         ${invoice.customer?.phone || ''}</p>
    </div>
    <div style="text-align: right;">
      <h3>Invoice Details:</h3>
      <p>Status: <strong>${invoice.status}</strong><br>
         Source: ${invoice.source}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Quantity</th>
        <th>Price</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((item: any) => `
        <tr>
          <td>${item.product?.name || 'Product'}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price.toFixed(2)}</td>
          <td style="text-align: right;">₹${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr>
        <td>Subtotal:</td>
        <td style="text-align: right;">₹${subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Tax (18% GST):</td>
        <td style="text-align: right;">₹${tax.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Total:</td>
        <td style="text-align: right;">₹${total.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Balance Due:</td>
        <td style="text-align: right;">₹${invoice.balance.toFixed(2)}</td>
      </tr>
    </table>
  </div>

  <div class="footer">
    <p>Thank you for your business!</p>
    <p>This is a computer-generated invoice.</p>
  </div>

  <script>
    // Auto-print when opened
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `.trim()
}
