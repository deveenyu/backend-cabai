const Usang = require('./model');
const User = require('../users/model');

module.exports = {
  index: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myUsang = await Usang.find({
        user: user,
      }).sort({
        tanggalPencatatan: 'descending',
        createdAt: 'descending',
      });

      const usangCMB = myUsang.filter(
        (obj) => obj.tipeCabai == 'cabaiMerahBesar'
      );

      const usangCMK = myUsang.filter(
        (obj) => obj.tipeCabai == 'cabaiMerahKeriting'
      );

      const usangCRM = myUsang.filter(
        (obj) => obj.tipeCabai == 'cabaiRawitMerah'
      );

      const userDetail = await User.findById(user).select('_id name role');

      if (!myUsang) {
        res.status(404).json({
          success: false,
          message: 'Belum ada Cabai Usang yang diisi',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Berhasil melihat data Cabai Usang',
          data: { user: userDetail, usangCMB, usangCMK, usangCRM },
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  createUsang: async (req, res) => {
    try {
      const {
        tipeCabai,
        jumlahUsang,
        hargaJual,
        tanggalPencatatan,
        pemanfaatan,
      } = req.body;

      const usang = new Usang({
        user: req.userData.id,
        tipeCabai,
        jumlahUsang: jumlahUsang / 100,
        hargaJual,
        tanggalPencatatan,
        pemanfaatan,
      });
      await usang.save();

      res.status(201).json({
        success: true,
        message: 'Berhasil menambahkan Cabai Usang',
        data: usang,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: error.message || `Internal server error`,
        });
    }
  },

  seeMyUsang: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myUsang = await Usang.find({ user: user })
        .select(
          '_id tipeCabai jumlahUsang hargaJual tanggalPencatatan pemanfaatan createdAt'
        )
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        });
      console.log(myUsang[0]);

      const countAllUsang = await Usang.find({ user: user }).countDocuments();

      const userData = await User.findById(user).select('_id name role');

      if (myUsang[0] == undefined) {
        res.status(404).json({
          message: 'Belum ada Cabai Usang yang diisi',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil melihat data Cabai Usang',
          petani: userData,
          data: myUsang,
          countAllUsang: countAllUsang,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seeAUsang: async (req, res) => {
    try {
      const user = req.userData.id;
      const id = req.params.usangId;
      console.log(user);

      const aUsang = await Usang.findOne({ user: user, _id: id });
      console.log(aUsang[0]);

      const userData = await User.findById(user).select('_id name role');

      if (aUsang[0] == undefined) {
        res.status(404).json({
          message: 'Data Cabai Usang tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil melihat data Cabai Usang',
          petani: userData,
          data: aUsang,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seeTipeUsang: async (req, res) => {
    try {
      const user = req.userData.id;
      const tipeCabai = req.params.tipecabai;
      console.log(user);

      const tipeUsang = await Usang.find({
        user: user,
        tipeCabai: tipeCabai,
      }).sort({
        tanggalPencatatan: 'descending',
        createdAt: 'descending',
      });
      console.log(tipeUsang[0]);

      const userData = await User.findById(user).select('_id name');

      if (tipeUsang[0] == undefined) {
        res.status(404).json({
          message: 'Data Cabai Usang tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: `Berhasil melihat data Cabai Usang untuk tipe ${tipeCabai}`,
          user: userData,
          data: tipeUsang,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  deleteUsang: async (req, res) => {
    try {
      const id = req.params.usangId;
      const user = req.userData.id;
      console.log(user);

      const findUsang = await Usang.findOne({ _id: id });

      if (findUsang && user) {
        const usang = await Usang.findOneAndRemove({ _id: id, user: user });
        res.status(201).json({
          message: 'Berhasil menghapus data Cabai Usang',
          data: usang,
        });
      } else {
        res.status(404).json({
          message: 'Data Cabai Usang tidak ditemukan',
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },
};
