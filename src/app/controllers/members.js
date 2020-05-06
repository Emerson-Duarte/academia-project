const { age, date } = require('../../lib/utils')

const Member = require('../models/Member')

module.exports = {
    index(req, res){

        Member.all(function(members) {
            return res.render("members/index", { members })
        })
    },
    
    show(req, res) {
        Member.find(req.params.id, function(member){
            if(!member) return res.send("Member not found!")

            member.birth = date(member.birth).birthDay

            return res.render ("members/show", { member })
        })
    },

    create(req, res) {

        Member.instrucorsSelectOptions(function(options) {
            return res.render('members/create', { instructorOptions: options })
        })

    },

    post(req, res) {
         //VALIDAÇAO, pega o body, coloca em uma variavel faz um FOR pra ver se tem algum campo vazio
         const keys = Object.keys(req.body)

         for(key of keys){
             if(req.body[key] == ""){
                 return res.send("Preencher todos os campos!")
             }
         }

         Member.create(req.body, function( member ) {
             return res.redirect(`/members/{member.id}`)
         })
        
       

    },

    edit(req, res) {
        Member.find(req.params.id, function(member){
            if(!member) return res.send("Member not found!")

            member.birth = date(member.birth).iso

            Member.instrucorsSelectOptions(function(options) {
                return res.render('members/edit', { member, instructorOptions: options })
            })

        })
    },

    put(req, res) {
         //VALIDAÇAO, pega o body, coloca em uma variavel faz um FOR pra ver se tem algum campo vazio
    const keys = Object.keys(req.body)

    for(key of keys){
        if(req.body[key] == ""){
            return res.send("Preencher todos os campos!")
        }
    }

        Member.update(req.body, function() {
            return res.redirect(`/members/${req.body.id}`)
        })
    },

    delete(req, res) {
        Member.delete(req.body.id, function() {
            return res.redirect(`/members`)
        })
    }
}