import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Users, Palette, Code2, BrainCircuit, CalendarDays, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { GradientIcon } from '../components/GradientIcon';
import { Button, Input } from '../components/ui';

const emailDomains=(import.meta.env.VITE_COLLEGE_EMAIL_DOMAINS || 'edu,ac.in').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
const passwordScore=(value)=>[value.length>=8,/[A-Z]/.test(value),/[a-z]/.test(value),/\d/.test(value),/[^A-Za-z0-9]/.test(value)].filter(Boolean).length;

export function AuthPage({ initialMode='login' }) {
  const [mode,setMode]=useState(initialMode);
  const [values,setValues]=useState({fullName:'',collegeName:'',major:'',email:'',password:''});
  const [errors,setErrors]=useState({});
  const [showPassword,setShowPassword]=useState(false);
  const [touched,setTouched]=useState({});
  const {login,register}=useAuth(); const {theme,toggleTheme}=useTheme(); const toast=useToast(); const navigate=useNavigate(); const location=useLocation();
  const strength=passwordScore(values.password);
  const validate=(field, value)=>{
    let error='';
    if(field==='email' && value){const at=value.lastIndexOf('@');const domain=value.slice(at+1).toLowerCase();if(at<1 || !domain.includes('.')) error='Enter a valid email address';else if(!emailDomains.some(suffix=>domain===suffix || domain.endsWith(`.${suffix}`))) error=`Use your college email (${emailDomains.map(x=>`.${x}`).join(' or ')})`;}
    if(field==='email'&&!value) error='Email is required';
    if(field==='password'&&!value) error='Password is required'; else if(field==='password'&&mode==='register'&&value.length<8) error='Use at least 8 characters';else if(field==='password'&&mode==='login'&&value.length<6) error='Use at least 6 characters';
    if(field==='fullName'&&mode==='register'&&!value.trim()) error='Your name is required';
    if(field==='collegeName'&&mode==='register'&&!value.trim()) error='Your college is required';
    return error;
  };
  const change=(field,value)=>{setValues(v=>({...v,[field]:value}));if(touched[field])setErrors(e=>({...e,[field]:validate(field,value)}));};
  const submit=async(e)=>{e.preventDefault();const fields=mode==='register'?['fullName','collegeName','email','password']:['email','password'];const next=Object.fromEntries(fields.map(f=>[f,validate(f,values[f])]));setTouched(Object.fromEntries(fields.map(f=>[f,true])));setErrors(next);if(Object.values(next).some(Boolean))return;const result=mode==='register'?await register(values):await login(values.email,values.password);if(!result.success){toast.error(result.error);return;}toast.success(mode==='register'?'Welcome to SkillSync!':'Welcome back!');navigate(mode==='register'?'/onboarding':(location.state?.from || '/dashboard'));};
  const switchMode=(next)=>{setMode(next);setErrors({});setTouched({});};
  const scoreLabel=['Add a few characters','Getting stronger','Good start','Almost there','Strong password','Excellent password'][strength];
  const collage=[['Code2','sky'],['Palette','amber'],['BrainCircuit','pink'],['Users','green'],['CalendarDays','coral']];
  return <div className="min-h-screen bg-[#F6F3EE] p-3 text-[#141414] dark:bg-[#151412] dark:text-[#f6f3ee] sm:p-5">
    <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1440px] overflow-hidden rounded-[34px] bg-white/55 dark:bg-white/[.035] lg:grid-cols-[.95fr_1.05fr]">
      <aside className="relative hidden overflow-hidden bg-[#DCE8D6] p-10 dark:bg-[#303a2d] lg:flex lg:flex-col lg:justify-between xl:p-14"><Link to="/" className="relative z-10 inline-flex w-fit items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#141414] text-white"><Sparkles size={18}/></span><span className="display-font text-xl font-extrabold">skill<span className="font-medium">sync</span></span></Link><div className="relative z-10 max-w-lg"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#607257] dark:text-[#d0dfc4]">Good ideas need good people</p><h1 className="editorial-title display-font mt-5 text-6xl font-extrabold xl:text-7xl">Your skills<br/>have a <span className="editorial-italic normal-case">next.</span></h1><p className="mt-6 max-w-md leading-7 text-[#5c6655] dark:text-[#d0dacd]">Find the events worth showing up for, then bring your kind of magic to the team.</p></div><div className="relative z-10 flex items-center justify-between"><p className="text-xs font-semibold text-[#65715e] dark:text-[#d0dfc4]">Make good things together.</p><div className="flex -space-x-3">{[1,2,3,4].map((n)=><img key={n} src={`https://i.pravatar.cc/100?img=${n+12}`} alt="" className="h-10 w-10 rounded-full border-[3px] border-[#DCE8D6] dark:border-[#303a2d]"/>)}</div></div>
        <motion.div animate={{rotate:[-3,2,-3],y:[0,-8,0]}} transition={{duration:7,repeat:Infinity,ease:'easeInOut'}} className="absolute right-[11%] top-[27%] grid h-52 w-52 place-items-center rounded-[42px] bg-[#FBE1D0] shadow-xl shadow-black/5 xl:right-[13%]"><div className="grid h-36 w-36 place-items-center rounded-full bg-[#F6F3EE]"><GradientIcon name="Sparkles" tone="coral" tileSize={92} size={42}/></div></motion.div>
        <div className="absolute bottom-[24%] right-[12%] grid grid-cols-3 gap-3">{collage.map(([name,tone])=><GradientIcon key={name} name={name} tone={tone} tileSize={55} size={23}/>)}</div>
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#FBEEC3] opacity-60 blur-3xl"/>
      </aside>
      <main className="flex min-h-[calc(100vh-24px)] flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between"><Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#625e56] hover:text-[#141414] dark:text-[#d0cbc2] dark:hover:text-white lg:hidden"><ArrowLeft size={16}/> Home</Link><Link to="/" className="hidden items-center gap-2 text-sm font-semibold text-[#625e56] hover:text-[#141414] dark:text-[#d0cbc2] dark:hover:text-white lg:inline-flex"><ArrowLeft size={16}/> Back to home</Link><div className="flex items-center gap-3"><span className="text-xs text-[#8a847a] dark:text-[#b9b2a7]">A space for student makers</span><button onClick={toggleTheme} aria-label={`Switch to ${theme==='dark'?'light':'dark'} mode`} className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">{theme==='dark'?<Sun size={17}/>:<Moon size={17}/>}</button></div></div>
        <div className="my-auto w-full max-w-md self-center py-10">
          <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8a847a]">{mode==='register'?'Your next team starts here':'Good to see you again'}</p><h2 className="display-font mt-3 text-4xl font-extrabold tracking-[-.06em]">{mode==='register'?'Create your account':'Welcome back'}</h2><p className="mt-3 text-sm leading-6 text-[#69645c] dark:text-[#c9c2b8]">{mode==='register'?'Make a profile, find an event, and meet your future teammates.':'Sign in to see your events, teams, and new matches.'}</p></div>
          <div className="mb-7 grid grid-cols-2 rounded-full bg-[#ebe7df] p-1 dark:bg-white/10"><button onClick={()=>switchMode('login')} className={`rounded-full py-2.5 text-sm font-semibold transition ${mode==='login'?'bg-white shadow-sm dark:bg-[#36342f]':''}`}>Log in</button><button onClick={()=>switchMode('register')} className={`rounded-full py-2.5 text-sm font-semibold transition ${mode==='register'?'bg-white shadow-sm dark:bg-[#36342f]':''}`}>Create account</button></div>
          <form onSubmit={submit} noValidate className="space-y-4">
            {mode==='register'&&<><Input label="Full name" autoComplete="name" value={values.fullName} onChange={e=>change('fullName',e.target.value)} onBlur={()=>{setTouched(t=>({...t,fullName:true}));setErrors(er=>({...er,fullName:validate('fullName',values.fullName)}));}} placeholder="Jordan Lee" error={touched.fullName&&errors.fullName}/><Input label="College or university" autoComplete="organization" value={values.collegeName} onChange={e=>change('collegeName',e.target.value)} onBlur={()=>{setTouched(t=>({...t,collegeName:true}));setErrors(er=>({...er,collegeName:validate('collegeName',values.collegeName)}));}} placeholder="Northstar Institute" error={touched.collegeName&&errors.collegeName}/><Input label="Major (optional)" value={values.major} onChange={e=>change('major',e.target.value)} placeholder="Computer Science"/> </>}
            <Input label="College email" type="email" autoComplete="email" value={values.email} onChange={e=>change('email',e.target.value)} onBlur={()=>{setTouched(t=>({...t,email:true}));setErrors(er=>({...er,email:validate('email',values.email)}));}} placeholder="you@university.edu" error={touched.email&&errors.email}/>
            <label className="block text-sm font-semibold text-[#33312d] dark:text-[#eee9e0]">Password<div className="relative mt-2"><input className={`auth-input pr-12 ${touched.password&&errors.password?'!border-[#b94848]':''}`} type={showPassword?'text':'password'} autoComplete={mode==='register'?'new-password':'current-password'} value={values.password} onChange={e=>change('password',e.target.value)} onBlur={()=>{setTouched(t=>({...t,password:true}));setErrors(er=>({...er,password:validate('password',values.password)}));}} placeholder="At least 8 characters"/><button type="button" onClick={()=>setShowPassword(x=>!x)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#777269]" aria-label={showPassword?'Hide password':'Show password'}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>{touched.password&&errors.password&&<span className="mt-1 block text-xs font-medium text-[#a23232] dark:text-[#ffb0a5]">{errors.password}</span>}{mode==='register'&&values.password&&<div className="mt-2"><div className="flex gap-1">{[1,2,3,4,5].map(i=><span key={i} className={`h-1 flex-1 rounded-full ${strength>=i?['bg-[#d96e60]','bg-[#e2a24c]','bg-[#dbbf59]','bg-[#76a06c]','bg-[#42826b]'][i-1]:'bg-black/10 dark:bg-white/15'}`}/>)}</div><span className="mt-1 block text-[11px] font-medium text-[#777269] dark:text-[#c9c2b8]">{scoreLabel}</span></div>}</label>
            <Button type="submit" className="mt-2 w-full" showArrow>{mode==='register'?'Create your account':'Log in'}</Button>
          </form>
          <p className="mt-5 text-center text-xs leading-5 text-[#858077] dark:text-[#b5aea3]">{mode==='register'?'By joining, you agree to be a good teammate and make something worthwhile.':'Your student community is right where you left it.'}</p>
        </div>
        <div className="flex justify-center gap-5 pb-4 text-[11px] text-[#918a80]"><span>Built for students</span><span>·</span><span>Made for collaboration</span></div>
      </main>
    </div>
  </div>;
}
