/** DALAM MEMBUAT SERVER BACK-END, PACKAGE YANG BIASANYA DIGUNAKAN:=====================
 * kita menggunakan package nodemon yang digunakan untuk pengembangan
 * karena setiap kali update program, kita tidak perlu menjalankan ulang server
 * untuk install "npm install nodemon --save-dev"
*/

console.log('Testt');

/**package yang kedua ada eslint yang mengevaluasi kode yang ditulis berdasarkan aturan
 * install dengan command "npm install eslint --save-dev"
 * sebelum menggunakannya, perlu dikonfigurasi dlu dengan command "npx eslint --init"
 * kemudian kita juga perlu tambah npm runner di package.json "lint":"eslint ./"
 * EDIT: KURANG PENTING!
 */

/** dalam melakukan project, selalu perhatikan prinsip single responsibility approach
 * jadi, satu berkas js itu untuk satu tujuan saja
 * jadi untuk proyek ini, setidaknya perlu 4 file js
 * 1. server.js: untuk memuat kode untuk create, configure, dan run server http
 * 2. routes.js: untuk konfigurasi routing server
 * 3. handler.js: untuk fungsi-fungsi yang digunakan oleh routes.js
 * 4. notes.js: untuk memuat data note yang disimpan dlm bentuk array objek
 * 
 * pisahkan source code tersebut ke dalam folder src agar terpisha dari berkas konfigurasi proyek
 */

const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        // agar client dan server bisa saling komunikasi, diperlukan mekanisme "Cross-origin resource sharing (CORS)"
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);

    await server.start();
    console.log(`Server jalan pada ${server.info.uri}`);
}

init();