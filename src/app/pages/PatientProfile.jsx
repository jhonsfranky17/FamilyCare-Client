import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AddMedicationModal from '../components/AddMedicationModal';
import { patientService, medicationService } from '../services/api';

export default function PatientProfile() {

  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [activeTab, setActiveTab] = useState('medications');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadPatientData = async () => {
      try {
        const patientData = await patientService.getPatient(patientId);
        const medicationData = await medicationService.listMedications(patientId);
        setPatient(patientData.patient || patientData);
        setMedications(medicationData.medications || medicationData || []);
      } catch (error) {
        console.error("Failed to load patient:", error);
        // Show empty profile instead of infinite spinner
        setPatient({ name: 'Family Member', age: null, role: 'Member', conditions: 'No data yet' });
        setMedications([]);
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, [patientId]);


  const handleMarkTaken = async (medicationId) => {

    try {

      await medicationService.markAsTaken(medicationId);

      setMedications(prev =>
        prev.map(med =>
          med.id === medicationId
            ? { ...med, status: 'Taken', statusColor: 'green' }
            : med
        )
      );

    } catch (error) {
      console.error('Failed to mark medication as taken:', error);
    }

  };


  const handleAddMedication = async (newMedication) => {
    try {
      await medicationService.addMedication({
        patientId,
        ...newMedication
      });

      // Reload the full list so what's in DB is what's shown
      const medicationData = await medicationService.listMedications(patientId);
      setMedications(medicationData.medications || medicationData || []);

    } catch (error) {
      console.error("Failed to add medication:", error);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }


  const getStatusIcon = (status) => {

    switch (status) {

      case 'Taken':
        return <CheckCircle className="w-5 h-5 text-green-600" />;

      case 'Upcoming':
        return <Clock className="w-5 h-5 text-blue-600" />;

      case 'Missed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;

      default:
        return <Clock className="w-5 h-5 text-gray-600" />;

    }

  };


  const getStatusBadgeColor = (status) => {

    switch (status) {

      case 'Taken':
        return 'bg-green-100 text-green-700';

      case 'Upcoming':
        return 'bg-blue-100 text-blue-700';

      case 'Missed':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';

    }

  };


  const missedMedications = medications.filter(med => med.status === 'Missed');
  const upcomingMedications = medications.filter(med => med.status === 'Upcoming');
  const takenMedications = medications.filter(med => med.status === 'Taken');


  return (

    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">

        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 md:p-6">

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-start justify-between">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                {patient.avatar || patient.name?.charAt(0)}
              </div>

              <div>

                <h1 className="text-2xl font-semibold mb-1">
                  {patient.name}
                </h1>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>{patient.role} · Age {patient.age}</span>
                </div>

              </div>

            </div>

          </div>

        </div>


        <div className="p-4 md:p-6">

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">

            <div className="flex border-b border-gray-200">

              <button
                onClick={() => setActiveTab('medications')}
                className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === 'medications'
                    ? 'text-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Medications
                {activeTab === 'medications' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === 'appointments'
                    ? 'text-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Appointments
                {activeTab === 'appointments' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('healthlog')}
                className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === 'healthlog'
                    ? 'text-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Health Log
                {activeTab === 'healthlog' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                )}
              </button>

            </div>


            {/* Medications Tab */}
            {activeTab === 'medications' && (

              <div className="p-6">

                <div className="flex items-center justify-between mb-6">

                  <h2 className="text-lg font-semibold">All Medications</h2>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Medication</span>
                  </button>

                </div>


                {/* Missed alert */}
                {missedMedications.length > 0 && (

                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">

                    <div className="flex items-start gap-3">

                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />

                      <div>

                        <h3 className="font-semibold text-red-900 mb-1">
                          {missedMedications.length} Missed Medication
                        </h3>

                        <p className="text-sm text-red-700">
                          Please check with {patient.name}.
                        </p>

                      </div>

                    </div>

                  </div>

                )}


                {/* Empty state */}
                {medications.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-lg font-medium">No medications yet</p>
                    <p className="text-sm mt-1">Click "Add Medication" to get started.</p>
                  </div>
                )}

                {/* Medication List */}
                <div className="space-y-3">

                  {medications.map((medication) => (

                    <div
                      key={medication.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100"
                    >

                      <div className="flex-shrink-0">
                        {getStatusIcon(medication.status)}
                      </div>

                      <div className="flex-1">

                        <div className="flex items-center gap-2 mb-1">

                          <h3 className="font-semibold">
                            {medication.name}
                          </h3>

                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(medication.status)}`}>
                            {medication.status}
                          </span>

                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{medication.dosage}</span>
                          <span>·</span>
                          <span>{medication.frequency}</span>
                          <span>·</span>
                          <span>{medication.time}</span>
                        </div>

                      </div>

                      {(medication.status === 'Upcoming' || medication.status === 'Missed') && (

                        <button
                          onClick={() => handleMarkTaken(medication.id)}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium"
                        >
                          Mark Taken
                        </button>

                      )}

                    </div>

                  ))}

                </div>

              </div>

            )}

          </div>


          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Total Medications</div>
              <div className="text-3xl font-bold">{medications.length}</div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Taken Today</div>
              <div className="text-3xl font-bold text-green-600">{takenMedications.length}</div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Missed</div>
              <div className="text-3xl font-bold text-red-600">{missedMedications.length}</div>
            </div>

          </div>

        </div>

      </div>


      <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        patientName={patient.name}
        onAdd={handleAddMedication}
      />

    </div>

  );

}