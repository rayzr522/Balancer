const fse = require('fs-extra');
const lowdb = require('lowdb');

fse.ensureDirSync('data');
const db = lowdb('data/settings.json');

db.defaults({ settings: [] })
    .write();

exports.get = (id) => {
    const value = db.get('settings')
        .find({ id })
        .value()

    if (typeof value === 'undefined') {
        return db.get('settings')
            .push({ id })
            .write();
    }

    return value;
}

exports.set = (id, settings) => {
    const value = db.get('settings')
        .find({ id })
        .assign(settings)
        .write();

    return value;
}