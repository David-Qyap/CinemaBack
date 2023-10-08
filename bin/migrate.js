import {
    Categories, Users, Movies, Reviews, ShowTime, Tickets, creditCard,Actor,movieActors,
} from '../models/index'

async function main() {
    await Movies.sync({ alter: true })
    await Actor.sync({ alter: true })
    await movieActors.sync({ alter: true })
    await Categories.sync({ alter: true })
    await ShowTime.sync({ alter: true })
    await Users.sync({ alter: true })
    await creditCard.sync({ alter: true })
    await Tickets.sync({ alter: true })
    await Reviews.sync({ alter: true })
    // eslint-disable-next-line no-undef
    process.exit(0)
}

main()
