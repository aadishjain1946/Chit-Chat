const path = require('path');
const chatModel = require(path.join(__dirname, '../models/chat'));
const chatOperations = {
    newChat(data, res) {
        chatModel.findOne({ $or: [{ "chatId": data.src1 + data.src2 }, { "chatId": data.src2 + data.src1 }] }, (err, doc) => {
            if (!doc || doc.length == 0) {
                chatModel.create({ chatId: data.src1 + data.src2, userId1: data.src1, userId2: data.src2 }, (err, doc) => {
                    if (!err) {
                        res.status(200).send({ c: true, doc: doc });
                    }
                    else {
                        console.log(err)
                        res.status(400).send({ c: false });
                    }
                })
            }
            else {
                res.status(200).send({ c: true, s: true, doc: doc });
            }
        })
    },
    searchChatuser(id, res) {
        chatModel.findOne({ "chatId": id }, (err, doc) => {
            if (!err) {
                res.status(200).send({ doc: doc })
            }
            else {
                res.status(400).send({ err: true });
            }
        })
    },
    updatechats(chat) {
        chatModel.updateOne({ chatId: chat.chatid }, { $push: { data: chat } },(err,doc)=>{
            if(err){
                console.log(err);
            }
        })
    }
}
module.exports = chatOperations;