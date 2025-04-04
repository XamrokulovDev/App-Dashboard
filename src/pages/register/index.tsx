import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../../store/regsiterSlice"
import type { AppDispatch, RootState } from "../../store"
import type { RegisterFormData } from "../../types"

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterFormData>({
    defaultValues: {
      gender: "MALE",
      maritalStatus: "single"
    }
  })

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  const [nationalities, setNationalities] = useState<string[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [policyAgree, setPolicyAgree] = useState<boolean>(false)
  const hasCar = watch("hasCar")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all")
        const data = await response.json()
        const countryNames = data.map((country: { name: { common: string } }) => country.name.common)
        setNationalities(countryNames)
        setCountries(countryNames)
      } catch (err) {
        console.error("Failed to fetch data:", err)
      }
    }

    fetchData()
  }, [])

  const onSubmit = async (data: RegisterFormData) => {
    if (!policyAgree) {
      alert("You must agree to the policy")
      return
    }

    // Name/surname "unknown" check
    if (data.name.toLowerCase() === "unknown" || data.surname.toLowerCase() === "unknown") {
      alert("Name and surname cannot be 'unknown'")
      return
    }

    try {
      const apiData = {
        name: data.name.trim(),
        surname: data.surname.trim(),
        patronymic: data.patronymic?.trim(),
        password: data.password,
        gender: data.gender,
        birthDate: data.birthday,
        nationality: data.nationality,
        placeOfBirth: data.placeOfBirth,
        address: data.address,
        maritalStatus: data.maritalStatus,
        ownsCar: data.hasCar,
        carNumber: data.hasCar ? data.carNumber?.trim() : undefined,
        phone: data.phone.trim(),
        secondaryPhone: data.secondaryPhone?.trim(),
        email: data.email?.trim()
      }

      const resultAction = await dispatch(registerUser(apiData))

      if (registerUser.fulfilled.match(resultAction)) {
        navigate("/")
      }
    } catch (err) {
      console.error("Registration failed", err)
    }
  }

  return (
    <div className="max-md:px-3">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-md shadow-md my-20 max-md:my-10 border border-gray-300">
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Name*</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
              {...register("name", { 
                required: "Name is required",
                validate: value => 
                  value.toLowerCase() !== "unknown" || "Name cannot be 'unknown'"
              })}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          {/* Surname */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Surname*</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
              {...register("surname", { 
                required: "Surname is required",
                validate: value => 
                  value.toLowerCase() !== "unknown" || "Surname cannot be 'unknown'"
              })}
            />
            {errors.surname && <p className="text-red-500 text-xs">{errors.surname.message}</p>}
          </div>

          {/* Patronymic */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Patronymic</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
              {...register("patronymic", {
                validate: value => 
                  !value || value.toLowerCase() !== "unknown" || "Patronymic cannot be 'unknown'"
              })}
            />
            {errors.patronymic && <p className="text-red-500 text-xs">{errors.patronymic.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Password*</label>
            <input
              type="password"
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
              {...register("password", { 
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
                maxLength: { value: 22, message: "Maximum 22 characters" }
              })}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Gender*</label>
            <select
              {...register("gender")}
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          {/* Birth Date */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Birth Date* (YYYY-MM-DD)</label>
            <input
              type="date"
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
              {...register("birthday", { 
                required: "Birth date is required",
                pattern: {
                  value: /^\d{4}-\d{2}-\d{2}$/,
                  message: "Use YYYY-MM-DD format"
                }
              })}
            />
            {errors.birthday && <p className="text-red-500 text-xs">{errors.birthday.message}</p>}
          </div>

          {/* Nationality */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Nationality*</label>
            <select
              {...register("nationality", { required: "Nationality is required" })}
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
            >
              <option value="">Select nationality</option>
              {nationalities.map((nation) => (
                <option key={nation} value={nation}>
                  {nation}
                </option>
              ))}
            </select>
            {errors.nationality && <p className="text-red-500 text-xs">{errors.nationality.message}</p>}
          </div>

          {/* Place of Birth */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Place of Birth</label>
            <select
              {...register("placeOfBirth")}
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Address</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
              {...register("address")}
            />
          </div>

          {/* Marital Status */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Marital Status</label>
            <select
              {...register("maritalStatus")}
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
            </select>
          </div>

          {/* Has Car */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              {...register("hasCar")}
            />
            <label className="text-lg">Has a car?</label>
          </div>

          {/* Car Number (conditionally shown) */}
          {hasCar && (
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Car Number</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
                {...register("carNumber")}
              />
            </div>
          )}

          {/* Phone (always required) */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Phone*</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
              {...register("phone", { required: "Phone is required" })}
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>

          {/* Secondary Phone */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Secondary Phone</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
              {...register("secondaryPhone")}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
              {...register("email")}
            />
          </div>

          {/* Policy Agreement */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={policyAgree}
              onChange={(e) => setPolicyAgree(e.target.checked)}
            />
            <label className="text-lg">I agree to the terms and conditions*</label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-full cursor-pointer px-4 py-2 rounded-md ${
                policyAgree 
                  ? "bg-blue-500 text-white hover:bg-blue-600" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!policyAgree || loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register