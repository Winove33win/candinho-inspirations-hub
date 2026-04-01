import csv
import uuid
import re
import unicodedata
from urllib.parse import unquote


def gen_uuid():
    return str(uuid.uuid4())


def slugify(text):
    text = unicodedata.normalize('NFD', text)
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text


def sql_escape(val):
    if val is None or val == '':
        return 'NULL'
    val = str(val).replace("'", "''")
    return f"'{val}'"


def bool_val(v):
    return 1 if str(v).strip().lower() == 'true' else 0


def convert_wix_image(val):
    if not val:
        return None
    val = val.strip()
    if val.startswith('wix:image://'):
        m = re.search(r'wix:image://v1/([^/]+)/', val)
        if m:
            return f"https://static.wixstatic.com/media/{m.group(1)}"
    if val.startswith('wix:document://'):
        return None
    if val.startswith('wix:video://'):
        return None
    if val.startswith('wix:audio://'):
        return None
    if val.startswith('http'):
        return val
    return None


def convert_wix_audio(val):
    if not val:
        return None
    val = val.strip()
    if val.startswith('wix:audio://'):
        m = re.search(r'wix:audio://v1/([^/]+)/', val)
        if m:
            filename = m.group(1)
            return f"https://static.wixstatic.com/mp3/{filename}"
    if val.startswith('wix:document://'):
        return None
    if val.startswith('http'):
        return val
    return None


def convert_wix_video_url(val):
    if not val:
        return None
    val = val.strip()
    if val.startswith('wix:'):
        return None
    if val.startswith('http'):
        return val
    return None


def clean_social(val):
    if not val:
        return None
    val = val.strip()
    if 'google.com' in val and 'url=' in val:
        m = re.search(r'[?&]url=([^&]+)', val)
        if m:
            decoded = unquote(m.group(1))
            val = decoded
    if not val.startswith('http'):
        return None
    return val


def valid_date(val):
    if not val:
        return None
    val = val.strip()
    if re.match(r'^\d{4}-\d{2}-\d{2}$', val):
        return val
    return None


def clean_field(val):
    if not val:
        return None
    v = val.strip()
    return v if v else None


with open(r'c:/Users/Nrtfe/candinho-inspirations-hub/migrations/New+Artist+Details.csv', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    rows = list(reader)

print(f"Total rows: {len(rows)}, cols in header: {len(rows[0])}")

sql_lines = []
sql_lines.append("-- SMARTx: Wix CSV Import")
sql_lines.append("-- Run in phpMyAdmin on database `smartx`")
sql_lines.append("SET NAMES utf8mb4;")
sql_lines.append("SET FOREIGN_KEY_CHECKS = 0;")
sql_lines.append("")

skipped = 0
processed = 0

for row_idx, row in enumerate(rows):
    if row_idx == 0:
        continue  # skip header

    # Ensure enough columns
    while len(row) < 125:
        row.append('')

    col = row  # alias

    artistic_name = col[14].strip()
    full_name = col[4].strip()

    # Rule 1: skip if both are empty
    if not artistic_name and not full_name:
        skipped += 1
        continue

    # memberId
    member_id = col[120].strip()
    if not member_id:
        member_id = col[3].strip()
    if not member_id:
        member_id = gen_uuid()

    # slug
    slug = col[62].strip()
    if not slug:
        name_for_slug = artistic_name or full_name
        slug = slugify(name_for_slug)
    if not slug:
        slug = member_id[:8]

    # email
    email = col[6].strip()
    if not email:
        email = f"wix-{member_id[:8]}@smartx.placeholder"

    # artist_details id (new UUID)
    artist_id = gen_uuid()

    # Profile image
    profile_image = convert_wix_image(col[20])

    # Video banners
    video_banner_portrait = convert_wix_video_url(col[22])
    video_banner_landscape = convert_wix_video_url(col[23])

    # Social media
    facebook = clean_social(col[24])
    instagram = clean_social(col[25])
    website = clean_social(col[26])

    # Music streaming - col[27] or col[28]
    music_streaming = clean_social(col[27]) or clean_social(col[28])

    # Youtube channel
    youtube_channel = clean_social(col[29])

    # Video links
    link_video1 = clean_social(col[30])
    link_video2 = clean_social(col[31])
    link_video3 = clean_social(col[32])
    link_video4 = clean_social(col[47])
    link_video5 = clean_social(col[48])
    link_video6 = clean_social(col[49])
    link_video7 = clean_social(col[50])
    link_video8 = clean_social(col[51])
    link_video9 = clean_social(col[52])
    link_video10 = clean_social(col[57])

    # Audio
    audio = convert_wix_audio(col[53])

    # Text fields
    profile_text2 = clean_field(col[54])
    biography_pt = clean_field(col[56])
    how_is_it_defined = clean_field(col[16])

    # Dates
    dob = valid_date(col[13])

    # Boolean fields
    acc_terms1 = bool_val(col[36])
    acc_terms2 = bool_val(col[37])
    perfil_completo = bool_val(col[121])

    # Address fields
    address1 = clean_field(col[8])
    address2 = clean_field(col[64])
    city = clean_field(col[9])
    country_residence = clean_field(col[10])
    postal_code = clean_field(col[11])
    country_birth = clean_field(col[12])
    cell_phone = clean_field(col[7])

    # Titles
    visao_geral = clean_field(col[71])
    historia = clean_field(col[72])
    carreira_titulo = clean_field(col[73])
    mais = clean_field(col[74])

    # Images 1-12 with texts
    img1 = convert_wix_image(col[75])
    img1_text = clean_field(col[76])
    img2 = convert_wix_image(col[77])
    img2_text = clean_field(col[78])
    img3 = convert_wix_image(col[79])
    img3_text = clean_field(col[80])
    img4 = convert_wix_image(col[81])
    img4_text = clean_field(col[82])
    img5 = convert_wix_image(col[83])
    img5_text = clean_field(col[84])
    # col[85]=Image-6, col[86]=Image-7, col[87]=Image-8
    img6 = convert_wix_image(col[85])
    img7 = convert_wix_image(col[86])
    img8 = convert_wix_image(col[87])
    # col[88]=Image-Text-7, col[89]=Image-Text-6, col[90]=Image-Text-8
    img7_text = clean_field(col[88])
    img6_text = clean_field(col[89])
    img8_text = clean_field(col[90])
    # col[91]=Image-9, col[92]=Image-10
    img9 = convert_wix_image(col[91])
    img10 = convert_wix_image(col[92])
    # col[93]=Image-Text-9, col[94]=Image-Text-10
    img9_text = clean_field(col[93])
    img10_text = clean_field(col[94])
    # col[95]=Image-11, col[96]=Image-12
    img11 = convert_wix_image(col[95])
    img12 = convert_wix_image(col[96])
    # col[103]=Image-Text-12, col[104]=Image-Text-11
    img12_text = clean_field(col[103])
    img11_text = clean_field(col[104])

    # Build INSERT for users
    user_sql = (
        "INSERT IGNORE INTO users (id, email, password, role) VALUES ("
        + sql_escape(member_id) + ", "
        + sql_escape(email) + ", "
        + "'$2a$04$placeholder_hash_for_imported_users', "
        + "'member'"
        + ");"
    )

    # Build INSERT for artist_details
    vals = [
        sql_escape(artist_id),
        sql_escape(member_id),
        sql_escape(slug),
        sql_escape(artistic_name or None),
        sql_escape(full_name or None),
        sql_escape(cell_phone),
        sql_escape(dob),
        sql_escape(country_birth),
        sql_escape(country_residence),
        sql_escape(city),
        sql_escape(address1),
        sql_escape(address2),
        sql_escape(postal_code),
        sql_escape(how_is_it_defined),
        sql_escape(profile_text2),
        sql_escape(profile_image),
        sql_escape(biography_pt),
        sql_escape(facebook),
        sql_escape(instagram),
        sql_escape(website),
        sql_escape(music_streaming),
        sql_escape(youtube_channel),
        sql_escape(audio),
        sql_escape(video_banner_portrait),
        sql_escape(video_banner_landscape),
        sql_escape(link_video1),
        sql_escape(link_video2),
        sql_escape(link_video3),
        sql_escape(link_video4),
        sql_escape(link_video5),
        sql_escape(link_video6),
        sql_escape(link_video7),
        sql_escape(link_video8),
        sql_escape(link_video9),
        sql_escape(link_video10),
        sql_escape(visao_geral),
        sql_escape(historia),
        sql_escape(carreira_titulo),
        sql_escape(mais),
        sql_escape(img1),
        sql_escape(img1_text),
        sql_escape(img2),
        sql_escape(img2_text),
        sql_escape(img3),
        sql_escape(img3_text),
        sql_escape(img4),
        sql_escape(img4_text),
        sql_escape(img5),
        sql_escape(img5_text),
        sql_escape(img6),
        sql_escape(img6_text),
        sql_escape(img7),
        sql_escape(img7_text),
        sql_escape(img8),
        sql_escape(img8_text),
        sql_escape(img9),
        sql_escape(img9_text),
        sql_escape(img10),
        sql_escape(img10_text),
        sql_escape(img11),
        sql_escape(img11_text),
        sql_escape(img12),
        sql_escape(img12_text),
        str(acc_terms1),
        str(acc_terms2),
        str(perfil_completo),
    ]

    artist_sql = (
        "INSERT IGNORE INTO artist_details ("
        "id, member_id, slug, artistic_name, full_name, cell_phone, date_of_birth, "
        "country_of_birth, country_residence, city, address1, address2, postal_code, "
        "how_is_it_defined, profile_text2, profile_image, biography1, "
        "facebook, instagram, website, music_spotify_apple, youtube_channel, audio, "
        "video_banner_portrait, video_banner_landscape, "
        "link_to_video, link_to_video2, link_to_video3, link_to_video4, link_to_video5, "
        "link_to_video6, link_to_video7, link_to_video8, link_to_video9, link_to_video10, "
        "visao_geral_titulo, historia_titulo, carreira_titulo, mais_titulo, "
        "image1, image1_text, image2, image2_text, image3, image3_text, "
        "image4, image4_text, image5, image5_text, image6, image6_text, "
        "image7, image7_text, image8, image8_text, image9, image9_text, "
        "image10, image10_text, image11, image11_text, image12, image12_text, "
        "accepted_terms1, accepted_terms2, perfil_completo"
        ") VALUES ("
        + ", ".join(vals)
        + ");"
    )

    sql_lines.append(f"-- Row {row_idx}: {artistic_name or full_name}")
    sql_lines.append(user_sql)
    sql_lines.append(artist_sql)
    sql_lines.append("")
    processed += 1

sql_lines.append("SET FOREIGN_KEY_CHECKS = 1;")
sql_lines.append("-- Import complete")

output_path = r'c:/Users/Nrtfe/candinho-inspirations-hub/migrations/002_import_wix.sql'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_lines))

print(f"Done. Processed: {processed}, Skipped: {skipped}")
print(f"Output written to: {output_path}")

import os
size = os.path.getsize(output_path)
print(f"File size: {size:,} bytes")
