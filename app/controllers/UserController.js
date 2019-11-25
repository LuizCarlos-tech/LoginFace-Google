const { User } = require('../models');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../../config/passport/config').jwtSecret;
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcrypt');

module.exports = {
    // facebook
    async createF(req, res) {
        const { name, email, url_image, id_facebook } = req.body;
        
        if (!name || !email || !url_image || !id_facebook)
          return res.send({
            error: "Erro ao Cadastrar",
            deion: "Falha no cadastro."
          });
    
        const newUserf = { name, email, url_image, id_facebook };
        

        try {
          const verifica = await User.findOne({
                where: { id_facebook: id_facebook }
              });

        if(verifica == null){
          const face = await User.create(newUserf);
          return res.json(face);

            }else{
                return res.json("User já existe");
            }

        } catch (err) {
  
          return res.json({
            error: "Erro ao Cadastrar",
            deion: "Erro no Servidor.",
            err
          });
        }
      },

      async deleteF(req, res) {
        //Deletar User facebook
        try {
          const face = await User.destroy({
            where: { id_facebook: req.params.id }
          });
  
          return res.send({ face });
        } catch (err) {
  
          return res.send({
            error: "Erro ao Deletar",
            deion: "Erro no Servidor",
            err
          });
        }
      },

          // Google
    async createG(req, res) {
        const { name, email, url_image, id_google } = req.body;
        
        if (!name || !email || !url_image || !id_google)
          return res.send({
            error: "Erro ao Cadastrar",
            deion: "Falha no cadastro."
          });
    
        const newUserg = { name, email, url_image, id_google };
          
        try {
            const verifica = await User.findOne({
                where: { id_google: id_google }
              });

        if(verifica == null){
          const goo = await User.create(newUserg);
          return res.json(goo);
            }else{
                return res.json("User já existe");
            }
        } catch (err) {
  
          return res.json({
            error: "Erro ao Cadastrar",
            deion: "Erro no Servidor.",
            err
          });
        }
      },

      async deleteG(req, res) {
        //Deletar User Google
        try {
          const goo = await User.destroy({
            where: { id_google: req.params.id }
          });
  
          return res.send({ goo });
        } catch (err) {
  
          return res.send({
            error: "Erro ao Deletar",
            description: "Erro no Servidor",
            err
          });
        }
      },
    // List all users
    async index(req, res) {
        try {
            const users = await User.findAll();
            
            users.password = undefined;
            return res.status(200).json({users});
        } catch (err) {
            return res.status(422).json({ error : 'Unable to list all users' });
        }
    },
    // List only one user
    async show(req, res) {
        try {
            const id = await jwt.verify(req.params.token, jwtSecret).id;
            const user = await User.findOne({where : { id }});

            user.password = undefined;
            res.status(200).json(user);
        } catch (err) {
            return res.status(422).json({ error : 'Unable to list user' });
        }
    },
    // Create a new user
    async create(req, res) {
        const { name, email, password, admin, url_image } = req.body;
        const newUser = { name, email, password, admin, url_image };
        const user = await User.findOne({where : { email }});
        
        if( user === null ){
            try {
                const user = await User.create(newUser);
                
                user.password = undefined;
                res.status(200).json(user);
            } catch (err) {
                return res.status(422).json({ error: 'error registering new user' });
            }
        } else {
            if(email !== user.email) {
                try {
                    const user = await User.create(newUser);
                    user.password = undefined;
                    res.status(200).json(user);
                } catch (err) {
                    return res.status(422).json({ error: 'error registering new user' });
                }
            } else {
                res.status(422).json('Erro ao registrar usuário, email já cadastrado');
            }
        }
    },
    // Update user data
    async update(req, res) {
        const { name, newpassword, url_image } = req.body;
        
        let { password } = req.body

        const id = await jwt.verify(req.params.token, jwtSecret).id;
        const user = await User.findOne({where: { id }});
        
        if(!await bcryptjs.compare(password, user.password))
            return res.status(422).json({ error:'invalid password' });

        bcrypt.genSalt(8, async (err, salt)=> {
            if (err) {
                return res.status(422).json({ error: 'Error generating password' });
            }
            bcrypt.hash(newpassword, salt, async (err, hash) => {
                if (err) {
                    return res.status(422).json({ error: 'Error generating password' });
                }
                password = hash;
                
                try {
                    const user = await User.update({
                        name, password, url_image, updatedAt: Date.now
                    }, { where : { id }});
                    return res.status(200).json( 'Name and password successfully changed' );
                } catch (err) {
                    return res.status(422).json({ error: 'Error Updating' });
                }
            });
        });
    },
    // Delete a user
    async delete(req, res) {
        try {
            const id = await jwt.verify(req.params.token, jwtSecret).id;
            const user = await User.destroy({where : {id}});
            return res.status(200).json('User successfully removed');
        } catch (err) {
            return res.status(422).json({ error: 'Error deleting user' });
        }
    },
}