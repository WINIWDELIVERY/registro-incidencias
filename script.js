// Configurar Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

function subirFoto() {
    const file = document.getElementById('fileInput').files[0];
    const descripcion = document.getElementById('descripcion').value;
    
    if (!file || !descripcion) {
        alert('Selecciona una imagen y escribe una descripción.');
        return;
    }
    
    const storageRef = storage.ref('incidencias/' + file.name);
    storageRef.put(file).then(snapshot => {
        storageRef.getDownloadURL().then(url => {
            db.collection('incidencias').add({
                descripcion: descripcion,
                foto_url: url,
                fecha: new Date()
            }).then(() => {
                alert('Incidencia subida exitosamente');
                mostrarIncidencias();
            });
        });
    });
}

function mostrarIncidencias() {
    const lista = document.getElementById('incidenciasLista');
    lista.innerHTML = '';
    
    db.collection('incidencias').orderBy('fecha', 'desc').get().then(snapshot => {
        snapshot.forEach(doc => {
            const li = document.createElement('li');
            li.innerHTML = `<img src="${doc.data().foto_url}" width="100"> ${doc.data().descripcion}`;
            lista.appendChild(li);
        });
    });
}

window.onload = mostrarIncidencias;