// src/services/mercadopago.service.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

// === INTERFACES ===
export interface BattleRegistrationData {
  // Datos personales
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  whatsapp: string;
  
  // Categoría
  category: 'intermedio-male' | 'intermedio-female' | 'scaled-male' | 'scaled-female';
  
  // Contacto emergencia
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation?: string;
  
  // Médico
  medicalConditions?: string;
  medications?: string;
  
  // Waivers
  waiverAccepted: boolean;
  imageAuthorized?: boolean;
  
  // Pago
  amount: number;
}

export interface MercadoPagoPreference {
  id: string;
  init_point: string; // URL para redirigir al usuario
  sandbox_init_point: string; // URL de prueba
}

// === CREAR REGISTRO EN BACKEND ===
export const createBattleRegistration = async (
  data: BattleRegistrationData,
  token?: string
): Promise<{
  registration: any;
  message: string;
}> => {
  try {
    const headers: any = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.post(
      `${API_URL}/api/battle-registrations`,
      data,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error al crear registro:', error);
    throw error.response?.data || error;
  }
};

// === CREAR PREFERENCIA DE MERCADOPAGO ===
export const createPaymentPreference = async (
  registrationId: string,
  registrationData: {
    amount: number;
    title: string;
    description: string;
    payer: {
      name: string;
      surname: string;
      email: string;
      phone: string;
    };
  }
): Promise<MercadoPagoPreference> => {
  try {
    // Llamar a tu backend que tiene la llave privada
    const response = await axios.post(
      `${API_URL}/api/battle-registrations/create-payment`,
      {
        registrationId,
        ...registrationData
      }
    );

    return response.data.preference;
  } catch (error: any) {
    console.error('Error al crear preferencia de pago:', error);
    throw error.response?.data || error;
  }
};

// === VERIFICAR ESTADO DE PAGO ===
export const checkPaymentStatus = async (paymentId: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${API_URL}/api/battle-registrations/payment-status/${paymentId}`
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Error al verificar pago:', error);
    throw error.response?.data || error;
  }
};

// === HELPER: Inicializar SDK de MercadoPago (Frontend) ===
export const initMercadoPagoSDK = () => {
  return new Promise((resolve, reject) => {
    // Verificar si ya está cargado
    if ((window as any).MercadoPago) {
      resolve((window as any).MercadoPago);
      return;
    }

    // Cargar script
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    
    script.onload = () => {
      if (!MP_PUBLIC_KEY) {
        reject(new Error('MercadoPago Public Key no configurada'));
        return;
      }
      
      const mp = new (window as any).MercadoPago(MP_PUBLIC_KEY);
      resolve(mp);
    };
    
    script.onerror = () => {
      reject(new Error('Error al cargar MercadoPago SDK'));
    };
    
    document.head.appendChild(script);
  });
};

// === HELPER: Abrir checkout de MercadoPago ===
export const openMercadoPagoCheckout = (initPointUrl: string) => {
  try {
    // Redirección simple
    window.location.href = initPointUrl;
    
  } catch (error) {
    console.error('Error al abrir checkout:', error);
    throw error;
  }
};
// === HELPER: Obtener info de preferencia ===
const getPreferenceById = async (preferenceId: string): Promise<MercadoPagoPreference> => {
  try {
    const response = await axios.get(
      `${API_URL}/api/battle-registrations/preference/${preferenceId}`
    );
    return response.data.preference;
  } catch (error: any) {
    console.error('Error al obtener preferencia:', error);
    throw error.response?.data || error;
  }
};

// === OBTENER MIS REGISTROS ===
export const getMyBattleRegistrations = async (token: string): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/api/battle-registrations/my-registrations`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data.registrations;
  } catch (error: any) {
    console.error('Error al obtener registros:', error);
    throw error.response?.data || error;
  }
};

// === OBTENER TODOS LOS REGISTROS (Admin) ===
export const getAllBattleRegistrations = async (
  token: string,
  filters?: {
    category?: string;
    status?: string;
    paymentStatus?: string;
  }
): Promise<{
  registrations: any[];
  stats: any;
}> => {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);

    const response = await axios.get(
      `${API_URL}/api/battle-registrations/admin/all?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener registros admin:', error);
    throw error.response?.data || error;
  }
};