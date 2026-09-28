import React from 'react';
import { Sparkles, Code2, Palette, BrainCircuit, Users, CalendarDays, UserRound, Rocket, Server, Smartphone, Database, Lightbulb, Heart, Trophy, Bell, Mail, Search, Laptop, Wrench, Camera, Globe2 } from 'lucide-react';

const tones = {
  coral: { stops:['#f47769','#ffae62'], tile:'#FBE1D0' },
  green: { stops:['#389d71','#a8ca54'], tile:'#DCE8D6' },
  sky: { stops:['#3986b5','#48bbc3'], tile:'#D8E8F4' },
  amber: { stops:['#d2932e','#f1c94f'], tile:'#FBEEC3' },
  pink: { stops:['#df7188','#f2ae88'], tile:'#F8D9DF' },
  teal: { stops:['#168c8b','#a8ca54'], tile:'#DCE8D6' },
};
const icons = { Sparkles, Code2, Palette, BrainCircuit, Users, CalendarDays, UserRound, Rocket, Server, Smartphone, Database, Lightbulb, Heart, Trophy, Bell, Mail, Search, Laptop, Wrench, Camera, Globe2 };

/** Lucide icon in a soft tile, with a two-stop gradient stroke. */
export function GradientIcon({ name = 'Sparkles', tone = 'sky', size = 24, className = '', tileSize = 52, ...props }) {
  const Icon = icons[name] || Sparkles;
  const colors = tones[tone] || tones.sky;
  const id = `gradient-${tone}-${name}`;
  return <span className={`gradient-icon-tile ${className}`} style={{ width:tileSize, height:tileSize, backgroundColor:colors.tile }} {...props}>
    <Icon size={size} strokeWidth={1.8} style={{ stroke:`url(#${id})`, color:colors.stops[0] }} aria-hidden="true" />
    <svg width="0" height="0" aria-hidden="true" focusable="false"><defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={colors.stops[0]} /><stop offset="100%" stopColor={colors.stops[1]} /></linearGradient></defs></svg>
  </span>;
}
