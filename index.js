const fs = require('fs')
const utils = require('util')
const writeFile = utils.promisify(fs.writeFile)
const path = require('path')
const mjml2html = require('mjml')
const Handlebars = require("handlebars")

const successOrder = {
    orderId: '1541234',
    status: 'NEW',
    createAt: '12.04.2021',
    paySum: 300,
    totalSum: 1200,
    name: 'Константин Константинович Константинопольский',
    phone: '+7 (900) 675-09-00',
    email: 'konstantinopolsky@yandex.ru',
    delivery: 'г. Москва, ул. Вечная, д. 12, кв. 56',
    total: 1000,
    scores: 200
}

const orders = [
    {
        name: 'Массажёр для лица',
        description: 'Просто у меня есть определенный регламент по времени на выполнение моих задач.',
        image: 'http://191n.mj.am/img/191n/3s/x4v.jpg',
        price: '2500',
        quantity: '2',
    },
    {
        name: 'Массажёр для лица',
        description: 'Просто у меня есть определенный регламент по времени на выполнение моих задач.',
        image: 'http://191n.mj.am/img/191n/3s/x4g.jpg',
        price: '1900',
        quantity: '1',
    },
    {
        name: 'Массажёр для лица',
        description: 'Просто у меня есть определенный регламент по времени на выполнение моих задач.',
        image: 'http://191n.mj.am/img/191n/3s/x46.jpg',
        price: '3800',
        quantity: '3',
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
        const orderBodyMjml = fs.readFileSync(path.join(__dirname, 'order', 'successOrderBody.hbs'), 'utf8')
        const productsMjml = fs.readFileSync(path.join(__dirname, 'order', 'orderSuccess.hbs'), 'utf8')

        const orderBodyTemplate = Handlebars.compile(orderBodyMjml)
        const productsTemplate = Handlebars.compile(productsMjml)

        Handlebars.registerPartial('Body', orderBodyTemplate({orderId, orderStatus}) + productsTemplate({items, ...successOrder}));

        const {html} = mjml2html(this.#createEmail({name: this.#username}))

        return html
    }

}

const email = new Email({file: 'input.hbs', username: 'Михаил'})
const t = email.createRecentlyOrder({items: orders, orderStatus: 'CLOSED', orderId: '№295034'})

writeFile('test.html', t)
