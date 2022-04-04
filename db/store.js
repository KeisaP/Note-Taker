const util = require('util');
const fs = require('fs');


const uuidv1 = require('uuid/v1');

const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);

class Store {
  read() {
    return readFromFile('db/db.json', 'utf8');
  }

  write(note) {
    return writeToFile('db/db.json', JSON.stringify(note));
  }

  addNote(note) {
    const { title, text } = note

    if (!title || !text) {
        throw new Error("title and text cannot be blank")
    }

    const newNote = { title, text, id: uuid() }

    return this.getNotes()
        .then(notes => [...notes, newNote])
        .then(updatedNotes => this.write(updatedNotes))
        .then(() => this.newNote)
}

getNotes() {
    return this.read()
        .then(notes => {
            return JSON.parse(notes) || [];
        })
}
removeNote(id) {
    return this.getNotes()
        .then(notes => notes.filter(note => note.id !== id))
        .then(keptNotes => this.write(keptNotes))
}
}

module.exports = new Store();
