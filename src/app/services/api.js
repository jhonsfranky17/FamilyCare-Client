// ============================================
// API CONFIGURATION
// ============================================

const API_BASE_URL = "http://localhost:3000";


// ============================================
// COMMON API REQUEST FUNCTION
// ============================================

const apiRequest = async (endpoint, options = {}) => {

  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = localStorage.getItem("authToken");

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "API Request Failed");
    }

    return data;

  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
};



// ============================================
// AUTH SERVICE
// ============================================

export const authService = {

  // POST Register
  register: async (name, email, password) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password
      })
    });
  },

  // POST Login
  login: async (email, password) => {

    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      })
    });

    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }

    if (data.user?.id) {
      localStorage.setItem("userId", data.user.id);
    }

    return data;
  },

  // GET Profile
  getProfile: async () => {
    return apiRequest("/auth/profile", {
      method: "GET"
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  }
};



// ============================================
// FAMILY SERVICE
// ============================================

export const familyService = {

  // POST Create Family
  createFamily: async (name) => {
    return apiRequest("/families", {
      method: "POST",
      body: JSON.stringify({ name })
    });
  },

  // POST Generate Invite
  generateInvite: async (familyId) => {
    return apiRequest(`/families/${familyId}/invite`, {
      method: "POST"
    });
  },

  // POST Join Family
  joinFamily: async (inviteCode) => {
    return apiRequest("/families/join", {
      method: "POST",
      body: JSON.stringify({ inviteCode })
    });
  },

  // GET List Members
  listMembers: async (familyId) => {
    return apiRequest(`/families/${familyId}/members`, {
      method: "GET"
    });
  },

  // GET Family Details
  getFamilyDetails: async (familyId) => {
    return apiRequest(`/families/${familyId}`, {
      method: "GET"
    });
  }
};



// ============================================
// PATIENT SERVICE
// ============================================

export const patientService = {

  // POST Create Patient
  createPatient: async (patientData) => {
    return apiRequest("/health/patients", {
      method: "POST",
      body: JSON.stringify(patientData)
    });
  },

  // GET Get Patient
  getPatient: async (patientId) => {
    return apiRequest(`/health/patients/${patientId}`, {
      method: "GET"
    });
  },

  // PUT Update Patient
  updatePatient: async (patientId, updates) => {
    return apiRequest(`/health/patients/${patientId}`, {
      method: "PUT",
      body: JSON.stringify(updates)
    });
  },

  // DELETE Patient
  deletePatient: async (patientId) => {
    return apiRequest(`/health/patients/${patientId}`, {
      method: "DELETE"
    });
  },

  // GET Patients In Family
  getPatientsInFamily: async (familyId) => {
    return apiRequest(`/health/families/${familyId}/patients`, {
      method: "GET"
    });
  }
};



// ============================================
// MEDICATION SERVICE
// ============================================

export const medicationService = {

  // POST Add Medication
  addMedication: async (data) => {
    return apiRequest("/health/medications", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  // GET List Medications
  listMedications: async (patientId) => {
    return apiRequest(`/health/patients/${patientId}/medications`, {
      method: "GET"
    });
  },

  // PUT Update Medication
  updateMedication: async (medicationId, updates) => {
    return apiRequest(`/health/medications/${medicationId}`, {
      method: "PUT",
      body: JSON.stringify(updates)
    });
  },

  // DELETE Medication
  deleteMedication: async (medicationId) => {
    return apiRequest(`/health/medications/${medicationId}`, {
      method: "DELETE"
    });
  },

  // POST Mark as Taken
  markAsTaken: async (medicationId) => {
    return apiRequest(`/health/medications/${medicationId}/taken`, {
      method: "POST"
    });
  },

  // GET Medication History
  medicationHistory: async (patientId) => {
    return apiRequest(`/health/patients/${patientId}/history`, {
      method: "GET"
    });
  }
};



// ============================================
// DRUG INFO SERVICE
// ============================================

export const drugService = {

  // GET Search Drug
  searchDrug: async (query) => {
    return apiRequest(`/health/drug-info/${encodeURIComponent(query)}`, {
      method: "GET"
    });
  }
};