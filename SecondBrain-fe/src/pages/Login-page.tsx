"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Brain, Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { BACKEND_URL } from "@/config"
import { useAuthStore } from "@/store/useAuthStore"



export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Login API call
      console.log("inside login page")
      const res = await axios.post(BACKEND_URL+"/api/v1/login",formData);

      console.log("res.data.braintoken : ",res.data.brainToken)

      const brainToken = res.data.brainToken
      const username = res.data.Username
      console.log("checking for braintoken : ",brainToken)
      console.log("checking for username : ",username)

      useAuthStore.getState().setUser(brainToken,username)
    

      console.log("inside login page : " + res.data);

     
      localStorage.setItem("brainToken",brainToken)

      localStorage.setItem("token",res.data.Authorization);
      window.location.href = "/dashboard"

    } catch (error) {
      console.error("Login error:", error)
      alert("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const popup = window.open("http://localhost:3000/auth/google", "_blank");

      const listener = (event: MessageEvent) => {
        if (event.origin !== "http://localhost:3000") return;
    
        const { token, brainToken } = event.data;
        if (token) {
          localStorage.setItem("token", token);
          window.location.href = "/dashboard";
        }
        if(brainToken){
          localStorage.setItem("brainToken",brainToken);
        }else{
          console.error("braintoken not provided...")
        }

    
        window.removeEventListener("message", listener);
        popup?.close();
      };
    
      window.addEventListener("message", listener);
  
    } catch (error) {
      console.error("Google login error:", error)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Message */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-8">
        <div className="text-center text-white space-y-6">
          <div className="flex justify-center">
            <Brain className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Welcome to the Brainly</h1>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <Separator />

            <Button
              type="button"
              variant="outline"
              className="w-full bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="text-center text-sm">
              {"Don't have an account? "}
              <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
