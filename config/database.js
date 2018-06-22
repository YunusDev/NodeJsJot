if (process.env.NODE_ENV == 'production'){

    module.exports = {

        mongoURI: 'mongodb://YunusDev:timmyayo1998@ds163700.mlab.com:63700/vidjot-me'

    }

}else{

    module.exports = {

        mongoURI: 'mongodb://localhost/vidjot'
    }

}