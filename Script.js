function luhnCheckDigit(raw10){
  const arr = raw10.split('').map(Number);
  let total=0;
  const parity=(arr.length+1)%2;
  for(let i=0;i<arr.length;i++){
    let d=arr[i];
    if(i%2===parity){d*=2;if(d>9)d-=9;}
    total+=d;
  }
  return (10-(total%10))%10;
}
function luhnValid(num){
  if(!/^\d{11}$/.test(num))return false;
  return Number(num.slice(-1))===luhnCheckDigit(num.slice(0,-1));
}
function randDOB(){
  const y=Math.floor(Math.random()*50)+1950;
  const m=('0'+(Math.floor(Math.random()*12)+1)).slice(-2);
  const d=('0'+(Math.floor(Math.random()*28)+1)).slice(-2);
  return {y,m,d,iso:`${y}-${m}-${d}`,yy:String(y).slice(2)};
}
const out=document.getElementById('out');
function show(txt){out.textContent=typeof txt==='string'?txt:JSON.stringify(txt,null,2);}
document.getElementById('btnGenerate').onclick=()=>{
  const prefix=document.getElementById('prefix').value||'0900';
  const count=parseInt(document.getElementById('count').value)||10;
  const arr=[];
  for(let i=0;i<count;i++){
    const d=randDOB();
    const raw10=prefix+d.yy+d.m+d.d;
    const chk=luhnCheckDigit(raw10);
    arr.push({kpj:raw10+chk,prefix,dob:d.iso});
  }
  show(arr);
};
document.getElementById('btnValidate').onclick=()=>{
  const k=document.getElementById('kpj').value;
  show({kpj:k,valid:luhnValid(k)});
};
document.getElementById('btnDownloadCsv').onclick=()=>{
  const txt=out.textContent.trim();
  if(!txt.startsWith('['))return show('Generate dulu!');
  const arr=JSON.parse(txt);
  const csv=['kpj,prefix,dob',...arr.map(o=>`${o.kpj},${o.prefix},${o.dob}`)].join('\\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='kpj.csv';
  a.click();
  URL.revokeObjectURL(a.href);
};
