const Url = require('../models/Url');
const { nanoid } = require('nanoid');

const leerUrls = async (req, res) => {
  // console.log(req.user);
  try {
    const urls = await Url.find({ user: req.user.id }).lean();
    res.render('home', { urls: urls });
  } catch (error) {
    // console.log(error);
    // res.send('falló algo...');
    req.flash('mensajes', [{ msg: error.message }]);
    return res.redirect('/');
  }
};

const agregarUrl = async (req, res) => {
  const { origin } = req.body;

  try {
    const url = new Url({
      origin: origin,
      shortURL: nanoid(8),
      user: req.user.id,
    });
    await url.save();
    req.flash('mensajes', [{ msg: 'Url agregada' }]);
    res.redirect('/');
  } catch (error) {
    req.flash('mensajes', [{ msg: error.message }]);
    return res.redirect('/');
  }
};

const eliminarUrl = async (req, res) => {
  // console.log(req.user.id);
  const { id } = req.params;
  try {
    // await Url.findByIdAndDelete(id);
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error('No es tu url payaso'); // Brinca en automático al catch
    }

    await url.remove();
    req.flash('mensajes', [{ msg: 'url eliminada' }]);
    res.redirect('/');
  } catch (error) {
    req.flash('mensajes', [{ msg: error.message }]);
    return res.redirect('/');
  }
};

const editarUrlForm = async (req, res) => {
  // console.log(req.user.id);
  const { id } = req.params;
  try {
    const url = await Url.findById(id).lean();

    if (!url.user.equals(req.user.id)) {
      throw new Error('No es tu url payaso'); // Brinca en automático al catch
    }

    return res.render('home', { url });
  } catch (error) {
    req.flash('mensajes', [{ msg: error.message }]);
    return res.redirect('/');
  }
};

const editarUrl = async (req, res) => {
  const { id } = req.params;
  const { origin } = req.body;
  try {
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error('No es tu url payaso'); // Brinca en automático al catch
    }

    await url.updateOne({ origin });
    req.flash('mensajes', [{ msg: 'url editada' }]);

    // await Url.findByIdAndUpdate(id, { origin: origin });
    res.redirect('/');
  } catch (error) {
    req.flash('mensajes', [{ msg: error.message }]);
    return res.redirect('/');
  }
};

const redireccionamiento = async (req, res) => {
  const { shortURL } = req.params;
  console.log(shortURL);
  try {
    const urlDB = await Url.findOne({ shortURL: shortURL });
    res.redirect(urlDB.origin);
  } catch (error) {
    req.flash('mensajes', [{ msg: 'No existe esta url configurada' }]);
    return res.redirect('/auth/login');
  }
};

module.exports = {
  leerUrls,
  agregarUrl,
  eliminarUrl,
  editarUrlForm,
  editarUrl,
  redireccionamiento,
};
