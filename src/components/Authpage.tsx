import React from 'react'
import { motion } from 'framer-motion'
import AuthForm from './registro/AuthForm'

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AuthForm />
      </motion.div>
    </div>
  )
}

export default AuthPage