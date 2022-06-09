const express = require('express');
const app = express();
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const fs = require('fs')

// Middleware body-parser para analizar el body del payload mediante la propiedad req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware para carga de archivos
app.use(
    expressFileUpload({
        limits: { fileSize: 5000000 }, // establece un peso maximo de 5MB 
        abortOnLimit: true,
        responseOnLimit: 'El peso del archivo supera el limite permitido.',
}));

app.listen(3000, console.log("Servidor corriendo en http://localhost:3000/"))

// Carpeta public
app.use(express.static("public"));

// Disponibiliza ruta raíz
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/formulario.html')
})

// Disponibiliza ruta POST "/imagen" para almacenar una imagen en la carpeta public
app.post('/imagen', (req, res) => {
    console.log(req.body)
    const { target_file } = req.files;
    const { posicion } = req.body;
    target_file.mv(`${__dirname}/public/imgs/imagen-${posicion}.jpg`, (err) => {
        res.redirect('/collage');
    });
});

// Disponibiliza ruta GET "/imagen"
app.get("/collage", (req, res) => {
    res.sendFile(__dirname + '/collage.html')
})

// ruta GET "/deleteImg/:nombre" que recibe como parámetro el nombre de la imagen y la elimine al hacer click.
app.delete("/imagen/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/public/imgs/${nombre}.jpg`, (err) => {
        res.send(`Imagen ${nombre} fue eliminada con éxito`);
    });
});

// Disponibiliza ruta GET "/deleteImg/:nombre" que recibe como parametro el nombre de la imagen y la elimine
app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
        res.redirect("/collage")
    });
});

// Disponibiliza rutas no declaradas
app.get('*', (req, res) => {
    res.send(`<br><center><h1>Pagina no encontrada 404</h1></center>`)
})
