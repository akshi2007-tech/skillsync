import React from 'react';
import {NavLink} from 'react-router-dom';
import {LayoutDashboard,CalendarDays,Sparkles,Users,UserRound,Search} from 'lucide-react';
import {GradientIcon} from './GradientIcon';
import {Button,Card} from './ui';
import {useAuth} from '../context/AuthContext';

const navItems=[['Overview','/dashboard','LayoutDashboard','sky'],['Discover events','/events','CalendarDays','coral'],['Find teammates','/assistant','Sparkles','pink'],['My teams','/teams','Users','green'],['Student directory','/students','Search','amber'],['My profile','/profile','UserRound','teal']];
export function Sidebar(){
  const {user}=useAuth();const items=[...navItems];
  if(user?.role==='ORGANIZER'||user?.role==='ADMIN')items.push(['Organizer studio','/studio','CalendarDays','amber']);
  if(user?.role==='ADMIN')items.push(['Admin overview','/admin','Sparkles','green']);
  return <aside className="hidden w-[244px] shrink-0 flex-col border-r border-black/[.06] bg-[#F6F3EE] p-4 dark:border-white/[.08] dark:bg-[#151412] md:flex"><p className="px-3 pb-3 pt-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#928b81]">Workspace</p><nav className="space-y-1">{items.map(([label,path,icon,tone])=><NavLink key={path} to={path} className={({isActive})=>`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${isActive?'bg-white shadow-sm dark:bg-white/10':'text-[#69645c] hover:bg-white/70 hover:text-[#141414] dark:text-[#c9c2b8] dark:hover:bg-white/[.06] dark:hover:text-white'}`}><GradientIcon name={icon} tone={tone} size={17} tileSize={34}/>{label}</NavLink>)}</nav><div className="mt-auto"><Card color="butter" className="mt-8 p-4"><GradientIcon name="Sparkles" tone="amber" size={18} tileSize={38}/><h3 className="mt-4 text-sm font-extrabold">A teammate might be one click away.</h3><p className="mt-2 text-xs leading-5 text-[#686052] dark:text-[#ded2b6]">See who brings a missing skill to your next project.</p><NavLink to="/assistant" className="mt-4 flex"><Button className="!w-full !px-3 !py-2.5 !text-xs" showArrow>Explore matches</Button></NavLink></Card><p className="px-2 pt-5 text-[10px] text-[#928b81]">SkillSync · Make good things together</p></div></aside>;
}
