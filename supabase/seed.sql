-- ==============================================================================
-- BINA PROJECT SUPABASE SEED DATA
-- ==============================================================================

INSERT INTO public.projects (slug, title, category, location, project_date, client, description, cover_image, gallery_images, featured)
VALUES
(
    'sdi-nur-multazam',
    'SDI Nur Multazam',
    'Eksterior',
    'Kota Malang, Jawa Timur',
    '15 Januari 2024',
    'Yayasan Nur Multazam',
    'Pembangunan gedung sarana pendidikan modern SDI Nur Multazam dengan mengedepankan efisiensi sirkulasi udara, pencahayaan alami, dan ketahanan struktur.',
    'assets/img/project/1.jpg',
    ARRAY[
        'assets/img/project/sdi (1).jpg',
        'assets/img/project/sdi (2).jpg',
        'assets/img/project/sdi (3).jpg',
        'assets/img/project/sdi (4).jpg',
        'assets/img/project/sdi (5).jpg',
        'assets/img/project/sdi (6).jpg',
        'assets/img/project/sdi (7).jpg',
        'assets/img/project/sdi (8).jpg',
        'assets/img/project/sdi (9).jpg',
        'assets/img/project/sdi (10).jpg',
        'assets/img/project/sdi (11).jpg',
        'assets/img/project/sdi (12).jpg',
        'assets/img/project/sdi (13).jpg',
        'assets/img/project/sdi (14).jpg',
        'assets/img/project/sdi (15).jpg',
        'assets/img/project/sdi (16).jpg',
        'assets/img/project/sdi (17).jpg',
        'assets/img/project/sdi (18).jpg',
        'assets/img/project/sdi (19).jpg',
        'assets/img/project/sdi (20).jpg'
    ],
    true
),
(
    'villa',
    'Villa Modern Batu',
    'Eksterior',
    'Kota Batu, Jawa Timur',
    '13 Juni 2024',
    'Private Client',
    'Desain dan konstruksi villa peristirahatan keluarga dengan konsep tropis modern yang menyatu dengan panorama alam pegunungan Kota Batu.',
    'assets/img/project/2.jpg',
    ARRAY[
        'assets/img/project/villa (1).jpg',
        'assets/img/project/villa (2).jpg',
        'assets/img/project/villa (3).jpg',
        'assets/img/project/villa (4).jpg',
        'assets/img/project/villa (5).jpg',
        'assets/img/project/villa (6).jpg',
        'assets/img/project/villa (7).jpg',
        'assets/img/project/villa (8).jpg',
        'assets/img/project/villa (9).jpg',
        'assets/img/project/villa (10).jpg'
    ],
    true
),
(
    'cafe-batu',
    'Cafe Batu Estetik',
    'Interior',
    'Kota Batu, Jawa Timur',
    '20 Maret 2024',
    'Owner Cafe Batu',
    'Konsep interior cafe kekinian dengan perpaduan material kayu hangat, pencahayaan dramatis, dan layout tempat duduk yang memaksimalkan kapasitas pelanggan.',
    'assets/img/project/3.jpg',
    ARRAY[
        'assets/img/project/cafe-batu (1).jpg',
        'assets/img/project/cafe-batu (2).jpg',
        'assets/img/project/cafe-batu (3).jpg',
        'assets/img/project/cafe-batu (4).jpg'
    ],
    true
),
(
    'rosana',
    'Rosana Residence',
    'Eksterior',
    'Pasuruan, Jawa Timur',
    '10 April 2024',
    'Rosana Group',
    'Pengembangan kawasan hunian residensial yang nyaman, kokoh, dan berkelas dengan fasad kontemporer minimalis.',
    'assets/img/project/4.jpg',
    ARRAY[
        'assets/img/project/rosana (1).jpg',
        'assets/img/project/rosana (2).jpg',
        'assets/img/project/rosana (3).jpg',
        'assets/img/project/rosana (4).jpg',
        'assets/img/project/rosana (5).jpg',
        'assets/img/project/rosana (6).jpg',
        'assets/img/project/rosana (7).jpg',
        'assets/img/project/rosana (8).jpg',
        'assets/img/project/rosana (9).jpg',
        'assets/img/project/rosana (10).jpg'
    ],
    false
),
(
    'rosana-collection',
    'Rosana Collection Store',
    'Interior',
    'Pasuruan, Jawa Timur',
    '22 Mei 2024',
    'Rosana Collection',
    'Penataan interior toko ritel busana dan butik eksklusif dengan display produk yang terorganisir serta pencahayaan aksen yang menarik minat pengunjung.',
    'assets/img/project/5.jpg',
    ARRAY[
        'assets/img/project/rosana-collection (1).jpg',
        'assets/img/project/rosana-collection (2).jpg',
        'assets/img/project/rosana-collection (3).jpg',
        'assets/img/project/rosana-collection (4).jpg',
        'assets/img/project/rosana-collection (5).jpg',
        'assets/img/project/rosana-collection (6).jpg'
    ],
    false
),
(
    'kitchen-set-dr-irfan',
    'Kitchen Set Dr. Irfan',
    'Interior',
    'Malang, Jawa Timur',
    '05 Agustus 2024',
    'Dr. Irfan',
    'Pembuatan custom kitchen set modern minimalis dengan material HPL anti gores, kabinet fungsional, dan table top marmer yang elegan.',
    'assets/img/project/6.jpg',
    ARRAY[
        'assets/img/project/kitchen-drirfan (1).jpg',
        'assets/img/project/kitchen-drirfan (2).jpg',
        'assets/img/project/kitchen-drirfan (3).jpg',
        'assets/img/project/kitchen-drirfan (4).jpg',
        'assets/img/project/kitchen-drirfan (5).jpg',
        'assets/img/project/kitchen-drirfan (6).jpg'
    ],
    true
),
(
    'kitchen-set',
    'Kitchen Set Pasuruan',
    'Interior',
    'Pasuruan, Jawa Timur',
    '18 Juli 2024',
    'Private Client',
    'Kitchen set island multifungsi untuk dapur bersih dan dapur kotor dengan sistem penyimpanan tersembunyi yang memaksimalkan ruang sempit.',
    'assets/img/project/7.jpg',
    ARRAY[
        'assets/img/project/kitchen-set-pasuruan (1).jpg',
        'assets/img/project/kitchen-set-pasuruan (2).jpg',
        'assets/img/project/kitchen-set-pasuruan (3).jpg',
        'assets/img/project/kitchen-set-pasuruan (4).jpg'
    ],
    false
),
(
    'interior-mr-samian',
    'Interior Mr. Samian',
    'Interior',
    'Kediri, Jawa Timur',
    '02 September 2024',
    'Mr. Samian',
    'Transformasi total interior rumah tinggal dengan konsep Japanese Scandinavian (Japandi) yang menenangkan, bersih, dan berestetika tinggi.',
    'assets/img/project/8.jpg',
    ARRAY[
        'assets/img/project/interior/1.jpg',
        'assets/img/project/interior/2.jpg',
        'assets/img/project/interior/3.jpg',
        'assets/img/project/interior/4.jpg',
        'assets/img/project/interior/5.jpg',
        'assets/img/project/interior/6.jpg',
        'assets/img/project/interior/7.jpg',
        'assets/img/project/interior/8.jpg',
        'assets/img/project/interior/9.jpg',
        'assets/img/project/interior/10.jpg'
    ],
    true
),
(
    'amd-academy',
    'AMD Academy Training Center',
    'Konstruksi',
    'Kota Malang, Jawa Timur',
    '14 Oktober 2024',
    'AMD Academy',
    'Renovasi dan fit-out ruang pelatihan profesional dengan partisi kedap suara dan instalasi jaringan kerja terintegrasi.',
    'assets/img/project/9.jpg',
    ARRAY[
        'assets/img/project/amd (1).jpg',
        'assets/img/project/amd (2).jpg',
        'assets/img/project/amd (3).jpg',
        'assets/img/project/amd (4).jpg'
    ],
    false
)
ON CONFLICT (slug) DO NOTHING;
