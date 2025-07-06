from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    # Data untuk Ringkasan
    summary = "Saya mahasiswa Teknik Informatika yang tertarik pada divisi IT Support. Memiliki 9 bulan pengalaman PKL dalam divisi Preventive Maintenance & Pemeliharaan Dasar Hardware, Dasar-dasar Jaringan (Networking). Berpengalaman dalam lingkungan kerja yang membutuhkan ketelitian dan respons cepat. Siap untuk segera memberikan dukungan teknis dan berkontribusi dalam tim Anda."

    # Data untuk Riwayat Pendidikan
    education_data = [
        {
            "institution": "Universitas Dian Nuswantoro Semarang",
            "period": "2024 - Sekarang",
            "major": "D3 Teknik Informatika | IPK Sementara: 3.67 / 4.00",
            "details": ["Sistem Operasi Jaringan & Komputer", "Dasar Pemrograman & Komputasi", "Interaksi Manusia & Komputer", "Analisa Perancangan Perangkat Lunak", "Proyek Aplikasi Web", "Algoritma Struktur Data", "Basis Data"]
        },
        {
            "institution": "SMK Negeri 2 Kota Tasikmalaya",
            "period": "2020 - 2024",
            "major": "Sistem Informasi, Jaringan & Aplikasi (Program 4 Tahun)",
            "details": ["Termasuk 9 bulan Praktik Kerja Lapangan (PKL) yang berfokus pada Preventive Maintenance dan Networking."]
        }
    ]

    # Data untuk Pengalaman Praktik Kerja Lapangan dengan Galeri
    work_experiences = [
        {
            "role": "Preventive Maintenance",
            "organization": "PT. Putra Telecommunication",
            "period": "Agustus 2023 - November 2023",
            "responsibilities": ["Preventif Maintenance.", "Bertanggung jawab atas kebersihan ruang perangkat (shelter) dan komponen di dalamnya untuk mencegah potensi gangguan sinyal.", "Bekerja sesuai dengan standar K3 yang berlaku untuk pekerjaan di ketinggian dan di sekitar perangkat listrik."],
            "gallery_images": ["pmt1.jpeg", "pmt2.jpeg", "pmt3.jpeg", "pmt4.jpeg"]
        },
        {
            "role": "Technical Support",
            "organization": "CV. Arjuna Jaya Sakti",
            "period": "Maret 2023 - Juli 2023",
            "responsibilities": ["Melakukan Troubleshooting, konfigurasi, dan pemeliharaan rutin CCTV.", "Memberikan dukungan teknis dan operasional.", "Membantu operasional kantor dan merancang konten video."],
            "gallery_images": ["arjuna1.png", "arjuna2.png", "arjuna3.png", "arjuna4.png"]
        }
    ]

    # Data untuk Pengalaman Organisasi
    organizations = [
        {"role": "Divisi Media", "organization": "Himpunan Mahasiswa DTI", "period": "2024 - Sekarang"},
        {"role": "Member", "organization": "Google Developer Student Clubs (GDSC) UDINUS", "period": "2024 - Sekarang"}
    ]
    
    # Data Skills
    skills_data = {
        "Teknis": {
            "Infrastruktur & Dukungan IT": ["Hardware-Software Maintenance and Troubleshooting", "Jaringan Dasar (Konfigurasi Router)", "Instalasi & Konfigurasi Sistem Operasi Windows"],
            "Pengembangan Web & Database": ["Front-End (HTML, CSS, JavaScript Dasar)", "Back-End (PHP Dasar)", "Python (Flask)", "Pengelolaan Database Dasar (MySQL)", "Design Web UI/UX"],
            "Tools & Perangkat Lunak": ["Visual Studio Code", "Xcode", "XAMPP", "Cisco", "Figma", "Microsoft Office (Word, Excel, PowerPoint)"]
        },
        "Non-Teknis": ["Pemecahan Masalah (Problem-Solving)", "Kerja Sama Tim & Kolaborasi", "Ketelitian (Attention to Detail)"],
        "Bahasa": ["Indonesia", "Inggris"]
    }

    # Data Proyek dengan Galeri Foto dan Video
    projects = [
        {
            'title': 'Project Smart Lamp (IoT)', 
            'description': 'Sistem pengendalian lampu otomatis menggunakan aplikasi Google Assistant', 
            'tech': ['C/C++', 'Arduino'],
            'gallery_images': ['smk3.jpeg', 'smk2.jpeg','smk1.jpeg'],
            'video_file': 'smkv.mp4'
        },
        {
            'title': 'Website Peta : QGIS + Database + API', 
            'description':'WebGIS interaktif berbasis QGIS yang terhubung database dan dapat diedit langsung melalui backend.', 
            'tech': ['HTML', 'CSS', 'JavaScript', 'PHP'],
            'gallery_images': ['ui-1.jpg', 'ui-2.jpg'],
            'video_file': 'webgis.mp4'
        }
    ]

    # Link ke folder Google Drive sertifikat Anda
    certificate_link = "https://drive.google.com/drive/folders/1Zah1VfcO4CHtFoAsclDLXG5zsPInj3LA?usp=sharing"
    
    # Data Pencapaian
    achievements_data = [
        {
            "title": "Pemenang Merchandise Tier 1 di #JuaraGCP Season 11 2025!",
            "organizer": "Google Cloud",
            "date": "Mei 2025",
            "description": "Termasuk kedalam 1000 peserta dengan nilai terbaik yang menyelesaikan completion form dan mengikuti online quiz, dan mendapatkan SWAG keren dari Google Cloud berupa : Bantal Leher, Stiker, dan Gantungan Kunci.",
            "thumbnail": "gcp1.jpeg",
            "gallery_images": ["gcp1.jpeg", "gcp2.jpeg", "gcp3.jpeg", "gcp4.jpeg", "gcp5.jpeg"]
        }
    ]

    return render_template(
        'index.html',
        summary=summary,
        education_data=education_data,
        work_experiences=work_experiences,
        organizations=organizations,
        skills_data=skills_data,
        projects=projects,
        certificate_link=certificate_link,
        achievements_data=achievements_data
    )

if __name__ == '__main__':
    app.run(debug=True)