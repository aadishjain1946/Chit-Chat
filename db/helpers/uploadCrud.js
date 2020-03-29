const path = require('path');
const uploadModel = require(path.join(__dirname, '../models/upload'));
const uploadOperations = {
    uploadData(obj, res) {
        uploadModel.create(obj, (err) => {
            if (err) {
                res.status(200).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    fetchPost(dta, res) {
        uploadModel.find({ "userId": dta }, (err, docs) => {
            if (err) {
                res.status(200).send({ status: 500, message: 'Err' });
            }
            else {
                noti = [];
                for (i = docs.length - 1; i >= 0; i--) {
                    noti.push(docs[i]);
                }
                res.status(200).send({ status: 200, data: noti });
            }
        })
    },
    liked(obj, res) {
        uploadModel.updateOne({ "imgId": obj.imgId }, { $push: { likes: obj.user } }, (err) => {
            if (err) {
                res.status(200).send({ status: 500, message: 'Err' });
            }
            else {
                res.status(200).send({ status: 200 });
            }
        })
    },
    disliked(obj, res) {
        uploadModel.updateOne({ "imgId": obj.imgId }, { $pull: { likes: obj.user } }, (err) => {
            if (err) {
                res.status(200).send({ status: 500, message: 'Err' });
            }
            else {
                res.status(200).send({ status: 200 });
            }
        })
    }
}
module.exports = uploadOperations;