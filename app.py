import os
import time
import requests
from flask import Flask, jsonify, request, render_template, json

app = Flask(__name__)

KV_URL = os.getenv("KV_REST_API_URL")
KV_TOKEN = os.getenv("KV_REST_API_TOKEN")
HEADERS = {"Authorization": f"Bearer {KV_TOKEN}"} if KV_TOKEN else {}
SESSION_TIMEOUT_SECONDS = 30
DB_KEY = "active_users"

def cleanup_inactive_users():
    if not KV_URL: return
    current_time = int(time.time())
    timeout_threshold = current_time - SESSION_TIMEOUT_SECONDS
    requests.post(f"{KV_URL}/zremrangebyscore/{DB_KEY}/-inf/{timeout_threshold}", headers=HEADERS)

@app.route('/api/ping', methods=['POST'])
def ping():
    if not KV_URL: return jsonify({"error": "Vercel KV not configured"}), 500
    data = request.json
    user_id = data.get('userId')
    if user_id:
        current_time = int(time.time())
        requests.post(f"{KV_URL}/zadd/{DB_KEY}", json=[current_time, user_id], headers=HEADERS)
    return jsonify({"status": "ok"})

@app.route('/api/count')
def count():
    if not KV_URL: return jsonify({"active_users": 1})
    cleanup_inactive_users()
    response = requests.get(f"{KV_URL}/zcard/{DB_KEY}", headers=HEADERS)
    if response.status_code == 200:
        count = response.json().get("result", 0)
        return jsonify({"active_users": max(1, count)})
    else:
        return jsonify({"active_users": 1})

@app.route('/')
def home():
    translations = {
        "id": {
            "nav_about": "Tentang",
            "nav_experience": "Pengalaman",
            "nav_projects": "Proyek",
            "nav_skills_certs": "Keahlian & Sertifikat",
            "nav_edu_org": "Pendidikan & Organisasi",
            "hero_title": "Faza Wahyu Adi Putra",
            "hero_subtitle": "Junior IT Support & Developer",
            "hero_cv_button": "Download CV",
            "hero_about_button": "Tentang Saya",
            "hero_email_button": "Email",
            "about_title": "Tentang Saya",
            "about_summary": "Saya mahasiswa Teknik Informatika yang tertarik pada divisi IT Support. Memiliki 9 bulan pengalaman PKL dalam divisi Preventive Maintenance & Pemeliharaan Dasar Hardware, Dasar-dasar Jaringan (Networking). Berpengalaman dalam lingkungan kerja yang membutuhkan ketelitian dan respons cepat. Siap untuk segera memberikan dukungan teknis dan berkontribusi dalam tim Anda.",
            "about_name_label": "Nama:",
            "about_name_value": "Faza Wahyu Adi Putra",
            "about_location_label": "Lokasi:",
            "about_location_value": "Semarang, Indonesia",
            "about_email_label": "Email:",
            "achieve_1_title": "Pemenang Merchandise Tier 1 di #JuaraGCP Season 11 2025!",
            "achieve_1_org": "Google Cloud",
            "achieve_1_date": "Mei 2025",
            "achieve_1_desc": "Termasuk kedalam 1.000 dari 12.000 peserta dengan nilai terbaik yang menyelesaikan pelatihan dan kuis akhir, dan mendapatkan #SWAG keren dari Google Cloud berupa : Bantal Leher, Stiker, Tas Serut, dan Gantungan Kunci.",
            "achieve_gallery_button": "Lihat Gambar",
            "profiles_gdev_title": "Profil Google Developer",
            "profiles_gdev_desc": "Lihat pencapaian, kontribusi, dan rekam jejak saya.",
            "profiles_skills_title": "Google Cloud Skills Boost",
            "profiles_skills_desc": "Jelajahi lencana keahlian dan kemajuan belajar saya.",
            "work_title": "Pengalaman Kerja Lapangan",
            "work_1_role": "Preventive Maintenance",
            "work_1_org": "PT. Putra Mulia Telecommunication",
            "work_1_period": "Agustus 2023 - November 2023",
            "work_1_resp_1": "Preventif Maintenance.",
            "work_1_resp_2": "Bertanggung jawab atas kebersihan ruang perangkat (shelter) dan komponen di dalamnya untuk mencegah potensi gangguan sinyal.",
            "work_1_resp_3": "Bekerja sesuai dengan standar K3 yang berlaku untuk pekerjaan di ketinggian dan di sekitar perangkat listrik.",
            "work_2_role": "Technical Support",
            "work_2_org": "CV. Arjuna Jaya Sakti",
            "work_2_period": "Maret 2023 - Juli 2023",
            "work_2_resp_1": "Melakukan Troubleshooting, konfigurasi, dan pemeliharaan rutin CCTV.",
            "work_2_resp_2": "Memberikan dukungan teknis dan operasional.",
            "work_2_resp_3": "Membantu operasional kantor dan merancang konten video.",
            "work_gallery_button": "Lihat Dokumentasi",
            "projects_title": "Proyek Pilihan",
            "proj_1_title": "Project Smart Lamp (IoT)",
            "proj_1_desc": "Sistem pengendalian lampu otomatis menggunakan aplikasi Google Assistant",
            "proj_2_title": "Website Peta : QGIS + Database + API",
            "proj_2_desc": "WebGIS interaktif berbasis QGIS yang terhubung database dan dapat diedit langsung melalui backend.",
            "proj_photo_button": "Foto",
            "proj_video_button": "Video",
            "skills_certs_title": "Keahlian & Sertifikasi",
            "skills_cat_tech": "Teknis",
            "skills_cat_nontech": "Non-Teknis",
            "skills_cat_lang": "Bahasa",
            "skill_subcat_it": "Infrastruktur & Dukungan IT",
            "skill_item_maintenance": "Hardware-Software Maintenance and Troubleshooting",
            "skill_item_networking": "Jaringan Dasar (Konfigurasi Router)",
            "skill_item_os": "Instalasi & Konfigurasi Sistem Operasi Windows",
            "skill_subcat_dev": "Pengembangan Web",
            "skill_item_frontend_backend": "Front-End & Back-End (Python) #PYTHON_LOGO#", # Ini akan ditangani di JS
            "skill_item_db": "Pengelolaan Database Dasar (MySQL)",
            "skill_item_uiux": "Design Web UI/UX",
            "skill_subcat_tools": "Tools & Perangkat Lunak",
            "skill_item_vscode": "Visual Studio Code",
            "skill_item_xcode": "Xcode",
            "skill_item_xampp": "XAMPP",
            "skill_item_cisco": "Cisco",
            "skill_item_figma": "Figma",
            "skill_item_canva": "Canva (Desain Grafis)",
            "skill_item_capcut": "Capcut (Editing Video)",
            "skill_item_office": "Microsoft Office (Word, Excel, PowerPoint)",
            "skill_item_problem_solving": "Pemecahan Masalah (Problem-Solving)",
            "skill_item_teamwork": "Kerja Sama Tim & Kolaborasi",
            "skill_item_attention": "Ketelitian (Attention to Detail)",
            "skill_item_lang_id": "Indonesia (Fasih)",
            "skill_item_lang_en": "Inggris (Menengah)",
            "cert_title": "Sertifikasi",
            "cert_desc": "Saya memiliki berbagai sertifikasi yang menunjukkan komitmen saya untuk terus belajar dan berkembang dalam bidang IT.",
            "cert_button": "Lihat Semua Sertifikat",
            "edu_org_title": "Pendidikan & Organisasi",
            "education_title": "Riwayat Pendidikan",
            "edu_1_institution": "Universitas Dian Nuswantoro Semarang",
            "edu_1_period": "2024 - Sekarang",
            "edu_1_major": "D3 Teknik Informatika | IPK Sementara: 3.67 / 4.00",
            "edu_2_institution": "SMK Negeri 2 Kota Tasikmalaya",
            "edu_2_period": "2020 - 2024",
            "edu_2_major": "Sistem Informasi, Jaringan & Aplikasi (Program 4 Tahun)",
            "org_title": "Organisasi",
            "org_1_role": "Divisi Media",
            "org_1_name": "Himpunan Mahasiswa DTI",
            "org_1_period": "2024 - Sekarang",
            "org_2_role": "Member",
            "org_2_name": "Google Developer Group on Campus (GDGoC) Universitas Dian Nuswantoro",
            "org_2_period": "2024 - Sekarang",
            "footer_cta": "Tertarik untuk berkolaborasi?",
            "footer_form_title": "Kritik & Saran",
            "footer_form_placeholder": "Tuliskan pesan Anda di sini...",
            "footer_form_button": "Kirim Pesan",
            "footer_form_sending": "Mengirim...",
            "footer_form_sent": "Terkirim!",
            "footer_copyright": "Didesain & dikembangkan oleh Faza."
        },
        "en": {
            "nav_about": "About",
            "nav_experience": "Experience",
            "nav_projects": "Projects",
            "nav_skills_certs": "Skills & Certificates",
            "nav_edu_org": "Education & Organization",
            "hero_title": "Faza Wahyu Adi Putra",
            "hero_subtitle": "Junior IT Support & Developer",
            "hero_cv_button": "Download CV",
            "hero_about_button": "About Me",
            "hero_email_button": "Email",
            "about_title": "About Me",
            "about_summary": "I am an Informatics Engineering student interested in the IT Support division. I have 9 months of internship experience in Preventive Maintenance & Basic Hardware Maintenance, and Networking fundamentals. Experienced in a work environment that requires precision and quick response. Ready to provide technical support and contribute to your team immediately.",
            "about_name_label": "Name:",
            "about_name_value": "Faza Wahyu Adi Putra",
            "about_location_label": "Location:",
            "about_location_value": "Semarang, Indonesia",
            "about_email_label": "Email",
            "achieve_1_title": "Tier 1 Merchandise Winner at #JuaraGCP Season 11 2025!",
            "achieve_1_org": "Google Cloud",
            "achieve_1_date": "May 2025",
            "achieve_1_desc": "Finished in the top 1,000 of 12,000 participants based on the best scores from the completing the training and taking the final quiz. Awarded with Google Cloud #SWAG: a Neck Pillow, Stickers, a Drawstring Bag, and a Keychain.",
            "achieve_gallery_button": "View Images",
            "profiles_gdev_title": "Google Developer Profile",
            "profiles_gdev_desc": "See my achievements, contributions, and track record.",
            "profiles_skills_title": "Google Cloud Skills Boost",
            "profiles_skills_desc": "Explore my skill badges and learning progress.",
            "work_title": "Field Work Experience",
            "work_1_role": "Preventive Maintenance",
            "work_1_org": "PT. Putra Mulia Telecommunication",
            "work_1_period": "August 2023 - November 2023",
            "work_1_resp_1": "Preventive Maintenance.",
            "work_1_resp_2": "Responsible for the cleanliness of the equipment room (shelter) and its components to prevent potential signal interference.",
            "work_1_resp_3": "Worked according to applicable H&S standards for working at heights and around electrical equipment.",
            "work_2_role": "Technical Support",
            "work_2_org": "CV. Arjuna Jaya Sakti",
            "work_2_period": "March 2023 - July 2023",
            "work_2_resp_1": "Performed troubleshooting, configuration, and routine maintenance of CCTV.",
            "work_2_resp_2": "Provided technical and operational support.",
            "work_2_resp_3": "Assisted with office operations and designed video content.",
            "work_gallery_button": "View Documentation",
            "projects_title": "Featured Projects",
            "proj_1_title": "Smart Lamp Project (IoT)",
            "proj_1_desc": "Automatic lamp control system using the Google Assistant application.",
            "proj_2_title": "Map Website: QGIS + Database + API",
            "proj_2_desc": "Interactive WebGIS based on QGIS connected to a database, editable directly via the backend.",
            "proj_photo_button": "Photos",
            "proj_video_button": "Video",
            "skills_certs_title": "My Skills & Certifications",
            "skills_cat_tech": "Technical",
            "skills_cat_nontech": "Non-Technical",
            "skills_cat_lang": "Languages",
            "skill_subcat_it": "IT Infrastructure & Support",
            "skill_item_maintenance": "Hardware-Software Maintenance and Troubleshooting",
            "skill_item_networking": "Basic Networking (Router Configuration)",
            "skill_item_os": "Windows Operating System Installation & Configuration",
            "skill_subcat_dev": "Web Development",
            "skill_item_frontend_backend": "Front-End & Back-End (Python) #PYTHON_LOGO#", # Ini akan ditangani di JS
            "skill_item_db": "Basic Database Management (MySQL)",
            "skill_item_uiux": "Web UI/UX Design",
            "skill_subcat_tools": "Tools & Software",
            "skill_item_vscode": "Visual Studio Code",
            "skill_item_xcode": "Xcode",
            "skill_item_xampp": "XAMPP",
            "skill_item_cisco": "Cisco",
            "skill_item_figma": "Figma",
            "skill_item_canva": "Canva (Graphic Design)",
            "skill_item_capcut": "Capcut (Video Editing)",
            "skill_item_office": "Microsoft Office (Word, Excel, PowerPoint)",
            "skill_item_problem_solving": "Problem-Solving",
            "skill_item_teamwork": "Teamwork & Collaboration",
            "skill_item_attention": "Attention to Detail",
            "skill_item_lang_id": "Indonesian (Native)",
            "skill_item_lang_en": "English (Intermediate)",
            "cert_title": "Certifications",
            "cert_desc": "I hold various certifications that demonstrate my commitment to continuous learning and development in the IT field.",
            "cert_button": "View All Certificates",
            "edu_org_title": "Education & Organization",
            "education_title": "Education History",
            "edu_1_institution": "Dian Nuswantoro University Semarang",
            "edu_1_period": "2024 - Present",
            "edu_1_major": "D3 Informatics Engineering | Current GPA: 3.67 / 4.00",
            "edu_2_institution": "SMK Negeri 2 Tasikmalaya City",
            "edu_2_period": "2020 - 2024",
            "edu_2_major": "Information Systems, Networking & Applications (4-Year Program)",
            "org_title": "Organizations",
            "org_1_role": "Media Division",
            "org_1_name": "DTI Student Association",
            "org_1_period": "2024 - Present",
            "org_2_role": "Member",
            "org_2_name": "Google Developer Group on Campus (GDGoC) at Dian Nuswantoro University",
            "org_2_period": "2024 - Present",
            "footer_cta": "Interested in collaborating?",
            "footer_form_title": "Feedback & Suggestions",
            "footer_form_placeholder": "Write your message here...",
            "footer_form_button": "Send Message",
            "footer_form_sending": "Sending...",
            "footer_form_sent": "Sent!",
            "footer_copyright": "Designed & developed by Faza."
        }
    }

    skills_structure = {
        "technical": {
            "title_key": "skills_cat_tech",
            "subcategories": [
                {
                    "title_key": "skill_subcat_it",
                    "skills": ["skill_item_maintenance", "skill_item_networking", "skill_item_os"]
                },
                {
                    "title_key": "skill_subcat_dev",
                    "skills": ["skill_item_frontend_backend", "skill_item_db", "skill_item_uiux"]
                },
                {
                    "title_key": "skill_subcat_tools",
                    "skills": ["skill_item_vscode", "skill_item_xcode", "skill_item_xampp", "skill_item_cisco", "skill_item_figma", "skill_item_canva", "skill_item_capcut", "skill_item_office"]
                }
            ]
        },
        "others": [
            {
                "title_key": "skills_cat_nontech",
                "skills": ["skill_item_problem_solving", "skill_item_teamwork", "skill_item_attention"]
            },
            {
                "title_key": "skills_cat_lang",
                "skills": ["skill_item_lang_id", "skill_item_lang_en"]
            }
        ]
    }

    initial_data = {
        "work_experiences": [
            {"gallery_images": ["pmt1.jpeg", "pmt2.jpeg", "pmt3.jpeg", "pmt4.jpeg"]},
            {"gallery_images": ["arjuna1.png", "arjuna2.png", "arjuna3.png", "arjuna4.png"]}
        ],
        "projects": [
            {'tech': ['C/C++', 'Arduino'], 'gallery_images': ['smk3.jpeg', 'smk2.jpeg','smk1.jpeg'], 'video_file': 'smkv.mp4'},
            {'tech': ['HTML', 'CSS', 'JavaScript', 'PHP'], 'gallery_images': ['ui-1.jpg', 'ui-2.jpg'], 'video_file': 'webgis.mp4'}
        ],
        "certificate_link": "https://drive.google.com/drive/folders/1Zah1VfcO4CHtFoAsclDLXG5zsPInj3LA?usp=sharing",
        "achievements_data": [{
            "thumbnail": "gcp1.jpeg",
            "gallery_images": ["gcp1.jpeg", "gcp2.jpeg", "gcp3.jpeg", "gcp4.jpeg", "gcp5.jpeg"]
        }]
    }

    return render_template(
        'index.html',
        initial_data=initial_data,
        translations_json=json.dumps(translations),
        skills_structure=skills_structure
    )

if __name__ == '__main__':
    app.run(debug=True)