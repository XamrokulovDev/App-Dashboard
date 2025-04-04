"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../../store/regsiterSlice";
import type { AppDispatch, RootState } from "../../store";
import type { RegisterFormData } from "../../types"

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  const [hasCar, setHasCar] = useState<boolean>(false)
  const [nationalities, setNationalities] = useState<string[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [policyAgree, setPolicyAgree] = useState<boolean>(false)

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all")
        const data = await response.json()
        setNationalities(data.map((country: { name: { common: string } }) => country.name.common))
      } catch (err) {
        console.error("Failed to fetch nationalities:", err)
      }
    }

    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all")
        const data = await response.json()
        setCountries(data.map((country: { name: { common: string } }) => country.name.common))
      } catch (err) {
        console.error("Failed to fetch countries:", err)
      }
    }

    fetchNationalities()
    fetchCountries()
  }, [])

  const onSubmit = async (data: RegisterFormData) => {
    if (!policyAgree) return

    try {
      const apiData = {
        ...data,
        birthDate: data.birthday,
        ownsCar: data.hasCar,
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
          {[
            { label: "Name", name: "name", required: true },
            { label: "Surname", name: "surname", required: true },
            { label: "Patronymic", name: "patronymic", required: false },
            { label: "Birth Date", name: "birthday", required: true, type: "date" },
            { label: "Address", name: "address", required: false, type: "text" },
            { label: "Place of Birth", name: "placeOfBirth", required: false, type: "select" },
          ].map(({ label, name, required, type = "text" }) => (
            <div className="mb-4" key={name}>
              <label className="block text-lg font-medium text-gray-700">{label}</label>
              {type === "select" ? (
                <select
                  className="mt-1 p-2 w-full border border-gray-300 rounded outline-none"
                  {...register(name as keyof RegisterFormData, required ? { required: `${label} is required` } : {})}
                >
                  <option value="">Select country</option>
                  {name === "placeOfBirth" &&
                    countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                </select>
              ) : (
                <input
                  type={type}
                  className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
                  {...register(name as keyof RegisterFormData, required ? { required: `${label} is required` } : {})}
                />
              )}
              {errors[name as keyof RegisterFormData] && (
                <p className="text-red-500 text-xs">{errors[name as keyof RegisterFormData]?.message}</p>
              )}
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Gender</label>
            <select
              {...register("gender")}
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Nationality</label>
            <select
              {...register("nationality")}
              className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
            >
              <option value="">Select nationality</option>
              {nationalities.map((nation) => (
                <option key={nation} value={nation}>
                  {nation}
                </option>
              ))}
            </select>
          </div>

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

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              {...register("hasCar")}
              onChange={(e) => setHasCar(e.target.checked)}
            />
            <label className="text-lg">Has a car?</label>
          </div>

          {hasCar && (
            <>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Car Number</label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
                  {...register("carNumber")}
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
                  {...register("phone", { required: "Phone is required" })}
                />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Secondary Phone</label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
                  {...register("secondaryPhone")}
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="mt-1 p-2 w-full border border-gray-300 rounded outline-none py-2"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>
            </>
          )}

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={policyAgree}
              onChange={(e) => setPolicyAgree(e.target.checked)}
            />
            <label className="text-lg">I agree to the terms and conditions</label>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-full cursor-pointer px-4 py-2 rounded-md ${policyAgree ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
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