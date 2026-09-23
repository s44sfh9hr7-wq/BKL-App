// BKL-App V0.9.0 – Supabase-Verbindung
// Nur Project URL + öffentlichen anon-Key eintragen.
// Niemals service_role/Secret-Key oder Datenbankpasswort hier eintragen.
window.BKL_SUPABASE_CONFIG={url:"HIER_SUPABASE_URL_EINTRAGEN",anonKey:"HIER_ANON_KEY_EINTRAGEN"};
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