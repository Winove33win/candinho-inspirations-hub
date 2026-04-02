-- Mark all imported artists as perfil_completo = 1
-- Run in phpMyAdmin on database `smartx`
UPDATE artist_details
SET perfil_completo = 1
WHERE artistic_name IS NOT NULL
  AND artistic_name != ''
  AND perfil_completo = 0;
