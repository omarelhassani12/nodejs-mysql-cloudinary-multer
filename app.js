require('dotenv').config();
const express = require('express');
const app = express();
const upload = require('./multer');
const connection = require('./database');
const cloudinary = require('cloudinary').v2;



cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


function uploadImage(req, res, next) {
    upload.single('image')(req, res, (err) => {
        if (err) {
            throw err;
        }

        const imageFile = req.file;
        const { originalname, mimetype, buffer } = imageFile;

        cloudinary.uploader
            .upload_stream((error, result) => {
                if (error) {
                    throw error;
                }

                const { public_id } = result;

                const url = cloudinary.url(public_id, {
                    width: 180,
                    height: 250,
                    crop: "fill",
                });

                const data = {
                    name: originalname,
                    type: mimetype,
                    url: url,
                    public_id: public_id,
                };

                const sql = "INSERT INTO images SET ?";

                connection.query(sql, data, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.json({
                        message: "Image uploaded successfully",
                    });
                });
            })
            .end(buffer);
    });
}


app.post('/upload', uploadImage);



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/images',(req, res)=>{
    const sql = "SELECT * FROM images";

    connection.query(sql, (err,result)=>{
        if(err) throw err;
        res.json(result);
    });
} )

let port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
