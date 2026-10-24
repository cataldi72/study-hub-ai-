import { useState } from 'react'
import { create, all } from 'mathjs'
const math = create(all)
export default function Calculator() {
  const [expr, setExpr] = useState(''); const [out, setOut] = useState(''); const [rad, setRad] = useState(false); const [hist, setHist] = useState<string[]>([])
  const k = rad ? 1 : Math.PI / 180
  const run = () => { try {
    const r = math.evaluate(expr.replace(/π/g, 'pi').replace(/√/g, 'sqrt'), { sin: (v: number) => Math.sin(v * k), cos: (v: number) => Math.cos(v * k), tan: (v: number) => Math.tan(v * k), asin: (v: number) => Math.asin(v) / k, acos: (v: number) => Math.acos(v) / k, atan: (v: number) => Math.atan(v) / k })
    const s = math.format(r, { precision: 12 }); setOut(s); setHist([`${expr} = ${s}`, ...hist].slice(0, 30)) } catch (e) { setOut('Expressão inválida') } }
  return <div className="max-w-xl"><h1 className="text-2xl font-bold mb-3">Calculadora</h1>
    <input aria-label="Expressão" value={expr} onChange={e => setExpr(e.target.value)} onKeyDown={e => e.key === 'Enter' && run()} placeholder="sin(30)+2^3/(1+1)" className="w-full bg-card border border-line rounded p-2" />
    <div className="bg-card border border-line rounded p-3 my-2 text-2xl min-h-12">{out}</div>
    <div className="flex gap-2"><button onClick={run} className="bg-brand rounded px-3 py-1">Calcular</button><button onClick={() => setRad(!rad)}>{rad ? 'Radianos' : 'Graus'}</button><button onClick={() => navigator.clipboard.writeText(out)}>Copiar</button></div>
    <ul className="mt-3 text-slate-400">{hist.map((h, i) => <li key={i}>{h}</li>)}</ul></div>
}
