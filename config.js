const SUPABASE_URL = 'https://kijhnxehaxdjgvkddgyo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpamhueGVoYXhkamd2a2RkZ3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNzg1MzUsImV4cCI6MjA5Mzk1NDUzNX0.NkiQ8wHtG8R79F-c5EQo8ZJ3X9wc4-qBjM2y8PlsmbI';


/* ===== EXPORT LAYOUT FIXES ===== */
.export-mode .city-section{
  position: relative !important;
  margin-top: 140px !important;
  margin-bottom: 120px !important;
  padding: 40px 28px 50px 28px !important;
  border: 2px solid rgba(212,170,66,0.75) !important;
  border-radius: 22px !important;
  background: rgba(0,0,0,0.35) !important;
  overflow: visible !important;
}

.export-mode .rank-city,
.export-mode .ranked-city,
.export-mode .city-rank{
  position: relative !important;
  z-index: 20 !important;
  margin-top: 60px !important;
  margin-bottom: 50px !important;
  transform: none !important;
}

.export-mode .rank-city .city-name,
.export-mode .ranked-city .city-name,
.export-mode .city-rank .city-name{
  position: absolute !important;
  left: 50% !important;
  top: 63% !important;
  transform: translateX(-50%) !important;
  text-align: center !important;
  width: 75% !important;
  z-index: 25 !important;
}

.export-mode .main-logo,
.export-mode .logo{
  position: relative !important;
  z-index: 50 !important;
  filter: brightness(1.1) !important;
  margin-bottom: 80px !important;
}

.export-mode .palier-grid,
.export-mode .tiers-grid{
  position: relative !important;
  z-index: 10 !important;
  gap: 22px !important;
}

.export-mode .palier-card,
.export-mode .tier-card{
  border: 1px solid rgba(212,170,66,0.7) !important;
  background: rgba(0,0,0,0.55) !important;
  box-shadow: 0 0 0 1px rgba(212,170,66,0.2) inset !important;
}
