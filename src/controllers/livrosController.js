import livros from "../models/Livro.js";
import autores from "../models/Autor.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      const buscaLivros = livros.find()
      req.resultado = buscaLivros
      next()
    } catch (erro) {
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  }

  static listarLivroPorId = async (req, res) => {
    try {
      const id = req.params.id;

      const livroResultados = await livros.findById(id)
        .exec();

      res.status(200).send(livroResultados);
    } catch (erro) {
      res.status(400).send({ message: `${erro.message} - Id do livro não localizado.` });
    }
  }

  static cadastrarLivro = async (req, res) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      res.status(500).send({ message: `${erro.message} - falha ao cadastrar livro.` });
    }
  }

  static atualizarLivro = async (req, res) => {
    try {
      const id = req.params.id;

      await livros.findByIdAndUpdate(id, { $set: req.body });

      res.status(200).send({ message: "Livro atualizado com sucesso" });
    } catch (erro) {
      res.status(500).send({ message: erro.message });
    }
  }

  static excluirLivro = async (req, res) => {
    try {
      const id = req.params.id;

      await livros.findByIdAndDelete(id);

      res.status(200).send({ message: "Livro removido com sucesso" });
    } catch (erro) {
      res.status(500).send({ message: erro.message });
    }
  }

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const busca = await searchLoading(req.query)

      if (busca !== null) {
        const livrosResultado = livros.find(busca)

        req.resultado = livrosResultado

        next()
      } else {
        res.status(200).send([])
      }
    } catch (erro) {
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  }



}

async function searchLoading(param) {
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = param;
  const busca = {}

  if (editora) busca.editora = editora;
  if (titulo) busca.titulo = { $regex: titulo, $options: "i" }
  if (minPaginas || maxPaginas) busca.paginas = {}

  if (minPaginas) busca.paginas.$gte = Number(minPaginas)
  if (maxPaginas) busca.paginas.$lte = Number(maxPaginas)

  if (nomeAutor) {
    const autor = await autores.findOne({ nome: nomeAutor });

    if (autor !== null) {
      busca.autor = autor._id
    } else {
      busca = null
    }
  }

  return busca
}

export default LivroController