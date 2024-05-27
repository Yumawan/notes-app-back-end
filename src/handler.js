const {nanoid} = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    // berdasarkan catatan.txt, client hanya mengirim title, tags, dan body
    const {title, tags, body} = request.payload;

    //tapi kita perlu simpan id, createdAt, updatedAt juga di server, 
    // untuk id, kita bisa pakai nanoid (install dengan command line "npm install nanoid@3")
    const id = nanoid(16);

    //untuk tanggal pakai library global Date()
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };

    //simpan ke file notes.js
    notes.push(newNote);

    //kita perlu cek push nya berhasil atau tidak
    // untuk mengecek kita bisa pakai filter()

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    //berdasarkan nilai tersebut, kita bisa merespon request client
    if (isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        // untuk server dan client bisa saling komunikasi, salah satu cara dgn aktifkan line code dibawah
        // response.header('Access-Control-Allow-Origin','*');
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
}

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNotebyIdHandler = (request, h) => {
    const {id} = request.params;
    
    //untuk mencari note berdasarkan id bisa pakai filter()
    const note = notes.filter((n) => n.id === id)[0];
    // ga perlu lewat response karena kita kirim mengembalikannya dalam bentuk plain, otomatis code 200
    if (note !== undefined){
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }
    const response = h.response({
        status : 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editNotebyIdHandler = (request,h) => {
    const {id} = request.params;

    const {title, tags, body} = request.payload;
    const updateAt = new Date().toISOString();

    //untuk menemukan index id, pakai method yang tersedia oleh array findIndex();
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1){
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updateAt,
        };

        const response = h.response({
            status: 'success',
            data:{
                message: 'Catatan berhasil diperbarui',
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        data:{
            message: 'Gagal memperbarui catatan, Id tidak ditemukan',
        },
    });
    response.code(404);
    return response;
};

const deleteNotebyIdHandler = (request,h)=>{
    const {id} = request.params;

    const index = notes.findIndex((note)=> note.id === id);

    if (index !== -1){
        notes.splice(index,1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

module.exports = {
    addNoteHandler, 
    getAllNotesHandler, 
    getNotebyIdHandler, 
    editNotebyIdHandler, 
    deleteNotebyIdHandler
};