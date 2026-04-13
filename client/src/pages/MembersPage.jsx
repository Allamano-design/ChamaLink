import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

export default function MembersPage() {
  const { id } = useParams();

  const members = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Admin',
      joinedDate: '2024-01-01',
      contribution: 25000,
      status: 'active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Member',
      joinedDate: '2024-01-05',
      contribution: 20000,
      status: 'active',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Member',
      joinedDate: '2024-01-10',
      contribution: 5000,
      status: 'active',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Group Members</h1>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid gap-6 p-6">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">KES {member.contribution.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Contributed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
