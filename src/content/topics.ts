export type Topic = { id: string; subject: string; title: string; level: 'Básico'|'Médio'; explain: string; formulas: string[]; example: string; summary: string; mistakes: string;
  quiz: { q: string; options: string[]; answer: number; why: string }[] }
export const topics: Topic[] = [
 { id:'mat1', subject:'Matemática', title:'Equação do 2º grau', level:'Médio', explain:'Em ax²+bx+c=0 (a≠0), o discriminante Δ define quantas raízes reais existem.', formulas:['\\Delta=b^2-4ac','x=\\dfrac{-b\\pm\\sqrt{\\Delta}}{2a}'], example:'x²−5x+6=0 → Δ=1 → x=3 ou x=2.', summary:'Calcule Δ e aplique Bhaskara.', mistakes:'Errar o sinal de −b.',
   quiz:[{q:'Raízes de x²−7x+10=0:',options:['2 e 5','−2 e −5','1 e 10','3 e 4'],answer:0,why:'Δ=9; x=(7±3)/2.'}] },
 { id:'fis2', subject:'Física', title:'Leis de Newton', level:'Médio', explain:'A força resultante é massa vezes aceleração.', formulas:['F=m\\cdot a','P=m\\cdot g'], example:'m=5 kg, F=10 N → a=2 m/s².', summary:'F=ma; peso é força.', mistakes:'Achar que ação e reação se anulam.',
   quiz:[{q:'5 kg sob 10 N. Aceleração:',options:['50','2','5','0,5'],answer:1,why:'a=F/m=2.'}] },
 { id:'qui1', subject:'Química', title:'pH', level:'Médio', explain:'pH mede acidez: <7 ácida, 7 neutra, >7 básica.', formulas:['pH=-\\log[H^+]'], example:'[H⁺]=10⁻³ → pH=3.', summary:'Cada unidade = 10 vezes.', mistakes:'Ignorar a escala logarítmica.',
   quiz:[{q:'[H⁺]=10⁻³ mol/L. pH:',options:['3','−3','11','7'],answer:0,why:'−log(10⁻³)=3.'}] }
]
