'use strict';

const fs = require('fs');
const formidable = require('koa-formidable');
const uuid = require('uuid/v4');

module.exports = async (req, ctx, type) => {
    function resolveForm() {
        return new Promise((resolve, reject) => {   //  eslint-disable-line
            formData((opts, formObj) => {
                resolve({
                    fields: formObj.fields,
                    files: formObj.files,
                });
            });
        });
    }

    const imgReg = /\.((j|J)(p|P)(e|E)?(g|G)|(p|P)(n|N)(g|G)|(g|G)(i|I)(f|F)|(b|B)(m|M)(p|P)|(s|S)(v|V)(g|G ))$/;
    const extReg = /\.[^.]+$/;

    const formData = formidable.parse(req);
    const {
        files,
    } = await resolveForm(formData);
    const fileOpts = {
        fileData: fs.readFileSync(files.file.path),
        data: {},
    };
    const originalFileName = files.file ? (files.file.name || '') : '';
    const ext = originalFileName.match(extReg) ? originalFileName.match(extReg)[0] : '';

    var fileName;

    switch(type) {
    case 'USER_AVATAR':
        fileName = `user/${ctx.session.user.uuid}.jpg`;
        fileOpts.message = 'avatar has been changed!';
        fileOpts.data = {
            originalFileName,
            fileName,
        };
        break;
    case 'PAPER_MATERIAL':
        fileName = `paper/${imgReg.test(ext) ? 'image' : 'attachment'}/${uuid()}${ext}`;
        fileOpts.message = 'upload paper material success!';
        fileOpts.data = {
            originalFileName,
            fileName,
        };
        break;
    default:
        fileName = '';
        fileOpts.fileData = '';
        fileOpts.data = {};
    }

    fileOpts.fileName = fileName;

    return fileOpts;
};