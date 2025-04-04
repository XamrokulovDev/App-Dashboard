export interface RegisterFormData {
  name: string
  surname: string
  patronymic?: string
  password: string
  gender: "MALE" | "FEMALE"
  birthday: string
  nationality: string
  placeOfBirth?: string
  address?: string
  maritalStatus?: "single" | "married" | "divorced"
  hasCar: boolean
  carNumber?: string
  phone: string
  secondaryPhone?: string
  email?: string
}