import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, Stethoscope, Microscope, CheckSquare, ChevronRight, Trash2, Edit, User, Phone, Mail, Calendar, Droplet, AlertTriangle, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AppointmentModal, { AppointmentForm } from '../components/common/AppointmentModal';
import PatientModal, { PatientForm } from '../components/common/PatientModal';
import StaffModal, { StaffForm } from '../components/common/StaffModal';
import LaboratoryModal, { LabTestForm } from '../components/common/LaboratoryModal';
import WardBedModal, { WardForm, BedForm, PatientAssignmentForm } from '../components/common/WardBedModal';
import InventoryModal, { InventoryItemForm, SupplierForm, PurchaseOrderForm, PurchaseOrderItemForm, InventoryTransactionForm } from '../components/common/InventoryModal';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from '../hooks/useTranslation';

const HospitalManagementPage = () => {
  const { t } = useTranslation();
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [labModalOpen, setLabModalOpen] = useState(false);
  const [wardBedModalOpen, setWardBedModalOpen] = useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);

  const [appointments, setAppointments] = useState<AppointmentForm[]>([]);
  const [patients, setPatients] = useState<PatientForm[]>([]);
  const [staff, setStaff] = useState<StaffForm[]>([]);
  const [labRecords, setLabRecords] = useState<LabTestForm[]>([]);
  const [wards, setWards] = useState<WardForm[]>([]);
  const [beds, setBeds] = useState<BedForm[]>([]);
  const [patientAssignments, setPatientAssignments] = useState<PatientAssignmentForm[]>([]);

  const [inventoryItems, setInventoryItems] = useState<InventoryItemForm[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierForm[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderForm[]>([]);
  const [purchaseOrderItems, setPurchaseOrderItems] = useState<PurchaseOrderItemForm[]>([]);
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransactionForm[]>([]);

  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('patients');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');
      if (!res.ok) throw new Error('Failed to fetch patients');
      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      if (!res.ok) throw new Error('Failed to fetch staff');
      const data = await res.json();
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchLabRecords = async () => {
    try {
      const res = await fetch('/api/labrecords');
      if (!res.ok) throw new Error('Failed to fetch lab records');
      const data = await res.json();
      setLabRecords(data);
    } catch (error) {
      console.error('Error fetching lab records:', error);
    }
  };

  const fetchWards = async () => {
    try {
      const res = await fetch('/api/ward-bed/wards');
      if (!res.ok) throw new Error('Failed to fetch wards');
      const data = await res.json();
      setWards(data);
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const fetchBeds = async () => {
    try {
      const res = await fetch('/api/ward-bed/beds');
      if (!res.ok) throw new Error('Failed to fetch beds');
      const data = await res.json();
      setBeds(data);
    } catch (error) {
      console.error('Error fetching beds:', error);
    }
  };

  const fetchPatientAssignments = async () => {
    try {
      const res = await fetch('/api/ward-bed/assignments');
      if (!res.ok) throw new Error('Failed to fetch patient assignments');
      const data = await res.json();
      setPatientAssignments(data);
    } catch (error) {
      console.error('Error fetching patient assignments:', error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const res = await fetch('/api/inventory/items');
      if (!res.ok) throw new Error('Failed to fetch inventory items');
      const data = await res.json();
      setInventoryItems(data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      toast.error('Failed to fetch inventory items.');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/inventory/suppliers');
      if (!res.ok) throw new Error('Failed to fetch suppliers');
      const data = await res.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to fetch suppliers.');
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      const res = await fetch('/api/inventory/purchaseorders');
      if (!res.ok) throw new Error('Failed to fetch purchase orders');
      const data = await res.json();
      setPurchaseOrders(data);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      toast.error('Failed to fetch purchase orders.');
    }
  };

  const fetchPurchaseOrderItems = async () => {
    try {
      const res = await fetch('/api/inventory/purchaseorderitems');
      if (!res.ok) throw new Error('Failed to fetch purchase order items');
      const data = await res.json();
      setPurchaseOrderItems(data);
    } catch (error) {
      console.error('Error fetching purchase order items:', error);
    }
  };

  const fetchInventoryTransactions = async () => {
    try {
      const res = await fetch('/api/inventory/transactions');
      if (!res.ok) throw new Error('Failed to fetch inventory transactions');
      const data = await res.json();
      setInventoryTransactions(data);
    } catch (error) {
      console.error('Error recording inventory transaction:', error);
    }
  };

  const handleBookAppointment = async (form: AppointmentForm) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to book appointment');
      toast.success('Appointment booked successfully!');
      setAppointmentModalOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment.');
    }
  };

  const handleAddPatient = async (form: PatientForm) => {
    try {
      console.log('Attempting to add patient:', form);
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add patient');
      console.log('Patient added successfully');
      toast.success('Patient added successfully!');
      setPatientModalOpen(false);
      fetchPatients();
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Failed to add patient.');
    }
  };

  const handleAddStaff = async (form: StaffForm) => {
    try {
      console.log('Attempting to add staff:', form);
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add staff');
      console.log('Staff added successfully:', await res.json());
      toast.success('Staff added successfully!');
      setStaffModalOpen(false);
      fetchStaff();
    } catch (error) {
      console.error('Error adding staff:', error);
      toast.error('Failed to add staff.');
    }
  };

  const handleAddLabRecord = async (form: LabTestForm) => {
    try {
      console.log('Attempting to add lab record:', form);
      const res = await fetch('/api/labrecords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add lab record');
      console.log('Lab record added successfully:', await res.json());
      toast.success('Lab record added successfully!');
      setLabModalOpen(false);
      fetchLabRecords();
    } catch (error) {
      console.error('Error adding lab record:', error);
      toast.error('Failed to add lab record.');
    }
  };

  const handleAddWard = async (form: WardForm) => {
    try {
      console.log('Attempting to add ward:', form);
      const res = await fetch('/api/ward-bed/wards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add ward');
      console.log('Ward added successfully:', await res.json());
      toast.success('Ward added successfully!');
      setWardBedModalOpen(false);
      fetchWards();
    } catch (error) {
      console.error('Error adding ward:', error);
      toast.error('Failed to add ward.');
    }
  };

  const handleAddBed = async (form: BedForm) => {
    try {
      console.log('Attempting to add bed:', form);
      const res = await fetch('/api/ward-bed/beds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add bed');
      console.log('Bed added successfully:', await res.json());
      toast.success('Bed added successfully!');
      setWardBedModalOpen(false);
      fetchBeds();
    } catch (error) {
      console.error('Error adding bed:', error);
      toast.error('Failed to add bed.');
    }
  };

  const handleAddPatientAssignment = async (form: PatientAssignmentForm) => {
    try {
      console.log('Attempting to add patient assignment:', form);
      const res = await fetch('/api/ward-bed/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add patient assignment');
      console.log('Patient assignment added successfully:', await res.json());
      toast.success('Patient assignment added successfully!');
      setWardBedModalOpen(false);
      fetchPatientAssignments();
    } catch (error) {
      console.error('Error adding patient assignment:', error);
      toast.error('Failed to add patient assignment.');
    }
  };

  const handleAddInventoryItem = async (form: InventoryItemForm) => {
    try {
      console.log('Attempting to add inventory item:', form);
      const res = await fetch('/api/inventory/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add inventory item');
      console.log('Inventory item added successfully:', await res.json());
      toast.success('Inventory item added successfully!');
      setInventoryModalOpen(false);
      fetchInventoryItems();
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast.error('Failed to add inventory item.');
    }
  };

  const handleAddSupplier = async (form: SupplierForm) => {
    try {
      console.log('Attempting to add supplier:', form);
      const res = await fetch('/api/inventory/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add supplier');
      console.log('Supplier added successfully:', await res.json());
      toast.success('Supplier added successfully!');
      setInventoryModalOpen(false);
      fetchSuppliers();
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast.error('Failed to add supplier.');
    }
  };

  const handleCreatePurchaseOrder = async (form: PurchaseOrderForm) => {
    try {
      console.log('Attempting to create purchase order:', form);
      const res = await fetch('/api/inventory/purchaseorders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to create purchase order');
      console.log('Purchase order created successfully:', await res.json());
      toast.success('Purchase order created successfully!');
      setInventoryModalOpen(false);
      fetchPurchaseOrders();
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast.error('Failed to create purchase order.');
    }
  };

  const handleAddPurchaseOrderItem = async (form: PurchaseOrderItemForm) => {
    try {
      console.log('Attempting to add purchase order item:', form);
      const res = await fetch('/api/inventory/purchaseorderitems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add purchase order item');
      console.log('Purchase order item added successfully:', await res.json());
      toast.success('Purchase order item added successfully!');
      setInventoryModalOpen(false);
      fetchPurchaseOrderItems();
    } catch (error) {
      console.error('Error adding purchase order item:', error);
      toast.error('Failed to add purchase order item.');
    }
  };

  const handleAddInventoryTransaction = async (form: InventoryTransactionForm) => {
    try {
      console.log('Attempting to record inventory transaction:', form);
      const res = await fetch('/api/inventory/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to record inventory transaction');
      console.log('Inventory transaction recorded successfully:', await res.json());
      toast.success('Inventory transaction recorded successfully!');
      setInventoryModalOpen(false);
      fetchInventoryTransactions();
    } catch (error) {
      console.error('Error recording inventory transaction:', error);
      toast.error('Failed to record inventory transaction.');
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchStaff();
    fetchLabRecords();
    fetchWards();
    fetchBeds();
    fetchPatientAssignments();
    fetchInventoryItems();
    fetchSuppliers();
    fetchPurchaseOrders();
    fetchPurchaseOrderItems();
    fetchInventoryTransactions();
  }, []);

  const useHash = () => {
    const location = useLocation();
    const [hash, setHash] = useState(() => location.hash);

    useEffect(() => {
      const handleHashChange = () => {
        setHash(window.location.hash);
      };

      window.addEventListener('hashchange', handleHashChange);
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
      };
    }, []);

    return hash;
  };

  const hash = useHash();

  const modules = [
    {
      icon: <CheckSquare className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />,
      title: "Appointment Management",
      description: "Book, view, and manage patient appointments with real-time updates.",
      action: () => setAppointmentModalOpen(true),
      id: "appointment"
    },
    {
      icon: <Users className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />,
      title: "Patient Management",
      description: "Electronic health records, patient history, and treatment plans in one secure location.",
      action: () => setPatientModalOpen(true),
      id: "patient"
    },
    {
      icon: <Stethoscope className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />,
      title: "Doctor & Staff Management",
      description: "Manage staff schedules, qualifications, specializations, and performance metrics.",
      action: () => setStaffModalOpen(true),
      id: "staff"
    },
    {
      icon: <Microscope className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />,
      title: "Laboratory Information",
      description: "Track and manage lab tests, results, and integrate with diagnostic equipment.",
      action: () => setLabModalOpen(true),
      id: "laboratory"
    },
    {
      icon: <Building2 className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />,
      title: "Ward & Bed Management",
      description: "Real-time monitoring of ward occupancy, bed availability, and patient assignments.",
      action: () => setWardBedModalOpen(true),
      id: "bed"
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />,
      title: "Inventory Management",
      description: "Track medical supplies, medications, and equipment with automated reordering.",
      action: () => setInventoryModalOpen(true),
      id: "inventory"
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />,
      title: "Billing & Insurance",
      description: "Streamlined billing processes, insurance claim management, and financial reporting.",
      id: "billing"
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />,
      title: "Vaccination Management",
      description: "Manage vaccination records and schedules.",
      id: "vaccination"
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />,
      title: "Report Management",
      description: "Generate and view various hospital reports.",
      id: "report"
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />,
      title: "Support Management",
      description: "Handle support requests and inquiries.",
      id: "support"
    },
    {
      icon: <Building2 className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />,
      title: "Facility Management",
      description: "Manage hospital facilities and infrastructure.",
      id: "facility"
    },
  ];

  const tabs = [
    { id: 'patients', name: 'Patients', icon: <Users className="h-6 w-6 text-gray-400" /> },
    { id: 'appointments', name: 'Appointments', icon: <Calendar className="h-6 w-6 text-gray-400" /> },
    { id: 'staff', name: 'Staff', icon: <User className="h-6 w-6 text-gray-400" /> },
    { id: 'labrecords', name: 'Lab Records', icon: <Microscope className="h-6 w-6 text-gray-400" /> },
    { id: 'wards', name: 'Wards', icon: <Building2 className="h-6 w-6 text-gray-400" /> },
    { id: 'inventory', name: 'Inventory', icon: <CheckSquare className="h-6 w-6 text-gray-400" /> },
  ];

  const filteredPatients = patients.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-20"
    >
      <section className="py-16 md:py-24 bg-gradient-to-b from-secondary-50 to-white dark:from-secondary-950 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {t('hospitalManagement.title')}
              </motion.h1>
              <motion.p
                className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t('hospitalManagement.subtitle')}
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <button className="btn-secondary">{t('hospitalManagement.scheduleDemo')}</button>
                <button className="bg-transparent border border-secondary-600 dark:border-secondary-400 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/30 py-2 px-4 rounded-md transition-colors duration-300">
                  {t('hospitalManagement.viewPricing')}
                </button>
              </motion.div>
            </div>
            <div className="lg:w-1/2">
              <motion.img
                src="https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Hospital Management" 
                className="rounded-xl shadow-lg w-full h-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('hospitalManagement.comprehensiveModules')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('hospitalManagement.modulesDescription')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * (index % 3) }}
                id={module.id}
              >
                <div className="bg-secondary-100 dark:bg-secondary-900/30 p-3 rounded-full w-fit mb-4">
                  {module.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {module.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {module.description}
                </p>
                {module.action ? (
                  <button onClick={module.action} className="mt-2 btn-secondary w-full">Add Record</button>
                ) : (
                  <Link
                    to={`/hospital-management#${module.id}`}
                    className="inline-flex items-center text-secondary-600 dark:text-secondary-400 font-medium hover:text-secondary-700 dark:hover:text-secondary-300 transition-colors duration-200"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {t('hospitalManagement.transformOperations')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                {t('hospitalManagement.transformDescription')}
              </p>

              <div className="space-y-4">
                {Object.values({
                  workload: t('hospitalManagement.benefits.workload'),
                  bedUtilization: t('hospitalManagement.benefits.bedUtilization'),
                  admissionSpeed: t('hospitalManagement.benefits.admissionSpeed'),
                  medicationErrors: t('hospitalManagement.benefits.medicationErrors'),
                  staffScheduling: t('hospitalManagement.benefits.staffScheduling')
                }).map((benefit: string, index: number) => (
                  <motion.div
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700 dark:text-gray-300">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Hospital Benefits" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary-600 dark:bg-secondary-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Optimize Your Hospital Operations?
            </motion.h2>
            <motion.p
              className="text-lg text-secondary-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join hundreds of hospitals improving efficiency and patient care with our system.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                to="/"
                className="bg-white text-secondary-600 hover:bg-secondary-50 py-2 px-6 rounded-md transition-colors duration-300 font-medium"
              >
                Request Demo
              </Link>
              <Link
                to="/"
                className="bg-transparent border border-white text-white hover:bg-secondary-700 dark:hover:bg-secondary-900 py-2 px-6 rounded-md transition-colors duration-300 font-medium"
              >
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <AppointmentModal open={appointmentModalOpen} onClose={() => setAppointmentModalOpen(false)} onSubmit={handleBookAppointment} />
      <PatientModal open={patientModalOpen} onClose={() => setPatientModalOpen(false)} onSubmit={handleAddPatient} />
      <StaffModal open={staffModalOpen} onClose={() => setStaffModalOpen(false)} onSubmit={handleAddStaff} />
      <LaboratoryModal open={labModalOpen} onClose={() => setLabModalOpen(false)} onSubmit={handleAddLabRecord} />
      <WardBedModal open={wardBedModalOpen} onClose={() => setWardBedModalOpen(false)} onSubmitWard={handleAddWard} onSubmitBed={handleAddBed} onSubmitPatientAssignment={handleAddPatientAssignment} />
      <InventoryModal open={inventoryModalOpen} onClose={() => setInventoryModalOpen(false)} onSubmitItem={handleAddInventoryItem} onSubmitSupplier={handleAddSupplier} onSubmitPurchaseOrder={handleCreatePurchaseOrder} onSubmitPurchaseOrderItem={handleAddPurchaseOrderItem} onSubmitInventoryTransaction={handleAddInventoryTransaction} />

      {appointments.length > 0 && (
        <section className="py-8">
          <h3 className="text-2xl font-bold text-center text-secondary-700 dark:text-secondary-300 mb-6">Recent Appointments</h3>
          <div className="overflow-x-auto">
            <motion.table initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Patient Name</th>
                  <th className="px-4 py-2">Age</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Mobile</th>
                  <th className="px-4 py-2">Blood Group</th>
                  <th className="px-4 py-2">Disease</th>
                  <th className="px-4 py-2">Timings</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a, idx) => (
                  <motion.tr key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors">
                    <td className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">{a.patientName}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{a.age}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{a.gender}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{a.mobileNo}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{a.bloodGroup}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{a.typeOfDisease}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{a.timings}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </section>
      )}

      {patients.length > 0 && (
        <section className="py-8">
          <h3 className="text-2xl font-bold text-center text-secondary-700 dark:text-secondary-300 mb-6">Recent Patients</h3>
          <div className="overflow-x-auto">
            <motion.table initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Patient Name</th>
                  <th className="px-4 py-2">Age</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Contact</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p, idx) => (
                  <motion.tr key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors">
                    <td className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">{p.patientName}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{p.age}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{p.gender}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{p.contact}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </section>
      )}

      {staff.length > 0 && (
        <section className="py-8">
          <h3 className="text-2xl font-bold text-center text-secondary-700 dark:text-secondary-300 mb-6">Recent Staff</h3>
          <div className="overflow-x-auto">
            <motion.table initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Mobile No.</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Department</th>
                  <th className="px-4 py-2">Qualification</th>
                  <th className="px-4 py-2">Experience</th>
                  <th className="px-4 py-2">Schedule</th>
                  <th className="px-4 py-2">Employment Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s, idx) => (
                  <motion.tr key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors">
                    <td className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">{s.name}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{s.role}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{s.mobileNo}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{s.email}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{s.department}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{s.qualification}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{s.experience}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{s.schedule}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{s.employmentStatus}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </section>
      )}

      {labRecords.length > 0 && (
        <section className="py-8">
          <h3 className="text-2xl font-bold text-center text-secondary-700 dark:text-secondary-300 mb-6">Recent Lab Records</h3>
          <div className="overflow-x-auto">
            <motion.table initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Patient ID</th>
                  <th className="px-4 py-2">Test Name</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Order Date</th>
                  <th className="px-4 py-2">Result Summary</th>
                </tr>
              </thead>
              <tbody>
                {labRecords.map((lr, idx) => (
                  <motion.tr key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors">
                    <td className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">{lr.patientId}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{lr.testName}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{lr.status}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{lr.orderDate}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{lr.resultSummary}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </section>
      )}


      {beds.length > 0 && (
        <section className="py-8">
          <h3 className="text-2xl font-bold text-center text-secondary-700 dark:text-secondary-300 mb-6">Recent Beds</h3>
          <div className="overflow-x-auto">
            <motion.table initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Ward ID</th>
                  <th className="px-4 py-2">Bed Number</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {beds.map((b, idx) => (
                  <motion.tr key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors">
                    <td className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">{b.WardID}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{b.BedNumber}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{b.Status}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </section>
      )}

      {patientAssignments.length > 0 && (
        <section className="py-8">
          <h3 className="text-2xl font-bold text-center text-secondary-700 dark:text-secondary-300 mb-6">Recent Patient Assignments</h3>
          <div className="overflow-x-auto">
            <motion.table initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Patient ID</th>
                  <th className="px-4 py-2">Ward ID</th>
                  <th className="px-4 py-2">Bed ID</th>
                  <th className="px-4 py-2">Admit Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {patientAssignments.map((pa, idx) => (
                  <motion.tr key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors">
                    <td className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">{pa.PatientID}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{pa.WardID}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{pa.BedID}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{pa.AdmitDate}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{pa.Status}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </section>
      )}

      {inventoryItems.length > 0 && (
        <section className="py-8">
          <h3 className="text-2xl font-bold text-center text-secondary-700 dark:text-secondary-300 mb-6">Recent Inventory Items</h3>
          <div className="overflow-x-auto">
            <motion.table initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Item Name</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Unit Price</th>
                  <th className="px-4 py-2">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((ii, idx) => (
                  <motion.tr key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors">
                    <td className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">{ii.itemName}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{ii.quantity}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{ii.unitPrice}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{ii.totalPrice}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </section>
      )}


      {purchaseOrders.length > 0 && (
        <section className="py-8">
          <h3 className="text-2xl font-bold text-center text-secondary-700 dark:text-secondary-300 mb-6">Recent Purchase Orders</h3>
          <div className="overflow-x-auto">
            <motion.table initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Supplier ID</th>
                  <th className="px-4 py-2">Order Date</th>
                  <th className="px-4 py-2">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po, idx) => (
                  <motion.tr key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors">
                    <td className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">{po.orderID}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{po.supplierID}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{po.orderDate}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{po.totalPrice}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </section>
      )}

      {purchaseOrderItems.length > 0 && (
        <section className="py-8">
          <h3 className="text-2xl font-bold text-center text-secondary-700 dark:text-secondary-300 mb-6">Recent Purchase Order Items</h3>
          <div className="overflow-x-auto">
            <motion.table initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Item ID</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrderItems.map((poi, idx) => (
                  <motion.tr key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors">
                    <td className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">{poi.orderID}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{poi.itemID}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{poi.quantity}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{poi.unitPrice}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </section>
      )}

      {inventoryTransactions.length > 0 && (
        <section className="py-8">
          <h3 className="text-2xl font-bold text-center text-secondary-700 dark:text-secondary-300 mb-6">Recent Inventory Transactions</h3>
          <div className="overflow-x-auto">
            <motion.table initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Transaction ID</th>
                  <th className="px-4 py-2">Item ID</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {inventoryTransactions.map((it, idx) => (
                  <motion.tr key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors">
                    <td className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">{it.transactionID}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{it.itemID}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{it.quantity}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{it.type}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </section>
      )}

    </motion.div>
  );
};

export default HospitalManagementPage;