import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { register: registerField, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const success = await login(data.email, data.password);
    if (success) {
      toast.success('Welcome back!');
      navigate('/');
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
            <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Welcome back
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Please enter your credentials to access your workspace.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                <div className="relative mt-2 rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>
                  <input 
                    type="email"
                    {...registerField('email')}
                    className="block w-full py-3 pl-10 pr-3 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white sm:text-sm transition-colors outline-none"
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
                    className="block w-full py-3 pl-10 pr-3 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white sm:text-sm transition-colors outline-none"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/>{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700" />
                  <label htmlFor="remember-me" className="block ml-2 text-sm text-slate-700 dark:text-slate-300">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">Forgot password?</a>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex items-center justify-center w-full px-4 py-3.5 text-sm font-bold text-white transition-all bg-gradient-to-r from-indigo-600 to-violet-600 border border-transparent rounded-xl shadow-md hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
                </button>
              </div>
            </form>
          </div>

          <p className="mt-10 text-sm text-center lg:text-left text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Visuals */}
      <div className="relative hidden w-0 flex-1 lg:block bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-violet-900/60 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-center"
          >
            <div className="inline-flex items-center px-4 py-2 mb-8 text-sm font-semibold text-indigo-200 border border-indigo-500/30 rounded-full bg-indigo-900/30 backdrop-blur-md shadow-2xl">
              <span className="flex w-2 h-2 mr-2 bg-indigo-400 rounded-full animate-pulse"></span>
              TaskFlow v2.0 is now live
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
              Manage your team's work <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300">
                with unprecedented clarity.
              </span>
            </h1>
            <p className="text-lg text-indigo-100/70 leading-relaxed max-w-xl mx-auto font-medium">
              Join thousands of teams already using TaskFlow to streamline their projects, automate workflows, and hit their deadlines consistently.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
