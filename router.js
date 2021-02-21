var express = require('express')
var user = require('./models/user')
var md5 = require('blueimp-md5')
var Cookies = require('js-cookie')


var router = express.Router()

router.get('/',function(req,res){
	res.cookie('name','xiaowu');

  res.render('index.html',{ user:req.session.user })

})

router.get('/login',function(req,res){
  if(req.session.user){res.redirect('/')}
    res.cookie('name', 'sd' ) 
    res.render('login.html',{})	

})

router.post('/login',function(req,res){
let body = req.body
//console.log(user)
user.findOne({
	email:body.email,
	password:md5(md5(body.password))
},function(err,data){
if(err){
return	res.status(500).json({
     err_code:500,
     err_message:'server err'

	})
}
if(!data){
return res.status(200).json({
err_code:1,
err_message:'账号或者密码重复'
})
}


 req.session.user =  data

res.status(200).json({
err_code:0,
err_message:'登录成功'

})


})


})
 

router.get('/register',function(req,res){
	res.render('register.html')

})

router.post('/register',function(req,res){
	var body = req.body
  	user.findOne({
		$or:[{email:body.email},{nickname:body.nickname}]
	},function(err,data){
		if(err){  return res.status(500).json({
			err_code:500,
			message:'server error'
		})}
			if(data){
				return res.status(200).json({
					err_code:1,
					message:'email or nickname already exists.'
				})
 
}
              body.password = md5(md5(body.password))

				new user(body).save(function(err,user){
					if(err){
						return res.status(500).json({
							err_code:500,
							message:'server(internal) error'
						})
					}

                    req.session.user = user
                   // console.log(req.session.user)
                   res.status(200).json({
						err_code:0,
						message:'ok'
                    })

                 
                         })

		 
		})

})

router.get('/logout',function(req,res){
//req.session.user = null
delete req.session.user  //这样更加严谨
res.redirect('/')

})


module.exports = router