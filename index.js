const fs = require('fs')
const utils = require('util')
const writeFile = utils.promisify(fs.writeFile)
const path = require('path')
const mjml2html = require('mjml')
const Handlebars = require("handlebars")


const orders = [
    {
        name: 'Массажёр для лица',
        supplier: 'Новая Волна',
        image: 'http://191n.mj.am/img/191n/3s/x4v.jpg'
    },
    {
        name: 'Массажёр для лица',
        supplier: 'Новая Волна',
        image: 'http://191n.mj.am/img/191n/3s/x4g.jpg'
    },
    {
        name: 'Массажёр для лица',
        supplier: 'Новая Волна',
        image: 'http://191n.mj.am/img/191n/3s/x46.jpg'
    },
]

class Email {
    #createEmail
    #username

    constructor({username, file}) {
        this.createBaseTemplate(file)
        this.#username = username
    }

    createBaseTemplate(file) {
        const mjml = fs.readFileSync(path.resolve(__dirname, file), 'utf8')
        this.#createEmail = Handlebars.compile(mjml)
    }

    createRecentlyOrder({items, orderId, orderStatus}) {
        const orderBodyMjml = fs.readFileSync(path.join(__dirname, 'order', 'order-body.hbs'), 'utf8')
        const productsMjml = fs.readFileSync(path.join(__dirname, 'order', 'product-items.hbs'), 'utf8')

        const orderBodyTemplate = Handlebars.compile(orderBodyMjml)
        const productsTemplate = Handlebars.compile(productsMjml)

        Handlebars.registerPartial('Body', orderBodyTemplate({orderId, orderStatus}) + productsTemplate({items}));

        const {html} = mjml2html(this.#createEmail({name: this.#username}))

        return html
    }

}

const email = new Email({file: 'input.hbs', username: 'Михаил'})
const t = email.createRecentlyOrder({items: orders, orderStatus: 'CLOSED', orderId: '№295034'})

writeFile('test.html', t)
