export interface RegisterFormData {
    name: string
    surname: string
    patronymic: string
    password: string
    gender: string
    birthday: string
    nationality: string
    placeOfBirth: string
    address: string
    maritalStatus: string
    healthStatus?: string
    livingStandards?: string
    hasCar: boolean
    carNumber: string
    phone: string
    secondaryPhone: string
    email: string
  }
  
  export interface RootState {
    auth: {
      user: null | {
        id: string
        name: string
        surname: string
      }
      loading: boolean
      error: string | null
    }
  }
  