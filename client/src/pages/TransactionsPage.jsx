import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

export default function TransactionsPage() {
  const { id } = useParams();

  const transactions = [
    {
      id: 1,
      date: '2024-01-15',
      member: 'John Doe',
      amount: 5000,
      type: 'contribution',
      status: 'completed',
    },
    {
      id: 2,
      date: '2024-01-14',
      member: 'Jane Smith',
      amount: 5000,
      type: 'contribution',
      status: 'completed',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Transaction History</h1>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Member</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-3 text-sm text-gray-600">{tx.date}</td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-semibold">{tx.member}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 capitalize">{tx.type}</td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-semibold">
                      KES {tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
