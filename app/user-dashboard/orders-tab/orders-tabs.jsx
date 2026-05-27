


export default function OrdersTab(){
    return(
          <div className="space-y-6">
    <h1 className="mb-6 font-bold text-2xl">سفارشات من</h1>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-gray-700 border-b">
            <th className="px-4 py-3 text-right">شماره سفارش</th>
            <th className="px-4 py-3 text-right">تاریخ</th>
            <th className="px-4 py-3 text-right">مبلغ</th>
            <th className="px-4 py-3 text-right">وضعیت</th>
            <th className="px-4 py-3 text-right">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id: '#ORD-001', date: '۱۴۰۲/۱۱/۱۵', amount: '۳,۵۰۰,۰۰۰', status: 'تکمیل شده' },
            { id: '#ORD-002', date: '۱۴۰۲/۱۲/۰۳', amount: '۲,۰۰۰,۰۰۰', status: 'در حال پردازش' },
            { id: '#ORD-003', date: '۱۴۰۳/۰۱/۲۰', amount: '۸۵۰,۰۰۰', status: 'تکمیل شده' },
            { id: '#ORD-004', date: '۱۴۰۳/۰۲/۰۵', amount: '۱,۲۰۰,۰۰۰', status: 'لغو شده' },
            { id: '#ORD-005', date: '۱۴۰۳/۰۲/۱۸', amount: '۴,۵۰۰,۰۰۰', status: 'تکمیل شده' },
          ].map((order, index) => (
            <tr key={index} className="hover:bg-gray-800/30 border-gray-800 border-b">
              <td className="px-4 py-3">{order.id}</td>
              <td className="px-4 py-3">{order.date}</td>
              <td className="px-4 py-3 font-bold">{order.amount} تومان</td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  order.status === 'تکمیل شده' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'در حال پردازش' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  جزئیات
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
    )
}