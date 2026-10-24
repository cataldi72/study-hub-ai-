import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import './index.css'
import { Library, TopicPage } from './pages/Library'
import Calculator from './pages/Calculator'
import Notes from './pages/Notes'
import Login from './pages/Login'
import Tutor from './pages/Tutor'
const links = [['/', 'Início'], ['/biblioteca', 'Biblioteca'], ['/calculadora', 'Calculadora'], ['/notas', 'Caderno'], ['/tutor', 'Tutor IA'], ['/login', 'Conta']]
function App() {
  return <BrowserRouter><div className="min-h-screen md:flex">
    <nav className="md:w-52 bg-card border-r border-line p-3 flex md:flex-col gap-1 overflow-x-auto"><b className="px-2 py-1">StudyHub AI</b>
      {links.map(([to, l]) => <NavLink key={to} to={to} end className={({ isActive }) => `px-3 py-1 rounded ${isActive ? 'bg-brand' : 'hover:bg-line'}`}>{l}</NavLink>)}</nav>
    <main className="flex-1 p-6"><Routes><Route path="/" element={<div><h1 className="text-2xl font-bold">Bem-vindo ao StudyHub AI</h1><p className="text-slate-400">Escolha uma ferramenta no menu.</p></div>} />
      <Route path="/biblioteca" element={<Library />} /><Route path="/biblioteca/:id" element={<TopicPage />} /><Route path="/calculadora" element={<Calculator />} /><Route path="/notas" element={<Notes />} /><Route path="/tutor" element={<Tutor />} /><Route path="/login" element={<Login />} /></Routes></main></div></BrowserRouter>
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
