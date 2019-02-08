const _ = require("lodash")
const fetch = require("node-fetch")
const clear = require("clear")
const terminalImage = require("terminal-image")
const { produce } = require("immer")


const getProfile = ({ member: { name, photo }}) =>
     produce({ name, photo }, async profile => {
        const url = photo ? photo.photo_link : "https://secure.meetupstatic.com/photos/event/8/a/b/3/600_470975507.jpeg"
        const imgResponse = await fetch(url)
        profile.image = await terminalImage.buffer(await imgResponse.buffer(), { height: "60%" })
    })


const showProfile = ({ name, image, isWinner = false }) => {
    clear()
    console.log()
    console.log(image)
    if (isWinner) {
        console.error("THE WINNER IS:", name, "!!!!!")
    } else {
        console.log(name)
    }
}

const doWelcome = async (length) => {
    clear()
    console.log("Siligong.js Lucky Door prize generator")
    console.log(`Picking a winner out of ${length} attendees`)
}

const sleep = (x) => new Promise((resolve) => setTimeout(() => resolve(), x))

const luckyDoor = async () => {
    // You'll need a pre-signed URL for this to work, I've deleted the signature.
    // Use this: https://secure.meetup.com/meetup_api/console/?path=/:urlname/events/:event_id/rsvps
    const response = await fetch("https://api.meetup.com/SiligongValley/events/257181487/rsvps?photo-host=public&response=yes")
    const rsvps = _.shuffle(await response.json())
    await doWelcome(rsvps.length)
    const profiles = await Promise.all(rsvps.map(getProfile))
    await sleep(5000)

    let i = profiles.length * 2
    do {
        showProfile(profiles[i % profiles.length])
        await sleep(Math.pow(rsvps.length - i, 2) / 3000 + 500)
    } while (--i)


    const winner = produce(profiles[i % profiles.length], profile => {
        profile.isWinner = true
    })

    showProfile(winner);
}

luckyDoor()
