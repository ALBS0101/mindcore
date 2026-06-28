import { useState, useRef, useEffect } from "react";
// Teasers dos 36 perfis (cliente). O relatório COMPLETO vem do servidor (getReport).
import { profiles } from "./profilesPreview.js";

/* Liga o fluxo de pagamento real (Mercado Pago). Enquanto false, usa o
   fluxo simulado — assim o app funciona antes do deploy das Cloud Functions. */
const PAGAMENTOS_ON = import.meta.env.VITE_PAYMENTS_ENABLED === "true";

const questions = [
  // Temperamento (5) + Inteligência (9) — cada inteligência aparece exatamente 4x
  { id:1, texto:"Em um grupo, você naturalmente:", opcoes:[{texto:"Assume a liderança e define o rumo",tipo:"colerico"},{texto:"Mantém a harmonia e evita conflitos",tipo:"fleumatico"},{texto:"Anima o ambiente e conecta as pessoas",tipo:"sanguineo"},{texto:"Observa, analisa e contribui com profundidade",tipo:"melancolico"}]},
  { id:2, texto:"Num projeto novo em grupo, qual papel você assume com mais naturalidade?", opcoes:[{texto:"Estruturar o plano, a lógica e os números por trás de tudo",tipo:"logica"},{texto:"Entender as pessoas do time e alinhar o que cada uma precisa",tipo:"interpessoal"},{texto:"Inventar o conceito e propor o que ninguém ainda pensou",tipo:"criativa"},{texto:"Sentir o ritmo do grupo e ajustar o tom para tudo fluir",tipo:"musical"}]},
  { id:3, texto:"O que você nota primeiro ao entrar num ambiente novo?", opcoes:[{texto:"O clima entre as pessoas — quem está conectado com quem",tipo:"interpessoal"},{texto:"As conversas: o que é dito e, principalmente, o que não é",tipo:"linguistica"},{texto:"O espaço físico e como meu corpo se sente nele",tipo:"corporal"},{texto:"Os padrões — o que se repete e o que está fora do lugar",tipo:"naturalista"}]},
  { id:4, texto:"Quando algo não sai como planejado, você:", opcoes:[{texto:"Recalcula e toma o controle da situação rapidamente",tipo:"colerico"},{texto:"Mantém a calma e espera o momento certo para agir",tipo:"fleumatico"},{texto:"Fala sobre isso e busca apoio",tipo:"sanguineo"},{texto:"Internaliza, analisa o que deu errado e sente o peso",tipo:"melancolico"}]},
  { id:5, texto:"Como você prefere dar forma a uma ideia que considera importante?", opcoes:[{texto:"Escrevendo ou falando, com as palavras exatas",tipo:"linguistica"},{texto:"Criando algo original que a traduza",tipo:"criativa"},{texto:"Pelo ritmo e pela cadência — por como aquilo 'soa'",tipo:"musical"},{texto:"Desenhando, mapeando, mostrando de forma visual",tipo:"espacial"}]},
  { id:6, texto:"O que mais te dá a sensação de 'isso faz sentido pra mim'?", opcoes:[{texto:"Criar algo que não existia antes",tipo:"criativa"},{texto:"Usar o corpo com maestria — fazer com as próprias mãos",tipo:"corporal"},{texto:"Entender como os sistemas e a natureza se conectam",tipo:"naturalista"},{texto:"Tocar nas questões profundas sobre o sentido das coisas",tipo:"existencial"}]},
  { id:7, texto:"Qual dessas frases mais representa você?", opcoes:[{texto:"Eu prefiro ser respeitado a ser querido",tipo:"colerico"},{texto:"Eu prefiro paz a ter razão",tipo:"fleumatico"},{texto:"Eu prefiro estar cercado de pessoas a estar sozinho",tipo:"sanguineo"},{texto:"Eu prefiro profundidade a popularidade",tipo:"melancolico"}]},
  { id:8, texto:"Qual habilidade as pessoas mais reconhecem em você?", opcoes:[{texto:"Destreza física, coordenação e presença",tipo:"corporal"},{texto:"Senso de ritmo e de timing",tipo:"musical"},{texto:"Visão espacial — enxergar como as coisas se encaixam",tipo:"espacial"},{texto:"Raciocínio lógico e capacidade de resolver problemas",tipo:"logica"}]},
  { id:9, texto:"O que te absorve a ponto de fazer você perder a noção do tempo?", opcoes:[{texto:"Música, ritmo e som",tipo:"musical"},{texto:"Observar a natureza, os animais, os padrões do mundo",tipo:"naturalista"},{texto:"Refletir sobre a vida, o universo e o sentido de tudo",tipo:"existencial"},{texto:"Uma conversa profunda com alguém",tipo:"interpessoal"}]},
  { id:10, texto:"Qual é sua maior fonte de energia?", opcoes:[{texto:"Conquistar metas e superar desafios",tipo:"colerico"},{texto:"Ambientes estáveis e relacionamentos seguros",tipo:"fleumatico"},{texto:"Interações sociais e novas conexões",tipo:"sanguineo"},{texto:"Tempo sozinho para pensar e criar",tipo:"melancolico"}]},
  { id:11, texto:"Diante de um problema complexo, qual é o seu instinto?", opcoes:[{texto:"Observar o sistema inteiro e como as partes se relacionam",tipo:"naturalista"},{texto:"Visualizar a solução como uma estrutura ou um mapa",tipo:"espacial"},{texto:"Quebrar em partes lógicas e resolver passo a passo",tipo:"logica"},{texto:"Colocar o problema em palavras para enxergá-lo melhor",tipo:"linguistica"}]},
  { id:12, texto:"O que você mais valoriza numa experiência marcante?", opcoes:[{texto:"A beleza visual e como o espaço foi organizado",tipo:"espacial"},{texto:"O significado mais profundo por trás dela",tipo:"existencial"},{texto:"As pessoas e as conexões que você criou ali",tipo:"interpessoal"},{texto:"A originalidade — algo que te surpreendeu",tipo:"criativa"}]},
  { id:13, texto:"No fundo, o que mais te move quando ninguém está olhando?", opcoes:[{texto:"A vontade de vencer e provar do que sou capaz",tipo:"colerico"},{texto:"O desejo de paz e de seguir no meu próprio ritmo",tipo:"fleumatico"},{texto:"A busca por emoção, novidade e pessoas",tipo:"sanguineo"},{texto:"A necessidade de dar sentido profundo ao que vivo",tipo:"melancolico"}]},
  { id:14, texto:"Quando você aprende algo novo, o que mais te motiva?", opcoes:[{texto:"Entender o 'porquê' último daquilo",tipo:"existencial"},{texto:"Dominar a lógica e a estrutura do assunto",tipo:"logica"},{texto:"Conseguir explicar e ensinar com clareza",tipo:"linguistica"},{texto:"Colocar a mão na massa e praticar de verdade",tipo:"corporal"}]}
];

function calcularPerfil(respostas) {
  const s = { logica:0,interpessoal:0,linguistica:0,criativa:0,corporal:0,musical:0,naturalista:0,espacial:0,existencial:0,colerico:0,fleumatico:0,sanguineo:0,melancolico:0 };
  respostas.forEach(r=>{ if(r&&s[r]!==undefined) s[r]++; });
  const iTop = ["logica","interpessoal","linguistica","criativa","corporal","musical","naturalista","espacial","existencial"].reduce((a,b)=>s[a]>=s[b]?a:b);
  const tTop = ["colerico","fleumatico","sanguineo","melancolico"].reduce((a,b)=>s[a]>=s[b]?a:b);
  const tN={colerico:"Colérico",fleumatico:"Fleumático",sanguineo:"Sanguíneo",melancolico:"Melancólico"};
  const iN={logica:"Lógica",interpessoal:"Interpessoal",linguistica:"Linguística",criativa:"Criativa",corporal:"Corporal",musical:"Musical",naturalista:"Naturalista",espacial:"Espacial",existencial:"Existencial"};
  return `${tN[tTop]}-${iN[iTop]}`;
}

function waitForJsPDF(timeout = 6000) {
  return new Promise((resolve, reject) => {
    if (window.jspdf) return resolve();
    const start = Date.now();
    const check = () => {
      if (window.jspdf) return resolve();
      if (Date.now() - start > timeout) return reject(new Error("jsPDF_timeout"));
      setTimeout(check, 100);
    };
    check();
  });
}

async function gerarPDF(perfil, perfilKey, nome) {
  await waitForJsPDF();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W=210, M=18, CW=W-M*2;
  let y=0;
  const hex2rgb = h=>{ const r=parseInt(h.slice(1),16); return [(r>>16)&255,(r>>8)&255,r&255]; };
  const [pr,pg,pb] = hex2rgb(perfil.cor);
  const addPage=()=>{ doc.addPage(); y=20; };
  const checkY=(need=20)=>{ if(y+need>275) addPage(); };
  const wrap=(t,w)=>doc.splitTextToSize(t,w);

  // CAPA
  doc.setFillColor(8,5,15); doc.rect(0,0,W,297,"F");
  doc.setFillColor(pr,pg,pb); doc.rect(0,0,5,297,"F");
  y=50;
  doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(pr,pg,pb);
  doc.text("MINDCODE  ·  SISTEMA DE AUTOCONHECIMENTO", M, y);
  doc.setDrawColor(pr,pg,pb); doc.setLineWidth(0.3); doc.line(M,y+4,W-M,y+4);
  y+=30;
  doc.setFont("helvetica","italic"); doc.setFontSize(36); doc.setTextColor(240,237,232);
  doc.text(perfil.nome, M, y); y+=14;
  doc.setFont("helvetica","normal"); doc.setFontSize(11); doc.setTextColor(pr,pg,pb);
  doc.text(perfilKey.toUpperCase(), M, y); y+=20;
  doc.setFont("helvetica","italic"); doc.setFontSize(13); doc.setTextColor(190,185,178);
  wrap(`"${perfil.frase}"`,CW).forEach(l=>{ doc.text(l,M,y); y+=8; });
  y+=14;
  doc.setFillColor(30,25,45); doc.roundedRect(M,y,CW,22,3,3,"F");
  doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(130,125,140);
  doc.text("Relatório gerado para", M+10, y+7);
  doc.setFont("helvetica","bold"); doc.setFontSize(13); doc.setTextColor(240,237,232);
  doc.text(nome||"Você", M+10, y+16);
  y=270; doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(60,55,70);
  doc.text("mindcode.app  ·  Perfil completo e exclusivo", M, y);

  const drawSection=(title,content,isArr=false)=>{
    checkY(32);
    doc.setFillColor(pr,pg,pb); doc.rect(M,y,3,14,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(pr,pg,pb);
    doc.text(title.toUpperCase(), M+8, y+5);
    doc.setDrawColor(40,35,55); doc.setLineWidth(0.15); doc.line(M+8,y+8,W-M,y+8);
    y+=18;
    if(isArr){ content.forEach(item=>{ checkY(14); doc.setFillColor(pr,pg,pb); doc.circle(M+3,y-1.5,1.1,"F"); doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(195,190,183); wrap(item,CW-10).forEach((l,i)=>{ if(i>0) checkY(7); doc.text(l,M+8,y); y+=6; }); y+=2; });
    } else { doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(195,190,183); wrap(content,CW).forEach(l=>{ checkY(7); doc.text(l,M,y); y+=6; }); }
    y+=8;
  };

  const pageHeader=()=>{ doc.setFillColor(8,5,15); doc.rect(0,0,W,297,"F"); doc.setFillColor(pr,pg,pb); doc.rect(0,0,5,297,"F"); doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(pr,pg,pb); doc.text("MINDCODE",M,y); doc.setFont("helvetica","normal"); doc.setTextColor(70,65,85); doc.text(`  ·  ${perfil.nome}`,M+22,y); doc.setDrawColor(25,20,35); doc.setLineWidth(0.15); doc.line(M,y+3,W-M,y+3); y+=14; };

  addPage(); pageHeader();
  doc.setFont("helvetica","italic"); doc.setFontSize(12); doc.setTextColor(pr,pg,pb);
  wrap(perfil.resumo,CW).forEach(l=>{ doc.text(l,M,y); y+=7; }); y+=10;

  // BASE TEÓRICA
  checkY(20);
  doc.setFillColor(pr,pg,pb); doc.rect(M,y,3,14,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(pr,pg,pb);
  doc.text("A ORIGEM DO SEU PERFIL", M+8, y+5);
  doc.setDrawColor(40,35,55); doc.setLineWidth(0.15); doc.line(M+8,y+8,W-M,y+8);
  y+=18;
  [["Seu temperamento — "+perfilKey.split("-")[0], perfil.base.arquetipo],
   ["Sua inteligência dominante — "+perfilKey.split("-")[1], perfil.base.inteligencia],
   ["Como eles se combinam em você", perfil.base.combinacao]
  ].forEach(([label,text])=>{
    checkY(14);
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(pr,pg,pb);
    doc.text(label.toUpperCase(), M, y); y+=7;
    doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(155,150,143);
    wrap(text,CW).forEach(l=>{ checkY(7); doc.text(l,M,y); y+=6; });
    y+=8;
  });
  y+=4;

  drawSection("Quem você é",perfil.descricao);
  drawSection("Indo mais fundo",perfil.descricao2);

  addPage(); pageHeader();
  drawSection("Seus pontos fortes",perfil.forcas,true);
  drawSection("Sua sombra — o que você evita ver",perfil.sombra,true);

  addPage(); pageHeader();
  drawSection("Você sob pressão",perfil.sobrePressao);
  drawSection("Seus pontos cegos",perfil.pontosCegos);
  drawSection("Você nos relacionamentos",perfil.relacoes);
  drawSection("Onde você prospera",perfil.carreiras,true);

  addPage(); pageHeader();
  drawSection("Fato sobre seu perfil",perfil.fatoCurioso);
  checkY(42);
  doc.setFillColor(pr,pg,pb); doc.setLineWidth(0.4); doc.setDrawColor(pr,pg,pb);
  doc.roundedRect(M,y,CW,38,3,3,"S");
  doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(pr,pg,pb); doc.text("PARA LEVAR",M+8,y+8);
  doc.setFont("helvetica","italic"); doc.setFontSize(10.5); doc.setTextColor(215,210,203);
  wrap(perfil.afirmacao,CW-16).forEach((l,i)=>{ doc.text(l,M+8,y+16+(i*7)); });
  y=268; doc.setDrawColor(25,20,35); doc.setLineWidth(0.15); doc.line(M,y,W-M,y); y+=5;
  doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(55,50,65);
  doc.text("mindcode.app  ·  Este relatório é pessoal e intransferível",M,y);
  if(nome) doc.text(nome,W-M,y,{align:"right"});

  doc.save(`MindCode_${perfil.nome.replace(/\s/g,"_")}_${(nome||"perfil").replace(/\s/g,"_")}.pdf`);
}

const Orb=({color,size,x,y,blur=120})=>(<div style={{position:"absolute",borderRadius:"50%",background:color,width:size,height:size,left:x,top:y,filter:`blur(${blur}px)`,opacity:"var(--orb-op)",pointerEvents:"none"}}/>);
const Sec=({title,cor,children})=>(<div style={{marginBottom:34}}><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}><div style={{width:3,height:16,background:cor,borderRadius:2,flexShrink:0}}/><h3 style={{fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--muted)",margin:0,fontWeight:700}}>{title}</h3></div>{children}</div>);
const bg={minHeight:"100vh",background:"var(--bg)",color:"var(--text)",position:"relative",overflow:"hidden",transition:"background 0.3s ease,color 0.3s ease"};

/* Paleta por temperamento (acentos do resultado) */
const TEMP_COLORS={"Colérico":"#EF4444","Sanguíneo":"#F59E0B","Melancólico":"#3B82F6","Fleumático":"#10B981"};
/* Paleta por inteligência (tags) */
const INTEL_COLORS={"Lógica":"#4F46E5","Espacial":"#06B6D4","Musical":"#8B5CF6","Corporal":"#F97316","Naturalista":"#22C55E","Linguística":"#EC4899","Interpessoal":"#0EA5E9","Existencial":"#312E81","Criativa":"#14B8A6"};

/* Ícones minimalistas de linha */
const LineIcon=({name,size=18,stroke=1.7})=>{
  const p={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:stroke,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"};
  if(name==="moon") return(<svg {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>);
  if(name==="sun") return(<svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>);
  if(name==="temperamento") return(<svg {...p}><path d="M12 2C9 5.5 7.5 8 7.5 11.5a4.5 4.5 0 0 0 9 0c0-1.7-.7-3.3-2-4.8-.9 1.6-1.8 1.8-2.6 1C11 6.4 11.4 4.3 12 2z"/></svg>);
  if(name==="inteligencia") return(<svg {...p}><path d="M12 3l1.7 4.1L18 9l-4.3 1.9L12 15l-1.7-4.1L6 9l4.3-1.9z"/><path d="M18 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>);
  if(name==="combinacao") return(<svg {...p}><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>);
  if(name==="download") return(<svg {...p}><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/></svg>);
  if(name==="lock") return(<svg {...p}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>);
  return null;
};

/* ─── Ícones oficiais das marcas (SVG) ─── */
const BrandIcon=({name,size=16})=>{
  if(name==="WhatsApp") return(
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#25D366" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.477-.999zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/></svg>
  );
  if(name==="Instagram") return(
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <defs><linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FED576"/><stop offset="26%" stopColor="#F47133"/><stop offset="61%" stopColor="#BC3081"/><stop offset="100%" stopColor="#4C63D2"/></linearGradient></defs>
      <path fill="url(#igGrad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.585 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.418 2.175 8.797 2.163 12 2.163zm0 1.802c-3.15 0-3.522.012-4.764.069-1.024.047-1.58.218-1.95.362-.49.19-.84.418-1.207.785-.367.367-.595.717-.785 1.207-.144.37-.315.926-.362 1.95-.057 1.242-.069 1.614-.069 4.764s.012 3.522.069 4.764c.047 1.024.218 1.58.362 1.95.19.49.418.84.785 1.207.367.367.717.595 1.207.785.37.144.926.315 1.95.362 1.242.057 1.614.069 4.764.069s3.522-.012 4.764-.069c1.024-.047 1.58-.218 1.95-.362.49-.19.84-.418 1.207-.785.367-.367.595-.717.785-1.207.144-.37.315-.926.362-1.95.057-1.242.069-1.614.069-4.764s-.012-3.522-.069-4.764c-.047-1.024-.218-1.58-.362-1.95-.19-.49-.418-.84-.785-1.207-.367-.367-.717-.595-1.207-.785-.37-.144-.926-.315-1.95-.362-1.242-.057-1.614-.069-4.764-.069zm0 3.064a4.971 4.971 0 110 9.942 4.971 4.971 0 010-9.942zm0 8.198a3.227 3.227 0 100-6.454 3.227 3.227 0 000 6.454zm6.323-8.392a1.162 1.162 0 11-2.324 0 1.162 1.162 0 012.324 0z"/>
    </svg>
  );
  if(name==="TikTok") return(
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path fill="#fff" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
  );
  // Copiar link — ícone de corrente/link
  return(
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
  );
};

export default function MindCode() {
  const [tela,setTela]=useState("intro");
  const [pergunta,setPergunta]=useState(0);
  const [respostas,setRespostas]=useState(Array(questions.length).fill(null));
  const [perfilKey,setPerfilKey]=useState(null);
  const [nome,setNome]=useState("");
  const [nomeInput,setNomeInput]=useState("");
  const [sel,setSel]=useState(null);
  const [anim,setAnim]=useState(false);
  const [pixOk,setPixOk]=useState(false);
  const [gerando,setGerando]=useState(false);
  const [copiado,setCopiado]=useState(null);
  const [tema,setTema]=useState(()=> (typeof document!=="undefined" && document.documentElement.getAttribute("data-theme")) || "light");
  // Pagamento real (Mercado Pago PIX)
  const [email,setEmail]=useState("");
  const [pix,setPix]=useState(null);          // { paymentId, qrCode, qrCodeBase64, ... }
  const [pixLoading,setPixLoading]=useState(false);
  const [pixErro,setPixErro]=useState(null);
  const [pagStatus,setPagStatus]=useState(null); // status vindo do Firestore
  // Relatório completo (vem do servidor após pagamento; fallback local no dev)
  const [report,setReport]=useState(null);
  const [reportErro,setReportErro]=useState(null);
  // Cartão (Mercado Pago Brick)
  const [metodo,setMetodo]=useState("pix");   // 'pix' | 'cartao'
  const [cardErro,setCardErro]=useState(null);
  const [cardMsg,setCardMsg]=useState(null);
  const brickRef=useRef(null);
  const top=useRef(null);
  const perfil=perfilKey?profiles[perfilKey]:null;
  const temperamento=perfilKey?perfilKey.split("-")[0]:null;
  const inteligencia=perfilKey?perfilKey.split("-")[1]:null;
  const cor=perfil?(TEMP_COLORS[temperamento]||"#6366F1"):"#6366F1";
  const intelCor=perfil?(INTEL_COLORS[inteligencia]||cor):cor;

  function toggleTema(){
    const novo = tema==="dark"?"light":"dark";
    setTema(novo);
    document.documentElement.setAttribute("data-theme",novo);
    try{ localStorage.setItem("mc-theme",novo); }catch(e){}
  }
  const themeToggle=(
    <button onClick={toggleTema} aria-label="Alternar tema claro e escuro" title="Alternar tema"
      style={{position:"fixed",top:16,right:16,zIndex:50,width:42,height:42,borderRadius:"50%",background:"var(--surface)",border:"1px solid var(--border)",color:"var(--muted)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"var(--shadow)"}}>
      <LineIcon name={tema==="dark"?"sun":"moon"} size={18}/>
    </button>
  );
  const prog=Math.round((respostas.filter(r=>r!==null).length/questions.length)*100);
  const ir=t=>{ setTela(t); setTimeout(()=>top.current?.scrollIntoView({behavior:"smooth"}),50); };

  function responder(tipo){
    if(anim) return; setSel(tipo); setAnim(true);
    const n=[...respostas]; n[pergunta]=tipo; setRespostas(n);
    setTimeout(()=>{ if(pergunta<questions.length-1){ setPergunta(p=>p+1); setSel(null); setAnim(false); } else { setPerfilKey(calcularPerfil(n)); ir("preview"); setAnim(false); } },380);
  }
  async function baixarPDF() {
    if (!report) return;
    setGerando(true);
    try {
      await gerarPDF(report, perfilKey, nome);
    } catch (e) {
      if (e.message === "jsPDF_timeout") {
        alert("Não foi possível carregar o gerador de PDF. Verifique sua conexão e recarregue a página.");
      } else {
        alert("Erro ao gerar PDF. Tente novamente.");
      }
    }
    setGerando(false);
  }

  // ─── Compartilhamento ───
  const linkSite = "https://mindcode.app";
  function compartilhar(rede) {
    const texto = perfil
      ? `Acabei de descobrir meu perfil no MindCode: ${perfil.nome} (${perfilKey}). "${perfil.frase}" Descubra o seu 👇`
      : "Descobri meu perfil no MindCode. Descubra o seu 👇";
    const full = `${texto} ${linkSite}`;
    const feedback = r => { setCopiado(r); setTimeout(() => setCopiado(null), 2500); };

    if (rede === "WhatsApp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(full)}`, "_blank", "noopener");
    } else if (rede === "Copiar link") {
      navigator.clipboard?.writeText(linkSite).catch(() => {});
      feedback(rede);
    } else {
      // Instagram e TikTok não aceitam texto pré-preenchido via web:
      // copiamos a legenda e abrimos o app/site para o usuário colar.
      navigator.clipboard?.writeText(full).catch(() => {});
      feedback(rede);
      const dest = rede === "Instagram" ? "https://www.instagram.com" : "https://www.tiktok.com";
      window.open(dest, "_blank", "noopener");
    }
  }

  // Monta o formulário de cartão (Brick do Mercado Pago) quando a aba Cartão abre.
  useEffect(()=>{
    if(!PAGAMENTOS_ON || tela!=="pagamento" || metodo!=="cartao") return;
    const pk = import.meta.env.VITE_MP_PUBLIC_KEY;
    if(!pk){ setCardErro("Pagamento por cartão ainda não configurado."); return; }
    let cancel=false; setCardErro(null); setCardMsg(null);
    (async()=>{
      try{
        const { carregarMpSdk, criarPagamentoCartao } = await import("./payment.js");
        await carregarMpSdk();
        if(cancel||!window.MercadoPago) return;
        const mp = new window.MercadoPago(pk,{ locale:"pt-BR" });
        const controller = await mp.bricks().create("cardPayment","mc-card-brick",{
          initialization:{ amount: 19.90 },
          callbacks:{
            onReady:()=>{ if(!cancel) setCardErro(null); },
            onError:(e)=>{ console.error("[MP cardPayment onError]", e); if(!cancel) setCardErro("Não foi possível carregar o formulário de cartão. Tente novamente."); },
            onSubmit:(fd)=> (async()=>{
              setCardErro(null); setCardMsg("Processando pagamento...");
              try{
                const d = await criarPagamentoCartao({
                  profileKey: perfilKey, nome,
                  email: fd.payer && fd.payer.email,
                  token: fd.token,
                  paymentMethodId: fd.payment_method_id,
                  installments: fd.installments,
                  identification: fd.payer && fd.payer.identification,
                });
                if(d.status==="approved"){ setPix({paymentId:d.paymentId}); setPagStatus("approved"); ir("resultado"); }
                else if(d.status==="in_process"||d.status==="pending"){ setCardMsg("Pagamento em análise. Você receberá a confirmação por e-mail."); }
                else { setCardMsg(null); setCardErro("Pagamento não aprovado. Verifique os dados ou tente outro cartão."); }
              }catch(e){ setCardMsg(null); setCardErro("Falha ao processar o cartão. Tente novamente."); }
            })(),
          },
        });
        brickRef.current = controller;
      }catch(e){ console.error("[MP cardPayment create]", e); if(!cancel) setCardErro("Não foi possível iniciar o pagamento por cartão. Recarregue a página."); }
    })();
    return ()=>{ cancel=true; try{ if(brickRef.current&&brickRef.current.unmount) brickRef.current.unmount(); }catch(e){} brickRef.current=null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[tela,metodo]);

  async function gerarPix(){
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ setPixErro("Digite um e-mail válido para enviar o acesso."); return; }
    setPixErro(null); setPixLoading(true);
    try{
      const { criarPagamentoPix } = await import("./payment.js");
      const data = await criarPagamentoPix({ profileKey: perfilKey, nome, email });
      setPix(data); setPagStatus(data.status||"pending");
    }catch(e){
      setPixErro("Não foi possível gerar o PIX agora. Tente novamente em instantes.");
    }
    setPixLoading(false);
  }
  // Ao chegar no resultado, busca o relatório completo (servidor ou fallback dev).
  useEffect(()=>{
    if(tela!=="resultado" || !perfilKey || report) return;
    let vivo=true;
    setReportErro(null);
    (async()=>{
      try{
        const { carregarRelatorio } = await import("./report.js");
        const r = await carregarRelatorio({ paymentId: pix?.paymentId || null, profileKey: perfilKey });
        if(vivo){ if(r) setReport(r); else setReportErro("Relatório indisponível."); }
      }catch(e){ if(vivo) setReportErro("Não foi possível carregar seu relatório. Recarregue a página."); }
    })();
    return ()=>{ vivo=false; };
  },[tela,perfilKey,report,pix]);

  // Escuta o status do pagamento; libera o resultado quando aprovado.
  useEffect(()=>{
    if(!PAGAMENTOS_ON || !pix?.paymentId) return;
    let unsub;
    (async()=>{
      const { observarPagamento } = await import("./payment.js");
      unsub = observarPagamento(pix.paymentId,(d)=>{
        if(!d) return;
        setPagStatus(d.status);
        if(d.status==="approved") ir("resultado");
      });
    })();
    return ()=>{ if(unsub) unsub(); };
  },[pix]);

  if(tela==="intro") return(
    <div style={bg} ref={top}>
      {themeToggle}
      <Orb color="#6366F1" size={500} x="-8%" y="-8%"/><Orb color="#8B5CF6" size={380} x="58%" y="28%"/><Orb color="#06B6D4" size={280} x="18%" y="68%"/>
      <div className="mc-pad" style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 24px",textAlign:"center"}}>
        <div style={{letterSpacing:"0.28em",fontSize:12,color:"var(--faint)",textTransform:"uppercase",marginBottom:18,fontWeight:600}}>Sistema de Autoconhecimento</div>
        <h1 style={{fontSize:"clamp(48px,9vw,84px)",fontWeight:800,letterSpacing:"-0.03em",margin:"0 0 10px",lineHeight:1}}><span style={{color:"var(--text)"}}>Mind</span><span style={{color:"var(--cta)"}}>Code</span></h1>
        <div style={{width:60,height:3,borderRadius:3,background:"linear-gradient(90deg,var(--cta),var(--cta-2))",margin:"20px auto 24px"}}/>
        <p style={{fontSize:"clamp(16px,2.3vw,20px)",color:"var(--muted)",maxWidth:520,lineHeight:1.7,margin:"0 0 44px"}}>Descubra o código único da sua mente — onde seu temperamento encontra sua inteligência dominante.</p>
        <div style={{display:"flex",gap:36,marginBottom:46,flexWrap:"wrap",justifyContent:"center"}}>
          {[["14","perguntas"],["36","perfis únicos"],["5","minutos"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}><div style={{fontSize:30,fontWeight:700,color:"var(--cta)",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{n}</div><div style={{fontSize:12,color:"var(--faint)",letterSpacing:"0.08em",marginTop:2}}>{l}</div></div>
          ))}
        </div>
        <button onClick={()=>ir("nome")} style={{background:"linear-gradient(135deg,var(--cta),var(--cta-2))",border:"none",color:"#fff",padding:"17px 52px",fontSize:16,letterSpacing:"0.02em",cursor:"pointer",borderRadius:12,fontWeight:600,boxShadow:"0 10px 30px rgba(99,102,241,0.35)"}}>Iniciar o Teste</button>
        <p style={{marginTop:22,fontSize:12,color:"var(--faint)"}}>Gratuito · Resultado disponível ao final</p>
      </div>
    </div>
  );

  if(tela==="nome") return(
    <div style={bg} ref={top}>
      {themeToggle}
      <Orb color="#6366F1" size={400} x="50%" y="0%" blur={160}/>
      <div className="mc-pad" style={{position:"relative",zIndex:1,maxWidth:520,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}>
        <div style={{fontSize:12,letterSpacing:"0.28em",color:"var(--faint)",textTransform:"uppercase",marginBottom:20,fontWeight:600}}>Antes de começar</div>
        <h2 style={{fontSize:"clamp(26px,5vw,38px)",fontWeight:700,margin:"0 0 14px",letterSpacing:"-0.02em"}}>Como posso te chamar?</h2>
        <p style={{color:"var(--muted)",fontSize:15,marginBottom:40,lineHeight:1.7}}>Seu nome tornará a análise mais pessoal — e o relatório PDF gerado ao final será personalizado para você.</p>
        <input type="text" value={nomeInput} onChange={e=>setNomeInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&nomeInput.trim()&&(setNome(nomeInput.trim()),ir("teste"))} placeholder="Digite seu primeiro nome..." autoFocus
          style={{width:"100%",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:"16px 20px",color:"var(--text)",fontSize:18,textAlign:"center",outline:"none",boxSizing:"border-box",marginBottom:28,boxShadow:"var(--shadow)"}}/>
        <button onClick={()=>{ if(nomeInput.trim()){ setNome(nomeInput.trim()); ir("teste"); }}} disabled={!nomeInput.trim()}
          style={{background:nomeInput.trim()?"linear-gradient(135deg,var(--cta),var(--cta-2))":"var(--surface-2)",border:nomeInput.trim()?"none":"1px solid var(--border)",color:nomeInput.trim()?"#fff":"var(--faint)",padding:"16px 52px",fontSize:15,letterSpacing:"0.02em",cursor:nomeInput.trim()?"pointer":"default",borderRadius:12,fontWeight:600,transition:"all 0.3s",marginBottom:16,display:"block",width:"100%",boxShadow:nomeInput.trim()?"0 10px 30px rgba(99,102,241,0.30)":"none"}}>
          Continuar
        </button>
        <button onClick={()=>{ setNome(""); ir("teste"); }} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer",fontSize:13}}>Continuar sem informar nome</button>
      </div>
    </div>
  );

  if(tela==="teste"){
    const q=questions[pergunta];
    return(
      <div style={bg} ref={top}>
        {themeToggle}
        <Orb color="#6366F1" size={380} x="-5%" y="5%" blur={150}/><Orb color="#8B5CF6" size={280} x="68%" y="55%" blur={150}/>
        <div className="mc-pad" style={{position:"relative",zIndex:1,maxWidth:680,margin:"0 auto",padding:"56px 24px 40px",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:44}}>
            <div style={{flex:1,height:6,borderRadius:6,background:"var(--track)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:6,background:"linear-gradient(90deg,var(--cta),var(--cta-2))",width:`${prog}%`,transition:"width 0.4s ease"}}/></div>
            <span style={{fontSize:12,color:"var(--faint)",whiteSpace:"nowrap",fontWeight:600}}>{pergunta+1} / {questions.length}</span>
          </div>
          {nome&&<div style={{fontSize:13,color:"var(--faint)",marginBottom:6}}>Olá, <span style={{color:"var(--muted)",fontWeight:600}}>{nome}</span></div>}
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <div style={{fontSize:12,letterSpacing:"0.22em",color:"var(--cta)",textTransform:"uppercase",marginBottom:18,fontWeight:700}}>Pergunta {pergunta+1}</div>
            <h2 style={{fontSize:"clamp(20px,2.8vw,26px)",fontWeight:700,lineHeight:1.45,marginBottom:30,letterSpacing:"-0.01em"}}>{q.texto}</h2>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {q.opcoes.map((op,i)=>(
                <button key={i} onClick={()=>responder(op.tipo)} style={{background:sel===op.tipo?"rgba(99,102,241,0.10)":"var(--surface)",border:sel===op.tipo?"1.5px solid var(--cta)":"1px solid var(--border)",color:"var(--text)",padding:"17px 20px",textAlign:"left",cursor:"pointer",fontSize:15,lineHeight:1.5,borderRadius:12,transition:"all 0.18s",opacity:anim&&sel!==op.tipo?0.35:1,boxShadow:sel===op.tipo?"0 6px 18px rgba(99,102,241,0.18)":"var(--shadow)",display:"flex",alignItems:"flex-start",gap:10}}
                  onMouseEnter={e=>{ if(!anim&&sel!==op.tipo){e.currentTarget.style.borderColor="var(--cta)";}}}
                  onMouseLeave={e=>{ if(sel!==op.tipo){e.currentTarget.style.borderColor="var(--border)";}}}
                ><span style={{color:"var(--cta)",fontWeight:700,flexShrink:0}}>{String.fromCharCode(65+i)}.</span>{op.texto}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(tela==="preview"&&perfil) return(
    <div style={bg} ref={top}>
      {themeToggle}
      <Orb color={cor} size={480} x="18%" y="-8%" blur={180}/><Orb color="#6366F1" size={280} x="-8%" y="55%"/>
      <div className="mc-pad" style={{position:"relative",zIndex:1,maxWidth:660,margin:"0 auto",padding:"60px 24px",textAlign:"center"}}>
        {nome&&<div style={{fontSize:13,color:"var(--faint)",marginBottom:8}}>Resultado de <span style={{color:"var(--muted)",fontWeight:600}}>{nome}</span></div>}
        <div style={{fontSize:12,letterSpacing:"0.24em",color:"var(--faint)",textTransform:"uppercase",marginBottom:16,fontWeight:600}}>Seu perfil foi identificado</div>
        <h2 style={{fontSize:"clamp(30px,6vw,50px)",fontWeight:800,margin:"0 0 14px",letterSpacing:"-0.02em"}}>{perfil.nome}</h2>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
          <span style={{padding:"5px 14px",borderRadius:999,background:`${cor}1A`,border:`1px solid ${cor}44`,color:cor,fontSize:12,letterSpacing:"0.04em",fontWeight:600}}>{temperamento}</span>
          <span style={{padding:"5px 14px",borderRadius:999,background:`${intelCor}1A`,border:`1px solid ${intelCor}44`,color:intelCor,fontSize:12,letterSpacing:"0.04em",fontWeight:600}}>{inteligencia}</span>
        </div>
        <p style={{fontSize:18,color:"var(--text)",lineHeight:1.6,marginBottom:12,fontWeight:500}}>“{perfil.frase}”</p>
        <p style={{fontSize:15,color:"var(--muted)",lineHeight:1.7,maxWidth:480,margin:"0 auto 38px"}}>{perfil.resumo}</p>
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:"26px 22px",marginBottom:34,textAlign:"left",boxShadow:"var(--shadow)"}}>
          <div style={{fontSize:12,color:"var(--muted)",marginBottom:14,letterSpacing:"0.04em",fontWeight:600}}>O relatório completo inclui:</div>
          <div className="mc-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 14px"}}>
            {["Quem você é — análise profunda","Indo mais fundo","Pontos fortes detalhados","Sua sombra","Você sob pressão","Pontos cegos","Você nos relacionamentos","Carreiras ideais","Fato único sobre seu perfil","Download PDF personalizado"].map(it=>(
              <div key={it} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"var(--faint)"}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:cor,flexShrink:0,opacity:0.55}}/><span style={{filter:"blur(2px)"}}>{it}</span>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:16,paddingTop:14,borderTop:"1px solid var(--border-2)",fontSize:12,color:"var(--faint)"}}>Conteúdo completo disponível após desbloqueio</div>
        </div>
        {/* ─── CHAMADA PERSUASIVA (PNL) ─── */}
        <div style={{marginBottom:30,textAlign:"left",maxWidth:540,marginLeft:"auto",marginRight:"auto"}}>
          <h3 style={{fontSize:"clamp(21px,3.4vw,28px)",fontWeight:700,color:"var(--text)",lineHeight:1.35,marginBottom:18,textAlign:"center",letterSpacing:"-0.02em"}}>
            {nome?`${nome}, você acabou de ver apenas a ponta do iceberg.`:"Você acabou de ver apenas a ponta do iceberg."}
          </h3>
          <p style={{fontSize:16,color:"var(--muted)",lineHeight:1.8,marginBottom:14}}>
            Tudo o que você sempre sentiu sobre si mesmo — mas nunca conseguiu colocar em palavras — está descrito, com precisão, no seu relatório completo. Não é horóscopo. É o mapa de como a sua mente realmente funciona.
          </p>
          <p style={{fontSize:16,color:"var(--muted)",lineHeight:1.8,marginBottom:14}}>
            <span style={{color:"var(--text)",fontWeight:600}}>Imagine</span> abrir esse documento e finalmente entender por que você reage do jeito que reage, onde está a sua maior força e qual é o ponto cego que vem te custando caro há anos. Quando você se enxerga com clareza, decisões que pareciam difíceis simplesmente se resolvem.
          </p>
          <p style={{fontSize:16,color:"var(--muted)",lineHeight:1.8}}>
            A maioria das pessoas atravessa a vida inteira sem nunca se conhecer de verdade. <span style={{color:"var(--text)",fontWeight:600}}>Você está a um clique de não ser uma delas.</span>
          </p>
        </div>

        <div style={{background:"var(--surface)",border:`1px solid ${cor}33`,borderRadius:16,padding:"30px 22px",marginBottom:16,boxShadow:"var(--shadow)"}}>
          <div style={{fontSize:12,letterSpacing:"0.14em",color:"var(--muted)",textTransform:"uppercase",marginBottom:12,fontWeight:600}}>Seu relatório completo · {perfil.nome}</div>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:10,marginBottom:6}}>
            <span style={{fontSize:16,color:"var(--faint)",textDecoration:"line-through"}}>R$ 47</span>
            <span style={{fontSize:40,fontWeight:800,color:"var(--cta)",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>R$ 19,90</span>
          </div>
          <div style={{fontSize:13,color:"var(--faint)",marginBottom:22}}>pagamento único · acesso imediato + PDF personalizado para {nome||"você"}</div>
          <button onClick={()=>ir("pagamento")} style={{background:"linear-gradient(135deg,var(--cta),var(--cta-2))",border:"none",color:"#fff",padding:"17px 44px",fontSize:16,letterSpacing:"0.01em",cursor:"pointer",borderRadius:12,width:"100%",fontWeight:600,boxShadow:"0 10px 30px rgba(99,102,241,0.35)"}}>Quero Conhecer Minha Mente Agora</button>
          <div style={{fontSize:12,color:"var(--faint)",marginTop:14,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><LineIcon name="lock" size={13}/> Compra 100% segura · Você recebe o acesso na hora</div>
        </div>
        <p style={{fontSize:12,color:"var(--faint)"}}>Menos que um café por semana — por algo que você leva para o resto da vida.</p>
      </div>
    </div>
  );

  if(tela==="pagamento") return(
    <div style={bg} ref={top}>
      {themeToggle}
      <Orb color="#6366F1" size={380} x="48%" y="-2%" blur={180}/>
      <div className="mc-pad" style={{position:"relative",zIndex:1,maxWidth:460,margin:"0 auto",padding:"60px 24px",textAlign:"center"}}>
        <button onClick={()=>ir("preview")} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer",fontSize:13,marginBottom:28}}>← Voltar</button>
        <div style={{fontSize:12,letterSpacing:"0.24em",color:"var(--faint)",textTransform:"uppercase",marginBottom:18,fontWeight:600}}>Último passo</div>
        <h2 style={{fontSize:"clamp(24px,4.5vw,32px)",fontWeight:700,marginBottom:14,lineHeight:1.3,letterSpacing:"-0.02em"}}>{nome?`${nome}, seu relatório já está pronto.`:"Seu relatório já está pronto."}</h2>
        <p style={{color:"var(--muted)",fontSize:15,lineHeight:1.75,marginBottom:30,maxWidth:400,marginLeft:"auto",marginRight:"auto"}}>Falta só um PIX para você desbloquear tudo o que descobrimos sobre a sua mente. Em segundos, ele estará na sua tela — e você não vai mais olhar para si mesmo da mesma forma.</p>
        <div style={{fontSize:12,letterSpacing:"0.2em",color:"var(--faint)",textTransform:"uppercase",marginBottom:8,fontWeight:600}}>Pague com PIX</div>
        <p style={{color:"var(--faint)",fontSize:13,marginBottom:26}}>Aprovação imediata · 100% seguro · Sem cadastro</p>

        {PAGAMENTOS_ON ? (
          /* ─── FLUXO REAL · Mercado Pago ─── */
          <>
          <div style={{display:"flex",gap:8,marginBottom:18,background:"var(--surface-2)",border:"1px solid var(--border-2)",borderRadius:12,padding:4}}>
            {[["pix","PIX"],["cartao","Cartão"]].map(([m,l])=>(
              <button key={m} onClick={()=>setMetodo(m)} style={{flex:1,padding:"10px 0",borderRadius:9,border:"none",cursor:"pointer",fontSize:14,fontWeight:600,background:metodo===m?"var(--surface)":"transparent",color:metodo===m?"var(--cta)":"var(--muted)",boxShadow:metodo===m?"var(--shadow)":"none"}}>{l}</button>
            ))}
          </div>
          {metodo==="pix" ? (
          !pix ? (
            <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:"26px 22px",marginBottom:20,boxShadow:"var(--shadow)"}}>
              <div style={{fontSize:32,fontWeight:800,color:"var(--cta)",marginBottom:4,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>R$ 19,90</div>
              <div style={{fontSize:12,color:"var(--faint)",marginBottom:18}}>MindCode · {nome||"Autoconhecimento"}</div>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu melhor e-mail para o acesso" inputMode="email" autoComplete="email"
                style={{width:"100%",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px",color:"var(--text)",fontSize:15,outline:"none",boxSizing:"border-box",marginBottom:12}}/>
              {pixErro&&<div style={{fontSize:13,color:"#EF4444",marginBottom:12}}>{pixErro}</div>}
              <button onClick={gerarPix} disabled={pixLoading} style={{background:pixLoading?"var(--surface-2)":"linear-gradient(135deg,var(--cta),var(--cta-2))",border:pixLoading?"1px solid var(--border)":"none",color:pixLoading?"var(--faint)":"#fff",padding:"15px 22px",fontSize:15,cursor:pixLoading?"default":"pointer",borderRadius:10,width:"100%",fontWeight:600}}>
                {pixLoading?"Gerando PIX...":"Gerar PIX e pagar"}
              </button>
              <p style={{fontSize:11,color:"var(--faint)",marginTop:12,lineHeight:1.6}}>Enviaremos a confirmação e o acesso para o seu e-mail. Pagamento processado pelo Mercado Pago.</p>
            </div>
          ) : (
            <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:28,marginBottom:20,boxShadow:"var(--shadow)"}}>
              {pix.qrCodeBase64&&(
                <div style={{background:"#fff",padding:14,borderRadius:12,display:"inline-block",marginBottom:18,boxShadow:"0 2px 10px rgba(15,23,42,0.10)"}}>
                  <img src={`data:image/png;base64,${pix.qrCodeBase64}`} alt="QR Code PIX" width={170} height={170} style={{display:"block",borderRadius:6}}/>
                </div>
              )}
              <div style={{fontSize:32,fontWeight:800,color:"var(--cta)",marginBottom:4,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>R$ 19,90</div>
              <div style={{fontSize:12,color:"var(--faint)",marginBottom:16}}>Escaneie o QR ou use o copia-e-cola</div>
              <button onClick={()=>{ if(pix.qrCode){navigator.clipboard.writeText(pix.qrCode).catch(()=>{}); setPixOk(true); setTimeout(()=>setPixOk(false),3000);} }} style={{background:"rgba(99,102,241,0.10)",border:"1px solid rgba(99,102,241,0.30)",color:"var(--cta)",padding:"12px 22px",fontSize:13,cursor:"pointer",borderRadius:10,width:"100%",fontWeight:600,marginBottom:14}}>
                {pixOk?"✓ Código copiado!":"Copiar código PIX (copia-e-cola)"}
              </button>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:13,color:pagStatus==="approved"?"#10B981":"var(--muted)"}}>
                {pagStatus==="approved"
                  ? <span>✓ Pagamento aprovado! Liberando seu resultado...</span>
                  : (pagStatus==="rejected"||pagStatus==="cancelled")
                    ? <span style={{color:"#EF4444"}}>Pagamento não aprovado. <button onClick={()=>{setPix(null);setPagStatus(null);}} style={{background:"none",border:"none",color:"var(--cta)",cursor:"pointer",fontSize:13,textDecoration:"underline"}}>Tentar de novo</button></span>
                    : <><span style={{width:9,height:9,borderRadius:"50%",background:"#F59E0B",display:"inline-block"}}/> Aguardando confirmação do pagamento...</>}
              </div>
            </div>
          )
          ) : (
            /* ─── CARTÃO (Brick do Mercado Pago) ─── */
            <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:"22px 20px",marginBottom:20,boxShadow:"var(--shadow)"}}>
              <div style={{fontSize:32,fontWeight:800,color:"var(--cta)",marginBottom:14,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>R$ 19,90</div>
              <div id="mc-card-brick"/>
              {cardMsg&&<div style={{fontSize:13,color:"var(--muted)",marginTop:12}}>{cardMsg}</div>}
              {cardErro&&<div style={{fontSize:13,color:"#EF4444",marginTop:12}}>{cardErro}</div>}
            </div>
          )}
          </>
        ) : (
          /* ─── FLUXO SIMULADO (até deploy das Functions) ─── */
          <>
            <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:28,marginBottom:20,boxShadow:"var(--shadow)"}}>
              <div style={{background:"#fff",padding:14,borderRadius:12,display:"inline-block",marginBottom:18,boxShadow:"0 2px 10px rgba(15,23,42,0.10)"}}>
                <div style={{width:150,height:150,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:6}}>
                  <svg width="120" height="120" viewBox="0 0 120 120">{[...Array(6)].map((_,r)=>[...Array(6)].map((_,c)=>(<rect key={`${r}-${c}`} x={c*20} y={r*20} width={18} height={18} fill={(r+c)%3===0?"#111":"transparent"} rx={1}/>)))}</svg>
                </div>
              </div>
              <div style={{fontSize:32,fontWeight:800,color:"var(--cta)",marginBottom:4,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>R$ 19,90</div>
              <div style={{fontSize:12,color:"var(--faint)",marginBottom:18}}>MindCode · {nome||"Autoconhecimento"}</div>
              <button onClick={()=>{ navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136mindcode@email.com.br520400005303986580 2BR5925MindCode6009SAOPAULO62070503***6304ABCD").catch(()=>{}); setPixOk(true); setTimeout(()=>setPixOk(false),3000); }} style={{background:"rgba(99,102,241,0.10)",border:"1px solid rgba(99,102,241,0.30)",color:"var(--cta)",padding:"12px 22px",fontSize:13,cursor:"pointer",borderRadius:10,width:"100%",fontWeight:600}}>
                {pixOk?"✓ Código copiado!":"Copiar código PIX"}
              </button>
            </div>
            <div style={{background:"var(--surface-2)",border:"1px solid var(--border-2)",borderRadius:12,padding:"18px 22px",marginBottom:22,textAlign:"left",fontSize:13,color:"var(--muted)",lineHeight:2}}>
              <div>1. Abra o app do seu banco</div><div>2. Escolha pagar com PIX</div><div>3. Escaneie o QR ou cole o código</div><div>4. Confirme o pagamento de R$ 19,90</div>
            </div>
            <button onClick={()=>{ ir("resultado"); }} style={{background:"linear-gradient(135deg,#10B981,#059669)",border:"none",color:"#fff",padding:"17px 44px",fontSize:16,letterSpacing:"0.01em",cursor:"pointer",borderRadius:12,width:"100%",fontWeight:600,boxShadow:"0 10px 30px rgba(16,185,129,0.32)"}}>Já paguei · Liberar meu resultado</button>
          </>
        )}

        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginTop:24,marginBottom:24,fontSize:12,color:"var(--faint)"}}>
          <span>✓ Acesso imediato</span><span style={{color:"var(--ghost)"}}>·</span><span>✓ PDF para sempre</span><span style={{color:"var(--ghost)"}}>·</span><span>✓ Pagamento único</span>
        </div>
        <p style={{fontSize:13,color:"var(--faint)"}}>O autoconhecimento é a única decisão que você nunca se arrepende de tomar.</p>
      </div>
    </div>
  );

  if(tela==="resultado"&&perfil) return(
    <div style={bg} ref={top}>
      {themeToggle}
      <Orb color={cor} size={580} x="8%" y="-4%" blur={200}/><Orb color="#6366F1" size={380} x="58%" y="48%" blur={150}/>
      <div className="mc-pad" style={{position:"relative",zIndex:1,maxWidth:720,margin:"0 auto",padding:"60px 24px 80px"}}>
        <div style={{textAlign:"center",marginBottom:50}}>
          <div style={{fontSize:12,letterSpacing:"0.24em",color:"var(--faint)",textTransform:"uppercase",marginBottom:14,fontWeight:600}}>MindCode · Perfil Completo</div>
          {nome&&<div style={{fontSize:14,color:"var(--faint)",marginBottom:14}}>Análise de <span style={{color:"var(--muted)",fontWeight:600}}>{nome}</span></div>}
          <h1 style={{fontSize:"clamp(34px,6vw,58px)",fontWeight:800,margin:"0 0 16px",letterSpacing:"-0.02em"}}>{perfil.nome}</h1>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
            <span style={{padding:"6px 16px",borderRadius:999,background:`${cor}1A`,border:`1px solid ${cor}44`,color:cor,fontSize:12,letterSpacing:"0.04em",fontWeight:600}}>{temperamento}</span>
            <span style={{padding:"6px 16px",borderRadius:999,background:`${intelCor}1A`,border:`1px solid ${intelCor}44`,color:intelCor,fontSize:12,letterSpacing:"0.04em",fontWeight:600}}>{inteligencia}</span>
          </div>
          <p style={{fontSize:"clamp(16px,2.3vw,19px)",color:"var(--text)",lineHeight:1.6,maxWidth:540,margin:"0 auto 10px",fontWeight:500}}>“{perfil.frase}”</p>
          <p style={{fontSize:15,color:"var(--muted)",maxWidth:480,margin:"0 auto",lineHeight:1.7}}>{perfil.resumo}</p>
        </div>

        {!report ? (
          <div style={{textAlign:"center",padding:"50px 20px"}}>
            {reportErro
              ? <p style={{color:"#EF4444",fontSize:15,lineHeight:1.7}}>{reportErro}</p>
              : <p style={{color:"var(--muted)",fontSize:15}}>Preparando seu relatório completo…</p>}
          </div>
        ) : (<>
        {/* BASE TEÓRICA */}
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:18,padding:"28px 26px",marginBottom:36,boxShadow:"var(--shadow)"}}>
          <div style={{fontSize:12,letterSpacing:"0.2em",color:"var(--muted)",textTransform:"uppercase",marginBottom:22,fontWeight:700}}>A origem do seu perfil</div>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {[["temperamento",cor,`Seu temperamento — ${temperamento}`,report.base.arquetipo],
              ["inteligencia",intelCor,`Sua inteligência dominante — ${inteligencia}`,report.base.inteligencia],
              ["combinacao","#6366F1","Como eles se combinam em você",report.base.combinacao]].map(([ic,c,label,texto],idx)=>(
              <div key={ic}>
                {idx>0&&<div style={{height:1,background:"var(--border-2)",marginBottom:20}}/>}
                <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:10}}>
                  <div style={{width:30,height:30,borderRadius:9,background:`${c}18`,border:`1px solid ${c}38`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:c}}>
                    <LineIcon name={ic} size={16}/>
                  </div>
                  <span style={{fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",color:c,fontWeight:700}}>{label}</span>
                </div>
                <p style={{fontSize:15,lineHeight:1.8,color:"var(--muted)",margin:0,paddingLeft:41}}>{texto}</p>
              </div>
            ))}
          </div>
        </div>

        <Sec title="Quem você é" cor={cor}>
          <p style={{fontSize:16,lineHeight:1.85,color:"var(--text)",marginBottom:14}}>{report.descricao}</p>
          <p style={{fontSize:16,lineHeight:1.85,color:"var(--muted)"}}>{report.descricao2}</p>
        </Sec>
        <Sec title="Seus pontos fortes" cor={cor}>
          {report.forcas.map((f,i)=>(<div key={i} style={{display:"flex",gap:13,marginBottom:13,alignItems:"flex-start"}}><div style={{width:18,height:18,borderRadius:"50%",background:`${cor}1A`,border:`1px solid ${cor}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:3}}><div style={{width:5,height:5,borderRadius:"50%",background:cor}}/></div><p style={{fontSize:15,lineHeight:1.7,color:"var(--text)",margin:0}}>{f}</p></div>))}
        </Sec>
        <Sec title="Sua sombra — o que você evita ver" cor={cor}>
          {report.sombra.map((s,i)=>(<div key={i} style={{display:"flex",gap:13,marginBottom:13,alignItems:"flex-start"}}><div style={{width:18,height:18,borderRadius:"50%",background:"rgba(239,68,68,0.10)",border:"1px solid rgba(239,68,68,0.30)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:3}}><div style={{width:5,height:5,borderRadius:"50%",background:"#EF4444"}}/></div><p style={{fontSize:15,lineHeight:1.7,color:"var(--text)",margin:0}}>{s}</p></div>))}
        </Sec>
        <Sec title="Você sob pressão" cor={cor}><p style={{fontSize:16,lineHeight:1.85,color:"var(--text)"}}>{report.sobrePressao}</p></Sec>
        <Sec title="Seus pontos cegos" cor={cor}><p style={{fontSize:16,lineHeight:1.85,color:"var(--text)"}}>{report.pontosCegos}</p></Sec>
        <Sec title="Você nos relacionamentos" cor={cor}><p style={{fontSize:16,lineHeight:1.85,color:"var(--text)"}}>{report.relacoes}</p></Sec>
        <Sec title="Onde você prospera" cor={cor}>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{report.carreiras.map((c,i)=>(<span key={i} style={{padding:"8px 14px",background:`${cor}14`,border:`1px solid ${cor}33`,borderRadius:999,fontSize:13,color:"var(--text)"}}>{c}</span>))}</div>
        </Sec>
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:"22px 24px",marginBottom:24,boxShadow:"var(--shadow)"}}>
          <div style={{fontSize:11,letterSpacing:"0.2em",color:intelCor,textTransform:"uppercase",marginBottom:12,fontWeight:700}}>Fato sobre seu perfil</div>
          <p style={{fontSize:16,lineHeight:1.8,color:"var(--text)",margin:0}}>{report.fatoCurioso}</p>
        </div>
        <div style={{background:"var(--surface)",border:`1px solid ${cor}33`,borderRadius:16,padding:"24px 24px",marginBottom:46,boxShadow:"var(--shadow)"}}>
          <div style={{fontSize:11,letterSpacing:"0.2em",color:cor,textTransform:"uppercase",marginBottom:12,fontWeight:700}}>Para levar</div>
          <p style={{fontSize:17,lineHeight:1.75,color:"var(--text)",margin:0,fontWeight:500}}>{report.afirmacao}</p>
        </div>
        </>)}

        <div style={{borderTop:"1px solid var(--border)",paddingTop:34,textAlign:"center"}}>
          <div style={{fontSize:11,letterSpacing:"0.14em",color:"var(--faint)",marginBottom:18,textTransform:"uppercase",fontWeight:600}}>Salve e compartilhe</div>
          {(()=>{ const off=gerando||!report; return (
          <button onClick={baixarPDF} disabled={off} style={{background:off?"var(--surface-2)":"linear-gradient(135deg,var(--cta),var(--cta-2))",border:off?"1px solid var(--border)":"none",color:off?"var(--faint)":"#fff",padding:"16px 40px",fontSize:15,letterSpacing:"0.01em",cursor:off?"default":"pointer",borderRadius:12,fontWeight:600,marginBottom:18,boxShadow:off?"none":"0 10px 30px rgba(99,102,241,0.30)",width:"100%",maxWidth:380,display:"flex",alignItems:"center",justifyContent:"center",gap:9,marginLeft:"auto",marginRight:"auto"}}>
            {gerando?"Gerando PDF...":(<><LineIcon name="download" size={18}/> Baixar PDF Personalizado</>)}
          </button>
          ); })()}
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            {["WhatsApp","Instagram","TikTok","Copiar link"].map(b=>(
              <button key={b} onClick={()=>compartilhar(b)} style={{background:copiado===b?"rgba(99,102,241,0.10)":"var(--surface)",border:copiado===b?"1px solid var(--cta)":"1px solid var(--border)",color:copiado===b?"var(--cta)":"var(--muted)",padding:"11px 18px",fontSize:12,cursor:"pointer",borderRadius:10,letterSpacing:"0.02em",transition:"all 0.2s",display:"flex",alignItems:"center",gap:7,fontWeight:500,boxShadow:"var(--shadow)"}}
                onMouseEnter={e=>{ if(copiado!==b){e.currentTarget.style.borderColor="var(--cta)";} }}
                onMouseLeave={e=>{ if(copiado!==b){e.currentTarget.style.borderColor="var(--border)";} }}
              ><BrandIcon name={b}/>{copiado===b?(b==="Copiar link"?"Link copiado!":"Legenda copiada!"):b}</button>
            ))}
          </div>
          <p style={{marginTop:12,fontSize:11,color:"var(--faint)",lineHeight:1.6}}>No Instagram e TikTok, a legenda é copiada automaticamente — é só colar na sua publicação.</p>
          {nome&&<p style={{marginTop:26,fontSize:12,color:"var(--faint)"}}>Análise gerada para <span style={{color:"var(--muted)",fontWeight:600}}>{nome}</span> · MindCode</p>}
        </div>
      </div>
    </div>
  );

  return null;
}
