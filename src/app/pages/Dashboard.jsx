import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Pill, AlertCircle, BellRing, Share2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import MobileHeader from '../components/MobileHeader';
import { familyService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [familyMembers, setFamilyMembers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const [stats, setStats] = useState({
    totalMeds: 0,
    missedDoses: 0,
    missedReminders: 0,
  });

  const [showInviteCode, setShowInviteCode] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        if (!user?.familyId) return;

        // POSTMAN: GET /family/:familyId/members
        const response = await familyService.listMembers(user.familyId);
        const membersList = response.members || [];

        setFamilyMembers(membersList);

        // stats calculation remains same
        const totalMeds = membersList.reduce(
          (sum, member) => sum + (member.medsToday || 0),
          0
        );

        const missedDoses = membersList.reduce(
          (sum, member) => sum + (member.missedDoses || 0),
          0
        );

        setStats({
          totalMeds,
          missedDoses,
          missedReminders: 0,
        });

      } catch (error) {
        console.error("Dashboard loading failed:", error);
      }

    };

    loadDashboardData();

  }, [user]);



  const handleGenerateInvite = async () => {

    try {

      // POSTMAN: POST /family/generate-invite
      const result = await familyService.generateInvite(user.familyId);

      setInviteCode(result.inviteCode);
      setShowInviteCode(true);

    } catch (error) {
      console.error('Failed to generate invite:', error);
    }

  };



  const getStatusBadgeColor = (status) => {

    switch (status) {

      case 'On track':
        return 'bg-green-100 text-green-700';

      case 'Missed':
        return 'bg-orange-100 text-orange-700';

      case 'Needs attention':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-blue-100 text-blue-700';
    }

  };



  return (

    <div className="flex min-h-screen bg-gray-50">

      <div className="hidden md:block">
        <Sidebar />
      </div>

      <MobileHeader />

      <div className="flex-1 overflow-auto">

        {/* HEADER */}

        <div className="bg-white border-b border-gray-200 p-4 md:p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-2xl font-semibold mb-1">
                Family Dashboard
              </h1>

              <p className="text-gray-600">
                Manage your family's medications and health
              </p>
            </div>

            <button
              onClick={handleGenerateInvite}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              <Share2 className="w-4 h-4"/>
              Generate Invite Code
            </button>

          </div>

        </div>

        <div className="p-4 md:p-6">

          {/* INVITE CODE */}

          {showInviteCode && (

            <div className="mb-6 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-6">

              <h3 className="font-semibold text-lg mb-2">
                Family Invite Code
              </h3>

              <div className="bg-white rounded-lg p-4 border-2 border-teal-300 text-center">

                <div className="text-3xl font-bold font-mono tracking-widest text-teal-700">
                  {inviteCode}
                </div>

              </div>

            </div>

          )}

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            <StatCard
              icon={<Pill className="w-5 h-5 text-blue-600"/>}
              value={stats.totalMeds}
              label="Meds for today"
              bg="bg-blue-100"
            />

            <StatCard
              icon={<AlertCircle className="w-5 h-5 text-orange-600"/>}
              value={stats.missedDoses}
              label="Missed doses"
              bg="bg-orange-100"
            />

            <StatCard
              icon={<BellRing className="w-5 h-5 text-yellow-600"/>}
              value={stats.missedReminders}
              label="Missed reminders"
              bg="bg-yellow-100"
            />

          </div>


          {/* FAMILY MEMBERS */}

          <div className="bg-white rounded-xl border border-gray-200 p-6">

            <h2 className="font-semibold text-lg mb-4">
              Family Members
            </h2>

            <div className="space-y-4">

              {familyMembers.map((member) => (

                <button
                  key={member.id}
                  onClick={() => navigate(`/patient/${member.id}`)}
                  className="w-full text-left bg-gray-50 rounded-lg p-4 hover:bg-gray-100 border"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.avatar || member.name?.charAt(0) || '?'}
                    </div>

                    <div className="flex-1">

                      <h3 className="font-semibold">
                        {member.name}
                      </h3>

                      <p className="text-sm text-gray-600">
                        {member.role === 'admin' ? 'Family Admin' : 'Member'}
                      </p>

                    </div>

                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(member.status || 'On track')}`}>
                      {member.status || 'On track'}
                    </span>

                  </div>

                </button>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

function StatCard({ icon, value, label, bg }) {

  return (

    <div className="bg-white rounded-xl p-6 border border-gray-200">

      <div className="flex items-center gap-3">

        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}>
          {icon}
        </div>

        <div>

          <div className="text-2xl font-bold">
            {value}
          </div>

          <div className="text-sm text-gray-600">
            {label}
          </div>

        </div>

      </div>

    </div>

  );

}