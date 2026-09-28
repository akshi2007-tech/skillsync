import axios from 'axios';
import * as mock from './mockData';

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', timeout: 12000, headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillsync_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const delay = (data) => new Promise(resolve => window.setTimeout(() => resolve({ data }), 180));
const student = () => { try { return JSON.parse(localStorage.getItem('skillsync_user') || 'null'); } catch { return null; } };
const saveUser = (value) => { localStorage.setItem('skillsync_user', JSON.stringify(value)); return value; };
const me = () => student() || mock.students[0];
let registrations = new Set();
let createdEvents = [...mock.events];
let invites = [...mock.invitations];
let createdTeams = [...mock.teams];
let messages = [];
const mockRequest = async (method, path, body = {}) => {
  const parts = path.split('/').filter(Boolean);
  let data;
  if (path === '/api/auth/login' || path === '/api/auth/register') {
    const email=(body.email||'').toLowerCase();
    const mockRole=email.startsWith('admin')?'ADMIN':email.startsWith('organizer')?'ORGANIZER':'STUDENT';
    const roleProfile=mockRole==='STUDENT'?null:{...mock.students[0],id:`mock-${mockRole.toLowerCase()}`,role:mockRole,email,fullName:mockRole==='ADMIN'?'Avery Admin':'Morgan Organizer'};
    const user = path.endsWith('register') ? { ...me(), ...body, id:`stu-${Date.now()}`, skills:body.skills || [], role:'STUDENT', profileCompleteness:35 } : (roleProfile || (email.startsWith('demo') ? mock.students[0] : mock.students.find(s=>s.email.toLowerCase()===email) || {...mock.students[0],email:body.email,fullName:body.email?.split('@')[0] || 'Student'}));
    localStorage.setItem('skillsync_token', `mock.${user.id}.${Date.now()}`); saveUser(user); data={token:localStorage.getItem('skillsync_token'),user};
  } else if (path === '/api/profile/me' && method === 'GET') data=me();
  else if (path === '/api/profile/me' && method === 'PUT') data=saveUser({...me(),...body});
  else if (parts[0] === 'api' && parts[1] === 'students' && parts.length === 3) data=mock.students.find(s=>s.id===parts[2]) || mock.students[0];
  else if (path === '/api/students') data=mock.students.filter(s=>!body.skill || s.skills.some(k=>k.skillName.toLowerCase()===body.skill.toLowerCase()));
  else if (path === '/api/events' && method === 'GET') data=createdEvents;
  else if (parts[1] === 'events' && parts.length === 3 && method === 'GET') data=createdEvents.find(e=>e.id===parts[2]) || createdEvents[0];
  else if (parts[1] === 'events' && parts[3] === 'register') { registrations.add(parts[2]); createdEvents=createdEvents.map(event=>event.id===parts[2]?{...event,registrations:(event.registrations||0)+1}:event); data={registered:true,eventId:parts[2]}; }
  else if (path === '/api/teams/mine') data=createdTeams.filter(t=>t.memberIds.includes(me().id) || t.id==='team-1' || t.id==='team-3');
  else if (path === '/api/teams' && method === 'POST') { const team={id:`team-${Date.now()}`,name:body.name || 'New team',eventId:body.eventId,eventName:mock.events.find(e=>e.id===body.eventId)?.title,status:'Forming',memberIds:[me().id,...(body.memberIds||[])],project:body.project||'',skillGaps:['Product Design']}; createdTeams=[team,...createdTeams]; data=team; }
  else if (parts[1] === 'teams' && parts[3] === 'recommendations') { const team=createdTeams.find(t=>t.id===parts[2])||mock.teams.find(t=>t.id===parts[2]); data=mock.recommendations(parts[2]).filter(candidate=>!team?.memberIds?.includes(candidate.id)); }
  else if (parts[1] === 'teams' && parts[3] === 'skill-gap') data={labels:['Frontend','Backend','AI / ML','Design','Data'],current:[4,2,1,1,2],required:[3,4,3,2,3]};
  else if (parts[1] === 'teams' && parts.length === 3) data=createdTeams.find(t=>t.id===parts[2]) || mock.teams[0];
  else if (path === '/api/invites/mine') data=invites;
  else if (path === '/api/invites' && method === 'POST') { const invite={id:`inv-${Date.now()}`,...body,status:'pending'}; invites=[invite,...invites]; data=invite; }
  else if (parts[1] === 'invites' && method === 'PUT') { invites=invites.map(i=>i.id===parts[2]?{...i,...body}:i); const invite=invites.find(i=>i.id===parts[2]); if(body.status==='accepted'&&invite?.teamId){createdTeams=createdTeams.map(team=>team.id===invite.teamId&&!team.memberIds.includes(me().id)?{...team,memberIds:[...team.memberIds,me().id]}:team);} data=invite; }
  else if (path === '/api/assistant/chat') { const text=body.message || ''; const reply=text.toLowerCase().includes('skill')?'Your team has a strong frontend base. Add someone with data or product design experience to round it out.':'I can help you find a team and explore upcoming events. What are you hoping to build?'; data={reply,recommendations:mock.recommendations().slice(0,2)}; messages=[...messages,{...body,reply}]; }
  else if (path === '/api/notifications') data=mock.notifications;
  else if (path === '/api/admin/analytics') data={signups:[24,38,31,54,49,72,86],registrations:[18,25,33,29,47,56,61],events:createdEvents.length,students:mock.students.length,teams:createdTeams.length};
  else if (parts[1] === 'events' && parts[3] === 'registrations') data=mock.students.slice(0,8);
  else if (path === '/api/events' && method === 'POST') { data={id:`evt-${Date.now()}`,registrations:0,...body}; createdEvents=[data,...createdEvents]; }
  else if (parts[1] === 'events' && method === 'PUT') { data={...createdEvents.find(e=>e.id===parts[2]),...body}; createdEvents=createdEvents.map(event=>event.id===parts[2]?data:event); }
  else data={ok:true};
  return delay(data);
};
const request = (method,path,data,config) => USE_MOCK ? mockRequest(method,path,data || {}) : api.request({method,url:path,data:method==='GET'?undefined:data,params:method==='GET'?data:undefined,...config});
export const authApi = { login:(data)=>request('POST','/api/auth/login',data), register:(data)=>request('POST','/api/auth/register',data) };
export const profileApi = { me:()=>request('GET','/api/profile/me'), update:(data)=>request('PUT','/api/profile/me',data) };
export const studentsApi = { list:(skill)=>request('GET','/api/students',{skill}), byId:(id)=>request('GET',`/api/students/${id}`) };
export const eventsApi = { list:()=>request('GET','/api/events'), byId:(id)=>request('GET',`/api/events/${id}`), register:(id,data)=>request('POST',`/api/events/${id}/register`,data), create:(data)=>request('POST','/api/events',data), update:(id,data)=>request('PUT',`/api/events/${id}`,data), registrations:(id)=>request('GET',`/api/events/${id}/registrations`) };
export const teamsApi = { create:(data)=>request('POST','/api/teams',data), mine:()=>request('GET','/api/teams/mine'), byId:(id)=>request('GET',`/api/teams/${id}`), recommendations:(id)=>request('GET',`/api/teams/${id}/recommendations`), skillGap:(id)=>request('GET',`/api/teams/${id}/skill-gap`) };
export const invitesApi = { create:(data)=>request('POST','/api/invites',data), update:(id,data)=>request('PUT',`/api/invites/${id}`,data), mine:()=>request('GET','/api/invites/mine') };
export const assistantApi = { chat:(data)=>request('POST','/api/assistant/chat',data) };
export const notificationsApi = { list:()=>request('GET','/api/notifications') };
export const adminApi = { analytics:()=>request('GET','/api/admin/analytics') };
