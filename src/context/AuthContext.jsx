import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, profileApi, USE_MOCK } from '../api/client';

const AuthContext = createContext(null);
const readUser = () => { try { return JSON.parse(localStorage.getItem('skillsync_user') || 'null'); } catch { return null; } };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [token, setToken] = useState(() => localStorage.getItem('skillsync_token') || '');
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('skillsync_token')));

  useEffect(() => {
    if (!token) { setUser(null); localStorage.removeItem('skillsync_user'); setLoading(false); return; }
    localStorage.setItem('skillsync_token', token);
    let active = true;
    profileApi.me().then(({data}) => { if(active) { setUser(data); localStorage.setItem('skillsync_user',JSON.stringify(data)); } }).catch(() => { if(active && !USE_MOCK) { setToken(''); localStorage.removeItem('skillsync_token'); } }).finally(() => { if(active) setLoading(false); });
    return () => { active=false; };
  }, [token]);

  const finishAuth = (data) => {
    const nextToken=data.token || `mock.${Date.now()}`;
    const nextUser=data.user || data.profile || data;
    localStorage.setItem('skillsync_token',nextToken);
    localStorage.setItem('skillsync_user',JSON.stringify(nextUser));
    setUser(nextUser); setToken(nextToken); return { success:true, data:nextUser };
  };
  const login = async (email,password) => { try { const {data}=await authApi.login({email,password}); return finishAuth(data); } catch(err) { return {success:false,error:err.response?.data?.message || err.message || 'Could not sign in'}; } };
  const register = async (userData) => { try { const {data}=await authApi.register(userData); return finishAuth(data); } catch(err) { return {success:false,error:err.response?.data?.message || err.message || 'Could not create your account'}; } };
  const updateProfile = async (updatedData) => { try { const {data}=await profileApi.update(updatedData); setUser(data); localStorage.setItem('skillsync_user',JSON.stringify(data)); return {success:true,data}; } catch(err) { if(!USE_MOCK) return {success:false,error:err.message}; const next={...user,...updatedData}; setUser(next); localStorage.setItem('skillsync_user',JSON.stringify(next)); return {success:true,data:next}; } };
  const logout=()=>{localStorage.removeItem('skillsync_token');localStorage.removeItem('skillsync_user');setToken('');setUser(null);};
  return <AuthContext.Provider value={{user,token,loading,login,register,logout,updateProfile,setUser}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
