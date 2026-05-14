import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const livroSchema = new mongoose.Schema(
  {
    id: {type: String},
    titulo: {type: String, required: true},
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'autores',
      required: [true, "O(a) autor(a) é obrigatório"],
      autopopulate: true
    },
    editora: {type: String, required: true},
    numeroPaginas: {type: Number}
  }
);

livroSchema.plugin(autopopulate);

const livros= mongoose.model('livros', livroSchema);

export default livros;