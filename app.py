import os
from flask import Flask, jsonify, render_template, json, request

app = Flask(__name__)

MAINTENANCE_MODE = os.environ.get('MAINTENANCE_MODE', 'false').lower() == 'true'

@app.before_request
def check_maintenance():
    if request.path.startswith('/static/'):
        return None
        
    if MAINTENANCE_MODE and request.path != '/maintenance':
        return render_template('maintenance.html'), 503

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
        "proj_3_title": "Generator Email Sementara",
        "proj_3_desc": "Sebuah situs web generator email sementara untuk melindungi privasi Anda saat online dari spam.",
        "proj_photo_button": "Foto",
        "proj_video_button": "Video",
        "proj_url_button": "Kunjungi Situs",
        "skills_certs_title": "Keahlian & Sertifikasi",
        "skills_cat_tech": "Teknis",
        "skills_cat_nontech": "Non-Teknis",
        "skills_cat_lang": "Bahasa",
        "skill_subcat_it": "Infrastruktur & Dukungan IT",
        "skill_item_maintenance": "Troubleshooting Hardware & Software",
        "skill_item_networking": "Fundamental Jaringan (Konfigurasi Router)",
        "skill_item_os": "Manajemen OS Windows",
        "skill_subcat_dev": "Pengembangan Web",
        "skill_item_frontend_backend": "Front-End & Back-End (Python)",
        "skill_item_db": "Manajemen Database (MySQL)",
        "skill_item_uiux": "Desain Web UI/UX",
        "skill_subcat_tools": "Tools & Perangkat Lunak",
        "skill_item_vscode": "Visual Studio Code",
        "skill_item_xampp": "XAMPP",
        "skill_item_cisco": "Cisco",
        "skill_item_figma": "Figma",
        "skill_item_problem_solving": "Pemecahan Masalah (Problem-Solving)",
        "skill_item_teamwork": "Kolaborasi Tim",
        "skill_item_attention": "Ketelitian (Attention to Detail)",
        "skill_item_lang_id": "Indonesia (Fasih)",
        "skill_item_lang_en": "Inggris (Menengah)",
        "cert_title": "Sertifikasi",
        "cert_desc": "Saya memiliki berbagai sertifikasi yang menunjukkan komitmen saya untuk terus belajar dan berkembang dalam bidang IT.",
        "cert_button": "Lihat Semua Sertifikat",
        "edu_org_title": "Pendidikan & Organisasi",
        "education_title": "Pendidikan",
        "edu_1_institution": "Universitas Dian Nuswantoro Semarang",
        "edu_1_status": "Status Mahasiswa Aktif",  
        "edu_1_period": "2024 - Sekarang",
        "edu_1_major": "D3 Teknik Informatika",
        "edu_1_desc": "Fokus pada pengembangan perangkat lunak dan dasar-dasar infrastruktur IT, dengan proyek-proyek praktis dalam pemrograman dan jaringan.",
        "edu_2_institution": "SMK Negeri 2 Kota Tasikmalaya",
        "edu_2_period": "2020 - 2024",
        "edu_2_major": "Sistem Informasi, Jaringan & Aplikasi (Program 4 Tahun)",
        "edu_2_desc": "Program kejuruan 4 tahun yang mendalami rekayasa perangkat lunak, administrasi jaringan, dan sistem informasi.",
        "org_title": "Organisasi",
        "org_1_name": "Himpunan Mahasiswa DTI",
        "org_1_period": "2024 - Sekarang",
        "org_1_role": "Divisi Media",
        "org_1_desc": "Bertanggung jawab atas branding visual, dokumentasi, dan publikasi konten untuk semua kegiatan Himpunan.",
        "org_2_name": "Google Developer Group on Campus (GDGoC) Universitas Dian Nuswantoro",
        "org_2_period": "2024 - Sekarang",
        "org_2_role": "Member",
        "org_2_desc": "Anggota aktif dalam komunitas developer, mengikuti tech talk, workshop, dan acara yang berfokus pada teknologi Google.",
        "org_details_button": "Lihat Detail",
        "dti_modal_title": "Detail Organisasi: Himpunan Mahasiswa DTI",
        "dti_modal_desc_1": "Sebagai anggota Divisi Media di Himpunan Mahasiswa DTI, saya bertanggung jawab dalam pengelolaan dan pembuatan konten visual untuk berbagai platform media sosial organisasi.",
        "dti_modal_desc_2": "Peran ini menuntut kreativitas, kerja sama tim yang solid, dan kemampuan untuk menyampaikan informasi secara efektif kepada audiens mahasiswa.",
        "dti_modal_resp_1": "Merancang dan membuat poster, pamflet, dan konten grafis lainnya untuk acara dan pengumuman.",
        "dti_modal_resp_2": "Mengelola akun media sosial resmi, termasuk penjadwalan posting dan interaksi dengan pengikut.",
        "dti_modal_resp_3": "Berkolaborasi dengan divisi lain untuk memastikan konsistensi branding dan pesan organisasi.",
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
        "about_email_label": "Email:",
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
        "proj_3_title": "Temporary Email Generator",
        "proj_3_desc": "A temporary email generator website to protect your online privacy from spam.",
        "proj_photo_button": "Photos",
        "proj_video_button": "Video",
        "proj_url_button": "Visit Site",
        "skills_certs_title": "My Skills & Certifications",
        "skills_cat_tech": "Technical",
        "skills_cat_nontech": "Non-Technical",
        "skills_cat_lang": "Languages",
        "skill_subcat_it": "IT Infrastructure & Support",
        "skill_item_maintenance": "Hardware & Software Troubleshooting",
        "skill_item_networking": "Networking Fundamentals (Router Config)",
        "skill_item_os": "Windows OS Management",
        "skill_subcat_dev": "Web Development",
        "skill_item_frontend_backend": "Front-End & Back-End (Python)",
        "skill_item_db": "Database Management (MySQL)",
        "skill_item_uiux": "Web UI/UX Design",
        "skill_subcat_tools": "Tools & Software",
        "skill_item_vscode": "Visual Studio Code",
        "skill_item_xampp": "XAMPP",
        "skill_item_cisco": "Cisco",
        "skill_item_figma": "Figma",
        "skill_item_problem_solving": "Problem-Solving",
        "skill_item_teamwork": "Team Collaboration",
        "skill_item_attention": "Attention to Detail",
        "skill_item_lang_id": "Indonesian (Native)",
        "skill_item_lang_en": "English (Intermediate)",
        "cert_title": "Certifications",
        "cert_desc": "I hold various certifications that demonstrate my commitment to continuous learning and development in the IT field.",
        "cert_button": "View All Certificates",
        "edu_org_title": "Education & Organization",
        "education_title": "Education",
        "edu_1_institution": "Dian Nuswantoro University Semarang",
        "edu_1_status": "Active Student Status",
        "edu_1_period": "2024 - Present",
        "edu_1_major": "D3 Informatics Engineering",
        "edu_1_desc": "Focusing on software development and IT infrastructure fundamentals, with practical projects in programming and networking.",
        "edu_2_institution": "SMK Negeri 2 Tasikmalaya City",
        "edu_2_period": "2020 - 2024",
        "edu_2_major": "Information Systems, Networking & Applications (4-Year Program)",
        "edu_2_desc": "A 4-year vocational program specializing in software engineering, network administration, and information systems.",
        "org_title": "Organization",
        "org_1_name": "DTI Student Association",
        "org_1_period": "2024 - Present",
        "org_1_role": "Media Division",
        "org_1_desc": "Responsible for visual branding, documentation, and content publication for all Association activities.",
        "org_2_name": "Google Developer Group on Campus (GDGoC) at Dian Nuswantoro University",
        "org_2_period": "2024 - Present",
        "org_2_role": "Member",
        "org_2_desc": "An active member of the developer community, participating in tech talks, workshops, and Google-focused technology events.",
        "org_details_button": "View Details",
        "dti_modal_title": "Organization Details: DTI Student Association",
        "dti_modal_desc_1": "As a member of the Media Division at the DTI Student Association, I am responsible for managing and creating visual content for the organization's various social media platforms.",
        "dti_modal_desc_2": "This role demands creativity, solid teamwork, and the ability to effectively convey information to the student audience.",
        "dti_modal_resp_1": "Designing and creating posters, flyers, and other graphic content for events and announcements.",
        "dti_modal_resp_2": "Managing official social media accounts, including post scheduling and follower interaction.",
        "dti_modal_resp_3": "Collaborating with other divisions to ensure consistency in branding and organizational messaging.",
        "footer_cta": "Interested in collaborating?",
        "footer_form_title": "Feedback & Suggestions",
        "footer_form_placeholder": "Write your message here...",
        "footer_form_button": "Send Message",
        "footer_form_sending": "Sending...",
        "footer_form_sent": "Sent!",
        "footer_copyright": "Designed & developed by Faza."
    }
}

@app.route('/')
def home():
    if MAINTENANCE_MODE:
        return render_template('maintenance.html'), 503
        
    page_data = {
        "skills": {
            "technical": [
                {
                    "title_key": "skill_subcat_it",
                    "skills": [
                        {"key": "skill_item_maintenance", "icon": "tool"},
                        {"key": "skill_item_networking", "icon": "wifi"},
                        {"key": "skill_item_os", "icon": "hard-drive"}
                    ]
                },
                {
                    "title_key": "skill_subcat_dev",
                    "skills": [
                        {"key": "skill_item_frontend_backend", "icon": "code"},
                        {"key": "skill_item_db", "icon": "database"},
                        {"key": "skill_item_uiux", "icon": "layout"}
                    ]
                },
                {
                    "title_key": "skill_subcat_tools",
                    "skills": [
                        {"key": "skill_item_vscode", "icon": "terminal"},
                        {"key": "skill_item_xampp", "icon": "server"},
                        {"key": "skill_item_cisco", "icon": "git-branch"},
                        {"key": "skill_item_figma", "icon": "pen-tool"}
                    ]
                }
            ],
            "others": [
                {
                    "title_key": "skills_cat_nontech",
                    "skills": [
                        {"key": "skill_item_problem_solving", "icon": "key"},
                        {"key": "skill_item_teamwork", "icon": "users"},
                        {"key": "skill_item_attention", "icon": "eye"}
                    ]
                },
                {
                    "title_key": "skills_cat_lang",
                    "skills": [
                        {"key": "skill_item_lang_id", "icon": "flag"},
                        {"key": "skill_item_lang_en", "icon": "globe"}
                    ]
                }
            ]
        },
        "education_and_orgs": [
            {
                "institution_key": "edu_1_institution",
                "major_key": "edu_1_major",
                "period_key": "edu_1_period",
                "desc_key": "edu_1_desc",
                "organizations": [
                    {
                        "name_key": "org_1_name",
                        "role_key": "org_1_role",
                        "period_key": "org_1_period",
                        "desc_key": "org_1_desc",
                        "details_button": True
                    },
                    {
                        "name_key": "org_2_name",
                        "role_key": "org_2_role",
                        "period_key": "org_2_period",
                        "desc_key": "org_2_desc",
                        "details_button": False
                    }
                ]
            },
            {
                "institution_key": "edu_2_institution",
                "major_key": "edu_2_major",
                "period_key": "edu_2_period",
                "desc_key": "edu_2_desc",
                "organizations": []
            }
        ]
    }

    initial_data = {
        "work_experiences": [
            {"gallery_images": ["pmt1.jpeg", "pmt2.jpeg", "pmt3.jpeg", "pmt4.jpeg"]},
            {"gallery_images": ["arjuna1.png", "arjuna2.png", "arjuna3.png", "arjuna4.png"]}
        ],
        "projects": [
            {'tech': ['C/C++', 'Arduino'], 'gallery_images': ['smk3.jpeg', 'smk2.jpeg','smk1.jpeg'], 'video_file': 'smkv.mp4', 'github_url': 'https://github.com/Raka-coder/project-smarthome-pio', 'external_url': '#'},
            {'tech': ['HTML', 'CSS', 'JavaScript', 'PHP'], 'gallery_images': ['ui-1.jpg', 'ui-2.jpg'], 'video_file': 'webgis.mp4', 'github_url': '#', 'external_url': '#'},
            {'tech': ['Next.js', 'TypeScript', 'API'], 'gallery_images': [], 'video_file': '', 'github_url': '#', 'external_url': 'https://mail-za.vercel.app/'}
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
        page_data=page_data
    )

@app.route('/organization')
def organization():
    if MAINTENANCE_MODE:
        return render_template('maintenance.html'), 503
    return render_template('organization.html', translations_json=json.dumps(translations))

@app.route('/maintenance')
def maintenance():
    return render_template('maintenance.html'), 503

if __name__ == '__main__':
    app.run(debug=True)
