export default function FiveGLabXSimple() {
  return (
    <div style={{height:'100vh', display:'flex', flexDirection:'column'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderBottom:'1px solid #e5e7eb', background:'#fff'}}>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <div style={{width:28, height:28, borderRadius:6, background:'linear-gradient(135deg,#2563eb,#0ea5e9)', color:'#fff', display:'grid', placeItems:'center', fontWeight:700}}>5G</div>
          <strong>5GLabX Platform</strong>
        </div>
        <span style={{fontSize:12, background:'#dcfce7', color:'#166534', border:'1px solid #86efac', borderRadius:999, padding:'2px 8px'}}>Online</span>
      </div>
      <div style={{flex:1, padding:12, display:'grid', gridTemplateColumns:'320px 1fr', gap:12}}>
        <aside style={{border:'1px solid #e5e7eb', borderRadius:8, padding:12, overflow:'auto'}}>
          <h3>Layers</h3>
          <ul>
            <li>PHY</li>
            <li>MAC</li>
            <li>RLC</li>
            <li>PDCP</li>
            <li>RRC</li>
            <li>NAS</li>
          </ul>
        </aside>
        <section style={{display:'flex', flexDirection:'column', gap:12}}>
          <div style={{border:'1px solid #e5e7eb', borderRadius:8, padding:12}}>
            <div style={{display:'flex', gap:8, marginBottom:8}}>
              <button style={{padding:'6px 10px', border:'1px solid #d1d5db', background:'#f9fafb', borderRadius:6, cursor:'pointer'}}>Play</button>
              <button style={{padding:'6px 10px', border:'1px solid #d1d5db', background:'#f9fafb', borderRadius:6, cursor:'pointer'}}>Pause</button>
              <button style={{padding:'6px 10px', border:'1px solid #d1d5db', background:'#f9fafb', borderRadius:6, cursor:'pointer'}}>Export</button>
            </div>
            <pre id="logs" style={{height:'60vh', overflow:'auto', background:'#0b1020', color:'#e2e8f0', borderRadius:6, padding:10, margin:0}} />
          </div>
        </section>
      </div>
      <script dangerouslySetInnerHTML={{__html:`(function(){const l=document.getElementById('logs');let b=[];function add(s){b.push(s);if(b.length>5000)b.shift();l.textContent=b.join('\n');l.scrollTop=l.scrollHeight;}function mock(){const layers=['PHY','MAC','RLC','PDCP','RRC','NAS'];const levels=['I','W','E','D'];const msgs=['PDSCH TB decoded','RRC Connection Request','Attach Accept','Scheduling grant','HARQ ACK/NACK','UE context setup'];const layer=layers[Math.floor(Math.random()*layers.length)];const level=levels[Math.floor(Math.random()*levels.length)];const msg=msgs[Math.floor(Math.random()*msgs.length)];const rnti=Math.floor(Math.random()*65535).toString(16);add('['+layer+'] ['+level+'] '+new Date().toISOString()+' rnti=0x'+rnti+' '+msg);}setInterval(mock,400);})();`}} />
    </div>
  );
}

