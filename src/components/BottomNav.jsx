import React from 'react';
import {NavLink} from 'react-router-dom';
import {LayoutDashboard,CalendarDays,Sparkles,Users,UserRound} from 'lucide-react';

const tabs=[['Home','/dashboard',LayoutDashboard],['Events','/events',CalendarDays],['Match','/assistant',Sparkles],['Teams','/teams',Users],['Profile','/profile',UserRound]];
export function BottomNav(){return <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[.07] bg-[#F6F3EE]/95 px-1 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl dark:border-white/[.08] dark:bg-[#151412]/95 md:hidden"><div className="mx-auto flex max-w-lg items-center justify-around">{tabs.map(([label,path,Icon])=><NavLink key={path} to={path} className={({isActive})=>`flex min-w-[56px] flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-semibold ${isActive?'text-[#141414] dark:text-white':'text-[#888176] dark:text-[#b9b2a7]'}`}><Icon size={19} strokeWidth={2}/><span>{label}</span></NavLink>)}</div></nav>;}
