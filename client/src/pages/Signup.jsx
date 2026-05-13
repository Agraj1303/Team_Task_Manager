import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Signup = () => {
  const { register: registerField, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const success = await register(data.name, data.email, data.password);
    if (success) {
      toast.success('Account created successfully!');
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      {/* Left Panel - Form */}
      <div className="flex flex-col justify-center flex-1 px-8 py-12 sm:px-12 lg:flex-none lg:w-[480px] xl:w-[560px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-10 relative">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm mx-auto lg:w-96"
        >
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
               <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Create an account
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Join your team and start managing tasks efficiently today.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative mt-2 rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <input 
                    type="text"
                    {...registerField('name')}
                    className="block w-full py-3 pl-10 pr-3 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white sm:text-sm transition-colors outline-none"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/>{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                <div className="relative mt-2 rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>
                  <input 
                    type="email"
                    {...registerField('email')}
                    className="block w-full py-3 pl-10 pr-3 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white sm:text-sm transition-colors outline-none"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/>{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative mt-2 rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <input 
                    type="password"
                    {...registerField('password')}
                    className="block w-full py-3 pl-10 pr-3 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white sm:text-sm transition-colors outline-none"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/>{errors.password.message}</p>}
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex items-center justify-center w-full px-4 py-3.5 text-sm font-bold text-white transition-all bg-gradient-to-r from-emerald-600 to-teal-600 border border-transparent rounded-xl shadow-md hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
                </button>
              </div>
            </form>
          </div>

          <p className="mt-10 text-sm text-center lg:text-left text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition-colors">
              Sign in instead
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Visuals */}
      <div className="relative hidden w-0 flex-1 lg:block bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-900/60 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-center"
          >
             <h1 className="text-5xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
              Empower your team to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                achieve greatness.
              </span>
            </h1>
            <p className="text-lg text-emerald-100/70 leading-relaxed max-w-xl mx-auto font-medium">
              TaskFlow gives your team the structure they need to succeed, without the overhead of complex project management tools.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
