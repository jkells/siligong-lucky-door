const _ = require("lodash")
const fetch = require("node-fetch")
const clear = require("clear")
const terminalImage = require("terminal-image")

const getImage = async rsvp => {
    const url = rsvp.member.photo ? rsvp.member.photo.photo_link : "https://secure.meetupstatic.com/photos/event/8/a/b/3/600_470975507.jpeg"
    const imgResponse = await fetch(url)
    return terminalImage.buffer(await imgResponse.buffer(), { height: "60%" })
}

const doWelcome = async (length) => {
    clear()
    console.log()
    console.log("Siligong.js Lucky Door prize generator")
    console.log(`Picking a winner out of ${length} attendees`)
    await sleep(5000)
    clear()
    console.log()
}

const sleep = (x) => new Promise((resolve) => setTimeout(() => resolve(), x))

const luckyDoor = async () => {
    // You'll need a pre-signed URL for this to work, I've deleted the signature.
    // Use this: https://secure.meetup.com/meetup_api/console/?path=/:urlname/events/:event_id/rsvps
    const response = await fetch("https://api.meetup.com/SiligongValley/events/257181487/rsvps?photo-host=public&response=yes")
    const rsvps = _.shuffle(await response.json())
    await doWelcome(rsvps.length)
    const images = await Promise.all(rsvps.map(getImage))

    let i = rsvps.length * 2
    do {
        const winner = rsvps[i % rsvps.length]
        const photo = images[i % rsvps.length]

        clear()
        console.log()
        console.log(photo)
        console.log(winner.member.name)

        await sleep(Math.pow(rsvps.length - i, 2) / 3000 + 500)
    } while (--i)

    clear()
    console.log()
    const winner = rsvps[i % rsvps.length]
    const photo = images[i % rsvps.length]
    console.log(photo)
    console.error("THE WINNER IS:", winner.member.name, "!!!!!")
}

luckyDoor()
