
// ── Helpers ──────────────────────────────────────────────────────────────
function srcIcon(s){return{youtube:"▶️",github:"🐙",pdf:"📄",image:"🖼️",instagram:"📸",twitter:"🐦",link:"🔗",article:"📝"}[s]||"🔗"}
function statCard(label,val,color){return '<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:20px;text-align:center"><div style="font-size:28px;font-weight:900;color:'+color+'">'+val+'</div><div style="font-size:12px;color:#94A3B8;margin-top:4px">'+label+'</div></div>'}

function openItem(item){
  if(!item||!item.url) return;
  var u=item.url.startsWith('http')?item.url:'https://'+item.url;
  window.open(u,'_blank');
}

function itemCard(item){
  var icon=srcIcon(item.source);
  var hasImg=item.imageUrl&&item.imageUrl.startsWith('http');
  var thumb=hasImg
    ?'<img src="'+item.imageUrl+'" style="width:100%;height:100px;object-fit:cover;border-radius:10px 10px 0 0" onerror="this.style.display=\'none\'">'
    :'<div style="height:80px;display:flex;align-items:center;justify-content:center;font-size:28px;background:rgba(255,255,255,.04);border-radius:10px 10px 0 0">'+icon+'</div>';
  var used=item.utilized?'<span style="color:#10B981;font-size:10px">✓ Used</span>':'';
  var idx=item.__idx!=null?item.__idx:-1;
  var click=idx>=0?'openItem(window.__items['+idx+'])':'';
  return '<div onclick="'+click+'" style="cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;overflow:hidden;transition:all .2s" onmouseover="this.style.transform=\'translateY(-3px)\';this.style.borderColor=\'rgba(79,124,247,.4)\'" onmouseout="this.style.transform=\'\';this.style.borderColor=\'rgba(255,255,255,.08)\'">'
    +thumb
    +'<div style="padding:10px 12px">'
    +'<div style="font-size:12px;font-weight:700;color:#F1F5F9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(item.title||'Untitled')+'</div>'
    +'<div style="font-size:11px;color:#94A3B8;margin-top:3px;display:flex;gap:6px;align-items:center">'+icon+' '+(item.source||'link')+' '+used+'</div>'
    +'</div></div>';
}

function itemsGrid(list){
  if(!list||!list.length) return '<p style="color:#94A3B8;font-size:14px;padding:12px 0">No items here yet.</p>';
  return '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px">'+list.map(function(i){return itemCard(i);}).join('')+'</div>';
}

function sectionBlock(emoji,title,content){
  return '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:24px;margin-bottom:20px">'
    +'<div style="font-size:15px;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px">'+emoji+' '+title+'</div>'
    +content+'</div>';
}

function exCard(e){
  var hasImg=e.imageUrl&&e.imageUrl.startsWith('http');
  var thumb=hasImg
    ?'<img src="'+e.imageUrl+'" style="width:100%;height:80px;object-fit:cover;border-radius:10px 10px 0 0" onerror="this.style.display=\'none\'">'
    :'<div style="height:70px;display:flex;align-items:center;justify-content:center;font-size:24px;background:rgba(217,119,6,.08);border-radius:10px 10px 0 0">🏋️</div>';
  var url=e.url?(e.url.startsWith('http')?e.url:'https://'+e.url):'';
  var click=url?'window.open(\''+url+'\',\'_blank\')':'';
  return '<div onclick="'+click+'" style="cursor:'+(url?'pointer':'default')+';background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;overflow:hidden;transition:all .2s" onmouseover="this.style.borderColor=\'rgba(217,119,6,.4)\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,.08)\'">'
    +thumb
    +'<div style="padding:10px 12px">'
    +'<div style="font-size:12px;font-weight:700;color:#F1F5F9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(e.title||e.name||'Exercise')+'</div>'
    +(e.description?'<div style="font-size:11px;color:#94A3B8;margin-top:3px">'+e.description+'</div>':'')
    +'</div></div>';
}

// ── Main render ───────────────────────────────────────────────────────────
window.renderDashboard = function(cloudData, activeWorkspace, searchQ){
  var allItems=(cloudData.items||[]).map(function(it,i){return Object.assign({},it,{__idx:i});});
  window.__items=allItems;
  var total=allItems.length;
  var used=allItems.filter(function(i){return i.utilized;}).length;
  var score=total>0?Math.round(used/total*100):0;
  var html='';

  // Stats
  html+='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">'
    +statCard('Total Saved',total,'#4F7CF7')
    +statCard('Used',used,'#10B981')
    +statCard('Pending',total-used,'#F59E0B')
    +statCard('Unfog Score',score+'%',score>70?'#10B981':score>40?'#F59E0B':'#EF4444')
    +'</div>';

  // Search
  var q=(searchQ||'').toLowerCase().trim();
  var wsItems=allItems.filter(function(i){return activeWorkspace==='all'||i.workspaceId===activeWorkspace;});
  if(q){
    var results=allItems.filter(function(i){return (i.title||'').toLowerCase().indexOf(q)>=0||(i.description||'').toLowerCase().indexOf(q)>=0||((i.tags||[]).join(' ')).toLowerCase().indexOf(q)>=0;});
    html+=sectionBlock('🔍','Search: "'+searchQ+'" ('+results.length+' results)',itemsGrid(results));
    return html;
  }

  // ── STUDENT ──
  if(activeWorkspace==='student'){
    var deadlines=cloudData.deadlines||[];
    var subjects=cloudData.subjects||[];
    var files=cloudData.studentFiles||[];
    if(deadlines.length){
      var dl='';
      deadlines.forEach(function(d){
        var days=Math.ceil((new Date(d.date)-new Date())/86400000);
        var c=days<0?'#EF4444':days<3?'#F59E0B':'#10B981';
        dl+='<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06)"><span style="font-weight:600">'+d.title+'</span><span style="color:'+c+';font-weight:700;font-size:13px">'+(days<0?'Overdue':days===0?'Today':days+'d left')+'</span></div>';
      });
      html+=sectionBlock('📅','Deadlines',dl);
    }
    if(subjects.length){
      subjects.forEach(function(sub){
        var subFiles=files.filter(function(f){return f.subjectId===sub.id||f.subject===sub.name;}).map(function(f){return {title:f.name||f.title,source:'pdf',url:f.url||'',imageUrl:'',__idx:-1};});
        var subItems=wsItems.filter(function(i){return i.folderName===sub.name||i.subject===sub.name||i.subjectId===sub.id;});
        var combined=subFiles.concat(subItems);
        html+=sectionBlock('📚',sub.name||'Subject',combined.length?itemsGrid(combined):'<p style="color:#94A3B8;font-size:13px">No saves in this subject yet.</p>');
      });
    } else {
      html+=sectionBlock('📚','All Student Saves',itemsGrid(wsItems));
    }
  }

  // ── TRAVELER ──
  else if(activeWorkspace==='traveler'){
    var dests=cloudData.destinations||[];
    if(dests.length){
      dests.forEach(function(dest){
        var dItems=wsItems.filter(function(i){return i.destinationId===dest.id||i.folderName===dest.city;});
        var inner='';
        ['stays','food','visit'].forEach(function(tab){
          var label={'stays':'🏨 Stays','food':'🍜 Food','visit':'🗺️ Visit'}[tab];
          var tItems=dItems.filter(function(i){return (i.category||i.tab||'').toLowerCase()===tab||(i.tags||[]).indexOf(tab)>=0;});
          if(tItems.length) inner+='<div style="margin-bottom:12px"><div style="font-size:12px;font-weight:700;color:#94A3B8;letter-spacing:1px;margin-bottom:8px">'+label+'</div>'+itemsGrid(tItems)+'</div>';
        });
        var other=dItems.filter(function(i){return ['stays','food','visit'].indexOf((i.category||i.tab||'').toLowerCase())<0;});
        if(other.length) inner+='<div style="margin-bottom:12px"><div style="font-size:12px;font-weight:700;color:#94A3B8;margin-bottom:8px">📌 Other</div>'+itemsGrid(other)+'</div>';
        if(!inner) inner='<p style="color:#94A3B8;font-size:13px">No saves for this destination yet.</p>';
        html+=sectionBlock('📍',dest.city+(dest.country?', '+dest.country:''),inner);
      });
    } else {
      html+=sectionBlock('🌐','All Traveler Saves',itemsGrid(wsItems));
    }
  }

  // ── SPORTS ──
  else if(activeWorkspace==='sports'){
    var routine=cloudData.gymRoutine||{};
    var folders=cloudData.exerciseFolders||[];
    var exercises=cloudData.exercises||[];
    var matchDays=cloudData.matchDays||[];

    if(Object.keys(routine).length){
      var r='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px">';
      Object.keys(routine).forEach(function(day){
        if(routine[day]) r+='<div style="background:rgba(217,119,6,.08);border:1px solid rgba(217,119,6,.2);border-radius:10px;padding:12px"><div style="font-weight:700;font-size:13px;color:#D97706">'+day+'</div><div style="font-size:12px;color:#94A3B8;margin-top:4px">'+routine[day]+'</div></div>';
      });
      r+='</div>';
      html+=sectionBlock('🏋️','Gym Routine',r);
    }

    folders.forEach(function(folder){
      // collectionId = new method, folderId = legacy
      var folderItems=wsItems.filter(function(i){return i.collectionId===folder.id;});
      var legacyExs=exercises.filter(function(e){return e.folderId===folder.id;}).map(function(e){return {title:e.name||'Exercise',name:e.name,source:'link',url:e.url||'',imageUrl:e.imageUrl||'',description:e.description||''};});
      var allEx=folderItems.concat(legacyExs);
      var icon=folder.icon||'💪';
      var ec=allEx.length
        ?'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px">'+allEx.map(function(e){return exCard(e);}).join('')+'</div>'
        :'<p style="color:#94A3B8;font-size:13px">No exercises in this folder yet. Add them via the app!</p>';
      html+=sectionBlock(icon,folder.name||'Folder',ec);
    });

    if(matchDays.length){
      var md='<div style="display:flex;flex-direction:column;gap:8px">';
      matchDays.slice(0,5).forEach(function(m){md+='<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06)"><span style="font-weight:600">'+(m.title||m.opponent||'Match')+'</span><span style="color:#D97706;font-size:13px">'+(m.date||'')+'</span></div>';});
      md+='</div>';
      html+=sectionBlock('📅','Match Days',md);
    }

    if(wsItems.length) html+=sectionBlock('📌','Other Sports Saves',itemsGrid(wsItems));
  }

  // ── CODER ──
  else if(activeWorkspace==='coder'){
    var tabs=['frontend','backend','ai','general'];
    var labeled=['Frontend','Backend','AI / ML','General'];
    var emojis=['🖥️','⚙️','🤖','🗂️'];
    tabs.forEach(function(tab,ti){
      var tItems=wsItems.filter(function(i){return (i.coderTab||i.tab||'general').toLowerCase()===tab||(i.tags||[]).map(function(t){return t.toLowerCase();}).indexOf(tab)>=0;});
      if(tItems.length) html+=sectionBlock(emojis[ti],labeled[ti],itemsGrid(tItems));
    });
    var uncat=wsItems.filter(function(i){return tabs.indexOf((i.coderTab||i.tab||'').toLowerCase())<0;});
    if(uncat.length) html+=sectionBlock('📌','Other Coder Saves',itemsGrid(uncat));
    if(!wsItems.length) html+=sectionBlock('💻','Coder Saves','<p style="color:#94A3B8">No saves yet.</p>');
  }

  // ── DESIGNER ──
  else if(activeWorkspace==='designer'){
    if(!wsItems.length){
      html+=sectionBlock('🎨','Designer Saves','<p style="color:#94A3B8">No saves yet.</p>');
    } else {
      html+=sectionBlock('🎨','All Designer Saves ('+wsItems.length+')',itemsGrid(wsItems));
    }
  }

  // ── GENERAL ──
  else if(activeWorkspace==='general'){
    var checklist=cloudData.generalChecklist||[];
    if(checklist.length){
      var cl='<div style="display:flex;flex-direction:column;gap:6px">';
      checklist.forEach(function(c){cl+='<div style="display:flex;align-items:center;gap:10px;padding:8px;background:rgba(255,255,255,.03);border-radius:8px"><span>'+(c.completed?'✅':'⬜')+'</span><span style="'+(c.completed?'text-decoration:line-through;color:#64748B':'')+';font-size:14px">'+c.text+'</span></div>';});
      cl+='</div>';
      html+=sectionBlock('✅','My Checklist',cl);
    }
    if(wsItems.length) html+=sectionBlock('📌','General Saves',itemsGrid(wsItems));
    if(!wsItems.length&&!checklist.length) html+=sectionBlock('🗂️','General','<p style="color:#94A3B8">No saves yet.</p>');
  }

  // ── Websites (all workspaces) ──
  var websites=cloudData.importantWebsites||[];
  if(websites.length){
    var w='<div style="display:flex;gap:10px;flex-wrap:wrap">';
    websites.forEach(function(site){
      var u=site.url.startsWith('http')?site.url:'https://'+site.url;
      w+='<a href="'+u+'" target="_blank" style="display:flex;align-items:center;gap:8px;background:rgba(79,124,247,.1);border:1px solid rgba(79,124,247,.25);border-radius:10px;padding:8px 14px;font-size:13px;font-weight:600;color:#4F7CF7">🌐 '+site.title+'</a>';
    });
    w+='</div>';
    html+=sectionBlock('🔗','Important Websites',w);
  }

  return html;
};
