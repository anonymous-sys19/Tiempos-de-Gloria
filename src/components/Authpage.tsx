import React from 'react'
import { motion } from 'framer-motion'
import AuthForm from './registro/AuthForm'

const AuthPage: React.FC = () => {
  return (

    <div>

    <div className="min-h-screen ">

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AuthForm />
      </motion.div>
    </div>
    </div>
  )
}

export default AuthPage