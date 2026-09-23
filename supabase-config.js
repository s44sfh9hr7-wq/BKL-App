// BKL-App V0.9.0 – Supabase-Verbindung
// Nur Project URL + öffentlichen anon-Key eintragen.
// Niemals service_role/Secret-Key oder Datenbankpasswort hier eintragen.
window.BKL_SUPABASE_CONFIG={url:"https://supabase.com/dashboard/project/pewwmmkxzpzdidszijmm/integrations/data_api/overview#:~:text=pewwmmkxzpzdidszijmm",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBld3dtbWt4enB6ZGlkc3ppam1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNDg1MjIsImV4cCI6MjEwNTcyNDUyMn0.tEaGoS1oUbpx6E5EDc1K_ZLD-V1PsXaIMpvdBJ98PlY"};
window.bklSupabase=null;
window.BKL_SUPABASE_STATUS="not_configured";
(function(){
 const c=window.BKL_SUPABASE_CONFIG;
 const ok=c&&!c.url.includes("HIER_")&&!c.anonKey.includes("HIER_")&&/^https:\/\/.+\.supabase\.co\/?$/.test(c.url.trim())&&c.anonKey.trim().length>40;
 if(!ok){console.info("BKL Supabase: noch nicht konfiguriert.");return;}
 if(!window.supabase?.createClient){window.BKL_SUPABASE_STATUS="library_missing";console.error("BKL Supabase: Bibliothek fehlt.");return;}
 try{window.bklSupabase=window.supabase.createClient(c.url.trim(),c.anonKey.trim(),{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});window.BKL_SUPABASE_STATUS="client_ready";console.info("BKL Supabase: Client bereit.");}
 catch(e){window.BKL_SUPABASE_STATUS="client_error";console.error("BKL Supabase: Initialisierung fehlgeschlagen.",e);}
})();
