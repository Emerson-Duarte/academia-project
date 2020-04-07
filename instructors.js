const fs = require('fs')
const data = require('./data.json')
const { age } = require('./utils')


/* ==== SHOW ===== */
exports.show = function(req, res) {
    //req.params
    const { id } = req.params

    let foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })
    
    if (!foundInstructor) return res.send("Instructor not found!")
    
    

    let instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at)
    }
    

    return res.render('instructors/show', {instructor})
}


/* ==== CREATE ===== */

exports.post = function(req, res) {
    //VALIDAÇAO, pega o body, coloca em uma variavel faz um FOR pra ver se tem algum campo vazio
    const keys = Object.keys(req.body)

    for(key of keys){
        if(req.body[key] == ""){
            return res.send("Preencher todos os campos!")
        }
    }

    let {avatar_url, name, birth, gender, services} = req.body
    
    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)


    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at  
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect('/instructors')
    })
}

/* ==== UPDATE ===== */

/* ==== DELETE ===== */
