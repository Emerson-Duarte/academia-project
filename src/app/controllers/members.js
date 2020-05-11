const { age, date } = require('../../lib/utils')

const Member = require('../models/Member')

module.exports = {
    index(req, res){

        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(members) {

                const pagination = {
                    total: Math.ceil(members[0].total / limit),
                    page
                }
 

                return res.render("members/index", { members, pagination, filter })
            }
        }

        Member.paginate(params)
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
             return res.redirect(`/members/${member.id}`)
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